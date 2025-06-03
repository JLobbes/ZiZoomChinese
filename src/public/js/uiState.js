// public/js/uiState.js

const uiState = {
  
  // ==== Image Viewer Elements ====
  menu: document.getElementById('imageMenu'),

  viewedImgWrapper: document.getElementById('viewerWrapper'),
  viewedImg: document.getElementById('viewedImage'),
  viewerContainer: document.getElementById('viewerContainer'),

  // ==== Zoom & Pan Variables ====
  isDraggingImage: false,
  scale: null,
  dragStartX: null,
  dragStartY: null,
  offsetX: null,
  offsetY: null,

  // ==== Area Selection Variables & Elements ====
  exitCardDataCollectBtn: document.getElementById('exitOverlayBtn'),

  selectionModeEnabled: false,
  isDrawingSelection: false,
  selectionStartX: null,
  selectionStartY: null,

  selectAreaBtn: document.getElementById('selectAreaBtn'),
  selectionBox: null,
  selected_area: null,

  // ==== Card Data Collection Elements ====
  cardCollectionOverlay: document.getElementById('cardDataCollection-Overlay'),
  previewImg: document.getElementById('croppedPreview'),
  deckSelectionGUI: document.getElementById('deckSelectionGUI'),
  saveDataBtn: document.getElementById('saveDataBtn'),

  collectChineseStep: document.getElementById('collectChineseStep'),
  collectPinYinStep: document.getElementById('collectPinYinStep'),
  collectEnglishStep: document.getElementById('collectEnglishStep'),
  collectDeckStep: document.getElementById('collectDeckStep'),
  reviewStep: document.getElementById('reviewStep'),

  chineseInput: document.getElementById('chineseInput'),
  pinyinInput: document.getElementById('pinyinInput'),
  englishInput: document.getElementById('englishInput'),
  deckInput: document.getElementById('deckInput'),

  reviewCardDeck: document.getElementById('reviewCardDeck'),
  reviewCardChinese: document.getElementById('reviewCardChinese'),
  reviewCardPinYin: document.getElementById('reviewCardPinYin'),
  reviewCardEnglish: document.getElementById('reviewCardEnglish'),

  // ==== Pinyin Input Variables & Elements ====

  currentVowel: '',
  pinyinInputMode: false,
  showingToneOptions: false,

  pinyinKeyboard: document.getElementById('pinyinKeyboard'),

  // === Flashcard Ghosts and Data Elements ====

  infoDisplayContainer: document.getElementById('informationDisplay-Container'),
  flashcardData_Popup: document.getElementById('flashcardData-Popup'),
  cardDataPopup_Chinese: document.getElementById('cardData-Popup-Chinese'), 
  cardDataPopup_English: document.getElementById('cardData-Popup-English'), 
  cardDataPopup_Pinyin: document.getElementById('cardData-Popup-Pinyin'), 

  // === Quiz Mode Variable and Elements ====

  chooseDeckToQuizContainer: document.getElementById('chooseDeckToQuiz-Container'),
  chooseDeckToQuizGUI: document.getElementById('chooseDeckToQuizGUI'),
  deckToQuiz: null,
  deckToQuizInput: document.getElementById('deckToQuizInput'),
  quizMeBtn: document.getElementById('quitMeBtn'),

};

export default uiState;
