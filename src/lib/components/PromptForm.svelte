<script lang="ts">
	import { tick } from 'svelte';
	import { zip } from 'fflate';
	import { env } from '$env/dynamic/public';
	import { getSessionToken, getIsPro, getPlan } from '$lib/user';
	import posthog from 'posthog-js';

	const API_URL = env.PUBLIC_API_URL || 'https://api.mochify.xyz';
	const WORKER_URL = env.PUBLIC_WORKER_URL || 'https://tokens.mochify.xyz';

	let { onSuccess, onBgRemovalUpsell }: { onSuccess?: () => void; onBgRemovalUpsell?: () => void } =
		$props();

	let prompt: string = $state('');
	let files: File[] = $state([]);
	let isDragging: boolean = $state(false);

	let isProcessing: boolean = $state(false);
	let processPhase: 'idle' | 'thinking' | 'uploading' | 'processing' | 'downloading' | 'packing' =
		$state('idle');
	let thinkingText: string = $state('Reading your images…');
	let processingText: string = $state('Processing…');

	let uploadPercent: number = $state(0);
	let downloadPercent: number = $state(0);
	let completedFiles: number = $state(0);
	let totalFiles: number = $state(0);
	let downloadAsZip: boolean = $state(false);
	let agentMessage: string = $state('');

	let showInfoTooltip = $state(false)

	let textareaEl: HTMLTextAreaElement;
	let fileInputEl: HTMLInputElement;

	const placeholders = [
		'Describe what you want…',
		'Shopify square-crop, convert to WebP…',
		'Fix PageSpeed — convert all to AVIF…',
		'Resize to 1200px, rename "product-ready"…',
		'Make these 1:1, center the subject…'
	];
	let placeholderIndex = $state(0);
	let placeholderVisible = $state(true);
	let isFocused = $state(false);

	$effect(() => {
		let intervalId: ReturnType<typeof setInterval>;
		let fadeId: ReturnType<typeof setTimeout>;

		const cycle = () => {
			placeholderVisible = false;
			fadeId = setTimeout(() => {
				placeholderIndex = (placeholderIndex + 1) % placeholders.length;
				placeholderVisible = true;
			}, 400);
		};

		intervalId = setInterval(cycle, 3200);
		return () => {
			clearInterval(intervalId);
			clearTimeout(fadeId);
		};
	});

	let MAX_FILE_SIZE = $state(20 * 1024 * 1024); // 20MB, 75MB for pro/lite
	let MAX_FILES = $state(3); // 3 for free, 25 for lite/pro
	$effect(() => {
		getIsPro().then((isPro) => {
			MAX_FILE_SIZE = isPro ? 75 * 1024 * 1024 : 20 * 1024 * 1024;
		});
		getPlan().then((plan) => {
			MAX_FILES = plan === 'free' ? 3 : 25;
		});
	});

	// Status state
	let statusMessage: { type: 'success' | 'error' | null; text: string } = $state({
		type: null,
		text: ''
	});
	let statusTimeout: ReturnType<typeof setTimeout>;
	let hitRateLimit: boolean = $state(false);
	let showSignupCta: boolean = $state(false);
	let showUpgradeCta: boolean = $state(false);
	let victoryGlow: boolean = $state(false);

	function triggerVictoryGlow() {
		victoryGlow = true;
		setTimeout(() => {
			victoryGlow = false;
		}, 1800);
	}

	function showStatus(type: 'success' | 'error', text: string) {
		statusMessage = { type, text };
		if (type === 'success') triggerVictoryGlow();
		if (statusTimeout) clearTimeout(statusTimeout);
		statusTimeout = setTimeout(() => {
			statusMessage = { type: null, text: '' };
		}, 5000);
	}

	const ACCEPTED_MIME_TYPES = new Set([
		'image/jpeg',
		'image/heic',
		'image/heif',
		'image/avif',
		'image/png',
		'image/jxl',
		'image/webp'
	]);
	const ACCEPTED_EXTENSIONS = new Set([
		'jpg',
		'jpeg',
		'heic',
		'heif',
		'hif',
		'avif',
		'png',
		'jxl',
		'webp'
	]);

	function validateAndAddFiles(newFiles: File[]) {
		const validFiles = [];
		let rejectedCount = 0;

		for (const f of newFiles) {
			const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
			const accepted = ACCEPTED_MIME_TYPES.has(f.type) || ACCEPTED_EXTENSIONS.has(ext);
			if (f.size > MAX_FILE_SIZE) {
				rejectedCount++;
			} else if (accepted) {
				validFiles.push(f);
			}
		}

		if (rejectedCount > 0) {
			showStatus(
				'error',
				`${rejectedCount} file(s) ignored (exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit)`
			);
		}

		const available = MAX_FILES - files.length;
		const toAdd = validFiles.slice(0, available);
		const overflow = validFiles.length - toAdd.length;
		if (overflow > 0) {
			showStatus(
				'error',
				`Free plan is limited to ${MAX_FILES} files. Upgrade to Seller or Pro for batches up to 25.`
			);
		}
		files = [...files, ...toAdd];
	}

	const suggestions = [
		{
			label: 'Remove BG',
			prompt: 'Remove the background and convert to PNG',
			dot: 'bg-purple-400'
		},
		{
			label: 'eBay',
			prompt: 'Optimize for eBay listings — square crop, convert to JPEG',
			dot: 'bg-[#3665F3]'
		},
		{
			label: 'Vinted',
			prompt: 'Optimize for Vinted listings — square crop, compress',
			dot: 'bg-[#007782]'
		},
		{
			label: 'Square crop',
			prompt: 'Smart-crop to square, centering the main subject',
			dot: 'bg-[#66BB6A]'
		},
		{
			label: 'PageSpeed',
			prompt: 'Fix my PageSpeed — convert to WebP and compress for fast load times',
			dot: 'bg-[#4285F4]'
		}
	];

	const formatSuggestions = [
		{ label: 'WebP', prompt: 'Convert to WebP for best web compression and quality' },
		{ label: 'JPEG', prompt: 'Convert to JPEG with high quality compression' },
		{ label: 'PNG', prompt: 'Convert to PNG for lossless quality' },
		{ label: 'AVIF', prompt: 'Convert to AVIF for maximum compression with high quality' },
		{ label: 'JPEG XL', prompt: 'Convert to JPEG XL for next-generation compression' }
	];

	const rotateSuggestions = [
		{ label: '90° clockwise', prompt: 'Rotate 90 degrees clockwise' },
		{ label: '180°', prompt: 'Rotate 180 degrees' },
		{ label: '90° anti-clockwise', prompt: 'Rotate 90 degrees anti-clockwise' },
		{ label: 'Flip horizontal', prompt: 'Flip horizontal' }
	];

	let showFormatPicker = $state(false);
	let showRotatePicker = $state(false);

	function closePickers() {
		showFormatPicker = false;
		showRotatePicker = false;
	}

	function fillPrompt(text: string) {
		prompt = text;
		tick().then(() => {
			autoGrow();
			textareaEl?.focus();
		});
	}

	function autoGrow() {
		if (!textareaEl) return;
		textareaEl.style.height = 'auto';
		textareaEl.style.height = Math.max(72, Math.min(textareaEl.scrollHeight, 200)) + 'px';
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			submit();
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
			isDragging = false;
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		const dropped = Array.from(e.dataTransfer?.files ?? []);
		validateAndAddFiles(dropped);
		tick().then(() => textareaEl?.focus());
	}

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files) {
			validateAndAddFiles(Array.from(input.files));
			input.value = '';
		}
	}

	function removeFile(i: number) {
		files = files.filter((_, idx) => idx !== i);
	}

	function getDimensions(file: File): Promise<{ w: number; h: number }> {
		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => {
				window.URL.revokeObjectURL(img.src);
				resolve({ w: img.width, h: img.height });
			};
			img.onerror = () => {
				window.URL.revokeObjectURL(img.src);
				resolve({ w: 0, h: 0 });
			};
			img.src = window.URL.createObjectURL(file);
		});
	}

	async function submit() {
		if (!prompt.trim() || files.length === 0 || isProcessing) return;

		const jwt = await getSessionToken();

		// Pre-flight quota check — works for both authed and unauthed users.
		let tokenData: any = null;
		try {
			const tokenRes = await fetch(`${API_URL}/v1/checkTokens`, {
				headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
			});
			if (tokenRes.ok) {
				tokenData = await tokenRes.json();
				if (tokenData.remaining < files.length) {
					if (jwt) showUpgradeCta = true;
					else showSignupCta = true;
					return;
				}
			}
		} catch {
			// Non-blocking — proceed if checkTokens fails
		}
        
		posthog.capture('magic_flow_submitted', {
			files: files.length,
			authed: !!jwt,
			prompt_length: prompt.length
		});

		isProcessing = true;
		processPhase = 'thinking';
		uploadPercent = 0;
		downloadPercent = 0;
		completedFiles = 0;
		hitRateLimit = false;
		agentMessage = '';

		const thinkingMessages = ['Reading your images…', 'Planning the squish…'];

		thinkingText = thinkingMessages[0];
		let msgIdx = 1;

		const msgInterval = setInterval(() => {
			if (processPhase === 'thinking') {
				thinkingText = thinkingMessages[msgIdx % thinkingMessages.length];
				msgIdx++;
			}
		}, 900);

		try {
			const fileDetails = await Promise.all(
				files.map(async (f) => {
					const dims = await getDimensions(f);
					const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
					return { format: ext, width: dims.w, height: dims.h };
				})
			);

			const nlpResponse = await fetch(`${WORKER_URL}/v1/prompt`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(jwt ? { Authorization: `Bearer ${jwt}` } : {})
				},
				body: JSON.stringify({ prompt: prompt.trim(), fileData: fileDetails })
			});

			if (!nlpResponse.ok) {
				if (nlpResponse.status === 429) {
					if (jwt) showUpgradeCta = true;
					else showSignupCta = true;
					return;
				}
				throw new Error(`Failed to understand prompt (Status: ${nlpResponse.status})`);
			}

			const parsedData = (await nlpResponse.json()) as { agent_message?: string; files?: any[] };
			agentMessage = parsedData.agent_message || '';
			const fileArray = parsedData.files || [];
			const fileMap: Record<string, any> = {};
			fileArray.forEach((item: any) => {
				fileMap[item.name || item.filename] = item;
			});
			// Index-based array for fallback when filenames don't match (e.g. NLP normalises them)
			const fileArrayByIndex = fileArray;

			// Original dimensions by index to skip NLP-echoed dims in params
			const origDims = fileDetails.map((f) => ({ w: f.width, h: f.height }));

			// Detect background removal requested by NLP.
			// Background removal requires authentication — strip the param for anonymous
			// users and proceed without it (backend enforces the same rule on 403).
			const bgRemovalRequested = fileArray.some((item: any) => item.removeBackground);
			const bgRemovalBlocked = bgRemovalRequested && !jwt;
			if (bgRemovalBlocked) {
				fileArray.forEach((item: any) => {
					delete item.removeBackground;
				});
			}

			processPhase = 'uploading';
			totalFiles = files.length;
			const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
			let uploadedBytes = 0;
			let processedFiles = 0;
			let currentFileIndex = 0;
			const CONCURRENCY_LIMIT = 1;
			const zipContents: Record<string, Uint8Array> = {};

			const getProcessingText = (config: any): string => {
				if (config.removeBackground) return 'Removing background…';
				if (config.type === 'avif') return 'Encoding to AVIF…';
				if (config.type === 'jxl') return 'Encoding to JPEG XL…';
				if (config.type === 'webp') return 'Compressing to WebP…';
				if (config.type === 'jpeg' || config.type === 'jpg') return 'Compressing to JPEG…';
				if (config.type === 'png') return 'Encoding to PNG…';
				if (config.smartCompress) return 'Smart-compressing…';
				if (config.crop || (config.width && config.width === config.height))
					return 'Cropping and compressing…';
				return 'Processing your image…';
			};

			const squishFile = (
				file: File,
				params: URLSearchParams,
				onUploadEnd?: () => void
			): Promise<Blob> =>
				new Promise((resolve, reject) => {
					const xhr = new XMLHttpRequest();
					xhr.open('POST', `${API_URL}/v1/squish?${params}`);
					xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
					if (jwt) xhr.setRequestHeader('Authorization', `Bearer ${jwt}`);
					xhr.responseType = 'blob';

					let lastLoaded = 0;
					xhr.upload.onprogress = (e) => {
						const delta = e.loaded - lastLoaded;
						lastLoaded = e.loaded;
						uploadedBytes += delta;
						uploadPercent = Math.min(Math.round((uploadedBytes / totalBytes) * 100), 100);
					};

					xhr.upload.onloadend = () => {
						onUploadEnd?.();
					};

					xhr.onload = () => {
						// Account for any bytes not reported via onprogress
						const remaining = file.size - lastLoaded;
						if (remaining > 0) {
							uploadedBytes += remaining;
							uploadPercent = Math.min(Math.round((uploadedBytes / totalBytes) * 100), 100);
						}

						const contentType = xhr.getResponseHeader('content-type') || '';
						if (contentType.includes('application/json')) {
							const status = xhr.status;
							const reader = new FileReader();
							reader.onload = () => {
								try {
									const errData = JSON.parse(reader.result as string);
									const e: any = new Error(
										errData.error || errData.message || `Server rejected ${file.name}`
									);
									e.status = status;
									reject(e);
								} catch {
									const e: any = new Error(`Server rejected ${file.name}`);
									e.status = status;
									reject(e);
								}
							};
							reader.readAsText(xhr.response as Blob);
							return;
						}
						if (xhr.status >= 200 && xhr.status < 300) {
							resolve(xhr.response as Blob);
						} else {
							const e: any = new Error(`Failed processing ${file.name} (Status: ${xhr.status})`);
							e.status = xhr.status;
							reject(e);
						}
					};

					xhr.onerror = () => reject(new Error(`Network error processing ${file.name}`));
					xhr.send(file);
				});

			const processNextFile = async () => {
				while (currentFileIndex < files.length) {
					const fileIdx = currentFileIndex;
					const file = files[currentFileIndex++];
					const fileConfig = fileMap[file.name] ?? fileArrayByIndex[fileIdx] ?? {};

					processPhase = 'uploading';

					const params = new URLSearchParams();
					if (fileConfig.type) params.append('type', fileConfig.type);
					if (fileConfig.smartCompress) params.append('smartCompress', '1');
					if (fileConfig.removeBackground) params.append('removeBackground', '1');
					// Default to stripping EXIF; NLP can explicitly set stripExif: 0 to preserve it
					const stripExif = fileConfig.stripExif !== undefined ? fileConfig.stripExif : 1;
					params.append('strip_exif', stripExif ? '1' : '0');

					const EXCLUDED_KEYS = new Set([
						'smartCompress',
						'type',
						'removeBackground',
						'stripExif',
						'filename',
						'name'
					]);
					for (const [key, value] of Object.entries(fileConfig)) {
						if (EXCLUDED_KEYS.has(key)) continue;
						// NLP echoes back original width/height as metadata — skip if unchanged
						if (key === 'width' && value === origDims[fileIdx]?.w) continue;
						if (key === 'height' && value === origDims[fileIdx]?.h) continue;
						if (value === true) params.append(key, '1');
						else if (value !== false && value !== 0 && value != null)
							params.append(key, String(value));
					}

					try {
						const blob = await squishFile(file, params, () => {
							processingText = getProcessingText(fileConfig);
							processPhase = 'processing';
						});

						processPhase = 'downloading';

						const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
						const newExtension = fileConfig.type || file.name.split('.').pop();
						const finalName = `${baseName}_mochified.${newExtension}`;

						if (downloadAsZip) {
							const arrayBuffer = await blob.arrayBuffer();
							zipContents[finalName] = new Uint8Array(arrayBuffer as ArrayBuffer);
						} else {
							const downloadUrl = window.URL.createObjectURL(blob);
							const a = document.createElement('a');
							a.style.display = 'none';
							a.href = downloadUrl;
							a.download = finalName;
							document.body.appendChild(a);
							a.click();
							setTimeout(() => {
								window.URL.revokeObjectURL(downloadUrl);
								document.body.removeChild(a);
							}, 100);
						}
					} catch (e: any) {
						console.error(`Error squishing ${file.name}:`, e);
						if (e?.status === 429) {
							hitRateLimit = true;
							if (jwt) showUpgradeCta = true;
							else showSignupCta = true;
							break;
						}
					}

					processedFiles++;
					completedFiles = processedFiles;
					downloadPercent = Math.round((processedFiles / totalFiles) * 100);
				}
			};

			const workers = [];
			for (let i = 0; i < Math.min(CONCURRENCY_LIMIT, files.length); i++) {
				workers.push(processNextFile());
			}

			await Promise.all(workers);

			if (hitRateLimit) return;

			if (downloadAsZip && Object.keys(zipContents).length > 0) {
				processPhase = 'packing';

				await new Promise<void>((resolve, reject) => {
					zip(zipContents, { level: 0 }, (err, zippedData) => {
						if (err) return reject(err);

						const zipBlob = new Blob([zippedData as Uint8Array<ArrayBuffer>], {
							type: 'application/zip'
						});
						const url = URL.createObjectURL(zipBlob);
						const a = document.createElement('a');
						a.href = url;
						a.download = 'mochified_batch.zip';
						document.body.appendChild(a);
						a.click();
						setTimeout(() => {
							URL.revokeObjectURL(url);
							document.body.removeChild(a);
							resolve();
						}, 100);
					});
				});
			}

			prompt = '';
			files = [];
			if (bgRemovalBlocked) {
				posthog.capture('magic_flow_completed', { files: totalFiles, bg_removal_blocked: true });
				showStatus(
					'success',
					'Images processed without background removal — sign up for a free account to unlock it. ✨'
				);
				onBgRemovalUpsell?.();
			} else {
				posthog.capture('magic_flow_completed', { files: totalFiles });
				showStatus('success', 'Images processed successfully! ✨');
				onSuccess?.();
			}
		} catch (err) {
			console.error(err);
			posthog.capture('magic_flow_failed', {
				error: err instanceof Error ? err.message : String(err)
			});
			posthog.captureException(err);
			showStatus('error', err instanceof Error ? err.message : 'An unexpected error occurred.');
		} finally {
			isProcessing = false;
			processPhase = 'idle';
			clearInterval(msgInterval);
		}
	}
