// macOS "AppleDouble" sidecars: when a Mac copies files to a drive or into a
// zip that cannot hold extended attributes, it writes `._NAME` beside each
// `NAME` to carry them. They keep the real file's extension (`._IMG_1234.HEIC`),
// so the browser types them as images and every extension check accepts them,
// but they hold no pixels — core refuses the first 4 KB as `unsupported-format`.
// Whole folders of them arrive from USB sticks and SD cards, almost always next
// to the real files, so they are dropped at intake instead of uploaded to fail.
export function isMacMetadataFile(f: File): boolean {
	return f.name.startsWith('._');
}

/** `files` without the AppleDouble sidecars, and how many were dropped. */
export function withoutMacMetadata(files: File[]): { kept: File[]; skipped: number } {
	const kept = files.filter((f) => !isMacMetadataFile(f));
	return { kept, skipped: files.length - kept.length };
}

// Shown only when a drop held nothing else: a batch that silently shrank by its
// sidecars needs no explanation, a drop that silently did nothing does.
export const MAC_METADATA_ONLY_MESSAGE =
	'Those are macOS metadata files (names starting with "._"), not images. Upload the files with the same names without the "._" prefix.';
