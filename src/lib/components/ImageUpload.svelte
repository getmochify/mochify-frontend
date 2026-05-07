<script lang="ts">
	import { zip } from 'fflate';
	import { env } from '$env/dynamic/public';
	import { getIsPro, getPlan, getSessionToken } from '$lib/user';
	import posthog from 'posthog-js';

	const API_URL = env.PUBLIC_API_URL || 'https://api.mochify.app';

	type FileProgress = {
		file: File;
		progress: number;
		phase: 'uploading' | 'processing' | 'downloading';
		status: 'pending' | 'processing' | 'complete' | 'error';
		error?: string;
		thumbnailUrl?: string;
	};

	const props = $props();
	let {
		types = '.JPG, .JPEG, .PNG, .WEBP, .AVIF, .HEIC, .HEIF, .HIF, .JXL',
		showTypes = true,
		output = 'jpg',
		class: className = '',
		queryParams = '',
		showExifOption = false,
		showSmartMode = false,
		bonusKey = ''
	} = props;
	const hasOutputOverride = 'output' in props;

	let stripExif: boolean = $state(false);
	let smartCompress: boolean = $state(false);
	let isDragging: boolean = $state(false);

	let selectedFiles: File[] = $state([]);
	let fileProgress: FileProgress[] = $state([]);
	let imageType: string = $state(output);
	let isLoading: boolean = $state(false);
	let errorMessage: string = $state('');
	let successMessage: string = $state('');
	let totalOriginalSize: number = $state(0);
	let fileInputElement: HTMLInputElement;
	let MAX_FILES = $state(25);
	const CONCURRENT_UPLOADS = 1;
	let MAX_INDIVIDUAL_FILE_SIZE = $state(20 * 1024 * 1024); // 20MB, 75MB for pro
	$effect(() => {
		getIsPro().then((isPro) => {
			MAX_INDIVIDUAL_FILE_SIZE = isPro ? 75 * 1024 * 1024 : 20 * 1024 * 1024;
		});
		getPlan().then((plan) => {
			if (plan === 'free' && bonusKey && !localStorage.getItem(`mochify_bonus_${bonusKey}`)) {
				MAX_FILES = 25;
			} else {
				MAX_FILES = plan === 'free' ? 3 : 25;
			}
		});
	});

	let showSignupCta = $state(false);
	let showUpgradeCta = $state(false);
	let isFileSizeError = $state(false);
	let shaking = $state(false);
	let processPhase: 'idle' | 'uploading' | 'processing' | 'downloading' = $state('idle');
	let uploadPercent: number = $state(0);
	let downloadPercent: number = $state(0);

	// Token limit tracking
	let availableTokens: number = $state(0);
	let hasCheckedTokens: boolean = $state(false);

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			processFiles(Array.from(target.files));
			target.value = '';
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		isDragging = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node)) {
			isDragging = false;
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		isDragging = false;
		if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
			processFiles(Array.from(event.dataTransfer.files));
		}
	}

	async function checkTokenLimit(): Promise<void> {
		try {
			const jwt = await getSessionToken();
			const response = await fetch(`${API_URL}/v1/checkTokens`, {
				headers: jwt ? { Authorization: `Bearer ${jwt}` } : {}
			});
			if (!response.ok) {
				throw new Error('Failed to check token limit');
			}
			const data = (await response.json()) as { remaining: number };
			availableTokens = data.remaining || 0;
			hasCheckedTokens = true;
		} catch (error) {
			console.error('Token check failed:', error);
			hasCheckedTokens = false;
		}
	}

	const ACCEPTED_MIME_TYPES = new Set([
		'image/jpeg',
		'image/heic',
		'image/heif',
		'image/avif',
		'image/png',
		'image/jxl',
		'image/webp',
		'image/svg+xml'
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
		'webp',
		'svg'
	]);

	async function processFiles(allFiles: File[]) {
		const invalidFiles = allFiles.filter((f) => {
			const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
			return !ACCEPTED_MIME_TYPES.has(f.type) && !ACCEPTED_EXTENSIONS.has(ext);
		});
		if (invalidFiles.length > 0) {
			errorMessage = `${invalidFiles.length} file(s) not supported. Accepted: JPG, PNG, WebP, AVIF, HEIC, HEIF, HIF, JXL, SVG.`;
			allFiles = allFiles.filter((f) => {
				const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
				return ACCEPTED_MIME_TYPES.has(f.type) || ACCEPTED_EXTENSIONS.has(ext);
			});
			if (allFiles.length === 0) return;
		}

		const oversizedFiles = allFiles.filter((f) => f.size > MAX_INDIVIDUAL_FILE_SIZE);

		if (oversizedFiles.length > 0) {
			errorMessage = `${oversizedFiles.length} file${oversizedFiles.length !== 1 ? 's' : ''} exceed${oversizedFiles.length === 1 ? 's' : ''} the ${MAX_INDIVIDUAL_FILE_SIZE / 1024 / 1024}MB limit.`;
			isFileSizeError = MAX_INDIVIDUAL_FILE_SIZE === 20 * 1024 * 1024;
			return;
		}

		const existingFileKeys = new Set(selectedFiles.map((f) => `${f.name}-${f.size}`));
		const newFiles = allFiles.filter((f) => !existingFileKeys.has(`${f.name}-${f.size}`));

		const combinedFiles = [...selectedFiles, ...newFiles].slice(0, MAX_FILES);
		const addedCount = combinedFiles.length - selectedFiles.length;

		selectedFiles = combinedFiles;
		fileProgress = combinedFiles.map((file) => {
			const existing = fileProgress.find((fp) => fp.file === file);
			if (existing) return existing;
			return {
				file,
				progress: 0,
				phase: 'uploading' as const,
				status: 'pending' as const,
				thumbnailUrl: URL.createObjectURL(file)
			};
		});
		totalOriginalSize = combinedFiles.reduce((sum, file) => sum + file.size, 0);
		errorMessage = '';
		successMessage = '';
		isFileSizeError = false;

		if (addedCount === 0 && newFiles.length === 0) {
			errorMessage = 'All selected files are already in the list.';
		} else if (selectedFiles.length >= MAX_FILES && allFiles.length > addedCount) {
			errorMessage =
				MAX_FILES === 3
					? `Free plan is limited to 3 files. Upgrade to Seller or Pro for batches up to 25.`
					: `Maximum ${MAX_FILES} files. Added ${addedCount} file(s).`;
		}

		await checkTokenLimit();
	}

	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
	}

	$effect(() => {
		if (hasOutputOverride) {
			imageType = output;
		}
	});

	// Pre-flight token check only applies to unauthenticated users.
	// Authenticated users skip this — the backend enforces limits via 429.
	let isAuthenticated: boolean = $state(false);
	$effect(() => {
		getSessionToken().then((jwt) => {
			isAuthenticated = !!jwt;
		});
	});

	const insufficientTokens = $derived(
		!isAuthenticated &&
			hasCheckedTokens &&
			selectedFiles.length > 0 &&
			selectedFiles.length > availableTokens
	);

	function handleButtonClick() {
		if (isLoading) return;
		if (selectedFiles.length === 0 || insufficientTokens) {
			shaking = true;
			setTimeout(() => (shaking = false), 400);
			return;
		}
		compressImage();
	}

	async function compressImage() {
		if (selectedFiles.length === 0) {
			errorMessage = 'Please select at least one image';
			return;
		}

		const jwt = await getSessionToken();

		posthog.capture('manual_compress_started', {
			files: selectedFiles.length,
			format: imageType,
			authed: !!jwt
		});

		if (bonusKey) {
			localStorage.setItem(`mochify_bonus_${bonusKey}`, '1');
		}

		isLoading = true;
		errorMessage = '';
		successMessage = '';
		processPhase = 'uploading';
		uploadPercent = 0;
		downloadPercent = 0;

		fileProgress = selectedFiles.map((file) => ({
			file,
			progress: 0,
			phase: 'uploading' as const,
			status: 'pending' as const
		}));

		try {
			let totalCompressedSize = 0;
			const compressedBlobs: Blob[] = new Array(selectedFiles.length);
			let hitRateLimit = false;
			const totalBytes = selectedFiles.reduce((sum, f) => sum + f.size, 0);
			let uploadedBytes = 0;

			const processFile = async (index: number) => {
				const file = selectedFiles[index];
				fileProgress[index].status = 'processing';

				try {
					const blob = await new Promise<Blob>((resolve, reject) => {
						const xhr = new XMLHttpRequest();
						let lastLoaded = 0;

						xhr.upload.addEventListener('progress', (e) => {
							const delta = e.loaded - lastLoaded;
							lastLoaded = e.loaded;
							uploadedBytes += delta;
							processPhase = 'uploading';
							uploadPercent = Math.min(Math.round((uploadedBytes / totalBytes) * 100), 100);
						});

						xhr.upload.addEventListener('load', () => {
							uploadedBytes += file.size - lastLoaded;
							uploadPercent = Math.min(Math.round((uploadedBytes / totalBytes) * 100), 100);
							processPhase = 'processing';
							downloadPercent = 0;
						});

						xhr.addEventListener('progress', (e) => {
							processPhase = 'downloading';
							if (e.lengthComputable) {
								downloadPercent = Math.round((e.loaded / e.total) * 100);
							}
						});

						xhr.addEventListener('load', () => {
							if (xhr.status >= 200 && xhr.status < 300) {
								const latency = xhr.getResponseHeader('X-Latency-Ms');
								if (latency) console.log(`[C++ Engine] ${file.name} squished in ${latency}`);
								resolve(xhr.response);
							} else {
								const error: any = new Error(`Server error: ${xhr.status}`);
								error.status = xhr.status;
								reject(error);
							}
						});

						xhr.addEventListener('error', () => reject(new Error('Network error')));
						xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

						xhr.open(
							'POST',
							`${API_URL}/v1/squish?type=${imageType}&strip_exif=${stripExif}${smartCompress ? '&smartCompress=1' : ''}${queryParams ? '&' + queryParams : ''}`
						);
						xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
						if (jwt) xhr.setRequestHeader('Authorization', `Bearer ${jwt}`);
						xhr.responseType = 'blob';
						xhr.send(file);
					});

					compressedBlobs[index] = blob;
					totalCompressedSize += blob.size;
					fileProgress[index].status = 'complete';
				} catch (error: any) {
					fileProgress[index].status = 'error';
					if (error.status === 429) {
						hitRateLimit = true;
						fileProgress[index].error = 'Rate limit exceeded';
						if (!jwt) {
							showSignupCta = true;
							posthog.capture('signup_cta_shown', { trigger: 'rate_limit' });
						} else {
							showUpgradeCta = true;
							posthog.capture('upgrade_cta_shown', { trigger: 'rate_limit' });
						}
					} else {
						fileProgress[index].error = error instanceof Error ? error.message : 'Unknown error';
					}
				}
			};

			batchLoop: for (let i = 0; i < selectedFiles.length; i += CONCURRENT_UPLOADS) {
				const batch = [];
				for (let j = i; j < Math.min(i + CONCURRENT_UPLOADS, selectedFiles.length); j++) {
					batch.push(processFile(j));
				}
				await Promise.allSettled(batch);
				if (hitRateLimit) break batchLoop;
			}

			const successfulFiles = selectedFiles.filter((_, i) => fileProgress[i].status === 'complete');
			const failedFiles = selectedFiles.filter((_, i) => fileProgress[i].status === 'error');

			if (successfulFiles.length === 0) {
				if (hitRateLimit) return; // CTA modal already shown
				throw new Error('All files failed to convert');
			}

			if (successfulFiles.length === 1) {
				const index = selectedFiles.findIndex((_, i) => fileProgress[i].status === 'complete');
				const nameWithoutExt = successfulFiles[0].name.replace(/\.[^/.]+$/, '');
				const extension = imageType === 'jpeg' ? 'jpg' : imageType;
				downloadBlob(compressedBlobs[index], `${nameWithoutExt}.${extension}`);
			} else {
				const zipData: Record<string, Uint8Array> = {};
				await Promise.all(
					selectedFiles.map(async (file, i) => {
						if (fileProgress[i].status !== 'complete') return;
						const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
						const extension = imageType === 'jpeg' ? 'jpg' : imageType;
						const buffer = await compressedBlobs[i].arrayBuffer();
						zipData[`${nameWithoutExt}.${extension}`] = new Uint8Array(buffer);
					})
				);

				const zipContent = await new Promise<Uint8Array>((resolve, reject) => {
					zip(zipData, { level: 0 }, (err, data) => {
						if (err) reject(err);
						else resolve(data);
					});
				});

				downloadBlob(
					new Blob([zipContent.buffer as ArrayBuffer], { type: 'application/zip' }),
					'compressed-images.zip'
				);
			}

			const reduction = ((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1);
			const spaceSaved = formatFileSize(totalOriginalSize - totalCompressedSize);

			if (hitRateLimit) {
				const pendingFiles = fileProgress.filter((fp) => fp.status === 'pending').length;
				posthog.capture('manual_compress_rate_limited', {
					files: successfulFiles.length,
					format: imageType
				});
				successMessage = `Rate limit reached! Downloaded ${successfulFiles.length} successful conversion(s). ${pendingFiles} file(s) remain.`;
			} else if (failedFiles.length > 0) {
				posthog.capture('manual_compress_completed', {
					files: successfulFiles.length,
					failed: failedFiles.length,
					format: imageType
				});
				successMessage = `${successfulFiles.length} of ${selectedFiles.length} squished. Saved ${spaceSaved}. ${failedFiles.length} failed.`;
			} else {
				posthog.capture('manual_compress_completed', {
					files: successfulFiles.length,
					reduction: parseFloat(reduction),
					format: imageType,
					space_saved_bytes: totalOriginalSize - totalCompressedSize
				});
				successMessage =
					selectedFiles.length === 1
						? `Squished! Saved ${spaceSaved} (${reduction}% smaller).`
						: `Done! ${selectedFiles.length} images optimised. Saved ${spaceSaved} total.`;
			}

			fileProgress.forEach((fp) => {
				if (fp.thumbnailUrl) URL.revokeObjectURL(fp.thumbnailUrl);
			});
			selectedFiles = selectedFiles.filter((_, i) => fileProgress[i].status !== 'complete');
			fileProgress = fileProgress.filter((fp) => fp.status !== 'complete');
			totalOriginalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

			if (fileInputElement) fileInputElement.value = '';
			await checkTokenLimit();
		} catch (error) {
			posthog.capture('manual_compress_failed', {
				error: error instanceof Error ? error.message : String(error)
			});
			posthog.captureException(error);
			errorMessage = error instanceof Error ? error.message : 'Failed to compress images';
		} finally {
			isLoading = false;
			processPhase = 'idle';
		}
	}

	function downloadBlob(blob: Blob, filename: string) {
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		if (!filename.includes('.')) {
			const extension = imageType === 'jpeg' ? 'jpg' : imageType;
			a.download = `${filename}.${extension}`;
		} else {
			a.download = filename;
		}
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	function resetForm() {
		fileProgress.forEach((fp) => {
			if (fp.thumbnailUrl) URL.revokeObjectURL(fp.thumbnailUrl);
		});
		selectedFiles = [];
		fileProgress = [];
		totalOriginalSize = 0;
		errorMessage = '';
		successMessage = '';
		imageType = 'jpg';
		if (fileInputElement) fileInputElement.value = '';
	}

	function removeFile(index: number) {
		if (fileProgress[index].thumbnailUrl) {
			URL.revokeObjectURL(fileProgress[index].thumbnailUrl!);
		}
		selectedFiles = selectedFiles.filter((_, i) => i !== index);
		fileProgress = fileProgress.filter((_, i) => i !== index);
		totalOriginalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
	}

	const formats = [
		{ value: 'jpg', label: 'JPEG' },
		{ value: 'png', label: 'PNG' },
		{ value: 'webp', label: 'WebP' },
		{ value: 'avif', label: 'AVIF' },
		{ value: 'jxl', label: 'JXL' }
	];
</script>

<div
	class={`liquid-glass relative w-full overflow-hidden rounded-[2rem] transition-all duration-300 ${isDragging ? 'liquid-glow scale-[1.02]' : ''} ${className}`.trim()}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	role="region"
	aria-label="Upload images"
>
	<!-- Top highlight -->
	<div
		class="absolute inset-x-0 top-0 z-10 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent"
	></div>

	<!-- Hidden file input -->
	<input
		bind:this={fileInputElement}
		id="file-input"
		type="file"
		accept=".jpg,.jpeg,.heic,.heif,.hif,.avif,.png,.jxl,.webp,.svg,image/jpeg,image/heic,image/heif,image/avif,image/png,image/jxl,image/webp,image/svg+xml"
		multiple
		onchange={handleFileSelect}
		class="hidden"
	/>

	<!-- Drag overlay -->
	{#if isDragging}
		<div
			class="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center rounded-[2rem] bg-white/40 backdrop-blur-md"
		>
			<div
				class="mb-3 flex h-14 w-14 animate-bounce items-center justify-center rounded-2xl bg-white/90 shadow-xl shadow-pink-200/50"
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
			<p class="text-lg font-bold tracking-tight text-[#4A2C2C] drop-shadow-md">
				Drop it like it's hot
			</p>
		</div>
	{/if}

	<!-- Thumbnails (files selected) -->
	{#if selectedFiles.length > 0}
		<div class="relative flex flex-wrap items-center gap-3 px-4 pt-6 pb-3 sm:px-6">
			{#each fileProgress as fp, index}
				<div class="group relative flex-shrink-0">
					<div class="liquid-bubble h-16 w-16 overflow-hidden rounded-2xl p-1">
						{#if fp.thumbnailUrl}
							<img
								src={fp.thumbnailUrl}
								alt={fp.file.name}
								class="h-full w-full rounded-xl object-cover"
							/>
						{:else}
							<div class="flex h-full w-full items-center justify-center rounded-xl bg-white/40">
								<svg class="h-5 w-5 text-[#FFB3C6]" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
						{/if}
					</div>

					<!-- Status badge -->
					{#if fp.status === 'complete'}
						<div
							class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#81C784] shadow-sm"
						>
							<svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					{:else if fp.status === 'error'}
						<div
							class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#EF5350] shadow-sm"
						>
							<svg class="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					{:else if fp.status === 'processing'}
						<div
							class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#F06292] shadow-sm"
						>
							<svg class="h-3 w-3 animate-spin text-white" fill="none" viewBox="0 0 24 24">
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						</div>
					{/if}


					<!-- Remove button -->
					{#if fp.status !== 'processing'}
						<button
							onclick={() => removeFile(index)}
							class="absolute -top-2 -right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#F06292] opacity-100 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:text-red-500 sm:opacity-0 sm:group-hover:opacity-100 sm:hover:scale-110"
							title="Remove file"
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
					{/if}
				</div>
			{/each}

			<!-- Add more -->
			<button
				onclick={() => fileInputElement?.click()}
				class="liquid-bubble flex h-16 w-16 flex-shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[#F06292]/30 text-[#F06292]/60 transition-all hover:scale-105 hover:bg-white/60 hover:text-[#F06292]"
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
	{:else}
		<!-- Empty state -->
		<label
			for="file-input"
			class="group flex cursor-pointer flex-col items-center justify-center gap-2 px-6 pt-8 pb-5 text-center"
		>
			<div
				class="liquid-bubble mb-1 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-105"
			>
				<svg
					class="h-6 w-6 text-[#F06292]/70"
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
			<p class="text-sm font-semibold text-[#4A2C2C]">
				Drop images here or <span class="text-[#F06292]">browse</span>
			</p>
			<p class="text-xs text-[#6C3F31]/60">
				{types} · max {MAX_FILES} files, {MAX_INDIVIDUAL_FILE_SIZE / 1024 / 1024}MB each
			</p>
		</label>
	{/if}

	<!-- Toggles -->
	{#if showExifOption || showSmartMode}
		<div class="flex flex-wrap gap-x-6 gap-y-3 px-4 pb-3 sm:px-6">
			{#if showExifOption}
				<label class="group flex cursor-pointer items-center gap-2.5 select-none">
					<input type="checkbox" bind:checked={stripExif} class="sr-only" />
					<div
						class="relative h-5 w-10 rounded-full transition-all duration-300 {stripExif
							? 'bg-[#F06292] shadow-[0_0_0_1px_#F06292]'
							: 'bg-[#875F42]/20 shadow-[inset_0_1px_3px_rgba(0,0,0,0.15),0_0_0_1px_rgba(135,95,66,0.25)]'}"
					>
						<div
							class="absolute top-[3px] left-[3px] h-3.5 w-3.5 rounded-full bg-white shadow-md transition-transform duration-300 {stripExif
								? 'translate-x-5'
								: ''}"
						></div>
					</div>
					<span
						class="text-xs font-semibold text-[#6C3F31] transition-colors group-hover:text-[#4A2C2C]"
						>Strip EXIF</span
					>
				</label>
			{/if}
			{#if showSmartMode}
				<label class="group flex cursor-pointer items-center gap-2.5 select-none">
					<input type="checkbox" bind:checked={smartCompress} class="sr-only" />
					<div
						class="relative h-5 w-10 rounded-full transition-all duration-300 {smartCompress
							? 'bg-[#66BB6A] shadow-[0_0_0_1px_#66BB6A]'
							: 'bg-[#875F42]/20 shadow-[inset_0_1px_3px_rgba(0,0,0,0.15),0_0_0_1px_rgba(135,95,66,0.25)]'}"
					>
						<div
							class="absolute top-[3px] left-[3px] h-3.5 w-3.5 rounded-full bg-white shadow-md transition-transform duration-300 {smartCompress
								? 'translate-x-5'
								: ''}"
						></div>
					</div>
					<span
						class="text-xs font-semibold text-[#6C3F31] transition-colors group-hover:text-[#4A2C2C]"
						>Smart Mode</span
					>
				</label>
			{/if}
		</div>
	{/if}

	<!-- Token status -->
	{#if hasCheckedTokens && selectedFiles.length > 0 && !insufficientTokens && availableTokens > 0}
		<div
			class="mx-4 mb-3 flex items-center gap-2 rounded-2xl border border-[#A5D6A7]/40 bg-white/30 px-4 py-2.5 backdrop-blur-sm sm:mx-6"
		>
			<svg class="h-4 w-4 flex-shrink-0 text-[#66BB6A]" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
					clip-rule="evenodd"
				/>
			</svg>
			<p class="text-xs font-semibold text-[#33691E]">
				{availableTokens} token{availableTokens !== 1 ? 's' : ''} available
			</p>
		</div>
	{/if}

	{#if insufficientTokens}
		<div
			class="mx-4 mb-3 flex items-start gap-2 rounded-2xl border border-[#FFD54F]/50 bg-white/30 px-4 py-2.5 backdrop-blur-sm sm:mx-6"
		>
			<svg
				class="mt-0.5 h-4 w-4 flex-shrink-0 text-[#F57C00]"
				fill="currentColor"
				viewBox="0 0 20 20"
			>
				<path
					fill-rule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
					clip-rule="evenodd"
				/>
			</svg>
			{#if availableTokens === 0}
				<p class="text-xs font-semibold text-[#6C3F31]">
					No tokens left. <a href="/auth/register" class="text-[#F06292] underline hover:text-[#E91E8C]">Create a free account</a> for 25/month, or <a href="/pricing" class="text-[#F06292] underline hover:text-[#E91E8C]">see plans</a>.
				</p>
			{:else}
				<p class="text-xs font-semibold text-[#6C3F31]">
					{availableTokens} token{availableTokens !== 1 ? 's' : ''} available — remove {selectedFiles.length -
						availableTokens} file{selectedFiles.length - availableTokens !== 1 ? 's' : ''} or <a href="/auth/register" class="text-[#F06292] underline hover:text-[#E91E8C]">sign up</a> for more.
				</p>
			{/if}
		</div>
	{/if}

	<!-- Submit button -->
	<div class="px-4 pb-4 sm:px-6">
		<button
			onclick={handleButtonClick}
			aria-disabled={selectedFiles.length === 0 || isLoading || insufficientTokens}
			class="group flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-bold transition-all duration-300
                {shaking ? 'animate-shake' : ''}
                {selectedFiles.length > 0 && !isLoading && !insufficientTokens
				? 'cursor-pointer bg-gradient-to-br from-[#FF9EBB] to-[#F06292] text-white shadow-[0_4px_16px_rgba(240,98,146,0.35)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(240,98,146,0.5)]'
				: 'cursor-not-allowed border border-[#875F42]/15 bg-white/40 text-[#875F42]/60'}"
		>
			{#if isLoading}
				<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				<span>Squishing{selectedFiles.length > 1 ? ` ${selectedFiles.length} images` : ''}…</span>
			{:else if insufficientTokens}
				<span>Not enough tokens</span>
			{:else}
				<svg
					class="h-4 w-4 {selectedFiles.length > 0 && !insufficientTokens ? 'transition-transform group-hover:scale-110' : ''}"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						fill-rule="evenodd"
						d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
				<span
					>Squish{selectedFiles.length > 1
						? ` ${selectedFiles.length} images as ZIP`
						: ' your image'}</span
				>
			{/if}
		</button>
	</div>

	<!-- Success / error messages -->
	{#if successMessage || errorMessage}
		<div class="-mt-1 flex flex-col gap-2 px-4 pb-4 sm:px-6">
			{#if successMessage}
				<div
					class="flex items-center gap-2 rounded-2xl border border-[#A5D6A7]/50 bg-white/30 px-4 py-3 backdrop-blur-sm"
				>
					<svg class="h-4 w-4 flex-shrink-0 text-[#66BB6A]" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						/>
					</svg>
					<p class="text-xs font-bold text-[#33691E]">{successMessage}</p>
				</div>
			{/if}
			{#if errorMessage}
				<div
					class="flex items-start gap-2 rounded-2xl border border-red-200/50 bg-white/30 px-4 py-3 backdrop-blur-sm"
				>
					<svg class="mt-0.5 h-4 w-4 shrink-0 text-[#EF5350]" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clip-rule="evenodd"
						/>
					</svg>
					{#if isFileSizeError}
						<p class="text-xs font-bold text-red-700">
							{errorMessage}
							{#if !isAuthenticated}
								<a href="/auth/register" class="ml-1 text-mochi-pink underline hover:text-[#E91E8C]">Create a free account</a> or
								<a href="/pricing" class="text-mochi-pink underline hover:text-[#E91E8C]">upgrade</a> for 75MB files.
							{:else}
								<a href="/pricing" class="ml-1 text-mochi-pink underline hover:text-[#E91E8C]">Upgrade your plan</a> for 75MB files.
							{/if}
						</p>
					{:else}
						<p class="text-xs font-bold text-red-700">{errorMessage}</p>
					{/if}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Footer tray -->
	<div>
	{#if isLoading}
		<div class="relative h-1 overflow-hidden bg-white/20">
			{#if processPhase === 'uploading'}
				<div class="h-full bg-gradient-to-r from-[#F06292] to-[#e040a0] shadow-[0_0_10px_rgba(240,98,146,0.5)] transition-all duration-300 ease-out" style="width: {uploadPercent}%"></div>
			{:else if processPhase === 'processing'}
				<div class="animate-shimmer absolute inset-0 bg-gradient-to-r from-[#A5D6A7] via-[#66BB6A] to-[#A5D6A7] bg-[length:200%_100%] opacity-80"></div>
			{:else if processPhase === 'downloading'}
				<div class="h-full bg-gradient-to-r from-[#A5D6A7] to-[#66BB6A] shadow-[0_0_10px_rgba(165,214,167,0.5)] transition-all duration-300 ease-out" style="width: {downloadPercent}%"></div>
			{/if}
		</div>
	{/if}
	<div
		class="flex items-center justify-between gap-3 bg-white/20 px-4 py-2 backdrop-blur-md sm:px-6"
	>
		{#if showTypes && !hasOutputOverride}
			<div class="flex flex-wrap items-center gap-1.5">
				{#each formats as fmt}
					<button
						onclick={() => (imageType = fmt.value)}
						class="cursor-pointer rounded-full px-2.5 py-1 text-xs font-bold tracking-wide transition-all duration-200 {imageType ===
						fmt.value
							? 'bg-[#F06292] text-white shadow-sm'
							: 'border border-[#875F42]/20 bg-white/50 text-[#6C3F31] hover:bg-white/70 hover:text-[#F06292]'}"
					>
						{fmt.label}
					</button>
				{/each}
			</div>
		{:else}
			<span></span>
		{/if}

		<span class="flex-shrink-0 text-xs font-medium whitespace-nowrap text-[#6C3F31]/70">
			{#if isLoading}
				{#if processPhase === 'uploading'}
					Uploading… ({uploadPercent}%)
				{:else if processPhase === 'processing'}
					<span class="animate-pulse">⬡</span> Processing…
				{:else if processPhase === 'downloading'}
					Saving…
				{/if}
			{:else if selectedFiles.length > 0}
				{selectedFiles.length}
				{selectedFiles.length === 1 ? 'image' : 'images'} ready
				{#if selectedFiles.length > 1}
					· <button
						onclick={resetForm}
						class="cursor-pointer text-[#F06292]/70 transition-colors hover:text-[#F06292]"
						>clear all</button
					>
				{/if}
			{/if}
		</span>
	</div>
	</div>
</div>

{#if showUpgradeCta}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
		onclick={() => (showUpgradeCta = false)}
		onkeydown={(e) => e.key === 'Escape' && (showUpgradeCta = false)}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div
			class="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl"
			role="presentation"
			onclick={(e) => e.stopPropagation()}
		>
			<button
				onclick={() => (showUpgradeCta = false)}
				aria-label="Close"
				class="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#875F42]/50 transition-all hover:bg-[#FFF5F7] hover:text-[#875F42]"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
			<div class="text-center">
				<div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0F5]">
					<svg class="h-6 w-6 text-[#F06292]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
					</svg>
				</div>
				<h3 class="mb-2 text-lg font-black text-[#4A2C2C]">Monthly limit reached</h3>
				<p class="mb-6 text-sm leading-relaxed text-[#875F42]/70">
					You've used your full image quota for this month. Upgrade for a higher limit, or your quota resets at the start of next month.
				</p>
				<div class="flex flex-col gap-3">
					<a
						href="/pricing"
						class="block rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-6 py-3 text-center text-sm font-black text-white shadow-[0_4px_16px_rgba(240,98,146,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)]"
					>
						Upgrade plan
					</a>
					<button
						onclick={() => (showUpgradeCta = false)}
						class="cursor-pointer rounded-2xl border border-[#875F42]/15 px-6 py-3 text-center text-sm font-bold text-[#6C3F31] transition-all hover:border-[#F06292]/30 hover:bg-[#FFF5F7] hover:text-[#F06292]"
					>
						Dismiss
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

{#if showSignupCta}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
		onclick={() => (showSignupCta = false)}
		onkeydown={(e) => e.key === 'Escape' && (showSignupCta = false)}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div
			class="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl"
			role="presentation"
			onclick={(e) => e.stopPropagation()}
		>
			<button
				onclick={() => (showSignupCta = false)}
				aria-label="Close"
				class="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#875F42]/50 transition-all hover:bg-[#FFF5F7] hover:text-[#875F42]"
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
			<div class="text-center">
				<div
					class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0F5]"
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
				<div class="flex flex-col gap-3">
					<a
						href="/auth/register"
						class="block rounded-2xl bg-gradient-to-br from-[#FF9EBB] to-[#F06292] px-6 py-3 text-center text-sm font-black text-white shadow-[0_4px_16px_rgba(240,98,146,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(240,98,146,0.45)]"
					>
						Create free account
					</a>
					<a
						href="/pricing"
						class="block rounded-2xl border border-[#875F42]/15 px-6 py-3 text-center text-sm font-bold text-[#6C3F31] transition-all hover:border-[#F06292]/30 hover:bg-[#FFF5F7] hover:text-[#F06292]"
					>
						See plans
					</a>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
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

	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		20%       { transform: translateX(-6px); }
		40%       { transform: translateX(6px); }
		60%       { transform: translateX(-4px); }
		80%       { transform: translateX(4px); }
	}
	.animate-shake {
		animation: shake 0.4s ease-in-out;
	}

	@keyframes shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}
	.animate-shimmer {
		animation: shimmer 1.8s ease-in-out infinite;
	}
</style>
