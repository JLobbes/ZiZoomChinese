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

  ocrProgressBar: document.getElementById('ocrProgressBar'),
  ocrProgressText: document.getElementById('ocrProgressText'),

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
  flashcardDataPopup: document.getElementById('flashcardData-Popup'),
  cardDatapPopupFront: document.getElementById('cardDataPopupFront'),
  cardDataPopupRear: document.getElementById('cardDataPopupRear'),
  cardDataPopupPinyin: document.getElementById('cardDataPopupPinyin'),
  cardDataPopupPinyinRow: document.getElementById('cardDataPopupPinyinRow'),

  // ==== Quiz UI ====
  
  exitInformationDisplayBtn: document.getElementById('exitInformationDisplayBtn'),
  chooseDeckToQuizContainer: document.getElementById('chooseDeckToQuiz-Container'),
  chooseDeckToQuizGUI: document.getElementById('chooseDeckToQuizGUI'),
  deckToQuizInput: document.getElementById('deckToQuizInput'),
  quizMeBtn: document.getElementById('quizMeBtn'),

  cropBox: null, // Created dynamically by applyCropBox(), see quizVisualHelpers.js

  quizUI: document.getElementById('quizOperationUI'),
  quizOperationFeedback: document.getElementById('quizOperationFeedback'),  
  quizOptionOne: document.getElementById('option-one'),
  quizOptionTwo: document.getElementById('option-two'),
  quizOptionThree: document.getElementById('option-three'),
  quizOptionFour: document.getElementById('option-four'),

  // ==== Settings Overlay ====
  
  settingsOverlay: document.getElementById('settingsOverlay'),
  exitSettingsBtn: document.getElementById('exitSettingsBtn'),
  togglePinyin: document.getElementById('togglePinyin'),

  // ==== Create Deck Overlay ====

  createDeckOverlay: document.getElementById('createDeckOverlay'),
  exitCreateDeckBtn: document.getElementById('exitCreateDeckBtn'),
  createDeckSubmitBtn: document.getElementById('createDeckSubmitBtn'),
  newDeckNameInput: document.getElementById('newDeckNameInput'),

};

export default uiElements;
