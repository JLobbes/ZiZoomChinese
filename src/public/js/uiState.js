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
  saveDataBtn: document.getElementById('saveDataBtn'),

  collectChineseStep: document.getElementById('collectChineseStep'),
  collectPinYinStep: document.getElementById('collectPinYinStep'),
  collectEnglishStep: document.getElementById('collectEnglishStep'),
  reviewStep: document.getElementById('reviewStep'),

  chineseInput: document.getElementById('chineseInput'),
  pinyinInput: document.getElementById('pinyinInput'),
  englishInput: document.getElementById('englishInput'),

  reviewCardChinese: document.getElementById('reviewCardChinese'),
  reviewCardPinYin: document.getElementById('reviewCardPinYin'),
  reviewCardEnglish: document.getElementById('reviewCardEnglish'),

  // ==== Pinyin Input Variables & Elements ====

  currentVowel: '',
  pinyinInputMode: false,
  showingToneOptions: false,

  pinyinKeyboard: document.getElementById('pinyinKeyboard'),


};

export default uiState;
