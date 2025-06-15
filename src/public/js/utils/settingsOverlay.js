// public/js/utils/openSettings.js

import uiState from '../uiState.js';
import uiElements from '../uiElements.js';

export function openSettingsOverlay() {
  uiElements.settingsOverlay.style.display = 'flex';
  uiElements.togglePinyin.checked = uiState.includePinyin;
}

export function closeSettingsOverlay () {
  uiElements.settingsOverlay.style.display = 'none';
};

// Toggle includePinyin
uiElements.togglePinyin.onchange = (e) => {
  uiState.includePinyin = e.target.checked;
};
