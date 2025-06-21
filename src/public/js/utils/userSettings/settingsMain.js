// public/js/utils/openSettings.js

import uiState from '../../uiState.js';
import uiElements from '../../uiElements.js';

import { saveSettings, loadSettings } from './settingsStorage.js';

export function openSettingsOverlay() {
  uiElements.settingsOverlay.style.display = 'flex';
  uiElements.togglePinyin.checked = uiState.includePinyin;
  updateToggleStatus();
}

export function closeSettingsOverlay () {
  uiElements.settingsOverlay.style.display = 'none';
};


// Load settings from localStorage and apply to uiState
export function applyPersistedSettings() {
  const persisted = loadSettings();
  if (typeof persisted.includePinyin === 'boolean') {
    uiState.includePinyin = persisted.includePinyin;
  }
  // Add more settings here as needed
}

// Helper to update the status span
function updateToggleStatus() {
  const statusSpan = document.getElementById('togglePinyinStatus');
  statusSpan.textContent = uiState.includePinyin ? 'On' : 'Off';
}

// Toggle includePinyin
uiElements.togglePinyin.onchange = (e) => {
  uiState.includePinyin = e.target.checked;
  saveSettings({
    includePinyin: uiState.includePinyin,
    // Add more settings here as needed
  });
  updateToggleStatus();
};
