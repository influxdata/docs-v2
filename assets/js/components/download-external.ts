/**
 * Download External Component
 *
 * Triggers a file download for a cross-origin URL by fetching the resource,
 * wrapping it in a Blob, and clicking a synthesized same-origin `blob:` link.
 *
 * The native `download` attribute on `<a>` is ignored for cross-origin URLs,
 * so a plain `<a download href="https://raw.githubusercontent.com/...">` will
 * navigate to the file instead of saving it. This component restores
 * save-to-disk behavior for those cases.
 *
 * USAGE:
 *   <a data-component="download-external"
 *      href="https://example.com/path/to/file.conf"
 *      data-filename="sample.conf">Download</a>
 *
 *   - `href` (required): the source URL. Must serve a permissive
 *     `Access-Control-Allow-Origin` header (e.g., raw.githubusercontent.com).
 *   - `data-filename` (optional): filename for the saved file. If omitted,
 *     the basename of the URL pathname is used.
 *
 * FALLBACK:
 * If the fetch fails (network error, CORS rejection, non-2xx response), the
 * component lets the browser follow the `href` so the user still gets the
 * file — they just see it inline in the browser instead of a save dialog.
 */

interface ComponentOptions {
  component: HTMLElement;
}

function filenameFromUrl(url: string): string {
  try {
    const { pathname } = new URL(url, window.location.href);
    const base = pathname.split('/').pop();
    return base || 'download';
  } catch {
    return 'download';
  }
}

async function downloadAsFile(url: string, filename: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Defer revocation so the browser has time to start the download.
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

export default function DownloadExternal({ component }: ComponentOptions) {
  if (!(component instanceof HTMLAnchorElement)) {
    console.warn(
      'download-external: expected an <a> element, got',
      component.tagName
    );
    return;
  }

  const anchor = component;

  anchor.addEventListener('click', async (event: MouseEvent) => {
    // Let the user open in a new tab / save-as via modifier keys.
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const url = anchor.href;
    if (!url) return;

    const filename =
      anchor.dataset.filename ||
      anchor.getAttribute('download') ||
      filenameFromUrl(url);

    event.preventDefault();
    try {
      await downloadAsFile(url, filename);
    } catch (error) {
      // Fall back to native navigation so the user still gets the file.
      console.warn(
        'download-external: fetch failed, falling back to navigation',
        error
      );
      window.location.href = url;
    }
  });

  return { element: anchor };
}