</script>

{#if statusMessage.type}
	<div
		class="animate-fade-in pointer-events-none fixed top-4 right-4 z-50 sm:top-24 sm:right-auto sm:left-1/2 sm:-translate-x-1/2"
	>
		<div
			class="flex items-center gap-3 rounded-2xl border px-5 py-3 shadow-xl backdrop-blur-md transition-all duration-300
            {statusMessage.type === 'error'
				? 'border-red-200 bg-red-50/90 text-red-800 shadow-red-500/10'
				: 'border-[#A5D6A7]/50 bg-[#F4FBF2]/90 text-[#2E5C31] shadow-green-500/10'}"
		>
			{#if statusMessage.type === 'error'}
				<svg
					class="h-5 w-5 flex-shrink-0 text-red-500"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					stroke-width="2.5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
			{:else}
				<svg
					class="h-5 w-5 flex-shrink-0 text-green-500"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					stroke-width="2.5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			{/if}

			<span class="text-sm font-bold tracking-tight sm:text-base">{statusMessage.text}</span>
		</div>
	</div>
{/if}

<div class="w-full max-w-3xl">
	<div
		class="relative rounded-[2rem] transition-all duration-300 {isDragging
			? 'liquid-glow scale-[1.02]'
			: ''}"
	>
		<div
			class="liquid-glass relative overflow-hidden rounded-[2rem] transition-all duration-700 {victoryGlow
				? 'victory-glow'
				: ''}"
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
			role="region"
			aria-label="Image processing prompt input area"
		>
			<div
				class="absolute inset-x-0 top-0 z-10 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent"
			></div>

			{#if isDragging}
				<div
					class="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center rounded-[2rem] bg-gradient-to-b from-pink-50/70 to-white/50 backdrop-blur-md"
				>
					<div
						class="animate-float mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 shadow-xl shadow-pink-200/60"
					>
						<svg
							class="h-6 w-6 text-[#F06292]"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
							/>
						</svg>
					</div>
					<p class="text-lg font-black tracking-tight text-[#4A2C2C]">Drop to squish</p>
				</div>
			{/if}

			{#if files.length > 0}
				<div class="relative flex flex-wrap items-center gap-3 px-4 pt-6 pb-2 sm:px-6">
					{#each files as file, i}
						<div class="group animate-fade-in relative flex-shrink-0">
							<div class="liquid-bubble h-16 w-16 overflow-hidden rounded-2xl p-1">
								<img
									src={URL.createObjectURL(file)}
									alt={file.name}
									class="h-full w-full rounded-xl object-cover"
								/>
							</div>
							<button
								onclick={() => removeFile(i)}
								class="absolute -top-2 -right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#F06292] opacity-100 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:text-red-500 sm:opacity-0 sm:group-hover:opacity-100 sm:hover:scale-110"
								aria-label="Remove {file.name}"
							>
								<svg
									class="h-3.5 w-3.5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									stroke-width="3"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					{/each}
					<button
						onclick={() => fileInputEl?.click()}
						class="liquid-bubble flex h-16 w-16 flex-shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[#F06292]/30 text-[#F06292]/60 shadow-sm transition-all hover:scale-105 hover:bg-white/60 hover:text-[#F06292]"
						aria-label="Add more images"
					>
						<svg
							class="h-6 w-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							stroke-width="2.5"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
					</button>

					<div class="absolute right-8 bottom-0 left-8">
						<div
							class="h-[1px] w-full bg-gradient-to-r from-transparent via-[#875F42]/15 to-transparent"
						></div>
						<div
							class="h-[1px] w-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
						></div>
					</div>
				</div>
			{/if}

			<div class="flex flex-col gap-3 px-4 pt-4 pb-3 sm:px-6 sm:pt-5">
				<input
					bind:this={fileInputEl}
					type="file"
					multiple
					accept=".jpg,.jpeg,.heic,.heif,.hif,.avif,.png,.jxl,.webp,image/jpeg,image/heic,image/heif,image/avif,image/png,image/jxl,image/webp"
					onchange={handleFileSelect}
					aria-label="Upload images"
					class="hidden"
				/>

				<div class="relative">
					{#if !prompt && !isFocused}
						<div
							aria-hidden="true"
							class="pointer-events-none absolute inset-0 flex items-start py-1 text-base leading-relaxed font-medium text-[#875F42]/40 transition-opacity duration-300 sm:text-lg {placeholderVisible
								? 'opacity-100'
								: 'opacity-0'}"
						>
							{placeholders[placeholderIndex]}
						</div>
					{/if}
					<textarea
						bind:this={textareaEl}
						bind:value={prompt}
						oninput={autoGrow}
						onkeydown={handleKeydown}
						onfocus={() => (isFocused = true)}
						onblur={() => (isFocused = false)}
						aria-label="Describe what you want"
						rows="2"
						class="max-h-[200px] min-h-[72px] w-full resize-none [appearance:none] overflow-y-auto border-0 bg-transparent py-1 text-base leading-relaxed font-medium text-[#4A2C2C] placeholder-transparent focus:ring-0 focus:outline-none sm:text-lg"
					></textarea>
				</div>
			</div>

			<div class="border-t border-white/40 bg-white/20 backdrop-blur-md">
				{#if isProcessing}
					<div class="relative h-1 overflow-hidden bg-white/20">
						{#if processPhase === 'thinking' || processPhase === 'packing'}
							<div
								class="absolute inset-0 animate-pulse bg-gradient-to-r from-[#F06292] to-[#e040a0] opacity-60"
							></div>
						{:else if processPhase === 'uploading'}
							<div
								class="h-full bg-gradient-to-r from-[#F06292] to-[#e040a0] shadow-[0_0_10px_rgba(240,98,146,0.5)] transition-all duration-300 ease-out"
								style="width: {uploadPercent}%"
							></div>
						{:else if processPhase === 'processing'}
							<div
								class="animate-shimmer absolute inset-0 bg-gradient-to-r from-[#A5D6A7] via-[#66BB6A] to-[#A5D6A7] bg-[length:200%_100%] opacity-80"
							></div>
						{:else if processPhase === 'downloading'}
							<div
								class="h-full bg-gradient-to-r from-[#A5D6A7] to-[#66BB6A] shadow-[0_0_10px_rgba(165,214,167,0.5)] transition-all duration-300 ease-out"
								style="width: {downloadPercent}%"
							></div>
						{/if}
					</div>
				{/if}

				<div class="flex items-center gap-2 px-3 py-2 sm:px-4">
					<!-- Controls -->
					<button
						onclick={() => fileInputEl?.click()}
						class="flex-shrink-0 cursor-pointer rounded-xl p-1.5 text-[#875F42]/60 transition-all hover:bg-white/60 hover:text-[#F06292]"
						aria-label="Attach images"
					>
						<svg
							class="h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							stroke-width="2.5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"
							/>
						</svg>
					</button>
					<div class="h-4 w-px flex-shrink-0 bg-white/40"></div>
					<label
						class="flex flex-shrink-0 cursor-pointer items-center gap-1.5"
						title="Download as ZIP"
					>
						<div class="relative">
							<input type="checkbox" bind:checked={downloadAsZip} class="sr-only" />
							<div
								class="block h-3.5 w-7 rounded-full border transition-all duration-300 {downloadAsZip
									? 'border-[#C8E6C9] bg-[#C8E6C9]'
									: 'border-[#C8E6C9]/40 bg-[#e8f5e9] shadow-inner'}"
							></div>
							<div
								class="dot absolute top-0.5 left-0.5 h-2.5 w-2.5 rounded-full bg-white shadow-sm transition-transform duration-300 {downloadAsZip
									? 'translate-x-3.5 transform'
									: ''}"
							></div>
						</div>
						<span
							class="text-[10px] font-extrabold tracking-widest uppercase transition-colors duration-300 {downloadAsZip
								? 'text-[#2E5C31]'
								: 'text-[#875F42]/50'}">ZIP</span
						>
					</label>
					<div class="h-4 w-px flex-shrink-0 bg-white/40"></div>
					<!-- Status text -->
					<span
						class="flex min-w-0 flex-1 items-center gap-1.5 truncate text-xs font-medium tracking-wide text-[#875F42]/50"
					>
						{#if isProcessing}
							{#if processPhase === 'thinking'}
								<span class="flex-shrink-0 animate-pulse">✨</span>
								{#key thinkingText}<span class="animate-fade-in truncate">{thinkingText}</span
									>{/key}
							{:else if processPhase === 'uploading'}
								Uploading{totalFiles > 1 ? ` ${completedFiles + 1}/${totalFiles}` : '…'} ({uploadPercent}%)
							{:else if processPhase === 'processing'}
								<span class="flex-shrink-0 animate-pulse text-[#66BB6A]">⬡</span>
								{#key processingText}<span class="animate-fade-in truncate"
										>{processingText}{totalFiles > 1
											? ` (${completedFiles + 1}/${totalFiles})`
											: ''}</span
									>{/key}
							{:else if processPhase === 'downloading'}
								{downloadAsZip ? 'Packing zip' : 'Saving'} ({completedFiles}/{totalFiles})…
							{:else if processPhase === 'packing'}
								Packing your zip file…
							{/if}
						{:else if files.length === 0}
							Drop images or use the clip button
						{:else}
							{files.length} {files.length === 1 ? 'image' : 'images'} attached
						{/if}
					</span>
					<!-- Info tooltip -->
					<div class="relative flex-shrink-0">
						<button
							onclick={() => (showInfoTooltip = !showInfoTooltip)}
							class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-[#875F42]/40 transition-all hover:bg-white/60 hover:text-[#875F42]/70"
							aria-label="How it works"
						>
							<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
							</svg>
						</button>
						{#if showInfoTooltip}
							<div class="absolute bottom-9 right-0 z-50 w-64 rounded-2xl border border-white/60 bg-white/95 p-4 shadow-xl shadow-pink-100/40 backdrop-blur-md">
								<div class="absolute -bottom-1.5 right-2.5 h-3 w-3 rotate-45 border-r border-b border-white/60 bg-white/95"></div>
								<p class="mb-1 text-[10px] font-black tracking-widest uppercase text-[#F06292]">How it works</p>
								<p class="mb-3 text-xs leading-relaxed text-[#4A2C2C]/75">Describe what you want in plain English, attach your images, then hit send. The AI reads your prompt and processes each file automatically.</p>
								<p class="mb-1 text-[10px] font-black tracking-widest uppercase text-[#F06292]">Accepted formats</p>
								<p class="text-xs leading-relaxed text-[#4A2C2C]/75">JPG · PNG · WebP · AVIF · JPEG XL · HEIC · HEIF · HIF</p>
							</div>
							<button class="fixed inset-0 -z-10 cursor-default" onclick={() => (showInfoTooltip = false)} aria-label="Close" tabindex="-1"></button>
						{/if}
					</div>
					<!-- Send button -->
					<button
						onclick={submit}
						disabled={!prompt.trim() || files.length === 0 || isProcessing}
						aria-label={isProcessing ? 'Processing…' : 'Submit'}
						class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl font-bold transition-all duration-300
                        {prompt.trim() && files.length > 0 && !isProcessing
							? 'cursor-pointer bg-gradient-to-br from-[#FF9EBB] to-[#F06292] text-white shadow-[0_2px_8px_rgba(240,98,146,0.4)] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(240,98,146,0.6)]'
							: 'cursor-not-allowed border border-white/60 bg-white/50 text-[#F06292]/30'}"
					>
						{#if isProcessing}
							<svg
								class="h-4 w-4 animate-spin"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								stroke-width="2.5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
								/>
							</svg>
						{:else}
							<svg
								class="h-4 w-4 translate-x-[1px]"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								stroke-width="2.5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
								/>
							</svg>
						{/if}
					</button>
				</div>
			</div>
		</div>
	</div>

	{#if agentMessage}
		<div class="animate-fade-in mt-3 px-1">
			<div
				class="flex items-start gap-3 rounded-2xl border border-l-[3px] border-[#F06292]/20 border-l-[#F06292] bg-gradient-to-r from-[#FFF0F5] to-[#FDFBF7] py-3.5 pr-5 pl-4 shadow-sm shadow-pink-100/60"
			>
				<svg
					class="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#F06292]"
					fill="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
					><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg
				>
				<p class="text-xs leading-relaxed font-medium text-[#4A2C2C]/75">{agentMessage}</p>
			</div>
		</div>
	{/if}

	<div class="mt-3 flex flex-wrap gap-2 px-1">
		{#if showFormatPicker || showRotatePicker}
			<!-- Back button -->
			<button
				onclick={closePickers}
				class="inline-flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-white/60 bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#875F42] shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F06292] hover:text-[#F06292] hover:shadow-md"
			>
				<svg
					class="h-2.5 w-2.5 flex-shrink-0"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					stroke-width="2.5"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
					/></svg
				>
				Back
			</button>
			<!-- Sub-options -->
			{#each showFormatPicker ? formatSuggestions : rotateSuggestions as s}
				<button
					onclick={() => {
						fillPrompt(s.prompt);
						closePickers();
					}}
					class="inline-flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-white/60 bg-gradient-to-r from-[#FF6B9D]/8 to-white/60 px-4 py-1.5 text-xs font-semibold text-[#875F42] shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F06292] hover:bg-white/80 hover:text-[#F06292] hover:shadow-md"
				>
					{s.label}
				</button>
			{/each}
		{:else}
			<!-- Main suggestions -->
			{#each suggestions as s}
				<button
					onclick={() => fillPrompt(s.prompt)}
					class="inline-flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-white/60 bg-gradient-to-r from-[#FF6B9D]/8 to-white/60 px-4 py-1.5 text-xs font-semibold text-[#875F42] shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F06292] hover:bg-white/80 hover:text-[#F06292] hover:shadow-md"
				>
					<span class="h-1.5 w-1.5 flex-shrink-0 rounded-full opacity-80 {s.dot}"></span>{s.label}
				</button>
			{/each}
			<!-- Convert to… expander -->
			<button
				onclick={() => {
					showFormatPicker = true;
					showRotatePicker = false;
				}}
				class="inline-flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-white/60 bg-gradient-to-r from-[#FF6B9D]/8 to-white/60 px-4 py-1.5 text-xs font-semibold text-[#875F42] shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F06292] hover:bg-white/80 hover:text-[#F06292] hover:shadow-md"
			>
				<svg
					class="h-2.5 w-2.5 flex-shrink-0"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					stroke-width="2.5"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
					/></svg
				>
				Convert to…
			</button>
			<!-- Rotate… expander -->
			<button
				onclick={() => {
					showRotatePicker = true;
					showFormatPicker = false;
				}}
				class="inline-flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-white/60 bg-gradient-to-r from-[#FF6B9D]/8 to-white/60 px-4 py-1.5 text-xs font-semibold text-[#875F42] shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F06292] hover:bg-white/80 hover:text-[#F06292] hover:shadow-md"
			>
				<svg
					class="h-2.5 w-2.5 flex-shrink-0"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					stroke-width="2.5"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
					/></svg
				>
				Rotate…
			</button>
		{/if}
	</div>
</div>

{#if showUpgradeCta}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
		onclick={() => (showUpgradeCta = false)}
		role="dialog"
		aria-modal="true"
	>
		<div
			class="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl"
			onclick={(e) => e.stopPropagation()}
		>
			<button
				onclick={() => (showUpgradeCta = false)}
				class="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#875F42]/8 text-[#875F42]/50 transition-all hover:bg-[#875F42]/15 hover:text-[#875F42]"
				aria-label="Close"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
			<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD6E5] to-[#F06292]/20">
				<svg class="h-6 w-6 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
				</svg>
			</div>
			<h3 class="mb-2 text-lg font-black text-[#4A2C2C]">You've used your quota</h3>
			<p class="mb-6 text-sm leading-relaxed text-[#875F42]/70">
				You've reached your plan's processing limit. Upgrade to get more images per month and unlock batch processing up to 25 files.
			</p>
			<a
				href="/pricing"
				class="mb-3 block w-full rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] py-3 text-center font-black text-white shadow-lg shadow-pink-200/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-pink-300/60"
			>
				Upgrade plan
			</a>
			<button
				onclick={() => (showUpgradeCta = false)}
				class="block w-full rounded-2xl border border-[#875F42]/15 py-3 text-center font-bold text-[#875F42] transition-all duration-200 hover:bg-[#875F42]/5 cursor-pointer"
			>
				Maybe later
			</button>
		</div>
	</div>
{/if}

{#if showSignupCta}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
		onclick={() => (showSignupCta = false)}
		role="dialog"
		aria-modal="true"
	>
		<div
			class="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl"
			onclick={(e) => e.stopPropagation()}
		>
			<button
				onclick={() => (showSignupCta = false)}
				class="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#875F42]/8 text-[#875F42]/50 transition-all hover:bg-[#875F42]/15 hover:text-[#875F42]"
				aria-label="Close"
			>
				<svg
					class="h-4 w-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					stroke-width="2.5"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
			<div
				class="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD6E5] to-[#F06292]/20"
			>
				<svg
					class="h-6 w-6 text-[#F06292]"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
				</svg>
			</div>
			<h3 class="mb-2 text-lg font-black text-[#4A2C2C]">You've hit the free limit</h3>
			<p class="mb-6 text-sm leading-relaxed text-[#875F42]/70">
				Without an account you get 3 free images per month. Create a free account for 25
				images/month, or upgrade for even more.
			</p>
			<a
				href="/auth/register"
				class="mb-3 block w-full rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] py-3 text-center font-black text-white shadow-lg shadow-pink-200/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-pink-300/60"
			>
				Create free account
			</a>
			<a
				href="/pricing"
				class="block w-full rounded-2xl border border-[#875F42]/15 py-3 text-center font-bold text-[#875F42] transition-all duration-200 hover:bg-[#875F42]/5"
			>
				See plans
			</a>
		</div>
	</div>
{/if}

<style>
	.victory-glow {
		animation: victory-pulse 1.8s ease-out forwards;
	}

	@keyframes victory-pulse {
		0% {
			box-shadow:
				0 8px 32px 0 rgba(240, 98, 146, 0.15),
				0 0 0 0 rgba(165, 214, 167, 0);
		}
		20% {
			box-shadow:
				0 8px 32px 0 rgba(165, 214, 167, 0.5),
				0 0 60px 12px rgba(165, 214, 167, 0.35);
		}
		60% {
			box-shadow:
				0 8px 32px 0 rgba(165, 214, 167, 0.3),
				0 0 40px 8px rgba(165, 214, 167, 0.2);
		}
		100% {
			box-shadow:
				0 8px 32px 0 rgba(240, 98, 146, 0.15),
				0 0 0 0 rgba(165, 214, 167, 0);
		}
	}

	.liquid-glass {
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%);
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		border: 1px solid rgba(255, 255, 255, 0.4);
		box-shadow:
			0 8px 32px 0 rgba(240, 98, 146, 0.15),
			inset 0 1px 0 0 rgba(255, 255, 255, 0.6),
			inset 0 -1px 0 0 rgba(255, 255, 255, 0.1);
	}

	.liquid-bubble {
		background: rgba(255, 255, 255, 0.25);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		box-shadow:
			inset 0 2px 4px rgba(255, 255, 255, 0.6),
			inset 0 -2px 4px rgba(0, 0, 0, 0.05),
			0 4px 12px rgba(240, 98, 146, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.5);
	}

	.liquid-glow {
		box-shadow:
			0 0 0 2px rgba(240, 98, 146, 0.4),
			0 0 40px rgba(240, 98, 146, 0.2),
			inset 0 0 20px rgba(255, 255, 255, 0.5);
	}

	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in {
		animation: fade-in 0.3s ease-out forwards;
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}
	.animate-shimmer {
		animation: shimmer 1.8s ease-in-out infinite;
	}
</style>
