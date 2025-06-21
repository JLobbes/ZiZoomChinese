// public/js/utils/userSettings/settingsMain.js

import uiState from '../../uiState.js';
import uiElements from '../../uiElements.js';
import { saveSettings, loadSettings } from './settingsStorage.js';

export function openSettingsOverlay() {
  uiElements.settingsOverlay.style.display = 'flex';
  uiElements.togglePinyin.checked = uiState.includePinyin;
  uiElements.toggleOCR.checked = uiState.enableOCR; 
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
  if (typeof persisted.enableOCR === 'boolean') {
    uiState.enableOCR = persisted.enableOCR;
  }
  // Add more settings here as needed
}

// Helper to update the status span
function updateToggleStatus() {
  const statusSpan = document.getElementById('togglePinyinStatus');
  statusSpan.textContent = uiState.includePinyin ? 'On' : 'Off';
  const ocrStatusSpan = document.getElementById('toggleOCRStatus');
  ocrStatusSpan.textContent = uiState.enableOCR ? 'On' : 'Off';
}

uiElements.togglePinyin.onchange = (e) => {
  uiState.includePinyin = e.target.checked;
  saveSettings({
    includePinyin: uiState.includePinyin,
    enableOCR: uiState.enableOCR,
    // Add more settings here as needed
  });
  updateToggleStatus();
};

uiElements.toggleOCR.onchange = (e) => {
  uiState.enableOCR = e.target.checked;
  saveSettings({
    includePinyin: uiState.includePinyin,
    enableOCR: uiState.enableOCR,
    // Add more settings here as needed
  });
  updateToggleStatus();
};
