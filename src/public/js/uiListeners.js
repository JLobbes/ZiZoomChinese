// public/js/uiListeners.js

import uiState from './uiState.js';
import uiElements from './uiElements.js';
import { renderMenu } from './utils/menuConstruction/renderMenuMain.js';
import { showFlashcardOverlay, hideFlashcardOverlay } from './utils/displayFlashcardGhosts.js';
import { keyPressZoomAndPan, startPan, panImage, endPan } from './utils/zoomOrPanImage.js';
import {
  enableSelectionMode, startSelection,
  drawSelectionBox, finalizeSelection
} from './utils/collectFlashcardData/selectImageArea.js';
import { handlePinyinKeydown, createPinyinKeyboard } from './utils/collectFlashcardData/createPinYinKeyboard.js';
import { resetCardOverlay } from './utils/collectFlashcardData/collectCardDataMain.js';

export function initUIListeners() {
  initGlobalKeyListeners();
  initMouseEvents();
  initOverlayListeners();
  initSelectionButton();
}

// === Global Key Listeners (keyboard shortcuts, pinyin, etc.)

function initGlobalKeyListeners() {
  window.addEventListener('load', renderMenu);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      handleEscapeKey(e);
      return;
    }

    if (uiState.pinyinInputMode || uiState.showingToneOptions) {
      handlePinyinKeydown(e);
      return;
    }

    const overlayVisible = uiElements.flashcardCreationOverlay.style.display === 'flex';
    if (uiState.selectionModeEnabled || overlayVisible) return;

    keyPressZoomAndPan(e);
  });
}

// === Mouse Events (image panning and selection)

function initMouseEvents() {
  document.addEventListener('mousedown', e => {
    const overlayVisible = uiElements.flashcardCreationOverlay.style.display === 'flex';

    if (uiState.selectionModeEnabled) {
      startSelection(e);
    } else if (!overlayVisible) {
      startPan(e);
    }
  });

  document.addEventListener('mousemove', e => {
    if (uiState.selectionModeEnabled && uiState.isDrawingSelection) {
      drawSelectionBox(e);
    } else if (uiState.isDraggingImage) {
      panImage(e);
    }
  });

  document.addEventListener('mouseup', e => {
    if (uiState.selectionModeEnabled && uiState.isDrawingSelection) {
      finalizeSelection(e);
    } else if (uiState.isDraggingImage) {
      endPan(e);
    }
  });
}

// === Overlay Listeners (hover previews and exit button)

function initOverlayListeners() {
  uiElements.viewedImgWrapper.addEventListener('mouseover', e => {
    const ghost = e.target.closest('.flashcardGhost');
    if (ghost) {
      const cardData = JSON.parse(ghost.dataset.card);
      const currentMouseY = e.clientY;
      showFlashcardOverlay(cardData, currentMouseY);
    }
  });

  uiElements.viewedImgWrapper.addEventListener('mouseout', e => {
    const ghost = e.target.closest('.flashcardGhost');
    if (ghost) {
      hideFlashcardOverlay();
    }
  });

  uiElements.exitFlashcardCreationBtn.addEventListener('click', resetCardOverlay);
}

// === Flashcard Creation Button

function initSelectionButton() {
  uiElements.makeFlashcardBtn.addEventListener('click', enableSelectionMode);
}

// === Escape Key Handler

function handleEscapeKey(e) {
  if (uiState.showingToneOptions) {
    e.preventDefault();
    createPinyinKeyboard(); // Reset to base vowels
    return;
  }

  const overlayVisible = uiElements.flashcardCreationOverlay.style.display === 'flex';
  if (overlayVisible) {
    e.preventDefault();
    resetCardOverlay();
  }
}
