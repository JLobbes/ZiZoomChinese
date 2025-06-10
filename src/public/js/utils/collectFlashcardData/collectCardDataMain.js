// public/js/utils/collectCardDataMain.js

import uiState from "../../uiState.js";
import uiElements from "../../uiElements.js";
import { ocrImageFromCanvas } from './OCR.js';
import { createPinyinKeyboard } from './createPinYinKeyboard.js';
import { getDecks } from '../../api/getDecks.js'
import { renderDeckSelection } from '../collectFlashcardData/renderSelectDeck.js'
import { displayFlashcardGhosts } from "../displayFlashcardGhosts.js";
import { fetchFlashcardsData } from "../../api/getFlashcards.js";
import { saveCardToDatabase } from '../../api/saveFlashcard.js';

export async function collectFlashcardData(imageSnippit) {
  const newCard = {
    imgPath: uiElements.viewedImg.src,
    imageSnippit,
    deckID: null,
  };

  const canvas = generateSnippitPreview(uiElements.viewedImg, imageSnippit);
  uiElements.flashcardSnippitPreview.src = canvas.toDataURL();
  uiElements.flashcardSnippitPreview.style.display = 'block';
  uiElements.flashcardCreationOverlay.style.display = 'flex';

  uiElements.ocrProgressBar.style.display = 'flex';
  uiElements.ocrProgressText.textContent = '0%';

  try {
    const ocrText = await ocrImageFromCanvas(canvas, (percent) => {
      uiElements.ocrProgressText.textContent = `${percent}%`;
    });

    uiElements.ocrProgressBar.style.display = 'none'; // hide progress bar after done
    startCollectCardFront(newCard, ocrText);

  } catch (err) {
    uiElements.ocrProgressBar.style.display = 'none';
    console.error('OCR failed:', err);
    startCollectCardFront(newCard, '');
  }
}

export function showFlashcardCreationOverlay(imageSnippit) {
  const canvas = generateSnippitPreview(uiElements.viewedImg, imageSnippit);

  uiElements.flashcardSnippitPreview.src = canvas.toDataURL();
  uiElements.flashcardSnippitPreview.style.display = 'block';
  uiElements.flashcardCreationOverlay.style.display = 'flex';
}

export function startCollectCardFront(card, initialText = '') {
  uiElements.cardFrontInputStep.style.display = 'flex';
  uiElements.cardFrontInput.value = initialText;
  uiElements.cardFrontInput.focus();

  uiElements.saveDataBtn.textContent = 'Next';
  uiElements.saveDataBtn.onclick = () => {
    const term = uiElements.cardFrontInput.value.trim();
    if (!term) return alert('Please enter text for card front.');
    card.chinese = term;
    if (uiState.includePinyin) {
      startCollectPinYin(card);
    } else {
      startCollectCardRear(card);
    }
  };
}

export function startCollectPinYin(card) {
  uiElements.cardFrontInputStep.style.display = 'none';
  uiElements.cardPinyinStep.style.display = 'flex';
  uiElements.cardPinyinInput.focus();

  createPinyinKeyboard(); 

  uiElements.saveDataBtn.textContent = 'Next';
  uiElements.saveDataBtn.onclick = () => {
    const pinyin = uiElements.cardPinyinInput.value.trim();
    if (!pinyin) return alert('Please enter Pinyin.');
    card.pinyin = pinyin;

    startCollectCardRear(card);
  };
}

export function startCollectCardRear(card) {

  if (uiState.includePinyin) {
    uiState.pinyinInputMode = false;
    uiState.showingToneOptions = false;
    uiElements.cardPinyinStep.style.display = 'none';
  } else {
    card.pinyin = null;
  }

  uiElements.cardFrontInputStep.style.display = 'none';
  uiElements.cardRearInputStep.style.display = 'flex';
  uiElements.cardRearInput.focus();

  uiElements.saveDataBtn.textContent = 'Next';
  uiElements.saveDataBtn.onclick = () => {
    const term = uiElements.cardRearInput.value.trim();
    if (!term) return alert('Please enter text for card rear.');
    card.english = term;

    // Move to deck selection step
    startSelectDeckStep(card);
  };
}

export function startSelectDeckStep(card) {
  uiElements.cardRearInputStep.style.display = 'none';
  uiElements.flashcardSnippitPreview.style.display = 'none';
  uiElements.collectDeckStep.style.display = 'flex';

  getDecks().then((decks) => {
    renderDeckSelection(uiElements.flashcardDeckSelectionGUI, decks, (deckID, deckName) => {
      uiState.globalDeckID = deckID;
      uiState.globalDeckName = deckName;
      
      uiElements.deckInput.value = deckName;
    });

    uiElements.saveDataBtn.textContent = 'Next';
    uiElements.saveDataBtn.onclick = () => {
      if (uiElements.deckInput.value === '') {
        alert('Please select a deck.');
        return;
      }

      uiElements.collectDeckStep.style.display = 'none';
      uiElements.flashcardSnippitPreview.style.display = 'block';
      startReviewInputStep(card);
    };

    

  }).catch((err) => {
    console.error('Failed to load decks', err);
    alert('Could not load decks. Please try again later.');
    resetCardOverlay();
  });
  card.deckID = uiState.globalDeckID;
  card.deckName = uiState.globalDeckName;
}

export function startReviewInputStep(card) {
  uiElements.cardRearInputStep.style.display = 'none';
  uiElements.cardReviewInputStep.style.display = 'flex';

  uiElements.reviewCardFrontInput.textContent = card.chinese;
  uiElements.reviewCardRearInput.textContent = card.english;
  uiElements.reviewCardDeck.textContent = uiState.globalDeckName; // Allows lazy select of deck during card creation

  // Hide Pinyin Element if includePinyin setting = false;
  uiElements.reviewCardPinYin.textContent = card.pinyin;
  if (!uiState.includePinyin) {
    uiElements.reviewCardPinYin.style.display = 'none';
  } 
  uiElements.saveDataBtn.textContent = 'Save';
  uiElements.saveDataBtn.onclick = async () => {
    if (!card.deckID) {
      alert('Please select a deck to save the card.');
      return;
    }
    saveCardToDatabase(card);
    const cards = await fetchFlashcardsData(uiElements.viewedImg.src);
    displayFlashcardGhosts(cards);
    resetCardOverlay();
  };
}

export function resetCardOverlay() {
  uiElements.flashcardCreationOverlay.style.display = 'none';

  uiElements.cardFrontInput.value = '';
  uiElements.cardPinyinInput.value = '';
  uiElements.cardRearInput.value = '';
  uiElements.flashcardSnippitPreview.src = '';

  uiElements.cardFrontInputStep.style.display = 'flex';
  uiElements.cardRearInputStep.style.display = 'none';
  uiElements.collectDeckStep.style.display = 'none';
  uiElements.cardReviewInputStep.style.display = 'none';
  
  uiElements.reviewCardFrontInput.textContent = '';
  uiElements.reviewCardPinYin.textContent = '';
  uiElements.reviewCardRearInput.textContent = '';
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
