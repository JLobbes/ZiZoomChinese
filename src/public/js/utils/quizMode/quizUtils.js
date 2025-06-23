// js/utils/quizMode/quizUtils.js

import uiElements from "../../uiElements.js";
import uiState from "../../uiState.js";
import { removeOldCropBoxes } from "./quizVisualHelpers.js";

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