// public/js/utils/viewDecks/viewDecksOverlays.js

import uiState from '../../uiState.js';
import uiElements from '../../uiElements.js';
import { createDeck } from '../../api/createDeck.js'; 
import { getDecks } from '../../api/getDecks.js';
import { renderDeckSelection } from './renderSelectDeck.js';
import { getCardsByDeck } from '../../api/getFlashcardsByDeck.js';
import { renderFlashcardList } from './flashcardEditor.js';

let parentDeckId = null;

export function openViewDecksOverlay(parentId) {
  parentDeckId = parentId;

  // Step 1: Show overlay
  uiElements.viewDecksOverlay.style.display = 'flex';

  // Step 2: Show GUI to select Deck
  uiElements.chooseDeckToViewContainer.style.display = 'flex';

  getDecks().then(decks => {
    // Build deckMap for name lookup
    const deckMap = {};
    decks.forEach(d => deckMap[d.DECK_ID] = d);

    renderDeckSelection(uiElements.chooseDeckToViewGUI, decks, (deckID, deckName) => {
      uiState.deckToView = deckID;
      getCardsByDeck(deckID).then(flashcards => {
        renderFlashcardList(
          flashcards,
          deckMap
        );
      });
    });
  }).catch(err => {
    console.error('Could not load decks for quiz', err);
    alert('Failed to load decks');
  });
}

export function closeViewDecksOverlay() {
  uiElements.viewDecksOverlay.style.display = 'none';
  parentDeckId = null;
}

// uiElements.createDeckSubmitBtn.onclick = async () => {
//   const name = uiElements.newDeckNameInput.value.trim();
//   await createDeck(name, parentDeckId);
//   closeViewDecksOverlay();
//   renderMenu(); // <-- Add this line to refresh the menu
// };