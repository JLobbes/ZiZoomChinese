// public/js/utils/quizMode/quizVisualHelpers.js

import uiElements from "../../uiElements.js";
import uiState from "../../uiState.js";
import { imageCoordsToPercent } from '../coordinateConverter.js';
import { updateImageTransform } from "../zoomOrPanImage.js";

/** Show a feedback message bubble in the quiz UI. */
export function showFeedbackMessage(message, delay = 0) {
  const feedbackDiv = document.getElementById('quizOperationFeedback');
  const msg = document.createElement('div');
  msg.className = 'quiz-feedback-message';
  msg.textContent = message;
  const leftPercent = 10 + Math.random() * 70;
  msg.style.left = `${leftPercent}%`;
  msg.style.transform = `translateX(-50%)`;
  setTimeout(() => {
    feedbackDiv.appendChild(msg);
    setTimeout(() => {
      msg.remove();
    }, 3000);
  }, delay);
}

export function handlQuizCardVisual(card) {
  const existingGhosts = uiElements.viewedImgWrapper.querySelectorAll('.flashcardGhost');
  existingGhosts.forEach(ghost => ghost.remove());
  uiElements.viewedImg.src = card.FLASHCARD_SOURCE_IMG_PATH;
  uiElements.viewerContainer.style.display = 'flex';
  uiState.offsetX = 0;
  uiState.offsetY = 0;
  uiElements.viewedImg.onload = () => {
    applyCropBox(card);
    scaleAndFitImage(card);
    setTimeout(() => {
      centerCropBoxWithPan(card);
    }, 300);
  };
}

export function applyCropBox(card) {
  removeOldCropBoxes();
  const { FLASHCARD_CROP_X, FLASHCARD_CROP_Y, FLASHCARD_CROP_WIDTH, FLASHCARD_CROP_HEIGHT } = card;
  uiElements.cropBox = document.createElement('div');
  uiElements.cropBox.className = 'quizCropBox';
  const percentBox = imageCoordsToPercent(
    FLASHCARD_CROP_X,
    FLASHCARD_CROP_Y,
    FLASHCARD_CROP_WIDTH,
    FLASHCARD_CROP_HEIGHT
  );
  uiElements.cropBox.style.left = `${percentBox.left}%`;
  uiElements.cropBox.style.top = `${percentBox.top}%`;
  uiElements.cropBox.style.width = `${percentBox.width}%`;
  uiElements.cropBox.style.height = `${percentBox.height}%`;
  uiElements.viewedImgWrapper.appendChild(uiElements.cropBox);
}

export function removeOldCropBoxes() {
  uiElements.cropBox = null;
  const oldBox = uiElements.viewedImgWrapper.querySelector('.quizCropBox');
  if (oldBox) oldBox.remove(); 
}

export function centerCropBoxWithPan(card) {
  const {
    FLASHCARD_CROP_X,
    FLASHCARD_CROP_Y,
    FLASHCARD_CROP_WIDTH,
    FLASHCARD_CROP_HEIGHT
  } = card;
  const imgNaturalWidth = uiElements.viewedImg.naturalWidth;
  const imgNaturalHeight = uiElements.viewedImg.naturalHeight;
  const imgWrapperRect = uiElements.viewedImgWrapper.getBoundingClientRect();
  const imgWrapperHalfWidth = Math.round(imgWrapperRect.width / 2);
  const imgWrapperHalfHeight = Math.round(imgWrapperRect.height / 2);
  const cropBoxMidY = Math.round(FLASHCARD_CROP_Y + FLASHCARD_CROP_HEIGHT / 2);
  const adjMidY = Math.round((cropBoxMidY / imgNaturalHeight) * imgWrapperRect.height);
  const distYFromCenter = adjMidY - imgWrapperHalfHeight;
  const bufferOffset = 100;
  uiState.offsetY = -distYFromCenter - bufferOffset;
  if (uiState.centerCropBoxHorizontally) {
    const cropBoxMidX = Math.round(FLASHCARD_CROP_X + FLASHCARD_CROP_WIDTH / 2);
    const adjMidX = Math.round((cropBoxMidX / imgNaturalWidth) * imgWrapperRect.width);
    const distXFromCenter = adjMidX - imgWrapperHalfWidth;
    uiState.offsetX = -distXFromCenter;
  }
  updateImageTransform(true);
}

export function scaleAndFitImage(card) {
  const { FLASHCARD_CROP_HEIGHT, FLASHCARD_CROP_WIDTH } = card;
  const mainAxisLength = Math.min(FLASHCARD_CROP_HEIGHT, FLASHCARD_CROP_WIDTH);
  const imgNaturalHeight = uiElements.viewedImg.naturalHeight;
  const imgWrapperHeight = uiElements.viewedImgWrapper.getBoundingClientRect().height;
  const naturalHeightAdjustment = Math.round((imgWrapperHeight / imgNaturalHeight) * mainAxisLength);
  const targetLength = 60;
  const adjustmentRatio = parseFloat((targetLength / naturalHeightAdjustment).toFixed(3));
  uiState.scale = parseFloat((uiState.scale * adjustmentRatio).toFixed(3));
  updateImageTransform(true);
}

/** Clean up and close down quiz mode visuals. */
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
