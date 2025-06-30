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


  // ==== Flashcard Creation Steps ====

  saveDataBtn: document.getElementById('saveDataBtn'), // Also functions as 'next'
  goBackOneStepBtn: document.getElementById('goBackOneStepBtn'),

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
  quizMeBtn: document.getElementById('quizMeBtn'),

  cropBox: null, // Created dynamically by applyCropBox(), see quizVisualHelpers.js

  quizUI: document.getElementById('quizOperationUI'),
  quizOperationFeedback: document.getElementById('quizOperationFeedback'),  
  quizOptionOne: document.getElementById('option-one'),
  quizOptionTwo: document.getElementById('option-two'),
  quizOptionThree: document.getElementById('option-three'),
  quizOptionFour: document.getElementById('option-four'),
  quizProgressCounter: document.getElementById('quizProgressCounter'),

  // ==== Settings Overlay ====
  
  settingsOverlay: document.getElementById('settingsOverlay'),
  exitSettingsBtn: document.getElementById('exitSettingsBtn'),
  togglePinyin: document.getElementById('togglePinyin'),
  toggleOCR: document.getElementById('toggleOCR'), 

  // ==== View Decks Overlay ====

  viewDecksOverlay: document.getElementById('viewDecksOverlay'),
  exitViewDecksBtn: document.getElementById('exitCreateDeckBtn'),
  chooseDeckToViewContainer: document.getElementById('chooseDeckToView-Container'),
  chooseDeckToViewGUI: document.getElementById('chooseDeckToViewGUI'),

  // ==== Flashcard Editor Controls ====
  
  flashcardEditor: document.getElementById('flashcardEditor'),
  flashcardSearchBar: document.getElementById('flashcardSearchBar'),
  filterAllBtn: document.getElementById('filterAllBtn'),
  filterHasPinyinBtn: document.getElementById('filterHasPinyinBtn'),
  filterNoPinyinBtn: document.getElementById('filterNoPinyinBtn'),
  filterRecentlyAddedBtn: document.getElementById('filterRecentlyAddedBtn'),
  flashcardListWrapper: document.getElementById('flashcardListWrapper'),

};

export default uiElements;
