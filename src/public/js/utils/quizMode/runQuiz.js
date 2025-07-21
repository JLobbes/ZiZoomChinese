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
    uiElements.quizOptionsContainer.classList.add('presenterMode');
    uiElements.quizProgressCounter.classList.add('presenterMode');
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

  // --- Reset Question Button ---
  const resetBtn = document.getElementById('resetQuestionBtn');
  if (resetBtn) {
    resetBtn.onclick = () => {
      uiState.questionCompletionTime = 0;
      showFeedbackMessage('⏱️ Timer reset!');
      // Optionally, you could also reset input fields or UI here if needed
    };
  }

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

  function completeQuestionAndContinue(questionStartTime) {

    if(uiState.performanceAdaptiveReview) {
      const newCompletionTime = (Date.now() - questionStartTime) / 1000;
        showFeedbackMessage(
          `⏱️ ${newCompletionTime}s`,
        );
      uiState.questionCompletionTime += newCompletionTime;
      uiState.questionCompletionTime = Number(uiState.questionCompletionTime.toFixed(2));
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

function pushNewFlashCardDuration(card, newDuration) {
  const newDurationInMilliseconds = newDuration * 1000; 
  const previousDuration = card.FLASHCARD_LAST_REVIEW_DURATION || 0;

  const alpha = 0.2; // recent value weight — increase to make it more responsive

  const exponentialMovingAverage = Math.floor(previousDuration * (1 - alpha) + newDurationInMilliseconds * alpha);
  displayImprovementFeedback(previousDuration, exponentialMovingAverage); // Shows progression or regression

  console.log('Old Duration:', (previousDuration / 1000).toFixed(2), 'New Duration:', (exponentialMovingAverage / 1000).toFixed(2));

  card.FLASHCARD_LAST_REVIEW_DURATION = Number(exponentialMovingAverage.toFixed(2));

  updateReviewDurationInDatabase(card.FLASHCARD_ID, card.FLASHCARD_LAST_REVIEW_DURATION); // API call
}


function displayImprovementFeedback(previousDuration, latestCompletionTime) {
  let improvementMessage = '';
  let improvementSVG = null;

  if (previousDuration > 0) {
    const improvement = ((previousDuration - latestCompletionTime) / previousDuration) * 100;
    console.log('Improvement:', improvement.toFixed(2), '%');
    if (improvement > 0) {
      improvementSVG = `<span style='display: inline-flex; align-items: center; gap: 0.4em;'><svg viewBox='0 0 64 64' fill='#ffffff' style='width: 1.2em; height: 1.2em; vertical-align: middle;'><g stroke-width='0'></g><g stroke-linecap='round' stroke-linejoin='round'></g><g> <g fill='none' fill-rule='evenodd'> <rect width='10' height='23' x='15' y='33' fill='#4ccd4e' rx='3'></rect> <rect width='10' height='30' x='28' y='26' fill='#2ba522' rx='3'></rect> <rect width='10' height='37' x='41' y='19' fill='#036316' rx='3'></rect> <path stroke='#ffffff' stroke-linecap='round' stroke-width='2' d='M10.4868562,28.2544738 C10.4868562,28.2544738 29.9645832,22.8690471 40.558199,9.75941372'></path> <polygon fill='#ffffff' points='43.132 1.632 49.132 12.632 37.132 12.632' transform='rotate(45 43.132 7.132)'></polygon> <rect width='57' height='3' x='3' y='58' fill='#ffffff'></rect> </g> </g></svg> <span>-${Math.abs(improvement.toFixed(1))}%</span></span>`;
      improvementMessage = '';
    } else {
      improvementSVG =  `<span style='display: inline-flex; align-items: center; gap: 0.4em;'><svg viewBox='0 0 64 64' fill='#ffffff' style='width: 1.2em; height: 1.2em; vertical-align: middle;'><g stroke-width='0'></g><g stroke-linecap='round' stroke-linejoin='round'></g><g> <g fill='none' fill-rule='evenodd'> <rect width='10' height='23' x='15' y='33' fill='#c34141' rx='3'></rect> <rect width='10' height='30' x='28' y='26' fill='#d2606b' rx='3'></rect> <rect width='10' height='37' x='41' y='19' fill='#ebadb7' rx='3'></rect> <path stroke='#ffffff' stroke-linecap='round' stroke-width='2' d='M10.4868562,28.2544738 C10.4868562,28.2544738 29.9645832,22.8690471 40.558199,9.75941372'></path> <polygon fill='#ffffff' points='43.132 1.632 49.132 12.632 37.132 12.632' transform='rotate(45 43.132 7.132)'></polygon> <rect width='57' height='3' x='3' y='58' fill='#ffffff'></rect> </g> </g></svg> <span>+${Math.abs(improvement.toFixed(1))}%</span></span>`;
      improvementMessage = ``;
    }
  }

  if (improvementSVG) {
    showFeedbackMessage('', 2000, improvementSVG);
  } else if (improvementMessage) {
    showFeedbackMessage(improvementMessage, 2000);
  }
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