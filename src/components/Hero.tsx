import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ScanLine, ShieldCheck, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-aurora pb-20 pt-32 lg:pt-40">
      {/* aurora layers */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-teal/40 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-40 h-[360px] w-[360px] rounded-full bg-coral/30 blur-3xl"
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-1.5 text-xs font-medium backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5 text-coral" />
          Your pocket food safety companion
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          Know what's on the{" "}
          <span className="bg-gradient-to-br from-coral via-coral to-ink bg-clip-text text-transparent">
            label
          </span>
          <br />
          before it's on your plate.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground"
        >
          AllerGuard scans ingredient labels against your personal allergen
          profile and flags regional hazards like aflatoxin, mould, and
          improperly dried maize — instantly, on-device.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/scan"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-powder shadow-steel transition-transform hover:scale-[1.03]"
          >
            <ScanLine className="h-4 w-4" />
            Start scanning
          </Link>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-6 py-3.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-accent/30"
          >
            <ShieldCheck className="h-4 w-4 text-steel" />
            Build your profile
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-4 text-left"
        >
          {[
            { k: "12+", v: "Allergens tracked" },
            { k: "50+", v: "Synonyms per group" },
            { k: "0", v: "Data leaves device" },
          ].map((s) => (
            <div
              key={s.v}
              className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur"
            >
              <div className="text-2xl font-semibold text-foreground">{s.k}</div>
              <div className="text-xs text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
