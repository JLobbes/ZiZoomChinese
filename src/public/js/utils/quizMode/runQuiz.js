import uiState from "../../uiState.js";
import uiElements from "../../uiElements.js";
import { 
  // shuffleArray, 
  generateChoices, 
  updateQuizCounter,
  getPerformanceAdaptiveStack
} from "./quizUtils.js";
import {  
  handlQuizCardVisual,
  showFeedbackMessage,
  closeDownQuizMode
} from "./quizVisualHelpers.js";
import { updateReviewDurationInDatabase } from "../../api/updateFlashcard.js";

export function runQuiz(cards) {
  uiState.quizRunning = true;
  uiElements.infoDisplayContainer.classList.add('quizRunning');
  uiState.scale = 1;

  if (uiState.quizPresenterMode) {
    document.getElementById('options-container').classList.add('presenterMode');
    uiElements.infoDisplayContainer.classList.add('presenterMode');
    uiElements.presenterNavButtons.style.display = 'flex';
  } else {
    uiElements.presenterNavButtons.style.display = 'none';
  }

  uiElements.quizProgressCounter.style.display = 'block';
  updateQuizCounter(0, cards.length);

  const shuffledCards = getPerformanceAdaptiveStack([...cards], 100);
  let currentIndex = 0;
  let stages = ['FRONT', ...(uiState.includePinyin ? ['PINYIN'] : []), 'REAR'];
  let currentStage = 0;

  // --- Memory for choices per card/stage ---
  // Structure: questionMemory[cardIndex][stageIndex] = { choices: [...], ... }
  const questionMemory = Array.from({ length: shuffledCards.length }, () =>
    Array.from({ length: stages.length }, () => ({}))
  );

  runQuizQuestion();

  function runQuizQuestion() {
    uiState.questionCompletionTime = 0;
    if (currentIndex >= shuffledCards.length) {
      uiElements.quizProgressCounter.style.display = 'none';
      closeDownQuizMode();
      return;
    }

    const questionStartTime = Date.now();
    updateQuizCounter(currentIndex, shuffledCards.length);

    const currentCard = shuffledCards[currentIndex];

    handlQuizCardVisual(currentCard);

    askQuestionStage();

    function askQuestionStage() {
      const field = stages[currentStage];
      const correctAnswer = currentCard[`FLASHCARD_${field}`];

      if (field === 'PINYIN' || field === 'REAR') {
        uiElements.quizFrontAnswer.style.display = 'block';
        uiElements.quizFrontAnswer.textContent = `${currentCard.FLASHCARD_FRONT}`;
      } else {
        uiElements.quizFrontAnswer.style.display = 'none';
        uiElements.quizFrontAnswer.textContent = '';
      }

      // --- Fill-in-blank memory not needed, but you could add it if you want ---
      if (field === 'FRONT' && uiState.fillInTheBlank) {
        renderFillInBlank(correctAnswer, (userInput) => {
          if (userInput && userInput.trim() === correctAnswer.trim()) {
            showFeedbackMessage('Correct! ✅');
            currentStage++;
            if (currentStage < stages.length) {
              askQuestionStage();
            } else {
              completeQuestionAndContinue(questionStartTime, true);
            }
          } else if (userInput === null) {
            currentStage++;
            if (currentStage < stages.length) {
              askQuestionStage();
            } else {
              completeQuestionAndContinue(questionStartTime);
            }
          } else {
            showFeedbackMessage('❌ Try Again!');
          }
        });
        return;
      }

      // --- Use memory for choices ---
      let memory = questionMemory[currentIndex][currentStage];
      if (!memory.choices) {
        memory.choices = generateChoices(cards, field, correctAnswer, 4);
      }
      const choices = memory.choices;

      renderChoices(choices, (selected) => {
        if (selected === correctAnswer) {
          showFeedbackMessage('Correct! ✅');
          currentStage++;
          if (currentStage < stages.length) {
            askQuestionStage();
          } else {
            completeQuestionAndContinue(questionStartTime);
          }
        } else {
          showFeedbackMessage('❌ Try Again!');
          uiState.questionCompletionTime += 20;
        }
      });
    }
  }

  function completeQuestionAndContinue(questionStartTime, showPlus = false) {

    if(uiState.performanceAdaptiveReview) {
      uiState.questionCompletionTime += (Date.now() - questionStartTime) / 1000;
      uiState.questionCompletionTime = Number(uiState.questionCompletionTime.toFixed(2));
      showFeedbackMessage(
        `⏱️ ${uiState.questionCompletionTime}${showPlus ? '+' : ''}s`,
        1000
      );
      pushNewFlashCardDuration(shuffledCards[currentIndex], uiState.questionCompletionTime);
    }
    currentIndex++;
    currentStage = 0; // Reset stage for next card
    runQuizQuestion();
  }

  // --- Presenter navigation ---
  if (uiState.quizPresenterMode) {
    uiElements.presenterBackBtn.onclick = () => {
      if (currentStage > 0) {
        currentStage--;
      } else if (currentIndex > 0) {
        currentIndex--;
        currentStage = stages.length - 1;
      }
      runQuizQuestion();
    };
    uiElements.presenterNextBtn.onclick = () => {
      if (currentStage < stages.length - 1) {
        currentStage++;
      } else if (currentIndex < shuffledCards.length - 1) {
        currentIndex++;
        currentStage = 0;
      }
      runQuizQuestion();
    };
  }
}

