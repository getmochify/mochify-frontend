// Save a Blob as a file download.
//
// The object URL is revoked a minute later, not straight after click().
// Safari starts reading a download asynchronously, and for a large blob (a
// batch ZIP) it got there after the old 100ms revoke and showed "Safari can't
// open the page ... WebKitBlobResource error 1" instead of saving the file.
// Chrome copies the blob at click time, which is why only Safari failed.
// Holding the URL a minute costs nothing beyond keeping the blob alive that
// long, and it is released either way.
const REVOKE_AFTER_MS = 60_000;

export function saveBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.style.display = 'none';
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), REVOKE_AFTER_MS);
}
