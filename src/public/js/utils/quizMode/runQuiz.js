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

  const shuffledCards = shuffleArray([...cards]); // randomize question order
  let currentIndex = 0;

  runQuizQuestion();

  function runQuizQuestion() {
    if (currentIndex >= shuffledCards.length) {
      return;
    }

    const currentCard = shuffledCards[currentIndex];
    const stages = ['FRONT', ...(uiState.includePinyin ? ['PINYIN'] : []), 'REAR'];
    let currentStage = 0;

    handlQuizCardVisual(currentCard);

    askQuestionStage();

    function askQuestionStage() {
      const field = stages[currentStage];
      const correctAnswer = currentCard[`FLASHCARD_${field}`];

      const choices = generateChoices(cards, field, correctAnswer, 4);

      renderChoices(choices, (selected) => {
        if (selected === correctAnswer) {
          showFeedbackMessage('Correct! ✅');
          currentStage++;
          if (currentStage < stages.length) {
            askQuestionStage();
          } else {
            currentIndex++;
            runQuizQuestion();
          }
        } else {
          showFeedbackMessage('❌ Try Again!');
          // Optional: handle penalties here
        }
      });
    }
  }
}

function renderChoices(choices, callback) {
  uiElements.quizUI.style.display = 'flex';

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
      // Enable buttons after click
      // buttons.forEach(b => b.disabled = false);
      callback(choice);
    };
    // btn.disabled = false;
  });
}
