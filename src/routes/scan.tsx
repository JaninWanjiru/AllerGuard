import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ScanLine } from "lucide-react";
import { toast } from "sonner";

import { CameraView } from "@/components/CameraView";
import { UploadDrop } from "@/components/UploadDrop";
import { DemoLabelGrid } from "@/components/DemoLabelGrid";
import { ResultPanel } from "@/components/ResultPanel";
import { SecureDispatch } from "@/components/SecureDispatch";
import { useAppStore } from "@/store/app-store";
import {
  buildWebhookEvent,
  dispatchWebhook,
  runScan,
  type ScanResult,
} from "@/lib/scan-engine";
import { runOCR } from "@/lib/ocr";
import type { DemoLabel } from "@/lib/demo-labels";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan a label · AllerGuard" },
      {
        name: "description",
        content:
          "Use your camera, upload, or try a demo label to instantly validate ingredients against your profile.",
      },
      { property: "og:title", content: "Scan a label · AllerGuard" },
      { property: "og:description", content: "Camera, upload, or demo label scanning." },
      { property: "og:url", content: "/scan" },
    ],
    links: [{ rel: "canonical", href: "/scan" }],
  }),
  component: ScanPage,
});

function ScanPage() {
  const activeIds = useAppStore((s) => s.activeAllergenIds);
  const customTerms = useAppStore((s) => s.customTerms);
  const pushScan = useAppStore((s) => s.pushScan);
  const pushCompliance = useAppStore((s) => s.pushCompliance);

  const [result, setResult] = useState<ScanResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [busyLabel, setBusyLabel] = useState("");
  const [dispatchOpen, setDispatchOpen] = useState(false);

  async function processText(rawText: string, source: ScanResult["source"], product?: string) {
    const scan = runScan({
      rawText,
      source,
      productName: product,
      activeIds,
      customTerms,
    });
    setResult(scan);
    pushScan(scan);

    const event = buildWebhookEvent(scan);
    await dispatchWebhook(event);
    pushCompliance(event);

    if (scan.status === "hazard") {
      setDispatchOpen(true);
      toast.error("Hazard detected — secure dispatch initiated", {
        description: scan.matches.map((m) => m.label).join(", "),
      });
    } else if (scan.status === "alert") {
      toast.warning(`${scan.matches.length} allergen${scan.matches.length > 1 ? "s" : ""} flagged`, {
        description: scan.matches.map((m) => m.label).join(", "),
      });
    } else {
      toast.success("Label is clean", { description: "No active triggers matched." });
    }
  }

  async function handleImage(blob: Blob) {
    setBusy(true);
    setBusyLabel("Running on-device OCR…");
    try {
      const text = await runOCR(blob);
      if (!text.trim()) {
        toast.error("Couldn't read any text", { description: "Try a clearer image." });
        return;
      }
      await processText(text, blob instanceof File ? "upload" : "camera");
    } catch (err) {
      toast.error("Scan failed", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setBusy(false);
      setBusyLabel("");
    }
  }

  async function handleDemo(d: DemoLabel) {
    setBusy(true);
    setBusyLabel(`Scanning ${d.product}…`);
    // small delay for theatre — feels like real processing
    await new Promise((r) => setTimeout(r, 420));
    await processText(d.text, "demo", d.product);
    setBusy(false);
    setBusyLabel("");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 lg:px-6 lg:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-steel">
          <ScanLine className="h-3.5 w-3.5" /> Scanner
        </span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Validate a label.
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Capture, upload, or pick a demo label. AllerGuard normalizes the text,
          matches it against your active allergens, and dispatches a compliance
          event when a hazard is found.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CameraView onCapture={handleImage} />
        </div>
        <div>
          <UploadDrop onFile={handleImage} />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Or try a demo label
        </h2>
        <DemoLabelGrid onPick={handleDemo} />
      </div>

      {busy && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex items-center justify-center gap-3 rounded-2xl border border-border/70 bg-card/60 px-4 py-4 text-sm text-muted-foreground"
        >
          <Loader2 className="h-4 w-4 animate-spin text-coral" />
          {busyLabel}
        </motion.div>
      )}

      {result && !busy && (
        <div className="mt-8">
          <ResultPanel result={result} onReset={() => setResult(null)} />
        </div>
      )}

      <SecureDispatch open={dispatchOpen} onClose={() => setDispatchOpen(false)} />
    </div>
  );
}
