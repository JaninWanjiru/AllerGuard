import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, Send, ShieldCheck, ShieldAlert } from "lucide-react";

const STEPS = [
  { label: "Encrypting payload", Icon: Lock },
  { label: "Transmitting to compliance node", Icon: Send },
  { label: "Acknowledged · audit chain updated", Icon: ShieldCheck },
] as const;

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SecureDispatch({ open, onClose }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) {
      setStep(0);
      return;
    }
    setStep(0);
    const timers = [
      setTimeout(() => setStep(1), 900),
      setTimeout(() => setStep(2), 1900),
      setTimeout(() => setStep(3), 2900),
    ];
    return () => timers.forEach(clearTimeout);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-4 backdrop-blur"
        >
          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-full max-w-md rounded-3xl bg-card p-6 shadow-coral"
            role="dialog"
            aria-label="Secure compliance dispatch"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-hazard text-hazard-foreground">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Secure Dispatch</h3>
                <p className="text-xs text-muted-foreground">
                  Hazard detected · encrypted compliance event in flight
                </p>
              </div>
            </div>

            <ol className="mt-6 space-y-3">
              {STEPS.map((s, i) => {
                const Done = step > i;
                const Active = step === i;
                const Icon = s.Icon;
                return (
                  <li
                    key={s.label}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                      Done
                        ? "border-safe/40 bg-safe/10"
                        : Active
                          ? "border-coral/50 bg-coral/10"
                          : "border-border bg-background/50 opacity-60"
                    }`}
                  >
                    <motion.span
                      animate={Active ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                      transition={{ duration: 1, repeat: Active ? Infinity : 0 }}
                      className={`grid h-9 w-9 place-items-center rounded-lg ${
                        Done
                          ? "bg-safe text-safe-foreground"
                          : Active
                            ? "bg-coral text-powder"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </motion.span>
                    <span className="text-sm font-medium">{s.label}</span>
                  </li>
                );
              })}
            </ol>

            <button
              type="button"
              onClick={onClose}
              disabled={step < 3}
              className="mt-6 w-full rounded-full bg-gradient-brand py-3 text-sm font-semibold text-powder shadow-steel disabled:opacity-40"
            >
              {step < 3 ? "Dispatching…" : "Acknowledge"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
