// public/js/quizMode/runQuiz.js

import uiState from "../uiState.js";
import { imageCoordsToPercent } from '../utils/coordinateConverter.js';
import { updateImageTransform } from "../utils/zoomOrPanImage.js";

export function runQuiz(cards) {

  uiState.quizRunning = true;
  uiState.infoDisplayContainer.classList.add('quizRunning');
  uiState.scale = 1;

  const shuffledCards = shuffleArray([...cards]); // randomize question order
  let currentIndex = 0;

  runQuizQuestion();

  function runQuizQuestion() {
    if (currentIndex >= shuffledCards.length) {
      // console.log('Quiz complete!');
      return;
    }

    const currentCard = shuffledCards[currentIndex];
    const stages = ['CHN', 'PINYIN', 'ENG'];
    let currentStage = 0;

    handlQuizCardVisual(currentCard);

    askQuestionStage();

    function askQuestionStage() {
      const field = stages[currentStage];
      const correctAnswer = currentCard[`FLASHCARD_${field}`];

      const choices = generateChoices(cards, field, correctAnswer, 4);

      // UI: render choices (stubbed)
      // console.log(`Question ${currentIndex + 1}, Stage: ${field}`);
      // console.log('Choices:', choices);
      // console.log('Correct Answer:', correctAnswer);

      renderChoices(choices, (selected) => {

        if (selected === correctAnswer) {
          // console.log(`Correct ${field}!`);
          currentStage++;
          if (currentStage < stages.length) {
            askQuestionStage();
          } else {
            currentIndex++;
            runQuizQuestion();
          }
        } else {
          // console.log(`Incorrect ${field}. Try again or handle penalty.`);
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

function handlQuizCardVisual(card) {
  const existingGhosts = uiState.viewedImgWrapper.querySelectorAll('.flashcardGhost');
  existingGhosts.forEach(ghost => ghost.remove());

  uiState.viewedImg.src = card.FLASHCARD_SOURCE_IMG_PATH;
  uiState.viewerContainer.style.display = 'flex';
  // uiState.scale = 1;
  uiState.offsetX = 0;
  uiState.offsetY = 0;

  // Wait for image to load
  uiState.viewedImg.onload = () => {
    applyCropBox(card);
    scaleAndFitImage(card);
  };
}

function renderChoices(choices, callback) {

  uiState.quizUI.style.display = 'flex';

  const buttons = [
    uiState.quizOptionOne,
    uiState.quizOptionTwo,
    uiState.quizOptionThree,
    uiState.quizOptionFour,
  ];
  // console.log('buttons:', buttons);

  // Fill each button and assign click handler
  buttons.forEach((btn, i) => {
    const choice = choices[i];
    btn.textContent = choice;
    btn.onclick = () => {
      // Disable buttons after click to prevent multiple answers
      buttons.forEach(b => b.disabled = false);
      // buttons.forEach(b => b.disabled = true);
      callback(choice);
    };
    btn.disabled = false;
  });
}


function applyCropBox(card) {
  // Remove existing crop box if any
  const oldBox = uiState.viewedImgWrapper.querySelector('.quizCropBox');
  if (oldBox) oldBox.remove();

  console.log('current card:', card);
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

function centerCropBoxWithPan(card) {
  const {
    FLASHCARD_CROP_X,
    FLASHCARD_CROP_Y,
    FLASHCARD_CROP_WIDTH,
    FLASHCARD_CROP_HEIGHT
  } = card;

  const imgNaturalWidth = uiState.viewedImg.naturalWidth;
  const imgNaturalHeight = uiState.viewedImg.naturalHeight;

  const imgWrapperRect = uiState.viewedImgWrapper.getBoundingClientRect();
  const imgWrapperHalfWidth = Math.round(imgWrapperRect.width / 2);
  const imgWrapperHalfHeight = Math.round(imgWrapperRect.height / 2);

  // --- Y-axis ---
  const cropBoxMidY = Math.round(FLASHCARD_CROP_Y + FLASHCARD_CROP_HEIGHT / 2);
  const adjMidY = Math.round((cropBoxMidY / imgNaturalHeight) * imgWrapperRect.height);
  const distYFromCenter = adjMidY - imgWrapperHalfHeight;
  const bufferOffset = 100; // px

  // --- X-axis ---
  const cropBoxMidX = Math.round(FLASHCARD_CROP_X + FLASHCARD_CROP_WIDTH / 2);
  const adjMidX = Math.round((cropBoxMidX / imgNaturalWidth) * imgWrapperRect.width);
  const distXFromCenter = adjMidX - imgWrapperHalfWidth;

  uiState.offsetY = -distYFromCenter -bufferOffset;
  uiState.offsetX = -distXFromCenter;

  updateImageTransform(true);
}

function scaleAndFitImage(card) {

  const { FLASHCARD_CROP_HEIGHT, FLASHCARD_CROP_WIDTH } = card;
  console.log('FLASHCARD_CROP_HEIGHT :', FLASHCARD_CROP_HEIGHT);
  const mainAxisLength = Math.min(FLASHCARD_CROP_HEIGHT, FLASHCARD_CROP_WIDTH);

  const imgNaturalHeight = uiState.viewedImg.naturalHeight;
  const imgWrapperHeight = uiState.viewedImgWrapper.getBoundingClientRect().height;
  const naturalHeightAdjustment = Math.round((imgWrapperHeight / imgNaturalHeight) * mainAxisLength);
  console.log('naturalHeightAdjustment :', naturalHeightAdjustment);

  const targetLength = 75; // px  
  const adjustmentRatio = (targetLength / naturalHeightAdjustment).toFixed(3);
  console.log('adjustmentRatio :', adjustmentRatio);

  uiState.scale = (uiState.scale * adjustmentRatio).toFixed(3);
  updateImageTransform(true);
  setTimeout(() => {
    centerCropBoxWithPan(card);
  }, 300)
}
