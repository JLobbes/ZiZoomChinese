// public/js/utils/collectCard.js

import uiState from "../uiState.js";
import { createPinyinKeyboard } from './createPinYinKeyboard.js';
import { saveCardToDatabase } from '../api/saveFlashcard.js';

// ==== COLLECT FLASH CARD DATA ====

export function collectCardData(selected_area) {
  const newCard = {
    selected_area,
    deckID: 2,
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

function startCollectEnglish(card) {
  uiState.pinyinInputMode = false; // Still in global scope?

  uiState.collectPinYinStep.style.display = 'none';
  uiState.collectEnglishStep.style.display = 'flex';
  uiState.englishInput.focus();

  uiState.saveDataBtn.textContent = 'Next';
  uiState.saveDataBtn.onclick = () => {
    const english = uiState.englishInput.value.trim();
    if (!english) return alert('Please enter English meaning.');
    card.english = english;

    startReviewStep(card);
  };
}

function startReviewStep(card) {
  uiState.collectEnglishStep.style.display = 'none';
  uiState.reviewStep.style.display = 'flex';

  uiState.reviewCardChinese.textContent = card.chinese;
  uiState.reviewCardPinYin.textContent = card.pinyin;
  uiState.reviewCardEnglish.textContent = card.english;

  uiState.saveDataBtn.textContent = 'Save';
  uiState.saveDataBtn.onclick = () => {
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
