// Runs mediabunny conversion off the main thread. mediabunny is only
// imported once a convert request arrives, so this worker chunk stays
// unfetched until a conversion actually starts.

import type { AudioCodec, VideoCodec } from 'mediabunny';

export type ConvertRequest = {
	file: File;
	output: string;
	audioOnly: boolean;
	// Pin the output codecs. Without these, any codec the container accepts is
	// copied as-is, e.g. VP9/Opus WebM remuxes into an MP4 few players open.
	videoCodec?: VideoCodec;
	audioCodec?: AudioCodec;
	// With videoCodec pinned: source codecs to copy into the output untouched
	// when this browser can't decode them (HEVC outside Safari and
	// hardware-backed Chrome), instead of failing the file. A list, not a flag:
	// the MP4 muxer also accepts ProRes, and a ProRes MP4 plays almost nowhere.
	copyFallback?: VideoCodec[];
	// Target size in pixels; 0 or absent keeps the source dimension. With only
	// one set, the other follows the aspect ratio.
	width?: number;
	height?: number;
};

export type WorkerResponse =
	| { type: 'progress'; value: number }
	| { type: 'done'; buffer: ArrayBuffer; keptCodec?: string }
	| { type: 'error'; message: string; fatal?: boolean };

let mediabunnyPromise: Promise<typeof import('mediabunny')> | null = null;

function loadMediabunny() {
	if (!mediabunnyPromise) {
		mediabunnyPromise = import('mediabunny');
	}
	return mediabunnyPromise;
}

function post(message: WorkerResponse, transfer?: Transferable[]) {
	if (transfer) {
		self.postMessage(message, { transfer });
	} else {
		self.postMessage(message);
	}
}

self.onmessage = async (event: MessageEvent) => {
	const { file, output, audioOnly, videoCodec, audioCodec, copyFallback, width, height } =
		event.data as ConvertRequest;
	const resize: { width?: number; height?: number; fit?: 'contain' } = {};
	if (width && width > 0) resize.width = width;
	if (height && height > 0) resize.height = height;
	// mediabunny refuses both dimensions without a fit; contain keeps the whole
	// frame (letterboxed if the aspect differs) rather than stretching or cropping.
	if (resize.width && resize.height) resize.fit = 'contain';
	const resizing = resize.width !== undefined || resize.height !== undefined;

	let mediabunny: typeof import('mediabunny');
	try {
		mediabunny = await loadMediabunny();
	} catch (e) {
		post({
			type: 'error',
			message: e instanceof Error ? e.message : 'Could not load the converter.',
			fatal: true
		});
		return;
	}

	const {
		Input,
		Output,
		Conversion,
		Quality,
		canEncodeAudio,
		BlobSource,
		BufferTarget,
		ALL_FORMATS,
		Mp4OutputFormat,
		WebMOutputFormat,
		MkvOutputFormat,
		MovOutputFormat,
		Mp3OutputFormat,
		WavOutputFormat,
		AdtsOutputFormat,
		FlacOutputFormat,
		OggOutputFormat
	} = mediabunny;

	const FORMAT_MAP: Record<string, new () => InstanceType<typeof mediabunny.OutputFormat>> = {
		mp4: Mp4OutputFormat,
		webm: WebMOutputFormat,
		mkv: MkvOutputFormat,
		mov: MovOutputFormat,
		mp3: Mp3OutputFormat,
		wav: WavOutputFormat,
		aac: AdtsOutputFormat,
		flac: FlacOutputFormat,
		ogg: OggOutputFormat
	};
	const FormatClass = FORMAT_MAP[output] ?? Mp4OutputFormat;

	try {
		const input = new Input({ formats: ALL_FORMATS, source: new BlobSource(file) });

		if (audioOnly) {
			const audioTracks = await input.getAudioTracks();
			if (audioTracks.length === 0) {
				post({ type: 'error', message: 'no audio track to extract' });
				return;
			}
		}

		const target = new BufferTarget();
		const out = new Output({ format: new FormatClass(), target });
		const copyableVideoCodecs = out.format.getSupportedVideoCodecs();
		let keptCodec: string | undefined;
		const conversion = await Conversion.init({
			input,
			output: out,
			// Match the source bitrate instead of mediabunny's resolution-derived
			// 'high' preset, which ignores how the source was actually encoded.
			video: async (track) => {
				// A copyable track is remuxed untouched; setting a quality would force a re-encode.
				// A resize always re-encodes, so neither copy path applies to it.
				const codec = await track.getCodec();
				const copyable = videoCodec
					? codec === videoCodec
					: !!codec && copyableVideoCodecs.includes(codec);
				if (copyable && !resizing) return undefined;
				if (
					!resizing &&
					codec &&
					copyFallback?.includes(codec) &&
					copyableVideoCodecs.includes(codec) &&
					!(await track.canDecode())
				) {
					keptCodec = codec;
					return undefined;
				}
				// Measured from packet sizes (metadata only, no decoding); the
				// container's declared bitrate is often missing or wrong.
				const { averageBitrate } = await track.computePacketStats();
				// A downscale scales the bitrate with the pixel count, so a 240p copy
				// can't come out larger than its 1080p source; an upscale keeps it.
				const srcW = track.displayWidth;
				const srcH = track.displayHeight;
				const outW = resize.width ?? (resize.height! * srcW) / srcH;
				const outH = resize.height ?? (resize.width! * srcH) / srcW;
				const scale = resizing && srcW && srcH ? Math.min(1, (outW * outH) / (srcW * srcH)) : 1;
				return {
					codec: videoCodec,
					...resize,
					quality: averageBitrate
						? new Quality({ bitrate: Math.round(averageBitrate * scale) })
						: undefined
				};
			},
			audio: async (track) => {
				if (!audioCodec || (await track.getCodec()) === audioCodec) return undefined;
				// WebCodecs AAC encoding isn't available in every browser, so
				// fall back to copying the source audio rather than dropping it.
				const encodable = await canEncodeAudio(audioCodec, {
					numberOfChannels: await track.getNumberOfChannels(),
					sampleRate: await track.getSampleRate()
				});
				return encodable ? { codec: audioCodec } : undefined;
			}
		});
		if (!conversion.isValid) {
			post({ type: 'error', message: 'unsupported conversion' });
			return;
		}
		// A video track that can't be decoded or encoded is otherwise dropped
		// silently, leaving an audio-only file with a video extension.
		const droppedVideo = conversion.discardedTracks.find(
			(d) => d.track.isVideoTrack() && d.reason !== 'discarded_by_user'
		);
		if (!audioOnly && droppedVideo) {
			// No browser decodes ProRes, so "your browser" would send people
			// off to try another one for nothing.
			const prores = (await droppedVideo.track.getCodec()) === 'prores';
			post({
				type: 'error',
				message: prores
					? "ProRes video can't be converted in a browser"
					: "your browser can't convert this video's codec"
			});
			return;
		}
		conversion.onProgress = (p: number) => {
			post({ type: 'progress', value: Math.min(Math.round(p * 100), 99) });
		};
		await conversion.execute();

		const buffer = target.buffer;
		if (!buffer) throw new Error('conversion produced no output');
		post({ type: 'done', buffer, keptCodec }, [buffer]);
	} catch (e) {
		post({ type: 'error', message: e instanceof Error ? e.message : 'conversion failed' });
	}
};
