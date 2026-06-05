import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, ShieldAlert, RotateCcw } from "lucide-react";
import type { ScanResult } from "@/lib/scan-engine";

const STATUS = {
  safe: {
    Icon: ShieldCheck,
    title: "Safe to consume",
    body: "No active triggers from your profile were found in this label.",
    badge: "bg-safe text-safe-foreground",
    bg: "from-safe/15 to-transparent",
  },
  alert: {
    Icon: AlertTriangle,
    title: "Allergen detected",
    body: "One or more ingredients match your active allergen profile.",
    badge: "bg-coral text-powder",
    bg: "from-coral/15 to-transparent",
  },
  hazard: {
    Icon: ShieldAlert,
    title: "Hazard — do not consume",
    body: "Contaminant or toxin indicators were detected. Compliance dispatch fired.",
    badge: "bg-hazard text-hazard-foreground",
    bg: "from-hazard/20 to-transparent",
  },
} as const;

interface Props {
  result: ScanResult;
  onReset: () => void;
}

export function ResultPanel({ result, onReset }: Props) {
  const s = STATUS[result.status];
  const { Icon } = s;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`overflow-hidden rounded-3xl border border-border bg-gradient-to-b ${s.bg} p-1`}
    >
      <div className="rounded-[calc(theme(borderRadius.3xl)-4px)] bg-card/95 p-6">
        <div className="flex items-start gap-4">
          <div className={`grid h-14 w-14 place-items-center rounded-2xl ${s.badge}`}>
            <Icon className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${s.badge}`}>
                {result.status}
              </span>
              <span className="text-xs text-muted-foreground">
                Confidence {Math.round(result.confidence * 100)}%
              </span>
            </div>
            <h3 className="mt-1 text-xl font-semibold">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.body}</p>
            {result.productName && (
              <p className="mt-2 text-xs text-muted-foreground">
                Product: <span className="font-medium text-foreground">{result.productName}</span>
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onReset}
            aria-label="Scan again"
            className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-accent/40"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {result.matches.length > 0 && (
          <div className="mt-5 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Matched triggers
            </h4>
            {result.matches.map((m) => (
              <div
                key={m.allergenId + m.matchedTerm}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{m.label}</span>
                  {m.hazard && (
                    <span className="rounded-full bg-hazard/15 px-2 py-0.5 text-[10px] font-semibold text-hazard">
                      HAZARD
                    </span>
                  )}
                </div>
                <code className="text-xs text-muted-foreground">“{m.matchedTerm}”</code>
              </div>
            ))}
          </div>
        )}

        <details className="group mt-5 rounded-xl border border-border/60 bg-background/40 p-3">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Scanned text
          </summary>
          <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
            {result.rawText}
          </pre>
        </details>
      </div>
    </motion.div>
  );
}
