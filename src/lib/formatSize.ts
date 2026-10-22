// Formats a magnitude, signed. Math.log of a negative is NaN, which used to
// cascade into `sizes[NaN]` and render the string "NaN undefined" whenever a
// caller passed a negative size delta. Callers now pass magnitudes, but the
// guard stays because a silent NaN here surfaces as user-facing copy.
// Shared by ImageUpload and PromptFormApp so the two surfaces quote savings
// in the same units.
export function formatFileSize(bytes: number): string {
	if (!Number.isFinite(bytes) || bytes === 0) return '0 Bytes';
	const sign = bytes < 0 ? '-' : '';
	const abs = Math.abs(bytes);
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	// Clamped so anything past GB keeps a unit instead of indexing off the end.
	const i = Math.min(Math.floor(Math.log(abs) / Math.log(k)), sizes.length - 1);
	return sign + Math.round((abs / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
