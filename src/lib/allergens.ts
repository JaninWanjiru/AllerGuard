/**
 * AllerGuard allergen & contaminant dictionary.
 * Each entry carries a rich synonym list for substring matching.
 * `hazard: true` triggers the SecureDispatch compliance flow.
 */

export type AllergenCategory = "global" | "contaminant";
export type Severity = "low" | "medium" | "high" | "critical";

export interface Allergen {
  id: string;
  label: string;
  emoji: string;
  category: AllergenCategory;
  synonyms: string[];
  hazard?: boolean;
  severity: Severity;
  description: string;
}

export const ALLERGENS: Allergen[] = [
  // ─── GLOBAL CORE ──────────────────────────────────────────────────
  {
    id: "dairy",
    label: "Dairy",
    emoji: "🥛",
    category: "global",
    severity: "high",
    description: "Milk and lactose-derived ingredients.",
    synonyms: [
      "milk", "whole milk", "skim milk", "skimmed milk", "milk solids",
      "milk powder", "dry milk", "buttermilk", "butter", "ghee",
      "cheese", "cheddar", "mozzarella", "parmesan", "ricotta",
      "yogurt", "yoghurt", "cream", "sour cream", "heavy cream",
      "whey", "whey protein", "whey powder", "casein", "caseinate",
      "sodium caseinate", "calcium caseinate", "lactose", "lactalbumin",
      "lactoglobulin", "lactoferrin", "curds", "ice cream",
      "condensed milk", "evaporated milk", "milkfat", "milk fat",
      "anhydrous milkfat", "amf", "kefir", "labneh", "paneer",
      "quark", "mascarpone", "creme fraiche", "half and half",
      "milk protein", "non-fat milk", "nonfat milk", "skimmed milk powder",
    ],
  },
  {
    id: "gluten",
    label: "Gluten",
    emoji: "🌾",
    category: "global",
    severity: "high",
    description: "Wheat, barley, rye, malt and derivatives.",
    synonyms: [
      "wheat", "wheat flour", "whole wheat", "wholewheat", "wheat starch",
      "wheat bran", "wheat germ", "durum", "durum wheat", "semolina",
      "spelt", "kamut", "einkorn", "emmer", "farro", "triticale",
      "barley", "barley malt", "barley extract", "pearl barley",
      "rye", "rye flour", "malt", "malted barley", "malt extract",
      "malt syrup", "malt flavoring", "malt vinegar", "brewers yeast",
      "couscous", "bulgur", "bulghur", "seitan", "vital wheat gluten",
      "gluten", "hydrolyzed wheat protein", "wheat protein",
      "bread", "breadcrumbs", "panko", "cracker", "biscuit",
      "atta", "maida", "graham flour", "farina", "matzo", "matzah",
    ],
  },
  {
    id: "peanuts",
    label: "Peanuts / Groundnuts",
    emoji: "🥜",
    category: "global",
    severity: "critical",
    description: "Peanuts and groundnut derivatives — common in East Africa.",
    synonyms: [
      "peanut", "peanuts", "peanut butter", "peanut oil", "peanut flour",
      "peanut protein", "peanut paste", "arachis", "arachis oil",
      "arachis hypogaea", "groundnut", "groundnuts", "groundnut oil",
      "groundnut paste", "groundnut flour", "njugu", "monkey nuts",
      "goober", "goobers", "goober peas", "mandelona",
      "beer nuts", "mixed nuts (may contain peanuts)",
    ],
  },
  {
    id: "soy",
    label: "Soy",
    emoji: "🫘",
    category: "global",
    severity: "high",
    description: "Soybean and all derivatives.",
    synonyms: [
      "soy", "soya", "soybean", "soybeans", "soy bean", "soya bean",
      "soy protein", "soya protein", "soy flour", "soy milk",
      "soya milk", "soy sauce", "shoyu", "tamari", "miso",
      "tempeh", "tofu", "edamame", "natto", "soy lecithin",
      "lecithin (soy)", "soya lecithin", "hydrolyzed soy protein",
      "textured soy protein", "tsp", "tvp", "textured vegetable protein",
      "soy isolate", "soy concentrate", "soybean oil", "soya oil",
    ],
  },
  {
    id: "tree-nuts",
    label: "Tree Nuts",
    emoji: "🌰",
    category: "global",
    severity: "critical",
    description: "Almonds, cashews, walnuts and other tree nuts.",
    synonyms: [
      "almond", "almonds", "almond flour", "almond milk", "marzipan",
      "cashew", "cashews", "cashew butter", "cashew nut",
      "walnut", "walnuts", "walnut oil",
      "pecan", "pecans", "hazelnut", "hazelnuts", "filbert", "filberts",
      "pistachio", "pistachios", "brazil nut", "brazil nuts",
      "macadamia", "macadamia nut", "pine nut", "pine nuts", "pignoli",
      "chestnut", "chestnuts", "nut butter", "nut paste",
      "praline", "nougat", "gianduja",
    ],
  },
  {
    id: "eggs",
    label: "Eggs",
    emoji: "🥚",
    category: "global",
    severity: "high",
    description: "Egg whites, yolks and derivatives.",
    synonyms: [
      "egg", "eggs", "egg white", "egg whites", "egg yolk", "egg yolks",
      "albumen", "albumin", "ovalbumin", "ovomucoid", "ovovitellin",
      "globulin", "livetin", "lysozyme", "meringue", "mayonnaise",
      "dried egg", "egg powder", "whole egg", "egg solids", "egg protein",
    ],
  },
  {
    id: "fish",
    label: "Fish",
    emoji: "🐟",
    category: "global",
    severity: "high",
    description: "Finfish and fish-derived ingredients.",
    synonyms: [
      "fish", "anchovy", "anchovies", "bass", "cod", "flounder",
      "haddock", "halibut", "herring", "mackerel", "perch", "pike",
      "salmon", "sardine", "sardines", "snapper", "sole", "swordfish",
      "tilapia", "trout", "tuna", "fish sauce", "fish oil",
      "fish gelatin", "isinglass", "surimi", "worcestershire",
      "caviar", "roe", "omena", "dagaa", "kapenta",
    ],
  },
  {
    id: "shellfish",
    label: "Shellfish",
    emoji: "🦐",
    category: "global",
    severity: "critical",
    description: "Crustaceans and molluscs.",
    synonyms: [
      "shellfish", "shrimp", "shrimps", "prawn", "prawns", "crab",
      "lobster", "crayfish", "crawfish", "krill", "langoustine",
      "clam", "clams", "mussel", "mussels", "oyster", "oysters",
      "scallop", "scallops", "octopus", "squid", "calamari", "abalone",
      "cuttlefish", "snail", "escargot", "shellfish extract",
    ],
  },
  {
    id: "sesame",
    label: "Sesame",
    emoji: "🌱",
    category: "global",
    severity: "high",
    description: "Sesame seeds and oils.",
    synonyms: [
      "sesame", "sesame seed", "sesame seeds", "sesame oil", "sesame paste",
      "tahini", "tahina", "benne", "benne seed", "gingelly", "til",
      "simsim", "halvah", "halva", "sesamol", "sesamum indicum",
    ],
  },

  // ─── CONTAMINANTS & TOXINS (regional focus) ───────────────────────
  {
    id: "aflatoxin",
    label: "Aflatoxin",
    emoji: "☣️",
    category: "contaminant",
    hazard: true,
    severity: "critical",
    description:
      "Toxin produced by Aspergillus moulds on poorly stored maize, groundnuts and cassava. Carcinogenic.",
    synonyms: [
      "aflatoxin", "aflatoxins", "aspergillus", "aspergillus flavus",
      "aspergillus parasiticus", "aflatoxin b1", "aflatoxin b2",
      "aflatoxin g1", "aflatoxin g2", "afla", "mycotoxin", "mycotoxins",
      "fumonisin", "fumonisins", "ochratoxin",
    ],
  },
  {
    id: "mould",
    label: "Mould / Mold",
    emoji: "🦠",
    category: "contaminant",
    hazard: true,
    severity: "critical",
    description: "Visible mould growth or fungal contamination indicators.",
    synonyms: [
      "mould", "moldy", "mouldy", "mold", "visible mould",
      "fungal growth", "fungus", "fungi", "spoiled", "rancid",
      "rotten", "decayed", "fermented (uncontrolled)", "bitter smell",
      "musty", "must", "musty odour", "off smell", "stale",
    ],
  },
  {
    id: "sulphites",
    label: "Sulphites",
    emoji: "🧪",
    category: "contaminant",
    severity: "medium",
    description: "Sulphite preservatives — asthma trigger.",
    synonyms: [
      "sulphite", "sulphites", "sulfite", "sulfites",
      "sulfur dioxide", "sulphur dioxide", "so2", "e220", "e221",
      "e222", "e223", "e224", "e225", "e226", "e227", "e228",
      "sodium sulfite", "sodium bisulfite", "sodium metabisulfite",
      "potassium metabisulfite", "potassium bisulfite",
    ],
  },
  {
    id: "damp-maize",
    label: "High-humidity Maize",
    emoji: "🌽",
    category: "contaminant",
    hazard: true,
    severity: "high",
    description: "Maize stored above safe moisture (>13.5%) — aflatoxin risk.",
    synonyms: [
      "damp maize", "wet maize", "high moisture maize", "humid maize",
      "improperly dried maize", "poorly dried maize", "maize (damp)",
      "moisture damaged maize", "wet corn", "damp corn",
      "uncured maize", "green maize meal", "humid storage",
    ],
  },
  {
    id: "cassava-toxin",
    label: "Cassava Cyanogens",
    emoji: "🌿",
    category: "contaminant",
    hazard: true,
    severity: "critical",
    description: "Improperly processed cassava can release toxic hydrogen cyanide.",
    synonyms: [
      "bitter cassava", "raw cassava", "unprocessed cassava",
      "cyanogenic glycoside", "cyanogenic glycosides", "linamarin",
      "lotaustralin", "hydrogen cyanide", "hcn",
      "improperly fermented cassava", "untreated cassava flour",
    ],
  },
  {
    id: "millet-dust",
    label: "Millet Dust",
    emoji: "🌾",
    category: "contaminant",
    severity: "medium",
    description: "Fine millet dust — respiratory irritant for sensitive users.",
    synonyms: [
      "millet dust", "millet flour dust", "finger millet dust",
      "pearl millet dust", "wimbi dust", "uji dust",
      "grain dust", "flour dust",
    ],
  },
];

export const ALLERGEN_BY_ID = Object.fromEntries(
  ALLERGENS.map((a) => [a.id, a]),
) as Record<string, Allergen>;

export function getAllergensByCategory(category: AllergenCategory) {
  return ALLERGENS.filter((a) => a.category === category);
}
