// public/js/uiState.js

const uiState = {

  // ==== Zoom & Pan ====

  isDraggingImage: false,
  scale: null,
  dragStartX: null,
  dragStartY: null,
  offsetX: null,
  offsetY: null,

  // ==== Img Area Selection (Flashcard Snippit) ====

  selectionModeEnabled: false,
  isDrawingSelection: false,
  selectionStartX: null,
  selectionStartY: null,
  selectionBox: null,
  selected_area: null,

  // ==== Deck Selection (Global) ====

  globalDeckName: null,
  globalDeckID: null,

  // ==== Deck View State ====

  deckToView: null, 
  deckToViewName: null, 

  // ==== Pinyin Input State ====

  currentVowel: '',
  pinyinInputMode: false,
  showingToneOptions: false,

  // ==== Quiz State ====
  
  quizModeOn: false,
  quizPresenterMode: true, 

  deckToQuiz: null,
  quizRunning: false, // Indicates user has chosen deck & started quiz.
  userFillingInQuizBlank: false, // Indicates user is filling in a blank answer.
  
  questionCompletionTime: 0, // Time taken to complete the current question

  // ==== Settings (User Adjustable) ====

  includePinyin: true,
  trickyPinyin: true,
  fillInTheBlank: true,
  centerCropBoxHorizontally: false,
  enableOCR: true, 

  // ==== Flashcard Editing ====

  isEditingFlashcard: false,

};

export default uiState;
