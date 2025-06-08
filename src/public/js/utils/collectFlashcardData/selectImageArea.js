// public/js/utils/selectImageArea.js

import uiState from "../../uiState.js";
import { getImageCoords, imageCoordsToPercent } from "../coordinateConverter.js";
import { collectFlashcardData } from "../collectFlashcardData/collectCardDataMain.js"; 

// ==== IMAGE AREA SELECTION (FOR FLASHCARD)  ====

export function enableSelectionMode() {
  if (uiState.selectionModeEnabled) return;
  if (!uiState.viewedImg?.src) return alert("Please load an image first.");

  uiState.selectionModeEnabled = true;
  uiState.viewedImg.style.cursor = 'crosshair';

  uiState.makeFlashcardBtn.style.backgroundColor = 'black';
  uiState.makeFlashcardBtn.style.color = 'white';
}

export function startSelection(e) {
  if (!uiState.selectionModeEnabled) return;

  uiState.isDrawingSelection = true;

  const { x, y } = getImageCoords(e.clientX, e.clientY);
  uiState.selectionStartX = x;
  uiState.selectionStartY = y;

  const box = document.createElement('div');
  box.style.position = 'absolute';
  box.style.border = '2px dashed #ff00ff';
  box.style.background = 'rgba(255, 0, 255, 0.2)';
  box.style.pointerEvents = 'none';
  box.style.zIndex = '9999';

  uiState.selectionBox = box;
  uiState.viewedImgWrapper.appendChild(box);
}

export function drawSelectionBox(e) {
  if (!uiState.selectionBox) return;

  const { x, y } = getImageCoords(e.clientX, e.clientY);

  const box = {
    x: Math.min(x, uiState.selectionStartX),
    y: Math.min(y, uiState.selectionStartY),
    width: Math.abs(x - uiState.selectionStartX),
    height: Math.abs(y - uiState.selectionStartY),
  };

  const percent = imageCoordsToPercent(box.x, box.y, box.width, box.height);

  const el = uiState.selectionBox;
  el.style.left = `${percent.left}%`;
  el.style.top = `${percent.top}%`;
  el.style.width = `${percent.width}%`;
  el.style.height = `${percent.height}%`;
}

export function finalizeSelection(e) {
  if (!uiState.selectionBox) return;

  uiState.isDrawingSelection = false;
  uiState.selectionModeEnabled = false;
  uiState.viewedImg.style.cursor = 'grab';

  const { x: endX, y: endY } = getImageCoords(e.clientX, e.clientY);

  uiState.selected_area = {
    x: Math.min(uiState.selectionStartX, endX),
    y: Math.min(uiState.selectionStartY, endY),
    width: Math.abs(endX - uiState.selectionStartX),
    height: Math.abs(endY - uiState.selectionStartY),
  };

  // Cleanup after 2s
  setTimeout(() => {
    if (uiState.selectionBox) {
      uiState.selectionBox.remove();
      uiState.selectionBox = null;
    }
  }, 2000);

  uiState.makeFlashcardBtn.style.backgroundColor = '';
  uiState.makeFlashcardBtn.style.color = '';

  collectFlashcardData(uiState.selected_area);
}
