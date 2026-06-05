import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, ShieldAlert, AlertTriangle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAppStore } from "@/store/app-store";
import type { ScanStatus } from "@/lib/scan-engine";

const STATUS_FILTERS: { id: "all" | ScanStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "safe", label: "Safe" },
  { id: "alert", label: "Alerts" },
  { id: "hazard", label: "Hazards" },
];

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Scan history · AllerGuard" },
      { name: "description", content: "Your past scans with filters, search, and dispatch trails." },
      { property: "og:title", content: "Scan history · AllerGuard" },
      { property: "og:description", content: "Searchable scan history." },
      { property: "og:url", content: "/history" },
    ],
    links: [{ rel: "canonical", href: "/history" }],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  return (
    <ProtectedRoute from="/history">
      <HistoryInner />
    </ProtectedRoute>
  );
}

function HistoryInner() {
  const history = useAppStore((s) => s.scanHistory);
  const clear = useAppStore((s) => s.clearHistory);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]["id"]>("all");

  const filtered = useMemo(() => {
    return history.filter((h) => {
      if (filter !== "all" && h.status !== filter) return false;
      if (q) {
        const needle = q.toLowerCase();
        const hay = (
          (h.productName ?? "") +
          " " +
          h.rawText +
          " " +
          h.matches.map((m) => m.label).join(" ")
        ).toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [history, filter, q]);

  return (
    <div className="mx-auto max-w-5xl px-4 pt-10 lg:px-6 lg:pt-28">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <span className="text-xs font-semibold uppercase tracking-wider text-steel">History</span>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          Every scan, kept.
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Filter by status, search by ingredient or product, and never re-scan
          the same label twice.
        </p>
      </motion.div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products or ingredients…"
            aria-label="Search history"
            className="w-full rounded-full border border-border bg-card pl-10 pr-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-card p-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f.id ? "bg-gradient-brand text-powder shadow-steel" : "text-muted-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            if (!history.length) return;
            clear();
            toast.success("History cleared");
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center text-sm text-muted-foreground">
            {history.length === 0
              ? "No scans yet. Head to the scanner to start."
              : "No scans match your filters."}
          </div>
        )}
        {filtered.map((h) => {
          const Icon =
            h.status === "hazard" ? ShieldAlert : h.status === "alert" ? AlertTriangle : ShieldCheck;
          const tone =
            h.status === "hazard"
              ? "text-hazard bg-hazard/15"
              : h.status === "alert"
                ? "text-coral bg-coral/15"
                : "text-safe bg-safe/15";
          return (
            <motion.article
              key={h.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 rounded-2xl border border-border bg-card/70 p-4"
            >
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="truncate font-semibold">
                    {h.productName ?? "Untitled scan"}
                  </h3>
                  <time className="shrink-0 text-xs text-muted-foreground">
                    {new Date(h.createdAt).toLocaleString()}
                  </time>
                </div>
                <p className="text-xs text-muted-foreground">
                  {h.source.toUpperCase()} · {Math.round(h.confidence * 100)}% confidence
                </p>
                {h.matches.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {h.matches.map((m) => (
                      <span
                        key={m.allergenId + m.matchedTerm}
                        className="rounded-full bg-background/80 px-2 py-0.5 text-[11px] font-medium"
                      >
                        {m.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
