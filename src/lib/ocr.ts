/**
 * OCR wrapper using tesseract.js. Lazy-loaded so the heavy worker
 * only initializes when the scanner page actually needs it.
 */

let workerPromise: Promise<import("tesseract.js").Worker> | null = null;

async function getWorker() {
  if (!workerPromise) {
    workerPromise = (async () => {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng");
      return worker;
    })();
  }
  return workerPromise;
}

export async function runOCR(
  image: Blob | string | HTMLCanvasElement | HTMLImageElement,
  onProgress?: (p: number) => void,
): Promise<string> {
  const worker = await getWorker();
  // tesseract.js v6+ doesn't accept logger after init, so we just poll progress crudely
  onProgress?.(0.2);
  const { data } = await worker.recognize(image as never);
  onProgress?.(1);
  return (data.text || "").trim();
}

export async function terminateOCR() {
  if (workerPromise) {
    try {
      const w = await workerPromise;
      await w.terminate();
    } catch {
      // ignore
    }
    workerPromise = null;
  }
}
