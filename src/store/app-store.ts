/**
 * Global app state — allergen profile, scan history, compliance log, theme.
 * Persisted to localStorage via Zustand persist middleware.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ScanResult, WebhookEvent } from "@/lib/scan-engine";
import { ALLERGENS } from "@/lib/allergens";

export type ThemeMode = "light" | "dark";

interface AppState {
  theme: ThemeMode;
  activeAllergenIds: string[];
  customTerms: string[];
  scanHistory: ScanResult[];
  complianceLog: WebhookEvent[];

  setTheme: (t: ThemeMode) => void;
  toggleTheme: () => void;
  toggleAllergen: (id: string) => void;
  setActiveAllergens: (ids: string[]) => void;
  addCustomTerm: (term: string) => void;
  removeCustomTerm: (term: string) => void;
  pushScan: (s: ScanResult) => void;
  pushCompliance: (e: WebhookEvent) => void;
  clearHistory: () => void;
}

// Sensible defaults: most common global allergens + the hazard contaminants
const DEFAULT_ACTIVE = ALLERGENS.filter(
  (a) => a.category === "global" || a.hazard,
).map((a) => a.id);

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "light",
      activeAllergenIds: DEFAULT_ACTIVE,
      customTerms: [],
      scanHistory: [],
      complianceLog: [],

      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),

      toggleAllergen: (id) =>
        set((s) => ({
          activeAllergenIds: s.activeAllergenIds.includes(id)
            ? s.activeAllergenIds.filter((x) => x !== id)
            : [...s.activeAllergenIds, id],
        })),

      setActiveAllergens: (ids) => set({ activeAllergenIds: ids }),

      addCustomTerm: (term) =>
        set((s) => {
          const t = term.trim();
          if (!t || s.customTerms.includes(t)) return s;
          return { customTerms: [...s.customTerms, t] };
        }),

      removeCustomTerm: (term) =>
        set((s) => ({ customTerms: s.customTerms.filter((x) => x !== term) })),

      pushScan: (scan) =>
        set((s) => ({ scanHistory: [scan, ...s.scanHistory].slice(0, 100) })),

      pushCompliance: (e) =>
        set((s) => ({ complianceLog: [e, ...s.complianceLog].slice(0, 40) })),

      clearHistory: () => set({ scanHistory: [], complianceLog: [] }),
    }),
    {
      name: "allerguard-store",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : (undefined as never),
      ),
      // Theme is applied via a sync effect; everything else is just persisted
    },
  ),
);
