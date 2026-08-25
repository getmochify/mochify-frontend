// Runs mediabunny conversion off the main thread. mediabunny is only
// imported once a convert request arrives, so this worker chunk stays
// unfetched until a conversion actually starts.

type ConvertRequest = {
	file: File;
	output: string;
	audioOnly: boolean;
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
	const { file, output, audioOnly } = event.data as ConvertRequest;

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
		const conversion = await Conversion.init({ input, output: out });
		if (!conversion.isValid) {
			post({ type: 'error', message: 'unsupported conversion' });
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
