// public/js/utils/userSettings/settingsMain.js

import uiState from '../../uiState.js';
import uiElements from '../../uiElements.js';
import { saveSettings, loadSettings } from './settingsStorage.js';

export function openSettingsOverlay() {
  uiElements.settingsOverlay.style.display = 'flex';
  uiElements.togglePinyin.checked = uiState.includePinyin;
  uiElements.toggleTrickyPinyin.checked = uiState.trickyPinyin;
  uiElements.toggleOCR.checked = uiState.enableOCR;
  uiElements.toggleFillInTheBlank.checked = uiState.fillInTheBlank; // <-- Add this line
  // Call after overlay is visible and all elements are in DOM
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
  if (typeof persisted.trickyPinyin === 'boolean') {
    uiState.trickyPinyin = persisted.trickyPinyin;
  }
  if (typeof persisted.enableOCR === 'boolean') {
    uiState.enableOCR = persisted.enableOCR;
  }
  if (typeof persisted.fillInTheBlank === 'boolean') { // <-- Add this block
    uiState.fillInTheBlank = persisted.fillInTheBlank;
  }
  // Add more settings here as needed
}

// Helper to update the status span
function updateToggleStatus() {
  const pinyinStatusSpan = document.getElementById('togglePinyinStatus');
  pinyinStatusSpan.textContent = uiState.includePinyin ? 'On' : 'Off';

  const trickyPinyinStatusSpan = document.getElementById('toggleTrickyPinyinStatus');
  trickyPinyinStatusSpan.textContent = uiState.trickyPinyin ? 'On' : 'Off';

  const ocrStatusSpan = document.getElementById('toggleOCRStatus');
  ocrStatusSpan.textContent = uiState.enableOCR ? 'On' : 'Off';

  const fillInBlankStatusSpan = document.getElementById('toggleFillInTheBlankStatus');
  fillInBlankStatusSpan.textContent = uiState.fillInTheBlank ? 'On' : 'Off';
}

// Helper to gather current settings and save them
function saveCurrentSettings() {
  saveSettings({
    includePinyin: uiState.includePinyin,
    trickyPinyin: uiState.trickyPinyin,
    fillInTheBlank: uiState.fillInTheBlank, 
    enableOCR: uiState.enableOCR,
    // Add more settings here as needed
  });
}

uiElements.togglePinyin.onchange = (e) => {
  uiState.includePinyin = e.target.checked;
  saveCurrentSettings();
  updateToggleStatus();
};

uiElements.toggleTrickyPinyin.onchange = (e) => {
  uiState.trickyPinyin = e.target.checked;
  saveCurrentSettings();
  updateToggleStatus();
};

uiElements.toggleFillInTheBlank.onchange = (e) => {
  uiState.fillInTheBlank = e.target.checked;
  saveCurrentSettings();
  updateToggleStatus();
};
uiElements.toggleOCR.onchange = (e) => {
  uiState.enableOCR = e.target.checked;
  saveCurrentSettings();
  updateToggleStatus();
};

