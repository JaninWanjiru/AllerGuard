/**
 * Four realistic demo product labels used in the scanner.
 */

export interface DemoLabel {
  id: string;
  product: string;
  origin: string;
  tagline: string;
  emoji: string;
  text: string;
  expected: "alert" | "safe" | "hazard";
  expectedNote: string;
}

export const DEMO_LABELS: DemoLabel[] = [
  {
    id: "highland-crackers",
    product: "Highland Crackers",
    origin: "Nakuru, Kenya",
    tagline: "Gluten trigger",
    emoji: "🍪",
    expected: "alert",
    expectedNote: "Contains wheat & barley malt",
    text: `INGREDIENTS: Wheat flour, vegetable oil (palm), barley malt
extract, sugar, sea salt, yeast, raising agent (sodium bicarbonate).
Contains: Wheat, Gluten. May contain traces of sesame seeds.
Best before: see base. Store in a cool, dry place.`,
  },
  {
    id: "savanna-energy-bar",
    product: "Savanna Energy Bar",
    origin: "Kampala, Uganda",
    tagline: "Multi-allergen",
    emoji: "🍫",
    expected: "alert",
    expectedNote: "Groundnuts + soy lecithin",
    text: `INGREDIENTS: Roasted groundnuts (32%), honey, oats, dried
mango, rice crisps, cocoa solids, soy lecithin (emulsifier), natural
vanilla flavour. Allergen advice: contains peanuts (groundnuts) and
soya. Produced in a facility that also handles tree nuts.`,
  },
  {
    id: "mountain-honey",
    product: "Pure Mountain Honey",
    origin: "Mt. Elgon, Kenya",
    tagline: "Clean & safe",
    emoji: "🍯",
    expected: "safe",
    expectedNote: "Single-ingredient natural honey",
    text: `INGREDIENTS: 100% pure raw mountain honey. No additives,
no preservatives, no added sugar. Naturally harvested from highland
wildflowers. May crystallize over time — warm gently to restore.`,
  },
  {
    id: "sundried-maize",
    product: "Sun-dried Maize Meal",
    origin: "Rural mill — informal",
    tagline: "Regional hazard",
    emoji: "🌽",
    expected: "hazard",
    expectedNote: "Mould visible · aflatoxin risk",
    text: `INGREDIENTS: Whole maize meal. WARNING — sample shows
visible mould patches and a musty odour. Stored under damp,
high-humidity conditions; improperly dried maize is associated with
aspergillus growth and aflatoxin contamination. Do not consume.`,
  },
];

export const DEMO_BY_ID = Object.fromEntries(DEMO_LABELS.map((d) => [d.id, d]));
