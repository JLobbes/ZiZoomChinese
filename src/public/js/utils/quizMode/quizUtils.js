// js/utils/quizMode/quizUtils.js

import uiElements from "../../uiElements.js";

export function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

export function generateChoices(allCards, fieldKey, correctValue, count) {
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
