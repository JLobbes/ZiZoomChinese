// public/js/showFlashcardGhosts.js

import uiState from "../uiState.js";
import { imageCoordsToPercent } from './coordinateConverter.js'

export function displayFlashcardGhosts(cards) {
  const existingGhosts = uiState.viewedImgWrapper.querySelectorAll('.flashcardGhost');
  existingGhosts.forEach(ghost => ghost.remove());

  cards.forEach(card => {
    const { FLASHCARD_CROP_X, FLASHCARD_CROP_Y, FLASHCARD_CROP_WIDTH, FLASHCARD_CROP_HEIGHT } = card;

    const ghost = document.createElement('div');
    ghost.className = 'flashcardGhost';

    const percentBox = imageCoordsToPercent(
      FLASHCARD_CROP_X,
      FLASHCARD_CROP_Y,
      FLASHCARD_CROP_WIDTH,
      FLASHCARD_CROP_HEIGHT
    );

    ghost.style.left = `${percentBox.left}%`;
    ghost.style.top = `${percentBox.top}%`;
    ghost.style.width = `${percentBox.width}%`;
    ghost.style.height = `${percentBox.height}%`;

    ghost.dataset.card = JSON.stringify(card);

    uiState.viewedImgWrapper.appendChild(ghost);
  });
}

export function showFlashcardOverlay(cardData, currentMouseY) {
  uiState.cardDataPopup_Chinese.innerText = cardData.FLASHCARD_CHN || '';
  uiState.cardDataPopup_Pinyin.innerText = cardData.FLASHCARD_PINYIN || '';
  uiState.cardDataPopup_English.innerText = cardData.FLASHCARD_ENG || '';

  uiState.infoDisplayContainer.style.display = 'flex'; 
  uiState.flashcardData_Popup.style.display = 'flex';
  requestAnimationFrame(() => {
    uiState.infoDisplayContainer.classList.add('show');
    
    const mouseInTopHalf = determineMouseArea(currentMouseY);
    if(mouseInTopHalf) {
      // defaults to display on bottom
    } else {
      uiState.infoDisplayContainer.classList.add('position-top');
    }
  });
}

export function hideFlashcardOverlay() {
  uiState.infoDisplayContainer.classList.remove('show');
  setTimeout(() => {
    const differentPopUpOpened = uiState.infoDisplayContainer.classList.contains('show');
    
    if(!differentPopUpOpened) {
      uiState.infoDisplayContainer.classList.remove('show');
      uiState.infoDisplayContainer.classList.remove('position-top');
      uiState.infoDisplayContainer.style.display = 'none';
      uiState.flashcardData_Popup.style.display = 'none';
    }
  }, 300); 
}

export function determineMouseArea(currentMouseY) {
  
  const currentHeight = window.innerHeight;
  const midwayMark = currentHeight / 2;

  // Return true if the mouse is in the top half of the screen
  return currentMouseY < midwayMark;
}