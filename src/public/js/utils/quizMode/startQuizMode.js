// src/public/js/quizMode/startQuizMode.js

import uiState from '../../uiState.js';
import uiElements from '../../uiElements.js';
import { getDecks } from '../../api/getDecks.js';
import { renderDeckSelection } from '../collectFlashcardData/renderSelectDeck.js';
import { getCardsByDeck } from '../../api/getFlashcardsByDeck.js'; // You'll need to make this API endpoint
import { runQuiz } from './runQuiz.js';
import { hideFlashcardOverlay } from '../displayFlashcardGhosts.js';


export function startQuizMode() {
  uiState.quizModeOn = true;

  // Step 0: Clear Image Viewer
  uiElements.viewedImg.src = '';
  hideFlashcardOverlay();

  // Step 1: Show overlay
  uiElements.infoDisplayContainer.style.display = 'flex'; 
  requestAnimationFrame(() => {
    uiElements.infoDisplayContainer.classList.add('show');
  });

  // Step 2: Show GUI to select Deck
  uiElements.chooseDeckToQuizContainer.style.display = 'flex';

  getDecks().then(decks => {
    renderDeckSelection(uiElements.chooseDeckToQuizGUI, decks, (deckID, deckName) => {
      uiState.deckToQuiz = deckID;
      uiElements.deckToQuizInput.value = deckName;
    });
  }).catch(err => {
    console.error('Could not load decks for quiz', err);
    alert('Failed to load decks');
  });

  // Step 3: Hook up the Quiz button
  uiElements.quizMeBtn.onclick = () => transitionToRunQuiz();
}

async function transitionToRunQuiz() {

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

    closeSelectDeckMenu();
    runQuiz(cards); 

  } catch (err) {
    console.error('Failed to load cards for quiz', err);
  }
};

function closeSelectDeckMenu() {
  uiElements.chooseDeckToQuizContainer.style.display = 'none';
}