// public/js/zoomOrPanImage.js

import uiState from '../uiState.js';

// ==== Zoom and Pan Via Keyboard ====

export function keyPressZoomAndPan(e) {
  const moveStep = 200;
  let animate = false;

  switch (e.key) {
    case '+':
    case '=':
      if (e.shiftKey) uiState.scale = Math.min(uiState.scale + 0.4, 8);
      break;
    case '-':
    case '_':
      if (e.shiftKey) uiState.scale = Math.max(uiState.scale - 0.2, 0.3);
      break;
    case 'ArrowLeft':
      uiState.offsetX += moveStep; animate = true; break;
    case 'ArrowRight':
      uiState.offsetX -= moveStep; animate = true; break;
    case 'ArrowUp':
      uiState.offsetY += moveStep; animate = true; break;
    case 'ArrowDown':
      uiState.offsetY -= moveStep; animate = true; break;
    default:
      return;
  }

  updateImageTransform(animate);
}

// ==== Drag Logic ====

export function startPan(e) {
  uiState.isDraggingImage = true;
  uiState.dragStartX = e.clientX - uiState.offsetX;
  uiState.dragStartY = e.clientY - uiState.offsetY;
  uiState.viewedImg.style.cursor = 'grabbing';
  e.preventDefault();
}

export function panImage(e) {
  uiState.offsetX = e.clientX - uiState.dragStartX;
  uiState.offsetY = e.clientY - uiState.dragStartY;
  updateImageTransform();
}

export function endPan(e) {
  uiState.isDraggingImage = false;
  uiState.viewedImg.style.cursor = 'grab';
  updateImageTransform();
}

export function updateImageTransform(smooth = false) {
    const transition = smooth ? 'transform 0.3s ease' : '';
    uiState.viewedImgWrapper.style.transition = transition;
    uiState.viewedImgWrapper.style.transform = `translate(${uiState.offsetX}px, ${uiState.offsetY}px) scale(${uiState.scale})`;
}