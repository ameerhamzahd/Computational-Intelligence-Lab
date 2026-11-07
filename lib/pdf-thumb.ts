// Renders page 1 of a paper's PDF to a JPEG data URL and caches it per paper id.
// Resolves to null when the file can't be fetched/rendered (restricted, CORS, no PDF yet),
// so callers can fall back to a text-only placeholder page.

const cache = new Map<string, Promise<string | null>>();

export function loadPdfThumb(id: string): Promise<string | null> {
    const cached = cache.get(id);
    if (cached) return cached;

    const task = (async () => {
        try {
            const pdfjs = await import("pdfjs-dist");
            if (!pdfjs.GlobalWorkerOptions.workerSrc) {
                pdfjs.GlobalWorkerOptions.workerSrc = new URL(
                    "pdfjs-dist/build/pdf.worker.min.mjs",
                    import.meta.url
                ).toString();
            }

            const loadingTask = pdfjs.getDocument({
                url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/research/${id}/preview`,
            });
            const doc = await loadingTask.promise;
            const page = await doc.getPage(1);

            const base = page.getViewport({ scale: 1 });
            const viewport = page.getViewport({ scale: 560 / base.width });
            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const context = canvas.getContext("2d");
            if (!context) return null;

            await page.render({ canvas, canvasContext: context, viewport }).promise;
            const url = canvas.toDataURL("image/jpeg", 0.85);
            void loadingTask.destroy();
            return url;
        } catch (error) {
            // Don't cache failures, so a transient error doesn't hide the preview until reload.
            cache.delete(id);
            console.warn(`[pdf-thumb] Could not render the first page of paper ${id}:`, error);
            return null;
        }
    })();

    cache.set(id, task);
    return task;
}
