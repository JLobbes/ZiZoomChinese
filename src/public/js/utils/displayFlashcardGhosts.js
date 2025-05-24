// public/js/showFlashcardGhots.js

import uiState from "../uiState.js";

export function displayFlashcardGhosts(cards) {
  const existingGhosts = uiState.viewedImgWrapper.querySelectorAll('.flashCardGhost');
  existingGhosts.forEach(ghost => ghost.remove());

  const naturalWidth = uiState.viewedImg.naturalWidth;
  const naturalHeight = uiState.viewedImg.naturalHeight;

  cards.forEach(card => {
    const { FLASHCARD_CROP_X, FLASHCARD_CROP_Y, FLASHCARD_CROP_WIDTH, FLASHCARD_CROP_HEIGHT } = card;

    const ghost = document.createElement('div');
    ghost.className = 'flashCardGhost';
    ghost.style.position = 'absolute';
    ghost.style.border = '2px dashed #ff00ff';
    ghost.style.background = 'rgba(255, 0, 255, 0.3)';
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '9999';

    // Convert to percentages based on original image size
    const percentBox = imageCoordsToPercent(
      FLASHCARD_CROP_X,
      FLASHCARD_CROP_Y,
      FLASHCARD_CROP_WIDTH,
      FLASHCARD_CROP_HEIGHT
    );

    ghost.style.left = `${percentBox.left}%`;
    ghost.style.top = `${percentBox.top}%`;
    ghost.style.width = `${percentBox.width}%`;
    ghost.style.height = `${percentBox.height}%`;

    // Store raw values in case you need them
    ghost.dataset.card = JSON.stringify({
      x: FLASHCARD_CROP_X,
      y: FLASHCARD_CROP_Y,
      width: FLASHCARD_CROP_WIDTH,
      height: FLASHCARD_CROP_HEIGHT
    });

    uiState.viewedImgWrapper.appendChild(ghost);
  });
}