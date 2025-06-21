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

  // ==== Pinyin Input State ====

  currentVowel: '',
  pinyinInputMode: false,
  showingToneOptions: false,

  // ==== Quiz State ====
  
  quizModeOn: false,
  quizRunning: false, // Indicates user has chosen deck & started quiz.
  deckToQuiz: null,

  // ==== Settings (User Adjustable) ====

  includePinyin: true,
  centerCropBoxHorizontally: false,
  enableOCR: true, 

};

export default uiState;
