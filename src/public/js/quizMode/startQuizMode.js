// src/public/js/quizMode/startQuizMode.js

import uiState from '../uiState.js';
import { getDecks } from '../api/getDecks.js';
import { renderDeckSelection } from '../utils/collectFlashcardData/renderSelectDeck.js';
import { getCardsByDeck } from '../api/getFlashcardsByDeck.js'; // You'll need to make this API endpoint
import { runQuiz } from './runQuiz.js'


export function startQuizMode() {
  // Step 1: Show overlay
  uiState.infoDisplayContainer.style.display = 'flex'; 
  requestAnimationFrame(() => {
    uiState.infoDisplayContainer.classList.add('show');
  });

  // Step 2: Show GUI to select Deck
  uiState.chooseDeckToQuizContainer.style.display = 'flex';

  getDecks().then(decks => {
    renderDeckSelection(uiState.chooseDeckToQuizGUI, decks, (deckID, deckName) => {
      uiState.deckToQuiz = deckID;
      uiState.deckToQuizInput.value = deckName;
    });
  }).catch(err => {
    console.error('Could not load decks for quiz', err);
    alert('Failed to load decks');
  });

  // Step 3: Hook up the Quiz button
  const quizMeBtn = document.getElementById('quizMeBtn');
  quizMeBtn.onclick = async () => {
    const deckID = uiState.deckToQuiz;
    if (!deckID) {
      alert('Please select a deck.');
      return;
    }

    try {
      const cards = await getCardsByDeck(deckID);
      if (!cards.length) {
        throw error('No flashcards found in this deck or its sub-decks.');
      }
      if (cards.length < 4) {
        throw error('Must have (4) or more cards to quiz. Please add more cards or choose another deck.');
      }

      console.log('Starting quiz with cards:', cards);
      closeSelectDeckMenu();
      runQuiz(cards); 

    } catch (err) {
      console.error('Failed to load cards for quiz', err);
      // alert('Something went wrong while loading flashcards.');
    }
  };
}

function closeSelectDeckMenu() {
  uiState.chooseDeckToQuizContainer.style.display = 'none';
}