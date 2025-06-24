// public/js/utils/flashcardCreation/selectImageArea.js

import uiState from "../../uiState.js";
import uiElements from "../../uiElements.js";
import { getImageCoords, imageCoordsToPercent } from "../coordinateConverter.js";
import { collectFlashcardData } from "./createFlashcardMain.js"; 

// ==== IMAGE SNIPPET SELECTION (FOR FLASHCARD)  ====

export function enableSelectionMode() {
  if (uiState.selectionModeEnabled) return;
  if (!uiElements.viewedImg?.src) return alert("Please load an image first.");

  uiState.selectionModeEnabled = true;
  uiElements.viewedImg.style.cursor = 'crosshair';

  uiElements.makeFlashcardBtn.style.backgroundColor = 'black';
  uiElements.makeFlashcardBtn.style.color = 'white';
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
  uiElements.viewedImgWrapper.appendChild(box);
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
  uiElements.viewedImg.style.cursor = 'grab';

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

  uiElements.makeFlashcardBtn.style.backgroundColor = '';
  uiElements.makeFlashcardBtn.style.color = '';

  collectFlashcardData(uiState.selected_area);
}
