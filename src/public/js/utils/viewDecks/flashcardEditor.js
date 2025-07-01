// public/js/utils/viewDecks/flashcardEditor.js

import uiElements from '../../uiElements.js';
import { updateCardInDatabase } from '../../api/updateFlashcard.js';
import uiState from '../../uiState.js';

export function renderFlashcardList(flashcards, deckMap) {
  const {
    flashcardSearchBar,
    filterAllBtn,
    filterHasPinyinBtn,
    filterNoPinyinBtn,
    filterRecentlyAddedBtn,
    flashcardListWrapper
  } = uiElements;

  // Clear list
  flashcardListWrapper.innerHTML = '';

  // Render cards
  flashcards.forEach(card => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'flashcard-bubble-row';

    // Deck bubble
    const deckBubble = document.createElement('span');
    deckBubble.className = 'bubble deck-bubble';
    deckBubble.textContent = deckMap?.[card.DECK_ID]?.DECK_NAME || card.DECK_ID;
    cardDiv.appendChild(deckBubble);

    // --- Editable fields ---
    const frontBubble = document.createElement('span');
    frontBubble.className = 'bubble front-bubble';
    frontBubble.textContent = card.FLASHCARD_FRONT;

    const pinyinBubble = document.createElement('span');
    pinyinBubble.className = 'bubble pinyin-bubble';
    pinyinBubble.textContent = card.FLASHCARD_PINYIN || '';

    const rearBubble = document.createElement('span');
    rearBubble.className = 'bubble rear-bubble';
    rearBubble.textContent = card.FLASHCARD_REAR;

    // Only append pinyin if present
    cardDiv.appendChild(frontBubble);
    if (card.FLASHCARD_PINYIN) cardDiv.appendChild(pinyinBubble);
    cardDiv.appendChild(rearBubble);

    // Image icon bubble to show source 
    const imgBubble = document.createElement('img');
    imgBubble.className = 'bubble img-bubble';
    imgBubble.src = 'icons/show_source_screen_white.png';
    imgBubble.style.cursor = 'pointer';

    imgBubble.onmouseenter = () => {
      let preview = document.createElement('img');
      preview.src = getSnippitUrl(card);
      preview.className = 'snippit-preview-popup';
      imgBubble.appendChild(preview);
    };
    imgBubble.onmouseleave = () => {
      const preview = imgBubble.querySelector('.snippit-preview-popup');
      if (preview) preview.remove();
    };
    cardDiv.appendChild(imgBubble);

    // --- Edit button ---
    const editBtn = document.createElement('button');
    editBtn.textContent = '✎';
    editBtn.title = 'Edit';
    editBtn.className = 'flashcard-edit-btn';
    cardDiv.appendChild(editBtn);

    // --- Edit mode handler ---
    editBtn.onclick = () => {

      uiState.isEditingFlashcard = true;
      // Replace bubbles with inputs
      const frontInput = document.createElement('input');
      frontInput.type = 'text';
      frontInput.value = frontBubble.textContent;
      frontInput.className = 'bubble front-bubble';

      const pinyinInput = document.createElement('input');
      pinyinInput.type = 'text';
      pinyinInput.value = pinyinBubble.textContent;
      pinyinInput.className = 'bubble pinyin-bubble';

      const rearInput = document.createElement('input');
      rearInput.type = 'text';
      rearInput.value = rearBubble.textContent;
      rearInput.className = 'bubble rear-bubble';

      // Replace bubbles with inputs
      cardDiv.replaceChild(frontInput, frontBubble);
      if (card.FLASHCARD_PINYIN) cardDiv.replaceChild(pinyinInput, pinyinBubble);
      cardDiv.replaceChild(rearInput, rearBubble);

      // Hide edit button, show check button
      editBtn.style.display = 'none';

      // Save button
      const checkBtn = document.createElement('button');
      checkBtn.textContent = '✔';
      checkBtn.title = 'Save';
      checkBtn.className = 'flashcard-save-btn';
      cardDiv.appendChild(checkBtn);

      // Cancel button
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = '✖';
      cancelBtn.title = 'Cancel';
      cancelBtn.className = 'flashcard-cancel-btn';
      cardDiv.appendChild(cancelBtn);

      checkBtn.onclick = () => {
        card.FLASHCARD_FRONT = frontInput.value;
        card.FLASHCARD_PINYIN = pinyinInput.value;
        card.FLASHCARD_REAR = rearInput.value;
        updateCardInDatabase(card).then(() => {
          // Update bubbles with new values
          console.log('Card updated successfully:', card);
          frontBubble.textContent = card.FLASHCARD_FRONT;
          pinyinBubble.textContent = card.FLASHCARD_PINYIN || '';
          rearBubble.textContent = card.FLASHCARD_REAR;

          // Replace inputs with updated bubbles
          cardDiv.replaceChild(frontBubble, frontInput);
          if (card.FLASHCARD_PINYIN) cardDiv.replaceChild(pinyinBubble, pinyinInput);
          cardDiv.replaceChild(rearBubble, rearInput);

          // Remove check button, show edit button again
          checkBtn.remove();
          cancelBtn.remove();
          editBtn.style.display = '';
        });

        uiState.isEditingFlashcard = false;
      };
      cancelBtn.onclick = () => {
        uiState.isEditingFlashcard = false;
      };
    };

    flashcardListWrapper.appendChild(cardDiv);
  });

  // --- Search functionality ---
  flashcardSearchBar.oninput = () => {
    const val = flashcardSearchBar.value.trim().toLowerCase();
    Array.from(flashcardListWrapper.children).forEach(cardDiv => {
      const text = cardDiv.textContent.toLowerCase();
      cardDiv.style.display = fuzzyMatch(val, text) ? '' : 'none';
    });
  };

  // // --- Filter buttons (dummy logic, implement as needed) ---
  // filterAllBtn.onclick = () => renderFlashcardList(flashcards, deckMap);
  // filterHasPinyinBtn.onclick = () => {
  //   renderFlashcardList(flashcards.filter(c => c.FLASHCARD_PINYIN), deckMap);
  // };
  // filterNoPinyinBtn.onclick = () => {
  //   renderFlashcardList(flashcards.filter(c => !c.FLASHCARD_PINYIN), deckMap);
  // };
  // filterRecentlyAddedBtn.onclick = () => {
  //   // Example: show last 10
  //   renderFlashcardList(flashcards.slice(-10), deckMap);
  // };
}

// Helper to build snippit url
function getSnippitUrl(card) {
  return card.FLASHCARD_SOURCE_IMG_PATH;
}

function fuzzyMatch(needle, haystack) {
  needle = needle.toLowerCase();
  haystack = haystack.toLowerCase();
  let hIdx = 0;
  for (let nIdx = 0; nIdx < needle.length; nIdx++) {
    hIdx = haystack.indexOf(needle[nIdx], hIdx);
    if (hIdx === -1) return false;
    hIdx++;
  }
  return true;
}