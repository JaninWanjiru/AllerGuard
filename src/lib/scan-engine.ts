/**
 * Scan engine — normalizes label text, matches against the user's allergen
 * profile, derives a status, and simulates a compliance webhook dispatch.
 */

import { ALLERGENS, ALLERGEN_BY_ID, type Allergen } from "./allergens";

export type ScanStatus = "safe" | "alert" | "hazard";

export interface MatchHit {
  allergenId: string;
  label: string;
  matchedTerm: string;
  hazard: boolean;
  severity: Allergen["severity"];
}

export interface ScanResult {
  id: string;
  createdAt: number;
  source: "demo" | "camera" | "upload" | "manual";
  productName?: string;
  rawText: string;
  matches: MatchHit[];
  status: ScanStatus;
  confidence: number; // 0..1
}

export interface WebhookEvent {
  id: string;
  scanId: string;
  createdAt: number;
  type: "scan.completed" | "scan.hazard" | "scan.alert" | "scan.safe";
  status: ScanStatus;
  payload: Record<string, unknown>;
}

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[^a-z0-9\s'/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchAllergens(
  rawText: string,
  activeIds: string[],
  customTerms: string[] = [],
): MatchHit[] {
  const text = " " + normalize(rawText) + " ";
  const hits: MatchHit[] = [];
  const seen = new Set<string>();

  const active = ALLERGENS.filter((a) => activeIds.includes(a.id));

  for (const allergen of active) {
    for (const syn of allergen.synonyms) {
      const needle = normalize(syn);
      if (!needle) continue;
      // word-boundary-ish: surround by space or punctuation
      if (text.includes(" " + needle + " ") || text.includes(" " + needle) || text.includes(needle + " ")) {
        const key = allergen.id + ":" + needle;
        if (seen.has(key)) continue;
        seen.add(key);
        hits.push({
          allergenId: allergen.id,
          label: allergen.label,
          matchedTerm: syn,
          hazard: !!allergen.hazard,
          severity: allergen.severity,
        });
      }
    }
  }

  for (const raw of customTerms) {
    const needle = normalize(raw);
    if (!needle) continue;
    if (text.includes(needle)) {
      const key = "custom:" + needle;
      if (seen.has(key)) continue;
      seen.add(key);
      hits.push({
        allergenId: "custom:" + needle,
        label: `Custom: ${raw}`,
        matchedTerm: raw,
        hazard: false,
        severity: "medium",
      });
    }
  }

  return hits;
}

export function deriveStatus(hits: MatchHit[]): ScanStatus {
  if (hits.some((h) => h.hazard)) return "hazard";
  if (hits.length > 0) return "alert";
  return "safe";
}

export function confidenceScore(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  const len = Math.min(t.length, 600);
  const wordCount = t.split(/\s+/).length;
  const punct = (t.match(/[,.;:()]/g) || []).length;
  // Longer, structured text → higher confidence
  const base = 0.45 + (len / 600) * 0.35 + Math.min(wordCount / 80, 1) * 0.1 + Math.min(punct / 20, 1) * 0.1;
  return Math.max(0.4, Math.min(0.99, base));
}

export interface RunScanInput {
  rawText: string;
  source: ScanResult["source"];
  productName?: string;
  activeIds: string[];
  customTerms: string[];
}

export function runScan(input: RunScanInput): ScanResult {
  const matches = matchAllergens(input.rawText, input.activeIds, input.customTerms);
  const status = deriveStatus(matches);
  return {
    id: cryptoId(),
    createdAt: Date.now(),
    source: input.source,
    productName: input.productName,
    rawText: input.rawText,
    matches,
    status,
    confidence: confidenceScore(input.rawText),
  };
}

export function buildWebhookEvent(scan: ScanResult): WebhookEvent {
  const type: WebhookEvent["type"] =
    scan.status === "hazard"
      ? "scan.hazard"
      : scan.status === "alert"
      ? "scan.alert"
      : "scan.safe";

  return {
    id: cryptoId(),
    scanId: scan.id,
    createdAt: Date.now(),
    type,
    status: scan.status,
    payload: {
      product: scan.productName ?? "Unknown product",
      source: scan.source,
      confidence: Number(scan.confidence.toFixed(2)),
      matches: scan.matches.map((m) => ({
        allergen: m.allergenId,
        term: m.matchedTerm,
        severity: m.severity,
        hazard: m.hazard,
      })),
    },
  };
}

/**
 * Simulated n8n webhook dispatch — logs to console for audit visibility.
 * In production this would POST to an n8n endpoint with signing.
 */
export async function dispatchWebhook(event: WebhookEvent): Promise<void> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 220));
  // eslint-disable-next-line no-console
  console.info("[AllerGuard › n8n dispatch]", event);
}

function cryptoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export { ALLERGEN_BY_ID };
