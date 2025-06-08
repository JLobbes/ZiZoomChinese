// public/js/utils/coordianteConverter.js

import uiElements from "../uiElements.js";

export function getImageCoords(clientX, clientY) {
  const rect = uiElements.viewedImg.getBoundingClientRect();
  const scaleX = uiElements.viewedImg.naturalWidth / rect.width;
  const scaleY = uiElements.viewedImg.naturalHeight / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

export function imageCoordsToPercent(x, y, width, height) {
  const nw = uiElements.viewedImg.naturalWidth;
  const nh = uiElements.viewedImg.naturalHeight;

  return {
    left: (x / nw) * 100,
    top: (y / nh) * 100,
    width: (width / nw) * 100,
    height: (height / nh) * 100
  };
}