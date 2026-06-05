import { motion } from "framer-motion";
import { DEMO_LABELS, type DemoLabel } from "@/lib/demo-labels";

interface Props {
  onPick: (label: DemoLabel) => void;
}

const TONE = {
  alert: "from-coral/15 to-transparent border-coral/40",
  safe: "from-safe/15 to-transparent border-safe/40",
  hazard: "from-hazard/20 to-transparent border-hazard/50",
} as const;

export function DemoLabelGrid({ onPick }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {DEMO_LABELS.map((d, i) => (
        <motion.button
          key={d.id}
          type="button"
          onClick={() => onPick(d)}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ y: -2 }}
          className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-b ${TONE[d.expected]} p-4 text-left transition-shadow hover:shadow-soft`}
        >
          <div className="text-3xl">{d.emoji}</div>
          <div className="mt-3 text-sm font-semibold">{d.product}</div>
          <div className="text-xs text-muted-foreground">{d.origin}</div>
          <div className="mt-3 inline-flex rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            {d.tagline}
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground">
            {d.expectedNote}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
