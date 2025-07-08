// js/utils/quizMode/quizUtils.js

import uiElements from "../../uiElements.js";
import uiState from "../../uiState.js";


export function getPerformanceAdaptiveStack(cards, quantity) {
  if (uiState.performanceAdaptiveReview) {
    // Get half from hardest (by review duration), half random, no duplicates
    const half = Math.floor(quantity / 2);
    const sorted = sortCardsByReviewDuration(cards);
    const hardest = sorted.slice(0, half);

    // Remove already picked cards from pool for random selection
    const hardestIds = new Set(hardest.map(card => card.FLASHCARD_ID));
    const remaining = cards.filter(card => !hardestIds.has(card.FLASHCARD_ID));
    const randoms = shuffleArray(remaining).slice(0, quantity - hardest.length);

    // Combine and shuffle the final stack
    const combined = hardest.concat(randoms);
    return shuffleArray(combined);
  } else {
    // Pure random selection
    return shuffleArray(cards);
  }
}  

export function sortCardsByReviewDuration(cards) {
  // Sort descending by FLASHCARD_LAST_REVIEW_DURATION (highest first)
  return cards.slice().sort((a, b) => 
    (b.FLASHCARD_LAST_REVIEW_DURATION || 0) - (a.FLASHCARD_LAST_REVIEW_DURATION || 0)
  );
}

export function shuffleArray(arr) {
  const array = arr.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/** Generate plausible pinyin variations for tricky mode. */
function getPlausiblePinyinVariations(originalPinYin) {
  const toneVariations = {
    'ā': ['á', 'ǎ', 'à', 'ā'],
    'á': ['ā', 'ǎ', 'à', 'á'],
    'ă': ['ā', 'á', 'à', 'ǎ'],
    'ǎ': ['ā', 'á', 'à', 'ǎ'],
    'à': ['ā', 'á', 'ǎ', 'à'],
    'ō': ['ó', 'ǒ', 'ò', 'ō'],
    'ó': ['ō', 'ǒ', 'ò', 'ó'],
    'ǒ': ['ō', 'ó', 'ò', 'ǒ'],
    'ŏ': ['ō', 'ó', 'ò', 'ǒ'],
    'ò': ['ō', 'ó', 'ǒ', 'ò'],
    'ē': ['é', 'ě', 'è', 'ē'],
    'é': ['ē', 'ě', 'è', 'é'],
    'ě': ['ē', 'é', 'è', 'ě'],
    'è': ['ē', 'é', 'ě', 'è'],
    'ī': ['í', 'ĭ', 'ì', 'ī'],
    'í': ['ī', 'ĭ', 'ì', 'í'],
    'ĭ': ['ī', 'í', 'ì', 'ĭ'],
    'ǐ': ['ī', 'í', 'ì', 'ĭ'],
    'ì': ['ī', 'í', 'ĭ', 'ì'],
    'ū': ['ú', 'ǔ', 'ù', 'ū'],
    'ú': ['ū', 'ǔ', 'ù', 'ú'],
    'ǔ': ['ū', 'ú', 'ù', 'ǔ'],
    'ŭ': ['ū', 'ú', 'ù', 'ǔ'],
    'ù': ['ū', 'ú', 'ǔ', 'ù'],
    'ǖ': ['ǘ', 'ǚ', 'ǜ', 'ǖ'],
    'ǘ': ['ǖ', 'ǚ', 'ǜ', 'ǘ'],
    'ǚ': ['ǖ', 'ǘ', 'ǜ', 'ǚ'],
    'ǜ': ['ǖ', 'ǘ', 'ǚ', 'ǜ']
  };

  const targetVowels = [];
  for (let i = 0; i < originalPinYin.length; i++) {
    const char = originalPinYin[i];
    if (toneVariations[char]) {
      targetVowels.push({ character: char, index: i });
    }
  }
  let alteredPinYin = originalPinYin;
  if (targetVowels.length === 0) return originalPinYin;
  do {
    alteredPinYin = originalPinYin.split('');
    for (const vowel of targetVowels) {
      const possibleVariations = toneVariations[vowel.character];
      if (possibleVariations) {
        const newVowel = possibleVariations[Math.floor(Math.random() * possibleVariations.length)];
        alteredPinYin[vowel.index] = newVowel;
      }
    }
    alteredPinYin = alteredPinYin.join('');
  } while (alteredPinYin === originalPinYin);
  return alteredPinYin;
}

/** Generate choices for a quiz question. */
export function generateChoices(allCards, fieldKey, correctValue, count) {
  if (uiState.trickyPinyin && fieldKey.toUpperCase() === "PINYIN") {
    const choices = new Set();
    choices.add(correctValue);
    while (choices.size < count) {
      const variation = getPlausiblePinyinVariations(correctValue);
      choices.add(variation);
    }
    return shuffleArray(Array.from(choices));
  }
  const pool = allCards
    .map(c => c[`FLASHCARD_${fieldKey}`])
    .filter(v => v && v !== correctValue);
  const shuffledPool = shuffleArray(pool);
  const choices = [...shuffledPool.slice(0, count - 1), correctValue];
  return shuffleArray(choices);
}

/** Update the quiz progress counter. */
export function updateQuizCounter(current, total) {
  uiElements.quizProgressCounter.textContent = `${current}`;
}