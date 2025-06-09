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

  // ==== Pinyin Input State ====

  currentVowel: '',
  pinyinInputMode: false,
  showingToneOptions: false,

  // ==== Quiz State ====
  
  quizRunning: false,
  deckToQuiz: null,

  // ==== Settings (User Adjustable) ====

  includePinyin: false, 
  centerCropBoxHorizontally: false,

};

export default uiState;
