// public/js/utils/viewDecks/flashcardEditor.js

import uiElements from '../../uiElements.js';
import { updateCardInDatabase } from '../../api/updateFlashcard.js';
import { deleteFlashcard } from '../../api/deleteFlashcard.js';
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
      const editContext = {
        cardDiv,
        frontBubble,
        pinyinBubble,
        rearBubble,
        editBtn,
        frontInput: null,
        pinyinInput: null,
        rearInput: null,
        checkBtn: null,
        cancelBtn: null,
        deleteBtn: null
      };

      // Create inputs and update context
      editContext.frontInput = document.createElement('input');
      editContext.frontInput.type = 'text';
      editContext.frontInput.value = frontBubble.textContent;
      editContext.frontInput.className = 'bubble front-bubble';

      editContext.pinyinInput = document.createElement('input');
      editContext.pinyinInput.type = 'text';
      editContext.pinyinInput.value = pinyinBubble.textContent;
      editContext.pinyinInput.className = 'bubble pinyin-bubble';

      editContext.rearInput = document.createElement('input');
      editContext.rearInput.type = 'text';
      editContext.rearInput.value = rearBubble.textContent;
      editContext.rearInput.className = 'bubble rear-bubble';

      // Replace bubbles with inputs
      cardDiv.replaceChild(editContext.frontInput, frontBubble);
      if (card.FLASHCARD_PINYIN) cardDiv.replaceChild(editContext.pinyinInput, pinyinBubble);
      cardDiv.replaceChild(editContext.rearInput, rearBubble);

      // Hide edit button, show check/cancel
      editBtn.style.display = 'none';

      editContext.checkBtn = document.createElement('button');
      editContext.checkBtn.textContent = '✔';
      editContext.checkBtn.title = 'Save';
      editContext.checkBtn.className = 'flashcard-save-btn';
      cardDiv.appendChild(editContext.checkBtn);

      editContext.cancelBtn = document.createElement('button');
      editContext.cancelBtn.textContent = '✖';
      editContext.cancelBtn.title = 'Cancel';
      editContext.cancelBtn.className = 'flashcard-cancel-btn';
      cardDiv.appendChild(editContext.cancelBtn);

      editContext.deleteBtn = document.createElement('button');
      editContext.deleteBtn.innerHTML = '🗑️'; // Unicode trashcan
      editContext.deleteBtn.title = 'Delete';
      editContext.deleteBtn.className = 'flashcard-delete-btn';
      cardDiv.appendChild(editContext.deleteBtn);

      editContext.checkBtn.onclick = () => {
        card.FLASHCARD_FRONT = editContext.frontInput.value;
        card.FLASHCARD_PINYIN = editContext.pinyinInput.value;
        card.FLASHCARD_REAR = editContext.rearInput.value;
        updateCardInDatabase(card).then(() => {
          exitEditFlashcardMode(card, editContext);
        });
        uiState.isEditingFlashcard = false;
      };
      editContext.cancelBtn.onclick = () => {
        exitEditFlashcardMode(card, editContext);
        uiState.isEditingFlashcard = false;
      };
      editContext.deleteBtn.onclick = async () => {
        if (confirm('Delete this flashcard?')) {
          try {
            await deleteFlashcard(card.FLASHCARD_ID);
            cardDiv.remove();
            uiState.isEditingFlashcard = false;
          } catch (e) {
            alert('Failed to delete flashcard.');
          }
        }
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

function exitEditFlashcardMode(card, editContext) {
  uiState.isEditingFlashcard = false;

  // Logic to exit edit mode, e.g. revert UI changes
  editContext.frontBubble.textContent = card.FLASHCARD_FRONT;
  editContext.pinyinBubble.textContent = card.FLASHCARD_PINYIN || '';
  editContext.rearBubble.textContent = card.FLASHCARD_REAR;

  // Replace inputs with updated bubbles
  editContext.cardDiv.replaceChild(editContext.frontBubble, editContext.frontInput);
  if (card.FLASHCARD_PINYIN) editContext.cardDiv.replaceChild(editContext.pinyinBubble, editContext.pinyinInput);
  editContext.cardDiv.replaceChild(editContext.rearBubble, editContext.rearInput);

  // Remove check & cancel buttons, show edit button again
  editContext.checkBtn.remove();
  editContext.cancelBtn.remove();
  editContext.deleteBtn.remove();
  editContext.editBtn.style.display = '';
  
  // This function can be expanded as needed
  console.log('Exiting edit mode for card:', card);
}