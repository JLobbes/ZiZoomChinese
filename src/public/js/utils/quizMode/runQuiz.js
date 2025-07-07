import uiState from "../../uiState.js";
import uiElements from "../../uiElements.js";
import { 
  shuffleArray, 
  generateChoices, 
  showFeedbackMessage 
} from "./quizUtils.js";
import {  handlQuizCardVisual } from "./quizVisualHelpers.js";

export function runQuiz(cards) {

  uiState.quizRunning = true;
  uiElements.infoDisplayContainer.classList.add('quizRunning');
  uiState.scale = 1;
  
  if (uiState.quizPresenterMode) {
    document.getElementById('options-container').classList.add('presenterMode');
    uiElements.infoDisplayContainer.classList.add('presenterMode');
  }

  // Show and initialize the counter
  uiElements.quizProgressCounter.style.display = 'block';
  updateQuizCounter(0, cards.length);

  const shuffledCards = shuffleArray([...cards]); // randomize question order
  let currentIndex = 0;

  runQuizQuestion();

  function runQuizQuestion() {
    uiState.questionCompletionTime = 0; // Reset for each question
    if (currentIndex >= shuffledCards.length) {
      uiElements.quizProgressCounter.style.display = 'none';
      return;
    }

    // Start timing for this question
    const questionStartTime = Date.now();

    updateQuizCounter(currentIndex, shuffledCards.length);

    const currentCard = shuffledCards[currentIndex];
    const stages = ['FRONT', ...(uiState.includePinyin ? ['PINYIN'] : []), 'REAR'];
    let currentStage = 0;

    handlQuizCardVisual(currentCard);

    askQuestionStage();

    function askQuestionStage() {
      const field = stages[currentStage];
      const correctAnswer = currentCard[`FLASHCARD_${field}`];

      // Show FRONT answer on PINYIN and REAR stages
      if (field === 'PINYIN' || field === 'REAR') {
        uiElements.quizFrontAnswer.style.display = 'block';
        uiElements.quizFrontAnswer.textContent = `${currentCard.FLASHCARD_FRONT}`;
      } else {
        uiElements.quizFrontAnswer.style.display = 'none';
        uiElements.quizFrontAnswer.textContent = '';
      }

      // Fill in the blank for FRONT if enabled
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
            // Out of strikes, advance
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

      const choices = generateChoices(cards, field, correctAnswer, 4);

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
          uiState.questionCompletionTime += 20; // Add 20 seconds penalty for incorrect attempt
        }
      });
    }
  }

  function completeQuestionAndContinue(questionStartTime, showPlus = false) {
    uiState.questionCompletionTime += (Date.now() - questionStartTime) / 1000;
    uiState.questionCompletionTime = Number(uiState.questionCompletionTime.toFixed(2));
    showFeedbackMessage(
      `⏱️ ${uiState.questionCompletionTime}${showPlus ? '+' : ''}s`,
      1000
    );
    currentIndex++;
    runQuizQuestion();
  }
}

function renderChoices(choices, callback) {
  uiElements.quizUI.style.display = 'flex';
  uiElements.multipleChoiceQuizContainer.style.display = 'flex';
  document.getElementById('options-container').style.display = 'flex'; // <-- Add this!
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

function updateQuizCounter(current, total) {
  // uiElements.quizProgressCounter.textContent = `Card ${current + 1} of ${total}`;
  uiElements.quizProgressCounter.textContent = `${current}`;
}

// Add this helper function:
const MAX_FILL_BLANK_STRIKES = 3;

function renderFillInBlank(correctAnswer, callback) {
  uiElements.quizUI.style.display = 'flex';
  document.getElementById('options-container').style.display = 'none';
  uiElements.fillQuizBlankContainer.style.display = 'flex';

  uiElements.fillQuizBlankInput.value = '';
  // uiElements.fillQuizBlankInput.focus();

  // Strike logic
  let strikesLeft = MAX_FILL_BLANK_STRIKES;
  const strikeCounterDiv = document.getElementById('fillBlankStrikeCounter');
  updateStrikeCounter();

  function updateStrikeCounter() {
    strikeCounterDiv.textContent = `${strikesLeft}`;
  }

  // Remove previous listeners
  uiElements.fillBlankGoBtn.onclick = null;
  uiElements.fillQuizBlankInput.onkeydown = null;

  function handleAttempt() {
    const userInput = uiElements.fillQuizBlankInput.value;
    if (userInput.trim() === correctAnswer.trim()) {
      callback(userInput); // Correct, handled in askQuestionStage
    } else {
      strikesLeft--;
      uiState.questionCompletionTime += 20; // Add 20 seconds penalty for incorrect attempt
      console.log("uiState.questionCompletionTime", uiState.questionCompletionTime);

      updateStrikeCounter();
      if (strikesLeft <= 0) {
        // Out of strikes, auto-advance
        showFeedbackMessage(`Out of strikes! :( The answer was: ${correctAnswer}`);
        callback(null); // Pass null to indicate failure
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