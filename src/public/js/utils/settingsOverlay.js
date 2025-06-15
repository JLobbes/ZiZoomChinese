// public/js/utils/openSettings.js

import uiState from '../uiState.js';
import uiElements from '../uiElements.js';

// Show settings overlay when "Settings" is clicked
export function openSettingsOverlay() {
  uiElements.settingsOverlay.style.display = 'flex';
  uiElements.togglePinyin.checked = uiState.includePinyin;
}

// Hide settings overlay
export function closeSettingsOverlay () {
  uiElements.settingsOverlay.style.display = 'none';
};

// Toggle includePinyin
uiElements.togglePinyin.onchange = (e) => {
  uiState.includePinyin = e.target.checked;
};
