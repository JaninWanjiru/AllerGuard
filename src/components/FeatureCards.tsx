import { ShieldCheck, Radar, Send, FileSearch } from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: Radar,
    title: "Instant allergen radar",
    body: "Real-time matching against 12+ allergens and 600+ synonyms — including East African staples like njugu, simsim and atta.",
  },
  {
    icon: ShieldCheck,
    title: "Regional hazard detection",
    body: "Spot mould, aflatoxin, damp-stored maize and cassava cyanogens that generic scanners miss entirely.",
  },
  {
    icon: Send,
    title: "Secure compliance dispatch",
    body: "Every hazardous detection fires an encrypted webhook to your audit chain for traceability and insurance claims.",
  },
  {
    icon: FileSearch,
    title: "Searchable history",
    body: "Full, filterable record of every scan with severity, matches, and confidence — never re-scan the same product twice.",
  },
];

export function FeatureCards() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Calm, technical, uncompromising.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Built on the assumption that food safety isn't a feature — it's the
          entire job.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group rounded-3xl border border-border/70 bg-card/60 p-7 backdrop-blur transition-all hover:border-steel/40 hover:shadow-soft"
            >
              <div className="mb-5 inline-grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand text-powder shadow-steel">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
