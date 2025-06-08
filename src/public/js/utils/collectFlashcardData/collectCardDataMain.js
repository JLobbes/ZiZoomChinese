// public/js/utils/collectCardDataMain.js

import uiState from "../../uiState.js";
import { createPinyinKeyboard } from './createPinYinKeyboard.js';
import { saveCardToDatabase } from '../../api/saveFlashcard.js';
import { getDecks } from '../../api/getDecks.js'
import { renderDeckSelection } from '../collectFlashcardData/renderSelectDeck.js'

export function collectFlashcardData(imageSnippit) {
  const newCard = {
    imgPath: uiState.viewedImg.src,
    imageSnippit,
    deckID: null,
  };

  showFlashcardCreationOverlay(imageSnippit);
  startCollectCardFront(newCard);
}

export function showFlashcardCreationOverlay(imageSnippit) {
  const canvas = generateSnippitPreview(uiState.viewedImg, imageSnippit);

  uiState.flashcardSnippitPreview.src = canvas.toDataURL();
  uiState.flashcardSnippitPreview.style.display = 'block';
  uiState.flashcardCreationOverlay.style.display = 'flex';
}

export function startCollectCardFront(card) {
  uiState.cardFrontInputStep.style.display = 'flex';
  uiState.cardFrontInput.focus();

  uiState.saveDataBtn.textContent = 'Next';
  uiState.saveDataBtn.onclick = () => {
    const term = uiState.cardFrontInput.value.trim();
    if (!term) return alert('Please enter text for card front.');
    card.chinese = term;
    startCollectPinYin(card);
  };
}

export function startCollectPinYin(card) {
  uiState.cardFrontInputStep.style.display = 'none';
  uiState.cardPinyinStep.style.display = 'flex';
  uiState.cardPinyinInput.focus();

  createPinyinKeyboard(); 

  uiState.saveDataBtn.textContent = 'Next';
  uiState.saveDataBtn.onclick = () => {
    const pinyin = uiState.cardPinyinInput.value.trim();
    if (!pinyin) return alert('Please enter Pinyin.');
    card.pinyin = pinyin;

    startCollectCardRear(card);
  };
}

export function startCollectCardRear(card) {

  uiState.pinyinInputMode = false;
  uiState.showingToneOptions = false;
  uiState.cardPinyinStep.style.display = 'none';

  uiState.cardRearInputStep.style.display = 'flex';
  uiState.cardRearInput.focus();

  uiState.saveDataBtn.textContent = 'Next';
  uiState.saveDataBtn.onclick = () => {
    const term = uiState.cardRearInput.value.trim();
    if (!term) return alert('Please enter text for card rear.');
    card.english = term;

    // Move to deck selection step
    startSelectDeckStep(card);
  };
}

export function startSelectDeckStep(card) {
  uiState.cardRearInputStep.style.display = 'none';
  uiState.flashcardSnippitPreview.style.display = 'none';
  uiState.collectDeckStep.style.display = 'flex';

  getDecks().then((decks) => {
    console.log('got decks:', decks);

    renderDeckSelection(uiState.flashcardDeckSelectionGUI, decks, (deckID, deckName) => {
      card.deckID = deckID;
      card.deckName = deckName;
      uiState.deckInput.value = deckName;
    });

    uiState.saveDataBtn.textContent = 'Next';
    uiState.saveDataBtn.onclick = () => {
      if (!card.deckID) {
        alert('Please select a deck.');
        return;
      }

      uiState.collectDeckStep.style.display = 'none';
      uiState.flashcardSnippitPreview.style.display = 'block';
      startReviewInputStep(card);
    };

  }).catch((err) => {
    console.error('Failed to load decks', err);
    alert('Could not load decks. Please try again later.');
    resetCardOverlay();
  });
}

export function startReviewInputStep(card) {
  uiState.cardRearInputStep.style.display = 'none';
  uiState.cardReviewInputStep.style.display = 'flex';

  uiState.reviewCardFrontInput.textContent = card.chinese;
  uiState.reviewCardPinYin.textContent = card.pinyin;
  uiState.reviewCardRearInput.textContent = card.english;
  uiState.cardReviewInputStep.textContent = card.deckName;

  uiState.saveDataBtn.textContent = 'Save';
  uiState.saveDataBtn.onclick = () => {
    if (!card.deckID) {
      alert('Please select a deck to save the card.');
      return;
    }
    saveCardToDatabase(card);
    resetCardOverlay();
  };
}


export function resetCardOverlay() {
  uiState.flashcardCreationOverlay.style.display = 'none';

  uiState.cardFrontInput.value = '';
  uiState.cardPinyinInput.value = '';
  uiState.cardRearInput.value = '';
  uiState.flashcardSnippitPreview.src = '';

  uiState.cardFrontInputStep.style.display = 'none';
  uiState.cardRearInputStep.style.display = 'none';
  uiState.collectDeckStep.style.display = 'none';
  uiState.cardReviewInputStep.style.display = 'none';
  
  uiState.reviewCardFrontInput.textContent = '';
  uiState.reviewCardPinYin.textContent = '';
  uiState.reviewCardRearInput.textContent = '';
}

function generateSnippitPreview(image, cropRect, targetShortSide = 100) {
  const { x, y, width, height } = cropRect;
  const aspectRatio = width / height;
  let drawWidth, drawHeight;

  if (width < height) {
    drawWidth = targetShortSide;
    drawHeight = Math.round(targetShortSide / aspectRatio);
  } else {
    drawHeight = targetShortSide;
    drawWidth = Math.round(targetShortSide * aspectRatio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = drawWidth;
  canvas.height = drawHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, x, y, width, height, 0, 0, drawWidth, drawHeight);

  return canvas;
}
