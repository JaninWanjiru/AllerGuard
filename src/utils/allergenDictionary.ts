export type AllergenCategory = 
  | 'Peanuts'
  | 'Dairy'
  | 'Gluten'
  | 'Soy'
  | 'Tree Nuts'
  | 'Eggs'
  | 'Fish'
  | 'Shellfish'
  | 'Sesame'
  | 'Custom';

export const ALLERGEN_DICTIONARY: Record<AllergenCategory, string[]> = {
  'Peanuts': ['peanut', 'peanuts', 'arachis', 'groundnuts', 'mandelonas'],
  'Dairy': ['dairy', 'milk', 'whey', 'casein', 'lactose', 'curds', 'butter', 'cheese', 'cream', 'ghee', 'yogurt'],
  'Gluten': ['gluten', 'wheat', 'barley', 'rye', 'malt', 'malt extract', 'brewer\'s yeast', 'triticale', 'spelt', 'kamut', 'farro', 'durum', 'bulgur'],
  'Soy': ['soy', 'soybean', 'soya', 'edamame', 'miso', 'natto', 'shoyu', 'soy lecithin', 'tamari', 'tempeh', 'tofu'],
  'Tree Nuts': ['almond', 'almonds', 'brazil nut', 'cashew', 'chestnut', 'hazelnut', 'macadamia', 'pecan', 'pine nut', 'pistachio', 'walnut'],
  'Eggs': ['egg', 'eggs', 'albumen', 'globulin', 'livetin', 'lysozyme', 'mayonnaise', 'meringue', 'ovalbumin', 'surimi'],
  'Fish': ['fish', 'anchovies', 'bass', 'catfish', 'cod', 'flounder', 'grouper', 'haddock', 'hake', 'halibut', 'herring', 'mahi mahi', 'perch', 'pike', 'pollock', 'salmon', 'scrod', 'swordfish', 'sole', 'snapper', 'tilapia', 'trout', 'tuna'],
  'Shellfish': ['shellfish', 'crab', 'crawfish', 'lobster', 'shrimp', 'prawns', 'barnacle', 'krill', 'mollusk', 'clam', 'oyster', 'scallop', 'squid', 'octopus', 'mussel'],
  'Sesame': ['sesame', 'tahini', 'benne', 'benniseed', 'gingelly', 'sesamol', 'sesamum', 'sim sim'],
  'Custom': [] // This acts as a placeholder; custom allergens are managed in state
};

// PRIDE Loop Toxicity Keywords
export const PRIDE_TOXICITY_KEYWORDS = ['mould', 'mold', 'humidity', 'spoilage', 'toxin', 'aflatoxin', 'mycotoxin'];
