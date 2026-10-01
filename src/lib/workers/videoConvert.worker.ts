// Runs mediabunny conversion off the main thread. mediabunny is only
// imported once a convert request arrives, so this worker chunk stays
// unfetched until a conversion actually starts.

import type { AudioCodec, VideoCodec } from 'mediabunny';

type ConvertRequest = {
	file: File;
	output: string;
	audioOnly: boolean;
	// Pin the output codecs. Without these, any codec the container accepts is
	// copied as-is, e.g. VP9/Opus WebM remuxes into an MP4 few players open.
	videoCodec?: VideoCodec;
	audioCodec?: AudioCodec;
};

type WorkerResponse =
	| { type: 'progress'; value: number }
	| { type: 'done'; buffer: ArrayBuffer }
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
	const { file, output, audioOnly, videoCodec, audioCodec } = event.data as ConvertRequest;

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
		const conversion = await Conversion.init({
			input,
			output: out,
			// Match the source bitrate instead of mediabunny's resolution-derived
			// 'high' preset, which ignores how the source was actually encoded.
			video: async (track) => {
				// A copyable track is remuxed untouched; setting a quality would force a re-encode.
				const codec = await track.getCodec();
				const copyable = videoCodec
					? codec === videoCodec
					: !!codec && copyableVideoCodecs.includes(codec);
				if (copyable) return undefined;
				// Measured from packet sizes (metadata only, no decoding); the
				// container's declared bitrate is often missing or wrong.
				const { averageBitrate } = await track.computePacketStats();
				return {
					codec: videoCodec,
					quality: averageBitrate ? new Quality({ bitrate: Math.round(averageBitrate) }) : undefined
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
		const droppedVideo = conversion.discardedTracks.some(
			(d) => d.track.isVideoTrack() && d.reason !== 'discarded_by_user'
		);
		if (!audioOnly && droppedVideo) {
			post({ type: 'error', message: "your browser can't convert this video's codec" });
			return;
		}
		conversion.onProgress = (p: number) => {
			post({ type: 'progress', value: Math.min(Math.round(p * 100), 99) });
		};
		await conversion.execute();

		const buffer = target.buffer;
		if (!buffer) throw new Error('conversion produced no output');
		post({ type: 'done', buffer }, [buffer]);
	} catch (e) {
		post({ type: 'error', message: e instanceof Error ? e.message : 'conversion failed' });
	}
};
