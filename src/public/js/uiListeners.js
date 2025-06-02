// public/js/uiListeners.js

import uiState from './uiState.js';
import { renderMenu } from './utils/menuConstruction/renderMenuMain.js';
import { keyPressZoomAndPan, startPan, panImage, endPan } from './utils/zoomOrPanImage.js';
import { startSelection, drawSelectionBox, finalizeSelection } from './utils/selectImageArea.js';
import { resetCardOverlay } from './utils/collectCardData.js';
import { enableSelectionMode } from './utils/selectImageArea.js';
import { handlePinyinKeydown, createPinyinKeyboard } from './utils/createPinYinKeyboard.js';
 
export function initUIListeners() {

  window.addEventListener('load', () => {
    renderMenu();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      handleEscapeKey(e);
      return;
    }

    if (uiState.pinyinInputMode || uiState.showingToneOptions) {
      handlePinyinKeydown(e);
      return;
    }

    const overlayVisible = uiState.cardCollectionOverlay.style.display === 'flex';
    if (uiState.selectionModeEnabled || overlayVisible) return;

    keyPressZoomAndPan(e);
  });

  document.addEventListener('mousedown', e => {
    if (uiState.selectionModeEnabled) {
      startSelection(e);
    } else {
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

  uiState.selectAreaBtn.addEventListener('click', enableSelectionMode);

  function handleEscapeKey(e) {
    // === Cancel tone selection ===
    if (uiState.showingToneOptions) {
      e.preventDefault();
      createPinyinKeyboard(); // Reset to base vowels
      return;
    }

    // === Close overlay ===
    const overlayVisible = uiState.cardCollectionOverlay.style.display === 'flex';
    if (overlayVisible) {
      e.preventDefault();
      resetCardOverlay();
    }
  }

  uiState.exitCardDataCollectBtn.addEventListener('click', resetCardOverlay);

}

