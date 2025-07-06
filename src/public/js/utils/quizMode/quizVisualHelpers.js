// public/js/utils/quizMode/quizVisualHelpers.js

import uiElements from "../../uiElements.js";
import uiState from "../../uiState.js";
import { imageCoordsToPercent } from '../coordinateConverter.js';
import { updateImageTransform } from "../zoomOrPanImage.js";

export function handlQuizCardVisual(card) {
  const existingGhosts = uiElements.viewedImgWrapper.querySelectorAll('.flashcardGhost');
  existingGhosts.forEach(ghost => ghost.remove());

  uiElements.viewedImg.src = card.FLASHCARD_SOURCE_IMG_PATH;
  uiElements.viewerContainer.style.display = 'flex';
  uiState.offsetX = 0;
  uiState.offsetY = 0;

  // Wait for image to load
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

  // --- Y-axis ---
  const cropBoxMidY = Math.round(FLASHCARD_CROP_Y + FLASHCARD_CROP_HEIGHT / 2);
  const adjMidY = Math.round((cropBoxMidY / imgNaturalHeight) * imgWrapperRect.height);
  const distYFromCenter = adjMidY - imgWrapperHalfHeight;
  const bufferOffset = 100; // px

  uiState.offsetY = -distYFromCenter - bufferOffset;

  // --- X-axis ---
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

  const targetLength = 60; // px  
  const adjustmentRatio = parseFloat((targetLength / naturalHeightAdjustment).toFixed(3));

  uiState.scale = parseFloat((uiState.scale * adjustmentRatio).toFixed(3));
  updateImageTransform(true);
}
