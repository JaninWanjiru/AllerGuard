import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ScanLine, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { runScan } from "@/lib/scan-engine";

const PLACEHOLDER = `Try pasting:  Wheat flour, sugar, groundnut paste, soy lecithin, salt`;

export function MiniSimulator() {
  const activeIds = useAppStore((s) => s.activeAllergenIds);
  const customTerms = useAppStore((s) => s.customTerms);
  const [text, setText] = useState("");

  const result = useMemo(() => {
    if (!text.trim()) return null;
    return runScan({
      rawText: text,
      source: "manual",
      activeIds,
      customTerms,
    });
  }, [text, activeIds, customTerms]);

  return (
    <section className="mx-auto max-w-5xl px-6 pb-20">
      <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/70 p-1 shadow-soft backdrop-blur">
        <div className="rounded-[calc(theme(borderRadius.3xl)-4px)] bg-gradient-soft p-8 md:p-10">
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-coral" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Try it live · no account needed
            </span>
          </div>
          <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Paste an ingredient list. See your verdict.
          </h3>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={PLACEHOLDER}
              rows={6}
              aria-label="Ingredient list"
              className="resize-none rounded-2xl border border-border bg-background/80 p-4 text-sm leading-relaxed shadow-soft outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <div className="rounded-2xl border border-border bg-background/60 p-5">
              {!result ? (
                <div className="grid h-full place-items-center text-center text-sm text-muted-foreground">
                  <div>
                    <ScanLine className="mx-auto mb-2 h-6 w-6 opacity-60" />
                    Verdict appears here as you type.
                  </div>
                </div>
              ) : (
                <motion.div
                  key={result.status + result.matches.length}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <StatusPill status={result.status} count={result.matches.length} />
                  <div className="mt-4 space-y-2">
                    {result.matches.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No active triggers from your profile matched. Looks clean.
                      </p>
                    ) : (
                      result.matches.map((m) => (
                        <div
                          key={m.allergenId + m.matchedTerm}
                          className="flex items-center justify-between rounded-xl border border-border/60 bg-card/60 px-3 py-2 text-sm"
                        >
                          <span className="font-medium">{m.label}</span>
                          <code className="text-xs text-muted-foreground">
                            “{m.matchedTerm}”
                          </code>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground">
                    Confidence: {Math.round(result.confidence * 100)}%
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusPill({ status, count }: { status: "safe" | "alert" | "hazard"; count: number }) {
  const map = {
    safe: { label: "Safe", cls: "bg-safe text-safe-foreground" },
    alert: { label: `${count} allergen${count > 1 ? "s" : ""} flagged`, cls: "bg-coral text-powder" },
    hazard: { label: "Hazard — do not consume", cls: "bg-hazard text-hazard-foreground" },
  } as const;
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}
