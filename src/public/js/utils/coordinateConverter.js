// public/js/utils/coordianteConverter.js

import uiState from "../uiState.js";

export function getImageCoords(clientX, clientY) {
  const rect = uiState.viewedImg.getBoundingClientRect();
  const scaleX = uiState.viewedImg.naturalWidth / rect.width;
  const scaleY = uiState.viewedImg.naturalHeight / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

export function imageCoordsToPercent(x, y, width, height) {
  const nw = uiState.viewedImg.naturalWidth;
  const nh = uiState.viewedImg.naturalHeight;

  return {
    left: (x / nw) * 100,
    top: (y / nh) * 100,
    width: (width / nw) * 100,
    height: (height / nh) * 100
  };
}