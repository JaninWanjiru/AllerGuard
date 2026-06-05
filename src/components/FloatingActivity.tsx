import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, X, ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";
import { useAppStore } from "@/store/app-store";

const STATUS_ICON = {
  hazard: ShieldAlert,
  alert: AlertTriangle,
  safe: ShieldCheck,
} as const;

const STATUS_COLOR = {
  hazard: "text-hazard",
  alert: "text-coral",
  safe: "text-safe",
} as const;

export function FloatingActivity() {
  const [open, setOpen] = useState(false);
  const log = useAppStore((s) => s.complianceLog);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open compliance activity (${log.length})`}
        className="fixed bottom-20 right-4 z-30 flex items-center gap-2 rounded-full bg-gradient-brand px-4 py-2.5 text-sm font-medium text-powder shadow-steel transition-transform hover:scale-105 lg:bottom-6 lg:right-6"
      >
        <Activity className="h-4 w-4" />
        <span>Activity</span>
        <span className="ml-1 rounded-full bg-powder/20 px-2 py-0.5 text-[10px] font-semibold">
          {log.length}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 36 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-card shadow-soft"
              role="dialog"
              aria-label="Compliance activity"
            >
              <header className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold">Compliance log</h2>
                  <p className="text-xs text-muted-foreground">
                    Live n8n dispatch events from every scan
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close activity"
                  className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent/40"
                >
                  <X className="h-4 w-4" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {log.length === 0 ? (
                  <div className="grid h-full place-items-center text-center text-sm text-muted-foreground">
                    <div>
                      <Activity className="mx-auto mb-2 h-6 w-6 opacity-60" />
                      No dispatched events yet.
                      <br />
                      Run a scan to populate the log.
                    </div>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {log.map((e) => {
                      const Icon = STATUS_ICON[e.status];
                      const color = STATUS_COLOR[e.status];
                      return (
                        <li
                          key={e.id}
                          className="rounded-xl border border-border/70 bg-background/60 p-3"
                        >
                          <div className="flex items-start gap-3">
                            <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <code className="truncate text-xs font-semibold">
                                  {e.type}
                                </code>
                                <time className="shrink-0 text-[10px] text-muted-foreground">
                                  {new Date(e.createdAt).toLocaleTimeString()}
                                </time>
                              </div>
                              <pre className="mt-2 max-h-32 overflow-auto rounded-md bg-muted/60 p-2 text-[11px] leading-relaxed">
                                {JSON.stringify(e.payload, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
