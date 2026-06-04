import { ALLERGEN_DICTIONARY, AllergenCategory, PRIDE_TOXICITY_KEYWORDS } from './allergenDictionary';

export interface AnalysisResult {
  verdict: 'SAFE' | 'WARNING' | 'CRITICAL';
  matchedAllergens: Array<{
    category: AllergenCategory;
    triggerWord: string;
  }>;
  prideLoopTriggered: boolean;
  highlightedText: string; // HTML string with <span> tags for highlighting
}

export const analyzeIngredients = (
  extractedText: string,
  activeAllergens: AllergenCategory[],
  customAllergens: string[] = []
): AnalysisResult => {
  const normalizedText = extractedText.toLowerCase();
  const matchedAllergens: Array<{ category: AllergenCategory; triggerWord: string }> = [];
  let prideLoopTriggered = false;

  // 1. Check for PRIDE Toxicity Keywords
  for (const keyword of PRIDE_TOXICITY_KEYWORDS) {
    if (normalizedText.includes(keyword)) {
      prideLoopTriggered = true;
      break;
    }
  }

  // 2. Check active dictionary allergens
  activeAllergens.forEach((category) => {
    if (category === 'Custom') return; // Handled separately
    const derivatives = ALLERGEN_DICTIONARY[category];
    for (const word of derivatives) {
      if (normalizedText.includes(word)) {
        matchedAllergens.push({ category, triggerWord: word });
      }
    }
  });

  // 3. Check custom allergens
  for (const word of customAllergens) {
    const normalizedWord = word.toLowerCase();
    if (normalizedWord && normalizedText.includes(normalizedWord)) {
      matchedAllergens.push({ category: 'Custom', triggerWord: word });
    }
  }

  // 4. Determine Verdict
  let verdict: 'SAFE' | 'WARNING' | 'CRITICAL' = 'SAFE';
  if (prideLoopTriggered || matchedAllergens.length > 0) {
    verdict = 'CRITICAL';
  } else if (normalizedText.includes('may contain') || normalizedText.includes('manufactured in a facility')) {
    // Basic heuristic for cross-contamination
    // If they have active allergens, any "may contain" could be a warning.
    // To be precise, we'd check if the "may contain" string has the allergen,
    // but as a general prototype, we'll flag any "may contain" as a WARNING if it exists.
    verdict = 'WARNING';
  }

  // 5. Generate Highlighted Text
  // We'll just replace the matched words with a highlighted span.
  // Note: Simple replaceAll might mess up HTML, but for this prototype, it's ok.
  let highlightedText = extractedText;
  
  if (prideLoopTriggered) {
    PRIDE_TOXICITY_KEYWORDS.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<span class="bg-rose-500/30 text-rose-300 px-1 rounded">$1</span>');
    });
  }

  matchedAllergens.forEach(({ triggerWord }) => {
    const regex = new RegExp(`(${triggerWord})`, 'gi');
    // For CRITICAL matches
    highlightedText = highlightedText.replace(regex, '<span class="bg-rose-500/30 text-rose-300 px-1 rounded font-bold">$1</span>');
  });

  // Highlight warnings
  if (verdict === 'WARNING') {
      highlightedText = highlightedText.replace(/(may contain|manufactured in a facility)/gi, '<span class="bg-amber-500/30 text-amber-300 px-1 rounded font-bold">$1</span>');
  }

  return {
    verdict,
    matchedAllergens,
    prideLoopTriggered,
    highlightedText
  };
};
