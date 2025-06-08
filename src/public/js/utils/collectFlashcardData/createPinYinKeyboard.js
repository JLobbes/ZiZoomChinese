// public/js/utils/createPinYinKeyboard.js

import uiState from "../../uiState.js";

// ==== PinYin Input ====

const baseVowels = ['a', 'e', 'i', 'o', 'u', 'ü'];
const toneMapping = {
  'a': ['ā', 'á', 'ǎ', 'à', 'a'],
  'e': ['ē', 'é', 'ě', 'è', 'e'],
  'i': ['ī', 'í', 'ǐ', 'ì', 'i'],
  'o': ['ō', 'ó', 'ǒ', 'ò', 'o'],
  'u': ['ū', 'ú', 'ǔ', 'ù', 'u'],
  'ü': ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü']
};

export function createPinyinKeyboard() {
  uiState.pinyinKeyboard.innerHTML = '';
  uiState.showingToneOptions = false;
  uiState.pinyinInputMode = true;

  baseVowels.forEach(vowel => {
    const btn = document.createElement('button');
    btn.className = 'pinyin-key';
    btn.textContent = vowel;
    btn.onclick = () => showToneOptions(vowel);
    uiState.pinyinKeyboard.appendChild(btn);
  });
}

function showToneOptions(vowel) {
  uiState.pinyinKeyboard.innerHTML = '';
  uiState.currentVowel = vowel;
  uiState.showingToneOptions = true;

  toneMapping[vowel].slice(0, vowel === 'ü' ? 4 : 5).forEach((toneChar, index) => {
    const container = document.createElement('div');
    container.className = 'tone-container';

    const label = document.createElement('div');
    label.className = 'tone-label';
    label.textContent = index < 4 ? index + 1 : vowel;

    const btn = document.createElement('button');
    btn.className = 'tone-key';
    btn.textContent = toneChar;
    btn.onclick = () => insertTonedVowel(toneChar);

    container.appendChild(btn);
    container.appendChild(label);
    uiState.pinyinKeyboard.appendChild(container);
  });
}

function insertTonedVowel(toneChar) {
  const start = uiState.cardPinyinInput.selectionStart;
  const end = uiState.cardPinyinInput.selectionEnd;
  const currentValue = uiState.cardPinyinInput.value;

  uiState.cardPinyinInput.value = currentValue.slice(0, start) + toneChar + currentValue.slice(end);
  uiState.cardPinyinInput.setSelectionRange(start + 1, start + 1);
  uiState.cardPinyinInput.focus();

  createPinyinKeyboard();
}

export function handlePinyinKeydown(e) {
  if (uiState.showingToneOptions && uiState.currentVowel) {
    const keyAsInt = parseInt(e.key);
    if (keyAsInt >= 1 && keyAsInt <= 4) {
      e.preventDefault();
      insertTonedVowel(toneMapping[uiState.currentVowel][keyAsInt - 1]);
      return;
    }

    if (e.key.toLowerCase() === uiState.currentVowel) {
      e.preventDefault();
      insertTonedVowel(toneMapping[uiState.currentVowel][4]); // base vowel
      return;
    }
  }

  if (
    uiState.pinyinInputMode &&
    !uiState.showingToneOptions &&
    !e.ctrlKey &&
    !e.metaKey &&
    !e.altKey
  ) {
    const char = e.key.toLowerCase();
    if (['a', 'e', 'i', 'o', 'u', 'v'].includes(char)) {
      e.preventDefault();
      const vowel = char === 'v' ? 'ü' : char;
      showToneOptions(vowel);
    }
  }
}

