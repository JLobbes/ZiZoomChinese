// public/js/uiElements.js

const uiElements = {

  // ==== Image Viewer Elements ====

  menu: document.getElementById('imageMenu'),
  viewedImgWrapper: document.getElementById('viewerWrapper'),
  viewedImg: document.getElementById('viewedImage'),
  viewerContainer: document.getElementById('viewerContainer'),

  // ==== Area Selection Elements ====

  exitFlashcardCreationBtn: document.getElementById('exitFlashcardCreationBtn'),
  makeFlashcardBtn: document.getElementById('makeFlashcardBtn'),
  flashcardCreationOverlay: document.getElementById('flashcardCreationOverlay'),
  flashcardSnippitPreview: document.getElementById('flashcardSnippitPreview'),
  flashcardDeckSelectionGUI: document.getElementById('flashcardDeckSelectionGUI'),

  saveDataBtn: document.getElementById('saveDataBtn'),

  // ==== Flashcard Creation Steps ====

  cardFrontInputStep: document.getElementById('cardFrontInputStep'),
  cardPinyinStep: document.getElementById('cardPinyinStep'),
  cardRearInputStep: document.getElementById('cardRearInputStep'),
  collectDeckStep: document.getElementById('collectDeckStep'),
  cardReviewInputStep: document.getElementById('cardReviewInputStep'),

  cardFrontInput: document.getElementById('cardFrontInput'),
  cardPinyinInput: document.getElementById('cardPinyinInput'),
  cardRearInput: document.getElementById('cardRearInput'),
  deckInput: document.getElementById('deckInput'),

  reviewCardDeck: document.getElementById('reviewCardDeck'),
  reviewCardFrontInput: document.getElementById('reviewCardFrontInput'),
  reviewCardPinYin: document.getElementById('reviewCardPinYin'),
  reviewCardRearInput: document.getElementById('reviewCardRearInput'),

  pinyinKeyboard: document.getElementById('pinyinKeyboard'),

  // ==== Flashcard Ghosts and Info Display ====

  infoDisplayContainer: document.getElementById('informationDisplay-Container'),
  flashcardData_Popup: document.getElementById('flashcardData-Popup'),
  cardDataPopup_Chinese: document.getElementById('cardData-Popup-Chinese'),
  cardDataPopup_English: document.getElementById('cardData-Popup-English'),
  cardDataPopup_Pinyin: document.getElementById('cardData-Popup-Pinyin'),
  cardDataPinyinTableRow: document.getElementById('cardDataPinyinTableRow'),

  // ==== Quiz UI ====
  
  chooseDeckToQuizContainer: document.getElementById('chooseDeckToQuiz-Container'),
  chooseDeckToQuizGUI: document.getElementById('chooseDeckToQuizGUI'),
  deckToQuizInput: document.getElementById('deckToQuizInput'),
  quizMeBtn: document.getElementById('quitMeBtn'),

  quizUI: document.getElementById('quizOperationUI'),
  quizOptionOne: document.getElementById('option-one'),
  quizOptionTwo: document.getElementById('option-two'),
  quizOptionThree: document.getElementById('option-three'),
  quizOptionFour: document.getElementById('option-four'),
};

export default uiElements;
