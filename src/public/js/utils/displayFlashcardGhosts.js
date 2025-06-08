// public/js/showFlashcardGhosts.js

import uiElements from "../uiElements.js";
import uiState from "../uiState.js";
import { imageCoordsToPercent } from './coordinateConverter.js'

export function displayFlashcardGhosts(cards) {
  const existingGhosts = uiElements.viewedImgWrapper.querySelectorAll('.flashcardGhost');
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

    uiElements.viewedImgWrapper.appendChild(ghost);
  });
}

export function showFlashcardOverlay(cardData, currentMouseY) {
  uiElements.cardDataPopup_Chinese.innerText = cardData.FLASHCARD_CHN || '';
  uiElements.cardDataPopup_English.innerText = cardData.FLASHCARD_ENG || '';

  if(uiState.includePinyin) {
    uiElements.cardDataPopup_Pinyin.innerText = cardData.FLASHCARD_PINYIN || '';
  } else {
    uiElements.cardDataPinyinTableRow.style.display = 'none';
  }

  uiElements.infoDisplayContainer.style.display = 'flex'; 
  uiElements.flashcardData_Popup.style.display = 'flex';
  requestAnimationFrame(() => {
    uiElements.infoDisplayContainer.classList.add('show');
    
    const mouseInTopHalf = determineMouseArea(currentMouseY);
    if(mouseInTopHalf) {
      // defaults to display on bottom
    } else {
      uiElements.infoDisplayContainer.classList.add('position-top');
    }
  });
}

export function hideFlashcardOverlay() {
  uiElements.infoDisplayContainer.classList.remove('show');
  setTimeout(() => {
    const differentPopUpOpened = uiElements.infoDisplayContainer.classList.contains('show');
    
    if(!differentPopUpOpened) {
      uiElements.infoDisplayContainer.classList.remove('show');
      uiElements.infoDisplayContainer.classList.remove('position-top');
      uiElements.infoDisplayContainer.style.display = 'none';
      uiElements.flashcardData_Popup.style.display = 'none';
    }
  }, 300); 
}

export function determineMouseArea(currentMouseY) {
  
  const currentHeight = window.innerHeight;
  const midwayMark = currentHeight / 2;

  // Return true if the mouse is in the top half of the screen
  return currentMouseY < midwayMark;
}