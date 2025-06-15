// public/js/utils/createDeckOverlay.js

import uiElements from '../uiElements.js';
import { createDeck } from '../api/createDeck.js'; 
import { renderMenu } from './menuConstruction/renderMenuMain.js'; // <-- Add this import

let parentDeckId = null;

export function openCreateDeckOverlay(parentId) {
  parentDeckId = parentId;
  uiElements.createDeckOverlay.style.display = 'flex';
  uiElements.newDeckNameInput.value = '';
}

export function closeCreateDeckOverlay() {
  uiElements.createDeckOverlay.style.display = 'none';
  parentDeckId = null;
}

uiElements.createDeckSubmitBtn.onclick = async () => {
  const name = uiElements.newDeckNameInput.value.trim();
  await createDeck(name, parentDeckId);
  closeCreateDeckOverlay();
  renderMenu(); // <-- Add this line to refresh the menu
};