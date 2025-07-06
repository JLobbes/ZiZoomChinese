// js/utils/quizMode/quizUtils.js

import uiElements from "../../uiElements.js";
import uiState from "../../uiState.js";
import { removeOldCropBoxes } from "./quizVisualHelpers.js";

export function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

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

  // Identify and store target vowels
  for (let i = 0; i < originalPinYin.length; i++) {
    const char = originalPinYin[i];
    if (toneVariations[char]) {
      targetVowels.push({ character: char, index: i });
    }
  }

  let alteredPinYin = originalPinYin;

  // Perform tone swaps
  if (targetVowels.length === 0) return originalPinYin; // No tones to swap

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

export function generateChoices(allCards, fieldKey, correctValue, count) {
  // Special logic for PINYIN field with includePinyin enabled
  if (uiState.trickyPinyin && fieldKey.toUpperCase() === "PINYIN") {
    const choices = new Set();
    choices.add(correctValue);

    while (choices.size < count) {
      const variation = getPlausiblePinyinVariations(correctValue);
      choices.add(variation);
    }

    return shuffleArray(Array.from(choices));
  }

  // Default logic for other fields
  const pool = allCards
    .map(c => c[`FLASHCARD_${fieldKey}`])
    .filter(v => v && v !== correctValue);

  const shuffledPool = shuffleArray(pool);
  const choices = [...shuffledPool.slice(0, count - 1), correctValue];
  return shuffleArray(choices); // shuffle so correct isn't always last
}

export function showFeedbackMessage(text) {
  const container = uiElements.quizOperationFeedback;
  if (!container) return;

  const msg = document.createElement('div');
  msg.className = 'quiz-feedback-message';
  msg.textContent = text;

  container.appendChild(msg);

  // Remove after animation completes (2s)
  msg.addEventListener('animationend', () => {
    msg.remove();
  });
}

export function closeDownQuizMode() {
  uiState.quizModeOn = false; 
  uiState.quizRunning = false; 
  uiState.deckToQuiz = null;

  uiState.scale = 1;
  uiElements.quizUI.style.display = 'none';
  uiElements.chooseDeckToQuizContainer.style.display = 'none';
  uiElements.infoDisplayContainer.classList.remove('quizRunning');
  uiElements.infoDisplayContainer.style.display = 'none';
  uiElements.quizProgressCounter.style.display = 'none';

  uiElements.viewedImg.src = '';
  removeOldCropBoxes();
}