function pushNewFlashCardDuration(card, duration) {
  const newDurationInMilliseconds = duration * 1000; 
  const previousDuration = card.FLASHCARD_LAST_REVIEW_DURATION || 0;
  const alpha = 0.2; // recent value weight — increase to make it more responsive

  const exponentialMovingAverage = Math.floor(previousDuration * (1 - alpha) + newDurationInMilliseconds * alpha);

  console.log('Old Duration:', (previousDuration / 1000).toFixed(2), 'New Duration:', (exponentialMovingAverage / 1000).toFixed(2));

  card.FLASHCARD_LAST_REVIEW_DURATION = Number(exponentialMovingAverage.toFixed(2));

  updateReviewDurationInDatabase(card.FLASHCARD_ID, card.FLASHCARD_LAST_REVIEW_DURATION); // API call
}

function renderChoices(choices, callback) {
  uiElements.quizUI.style.display = 'flex';
  uiElements.multipleChoiceQuizContainer.style.display = 'flex';
  document.getElementById('options-container').style.display = 'flex';
  uiElements.fillQuizBlankContainer.style.display = 'none';

  const buttons = [
    uiElements.quizOptionOne,
    uiElements.quizOptionTwo,
    uiElements.quizOptionThree,
    uiElements.quizOptionFour,
  ];

  buttons.forEach((btn, i) => {
    const choice = choices[i];
    btn.textContent = choice;
    btn.onclick = () => {
      callback(choice);
    };
  });
}

const MAX_FILL_BLANK_STRIKES = 3;

function renderFillInBlank(correctAnswer, callback) {
  uiElements.quizUI.style.display = 'flex';
  document.getElementById('options-container').style.display = 'none';
  uiElements.fillQuizBlankContainer.style.display = 'flex';

  uiElements.fillQuizBlankInput.value = '';

  let strikesLeft = MAX_FILL_BLANK_STRIKES;
  const strikeCounterDiv = document.getElementById('fillBlankStrikeCounter');
  updateStrikeCounter();

  function updateStrikeCounter() {
    strikeCounterDiv.textContent = `${strikesLeft}`;
  }

  uiElements.fillBlankGoBtn.onclick = null;
  uiElements.fillQuizBlankInput.onkeydown = null;

  function handleAttempt() {
    const userInput = uiElements.fillQuizBlankInput.value;
    if (userInput.trim() === correctAnswer.trim()) {
      callback(userInput);
    } else {
      strikesLeft--;
      uiState.questionCompletionTime += 20;
      updateStrikeCounter();
      if (strikesLeft <= 0) {
        showFeedbackMessage(`Out of strikes! :( The answer was: ${correctAnswer}`);
        callback(null);
      } else {
        showFeedbackMessage('❌ Try Again!');
      }
    }
  }

  uiElements.fillBlankGoBtn.onclick = handleAttempt;
  uiElements.fillQuizBlankInput.onkeydown = (e) => {
    if (e.key === 'Enter') handleAttempt();
  };

  uiElements.fillQuizBlankInput.addEventListener('focus', () => {
    uiState.userFillingInQuizBlank = true;
  });

  uiElements.fillQuizBlankInput.addEventListener('blur', () => {
    uiState.userFillingInQuizBlank = false;
  });
}