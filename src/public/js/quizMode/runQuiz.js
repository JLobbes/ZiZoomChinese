// public/js/quizMode/runQuiz.js

import uiState from "../uiState.js";
import { imageCoordsToPercent } from '../utils/coordinateConverter.js';

export function runQuiz(cards) {
  const shuffledCards = shuffleArray([...cards]); // randomize question order
  let currentIndex = 0;

  // Start the first question
  prepareQuiz();

  function prepareQuiz() {
    if (currentIndex >= shuffledCards.length) {
      console.log('Quiz complete!');
      return;
    }

    const currentCard = shuffledCards[currentIndex];
    const stages = ['CHN', 'PINYIN', 'ENG'];
    let currentStage = 0;

    // Show image & apply crop box (stubbed)
    const existingGhosts = uiState.viewedImgWrapper.querySelectorAll('.flashcardGhost');
    existingGhosts.forEach(ghost => ghost.remove());  
    
    uiState.viewedImg.src = currentCard.FLASHCARD_SOURCE_IMG_PATH;
    uiState.viewerContainer.style.display = 'flex';
    uiState.scale = 1;
    uiState.offsetX = 0;
    uiState.offsetY = 0;

    applyCropBox(currentCard); // black out quiz word area (your implementation)

    askQuestionStage();

    function askQuestionStage() {
      const field = stages[currentStage];
      const correctAnswer = currentCard[`FLASHCARD_${field}`];

      const choices = generateChoices(cards, field, correctAnswer, 4);

      // UI: render choices (stubbed)
      console.log(`Question ${currentIndex + 1}, Stage: ${field}`);
      console.log('Choices:', choices);
      console.log('Correct Answer:', correctAnswer);

      renderChoices(choices, (selected) => {

        if (selected === correctAnswer) {
          console.log(`Correct ${field}!`);
          currentStage++;
          if (currentStage < stages.length) {
            askQuestionStage();
          } else {
            currentIndex++;
            nextStepInQuiz();
          }
        } else {
          console.log(`Incorrect ${field}. Try again or handle penalty.`);
          // Optional: handle penalties or feedback here
        }
      });
    }
  }
}

// ---- Helper Functions ----

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function generateChoices(allCards, fieldKey, correctValue, count) {
  const pool = allCards
    .map(c => c[`FLASHCARD_${fieldKey}`])
    .filter(v => v && v !== correctValue);

  const shuffledPool = shuffleArray(pool);
  const choices = [...shuffledPool.slice(0, count - 1), correctValue];
  return shuffleArray(choices); // shuffle so correct isn't always last
}

function renderChoices(choices, callback) {

  uiState.quizUI.style.display = 'flex';

  const buttons = [
    uiState.quizOptionOne,
    uiState.quizOptionTwo,
    uiState.quizOptionThree,
    uiState.quizOptionFour,
  ];
  console.log('buttons:', buttons);

  // Fill each button and assign click handler
  buttons.forEach((btn, i) => {
    const choice = choices[i];
    btn.textContent = choice;
    btn.onclick = () => {
      // Disable buttons after click to prevent multiple answers
      buttons.forEach(b => b.disabled = true);
      callback(choice);
    };
    btn.disabled = false;
  });
}


function applyCropBox(card) {
  // Remove existing crop box if any
  const oldBox = uiState.viewedImgWrapper.querySelector('.quizCropBox');
  if (oldBox) oldBox.remove();

  const { FLASHCARD_CROP_X, FLASHCARD_CROP_Y, FLASHCARD_CROP_WIDTH, FLASHCARD_CROP_HEIGHT } = card;

  const cropBox = document.createElement('div');
  cropBox.className = 'quizCropBox';

  const percentBox = imageCoordsToPercent(
    FLASHCARD_CROP_X,
    FLASHCARD_CROP_Y,
    FLASHCARD_CROP_WIDTH,
    FLASHCARD_CROP_HEIGHT
  );

  cropBox.style.left = `${percentBox.left}%`;
  cropBox.style.top = `${percentBox.top}%`;
  cropBox.style.width = `${percentBox.width}%`;
  cropBox.style.height = `${percentBox.height}%`;

  uiState.viewedImgWrapper.appendChild(cropBox);
}
