// public/js/utils/collectCardDataMain.js

import uiState from "../../uiState.js";
import { createPinyinKeyboard } from './createPinYinKeyboard.js';
import { saveCardToDatabase } from '../../api/saveFlashcard.js';
import { getDecks } from '../../api/getDecks.js'
import { renderDeckSelection } from '../collectFlashcardData/renderSelectDeck.js'

// ==== COLLECT FLASH CARD DATA ====

export function collectCardData(selected_area) {
  const newCard = {
    selected_area,
    deckID: null,
    imgPath: uiState.viewedImg.src,
  };

  showCardOverlay(selected_area);
  startCollectChinese(newCard);
}

export function showCardOverlay(selected_area) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const { x, y, width, height } = selected_area;

  const targetShortSide = 100;
  const aspectRatio = (width / height).toFixed(3);
  let drawWidth, drawHeight;

  if (width < height) {
    drawWidth = targetShortSide;
    drawHeight = Math.round(targetShortSide / aspectRatio);
  } else {
    drawHeight = targetShortSide;
    drawWidth = Math.round(targetShortSide * aspectRatio);
  }

  canvas.width = drawWidth;
  canvas.height = drawHeight;

  ctx.drawImage(uiState.viewedImg, x, y, width, height, 0, 0, drawWidth, drawHeight);
  uiState.previewImg.src = canvas.toDataURL();
  uiState.previewImg.style.display = 'block';
  uiState.cardCollectionOverlay.style.display = 'flex';
}

export function startCollectChinese(card) {
  uiState.collectChineseStep.style.display = 'flex';
  uiState.chineseInput.focus();

  uiState.saveDataBtn.textContent = 'Next';
  uiState.saveDataBtn.onclick = () => {
    const term = uiState.chineseInput.value.trim();
    if (!term) return alert('Please enter Chinese word.');
    card.chinese = term;
    startCollectPinYin(card);
  };
}

export function startCollectPinYin(card) {
  uiState.collectChineseStep.style.display = 'none';
  uiState.collectPinYinStep.style.display = 'flex';
  uiState.pinyinInput.focus();

  createPinyinKeyboard(); // Assuming defined globally

  uiState.saveDataBtn.textContent = 'Next';
  uiState.saveDataBtn.onclick = () => {
    const pinyin = uiState.pinyinInput.value.trim();
    if (!pinyin) return alert('Please enter Pinyin.');
    card.pinyin = pinyin;

    startCollectEnglish(card);
  };
}

export function startCollectEnglish(card) {
  uiState.pinyinInputMode = false;

  uiState.collectPinYinStep.style.display = 'none';
  uiState.collectEnglishStep.style.display = 'flex';
  uiState.englishInput.focus();

  uiState.saveDataBtn.textContent = 'Next';
  uiState.saveDataBtn.onclick = () => {
    const english = uiState.englishInput.value.trim();
    if (!english) return alert('Please enter English meaning.');
    card.english = english;

    // Move to deck selection step
    startSelectDeck(card);
  };
}

export function startSelectDeck(card) {
  uiState.collectEnglishStep.style.display = 'none';
  uiState.previewImg.style.display = 'none';
  uiState.collectDeckStep.style.display = 'flex';

  getDecks().then((decks) => {
    console.log('got decks:', decks);

    renderDeckSelection(uiState.deckSelectionGUI, decks, (deckID, deckName) => {
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
      uiState.previewImg.style.display = 'block';
      startReviewStep(card);
    };

  }).catch((err) => {
    console.error('Failed to load decks', err);
    alert('Could not load decks. Please try again later.');
    resetCardOverlay();
  });
}

export function startReviewStep(card) {
  uiState.collectEnglishStep.style.display = 'none';
  uiState.reviewStep.style.display = 'flex';

  uiState.reviewCardChinese.textContent = card.chinese;
  uiState.reviewCardPinYin.textContent = card.pinyin;
  uiState.reviewCardEnglish.textContent = card.english;
  uiState.reviewCardDeck.textContent = card.deckName;

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
  uiState.cardCollectionOverlay.style.display = 'none';

  uiState.chineseInput.value = '';
  uiState.pinyinInput.value = '';
  uiState.englishInput.value = '';
  uiState.previewImg.src = '';

  uiState.reviewStep.style.display = 'none';
  uiState.reviewCardChinese.textContent = '';
  uiState.reviewCardPinYin.textContent = '';
  uiState.reviewCardEnglish.textContent = '';
}

