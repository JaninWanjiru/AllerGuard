import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, ShieldCheck, AlertTriangle, ShieldAlert, Check } from "lucide-react";
import { toast } from "sonner";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ALLERGENS, getAllergensByCategory } from "@/lib/allergens";
import { useAppStore } from "@/store/app-store";
import { useAuthStore } from "@/store/auth-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile · AllerGuard" },
      {
        name: "description",
        content:
          "Customize the allergens and contaminants AllerGuard watches for on every scan.",
      },
      { property: "og:title", content: "Your profile · AllerGuard" },
      { property: "og:description", content: "Personal allergen profile management." },
      { property: "og:url", content: "/profile" },
    ],
    links: [{ rel: "canonical", href: "/profile" }],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <ProtectedRoute from="/profile">
      <ProfileInner />
    </ProtectedRoute>
  );
}

function ProfileInner() {
  const user = useAuthStore((s) => s.user);
  const activeIds = useAppStore((s) => s.activeAllergenIds);
  const toggleAllergen = useAppStore((s) => s.toggleAllergen);
  const customTerms = useAppStore((s) => s.customTerms);
  const addCustomTerm = useAppStore((s) => s.addCustomTerm);
  const removeCustomTerm = useAppStore((s) => s.removeCustomTerm);

  const [term, setTerm] = useState("");

  function handleAdd() {
    const t = term.trim();
    if (!t) return;
    if (customTerms.includes(t)) {
      toast.info("Already in your profile");
      return;
    }
    addCustomTerm(t);
    setTerm("");
    toast.success(`Added "${t}" to custom triggers`);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pt-10 lg:px-6 lg:pt-28">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <span className="text-xs font-semibold uppercase tracking-wider text-steel">
          Profile
        </span>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          Hello, {user?.name}.
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Choose what AllerGuard watches for on every scan. Toggle global
          allergens, regional contaminants, or add your own custom triggers.
        </p>
      </motion.div>

      <Section
        title="Global allergens"
        body="The big-9 plus sesame — match against thousands of ingredient synonyms."
        items={getAllergensByCategory("global")}
        activeIds={activeIds}
        onToggle={toggleAllergen}
      />

      <Section
        title="Contaminants & toxins"
        body="Regional hazards including aflatoxin, mould, sulphites and cassava cyanogens. Detections fire Secure Dispatch."
        items={getAllergensByCategory("contaminant")}
        activeIds={activeIds}
        onToggle={toggleAllergen}
        hazardTinted
      />

      <section className="mt-12">
        <h2 className="text-lg font-semibold">Custom triggers</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add ingredients specific to your sensitivities (e.g. "monosodium glutamate", "carrageenan").
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {customTerms.length === 0 && (
            <span className="text-xs text-muted-foreground">No custom triggers yet.</span>
          )}
          {customTerms.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 rounded-full bg-coral/15 px-3 py-1 text-sm text-coral"
            >
              {t}
              <button
                type="button"
                onClick={() => removeCustomTerm(t)}
                aria-label={`Remove ${t}`}
                className="grid h-4 w-4 place-items-center rounded-full hover:bg-coral/30"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="e.g. carrageenan"
            aria-label="New custom trigger"
            className="flex-1 rounded-full border border-border bg-card px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-powder shadow-steel"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </section>

      <div className="mt-10 rounded-2xl border border-border/70 bg-card/60 p-5 text-sm text-muted-foreground">
        <p>
          <span className="font-semibold text-foreground">
            {activeIds.length} / {ALLERGENS.length}
          </span>{" "}
          built-in triggers active · <span className="font-semibold text-foreground">{customTerms.length}</span> custom.
        </p>
      </div>
    </div>
  );
}

function Section({
  title,
  body,
  items,
  activeIds,
  onToggle,
  hazardTinted,
}: {
  title: string;
  body: string;
  items: typeof ALLERGENS;
  activeIds: string[];
  onToggle: (id: string) => void;
  hazardTinted?: boolean;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => {
          const active = activeIds.includes(a.id);
          const Icon = a.hazard ? ShieldAlert : a.severity === "critical" ? AlertTriangle : ShieldCheck;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => onToggle(a.id)}
              className={`text-left rounded-2xl border p-4 transition-all ${
                active
                  ? hazardTinted
                    ? "border-hazard/50 bg-hazard/10 shadow-soft"
                    : "border-steel/50 bg-steel/10 shadow-soft"
                  : "border-border bg-card/60 hover:border-foreground/20"
              }`}
              aria-pressed={active}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl">{a.emoji}</div>
                  <div className="mt-2 font-semibold">{a.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.synonyms.length} synonyms
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-5 w-5 ${
                      active ? (a.hazard ? "text-hazard" : "text-steel") : "text-muted-foreground"
                    }`}
                  />
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded transition-all ${
                      active ? "bg-gradient-brand shadow-steel border-none" : "border border-border bg-card/60"
                    }`}
                    aria-hidden="true"
                  >
                    {active && <Check className="h-3.5 w-3.5 text-powder" />}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {a.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
