// public/js/utils/loadImages.js

import uiState from '../uiState.js';
import uiElements from '../uiElements.js';
import { updateImageTransform } from './zoomOrPanImage.js';
import { displayFlashcardGhosts } from '../utils/displayFlashcardGhosts.js'
import { fetchFlashcardsData } from '../api/getFlashcards.js';

export function loadImages(files) {

  files.forEach(file => {
    const item = document.createElement('div');
    item.className = 'menuItem';
    item.textContent = file;
    item.setAttribute('data-src', `/images/${file}`);
    item.addEventListener('click', () => {

      uiElements.viewedImg.src = `/images/${file}`;
      uiElements.viewerContainer.style.display = 'flex';
      uiState.scale = 1;
      uiState.offsetX = 0;
      uiState.offsetY = 0;
      updateImageTransform();
      const flashCardData = fetchFlashcardsData();
      displayFlashcardGhosts(flashCardData);
    });
    uiElements.menu.appendChild(item);
  });
}
