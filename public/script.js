const imgContainer = document.getElementById('viewerContainer');
const img = document.getElementById('viewer');
const selectAreaBtn = document.getElementById('selectAreaBtn');

let isDraggingImage = false;
let isDrawingSelection = false;
let selectionModeEnabled = false;

let scale = 1;
let offsetX = 0, offsetY = 0;
let dragStartX, dragStartY;
let selectionStartX, selectionStartY;
let selectionBox;

// ==== ZOOM & PAN via Keyboard ====

document.addEventListener('keydown', e => {
  const overlayVisible = document.getElementById('cardDataCollection-Overlay').style.display === 'flex';
  if (selectionModeEnabled || overlayVisible) return;

  const moveStep = 200;
  let animate = false;

  switch (e.key) {
    case '+':
    case '=':
      if (e.shiftKey) scale = Math.min(scale + 0.5, 5);
      break;
    case '-':
    case '_':
      if (e.shiftKey) scale = Math.max(scale - 0.5, 0.5);
      break;
    case 'ArrowLeft':
      offsetX += moveStep; animate = true; break;
    case 'ArrowRight':
      offsetX -= moveStep; animate = true; break;
    case 'ArrowUp':
      offsetY += moveStep; animate = true; break;
    case 'ArrowDown':
      offsetY -= moveStep; animate = true; break;
    default:
      return;
  }

  updateImageTransform(animate);
});

function updateImageTransform(smooth = false) {
  const wrapper = document.getElementById('viewerWrapper');
  wrapper.style.transition = smooth ? 'transform 0.3s ease' : '';
  wrapper.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}


// ==== IMAGE DRAGGING ====

function onImageMouseDown(e) {
  if (selectionModeEnabled) return;  // Disable dragging in selection mode

  isDraggingImage = true;
  dragStartX = e.clientX - offsetX;
  dragStartY = e.clientY - offsetY;
  img.style.cursor = 'grabbing';
  e.preventDefault();
}

function onMouseMove(e) {
  if (isDraggingImage) {
    offsetX = e.clientX - dragStartX;
    offsetY = e.clientY - dragStartY;
    updateImageTransform();
  }

  if (isDrawingSelection && selectionBox) {
    drawSelectionBox(e);
  }
}

function onMouseUp(e) {
  isDraggingImage = false;
  img.style.cursor = 'grab';

  if (isDrawingSelection) {
    finalizeSelection(e);
  }

  // Set interval to continuously update image transform
  const transformInterval = setInterval(() => {
    updateImageTransform();
  }, 1);

  // Set timeout to clear the interval after 500ms
  setTimeout(() => {
    clearInterval(transformInterval);  // Clear the interval after 500ms
    updateImageTransform();  // Ensure the final transform is applied smoothly
  }, 500);
}

// ==== IMAGE SECTION SELECTION (FOR FLASHCARD)  ====

function enableSelectionMode() {
  if (selectionModeEnabled) return;
  if (!img.src) return alert("Please load an image first.");

  selectionModeEnabled = true;
  img.style.cursor = 'crosshair';

  img.addEventListener('mousedown', startSelection);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  selectAreaBtn.style.backgroundColor = 'black'; 
  selectAreaBtn.style.color = 'white'; 
}

function startSelection(e) {
  if (!selectionModeEnabled) return;

  isDrawingSelection = true;
  const { x, y } = getImageCoords(e.clientX, e.clientY);
  selectionStartX = x;
  selectionStartY = y;

  // Create selection box overlay
  selectionBox = document.createElement('div');
  selectionBox.style.position = 'absolute';
  selectionBox.style.border = '2px dashed #ff00ff';
  selectionBox.style.background = 'rgba(255, 0, 255, 0.2)';
  selectionBox.style.pointerEvents = 'none';
  selectionBox.style.zIndex = '9999';
  imgContainer.appendChild(selectionBox);
}

function drawSelectionBox(e) {
  const { x, y } = getImageCoords(e.clientX, e.clientY);
  const rect = img.getBoundingClientRect();

  const naturalWidth = img.naturalWidth;
  const naturalHeight = img.naturalHeight;

  const width = Math.abs(x - selectionStartX);
  const height = Math.abs(y - selectionStartY);
  const left = Math.min(x, selectionStartX);
  const top = Math.min(y, selectionStartY);

  const containerRect = imgContainer.getBoundingClientRect();
  const imageLeftOffset = rect.left - containerRect.left;
  const imageTopOffset = rect.top - containerRect.top;

  selectionBox.style.left = `${(left / naturalWidth) * rect.width + imageLeftOffset}px`;
  selectionBox.style.top = `${(top / naturalHeight) * rect.height + imageTopOffset}px`;

  selectionBox.style.width = `${(width / naturalWidth) * rect.width}px`;
  selectionBox.style.height = `${(height / naturalHeight) * rect.height}px`;
}

function finalizeSelection(e) {
  isDrawingSelection = false;
  selectionModeEnabled = false;
  img.style.cursor = 'grab';

  const { x: endX, y: endY } = getImageCoords(e.clientX, e.clientY);

  const box = {
    x: Math.min(selectionStartX, endX),
    y: Math.min(selectionStartY, endY),
    width: Math.abs(endX - selectionStartX),
    height: Math.abs(endY - selectionStartY),
  };

  // Remove the selection box after 2 seconds (ensure this happens only once)
  if (selectionBox) {
    setTimeout(() => {
      if (selectionBox) {
        selectionBox.remove();
        selectionBox = null;  // Reset the reference to prevent future issues
      }
    }, 2000);
  }

  selectAreaBtn.style.backgroundColor = ''; 
  selectAreaBtn.style.color = ''; 
  collectCardData(box);
}

// ==== IMAGE ADD ONS (FLASHCARD GHOSTS) ====

function displayFlashCardGhosts(cards) {
  const imgContainer = document.getElementById('viewerContainer');
  const existingGhosts = imgContainer.querySelectorAll('.flashCardGhost');
  existingGhosts.forEach(ghost => ghost.remove());

  cards.forEach(card => {
    const { FLASHCARD_CROP_X, FLASHCARD_CROP_Y, FLASHCARD_CROP_WIDTH, FLASHCARD_CROP_HEIGHT } = card;

    const ghost = document.createElement('div');
    ghost.className = 'flashCardGhost';
    ghost.style.position = 'absolute';
    ghost.style.border = '2px dashed #ff00ff';
    ghost.style.background = 'rgba(255, 0, 255, 0.3)';
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '9999';

    ghost.style.transition = 'all 0.3s ease';  // Apply smooth transition to ghosts
    ghost.style.left = `${(FLASHCARD_CROP_X / img.naturalWidth) * imgContainer.offsetWidth}px`;
    ghost.style.top = `${(FLASHCARD_CROP_Y / img.naturalHeight) * imgContainer.offsetHeight}px`;
    ghost.style.width = `${(FLASHCARD_CROP_WIDTH / img.naturalWidth) * imgContainer.offsetWidth}px`;
    ghost.style.height = `${(FLASHCARD_CROP_HEIGHT / img.naturalHeight) * imgContainer.offsetHeight}px`;

    // Store card data as JSON string
    ghost.dataset.card = JSON.stringify({
      x: FLASHCARD_CROP_X,
      y: FLASHCARD_CROP_Y,
      width: FLASHCARD_CROP_WIDTH,
      height: FLASHCARD_CROP_HEIGHT
    });

    imgContainer.appendChild(ghost);
  });
}

function updateFlashCardGhosts() {
  const ghosts = imgContainer.querySelectorAll('.flashCardGhost');
  const rect = img.getBoundingClientRect();  // <- Real on-screen size and position

  ghosts.forEach(ghost => {
    const card = JSON.parse(ghost.dataset.card);

    const left = (card.x / img.naturalWidth) * rect.width + rect.left - imgContainer.getBoundingClientRect().left;
    const top = (card.y / img.naturalHeight) * rect.height + rect.top - imgContainer.getBoundingClientRect().top;
    const width = (card.width / img.naturalWidth) * rect.width;
    const height = (card.height / img.naturalHeight) * rect.height;

    ghost.style.left = `${left}px`;
    ghost.style.top = `${top}px`;
    ghost.style.width = `${width}px`;
    ghost.style.height = `${height}px`;
  });
}

function updateImageTransform(smooth = false) {
  img.style.transition = smooth ? 'transform 0.3s ease' : '';
  img.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;

  // 🧠 Step 1: force a reflow to ensure layout is accurate
  void img.offsetWidth;

  // 🧠 Step 2: delay just enough for animation to visually complete before syncing overlays
  setTimeout(() => {
    updateFlashCardGhosts();
  }, smooth ? 350 : 0); // only delay if it's a smooth animation

  // Original, no frills
  updateFlashCardGhosts();
}


// ==== UTILITY ====

function getImageCoords(clientX, clientY) {
  const rect = img.getBoundingClientRect();
  const scaleX = img.naturalWidth / rect.width;
  const scaleY = img.naturalHeight / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

// ==== COLLECT FLASH CARD DATA ====

function collectCardData(croppedImageLocation) {
  const newCard = { croppedImageLocation };
  
  // Set early variables
  newCard.deckID = 2;
  newCard.imgPath = img.src;

  showCardOverlay(croppedImageLocation);
  startCollectChinese(newCard);
}

function showCardOverlay(croppedImageLocation) {
  const previewImg = document.getElementById('croppedPreview');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const { x, y, width, height } = croppedImageLocation;

  const targetShortSide = 100;
  const aspectRatio = (width / height).toFixed(3);
  let drawWidth, drawHeight;

  if (width < height) {
    drawWidth = targetShortSide;
    drawHeight = Math.round(targetShortSide / aspectRatio);
  } else {
    drawHeight = targetShortSide;
    drawWidth = Math.round(targetShortSide * aspectRatio);
  }

  canvas.width = drawWidth;
  canvas.height = drawHeight;

  ctx.drawImage(img, x, y, width, height, 0, 0, drawWidth, drawHeight);

  previewImg.src = canvas.toDataURL();
  previewImg.style.display = 'block';

  document.getElementById('cardDataCollection-Overlay').style.display = 'flex';
}

function startCollectChinese(card) {
  const collectChineseStep = document.getElementById('collectChineseStep');
  const chineseInput = document.getElementById('chineseInput');
  const btn = document.getElementById('saveDataBtn');

  collectChineseStep.style.display = 'flex';
  chineseInput.focus();

  btn.textContent = 'Next';
  btn.onclick = () => {
    const term = chineseInput.value.trim();
    if (!term) return alert('Please enter Chinese word.');
    card.chinese = term;
    startCollectPinYin(card); // Continue to PinYin collection
  };
}

function startCollectPinYin(card) {
  const collectChineseStep = document.getElementById('collectChineseStep');
  const collectPinYinStep = document.getElementById('collectPinYinStep');
  const pinyinInput = document.getElementById('pinyinInput');
  const btn = document.getElementById('saveDataBtn');

  collectChineseStep.style.display = 'none';
  collectPinYinStep.style.display = 'flex';
  pinyinInput.focus();
  createPinyinKeyboard();

  btn.textContent = 'Next';
  btn.onclick = () => {
    const pinyin = pinyinInput.value.trim();
    if (!pinyin) return alert('Please enter Pinyin.');
    card.pinyin = pinyin;
  
    startCollectEnglish(card);  // Continue to meaning collection
  };
};

function startCollectEnglish(card) {
  pinyinInputMode = false; // Will steal one vowel from user if left untouched;

  const collectPinYinStep = document.getElementById('collectPinYinStep');
  const collectEnglishStep = document.getElementById('collectEnglishStep');
  const englishInput = document.getElementById('englishInput');
  const btn = document.getElementById('saveDataBtn');

  collectPinYinStep.style.display = 'none';
  collectEnglishStep.style.display = 'flex';
  englishInput.focus();

  btn.textContent = 'Next';
  btn.onclick = () => {
    const english = englishInput.value.trim();
    if (!english) return alert('Please enter English meaning.');
    card.english = english;

    startReviewStep(card);
  };
}

function startReviewStep(card) {
  const collectEnglishStep = document.getElementById('collectEnglishStep');
  const reviewStep = document.getElementById('reviewStep');
  const btn = document.getElementById('saveDataBtn');

  collectEnglishStep.style.display = 'none';
  reviewStep.style.display = 'flex';

  const cardChineseDisplay = document.getElementById('reviewCardChinese');
  cardChineseDisplay.textContent = card.chinese;
  
  const cardPinYinDisplay = document.getElementById('reviewCardPinYin');
  cardPinYinDisplay.textContent = card.pinyin;
  
  const cardMeaningDisplay = document.getElementById('reviewCardEnglish');
  cardMeaningDisplay.textContent = card.english;
  
  btn.textContent = 'Save';
  btn.onclick = () => {
    collectEnglishStep.style.display = 'none';
    saveCardToDatabase(card);
    resetCardOverlay();
  }
}

function resetCardOverlay() {
  document.getElementById('cardDataCollection-Overlay').style.display = 'none';
  document.getElementById('chineseInput').value = '';
  document.getElementById('pinyinInput').value = '';
  document.getElementById('englishInput').value = '';
  document.getElementById('croppedPreview').src = '';

  document.getElementById('reviewStep').style.display = 'none';
  document.getElementById('reviewCardChinese').value = '';
  document.getElementById('reviewCardPinYin').value = '';
  document.getElementById('reviewCardEnglish').value = '';
}


// ==== PinYin Input ====

const baseVowels = ['a', 'e', 'i', 'o', 'u', 'ü'];
const toneMapping = {
  'a': ['ā', 'á', 'ǎ', 'à', 'a'],
  'e': ['ē', 'é', 'ě', 'è', 'e'],
  'i': ['ī', 'í', 'ǐ', 'ì', 'i'],
  'o': ['ō', 'ó', 'ǒ', 'ò', 'o'],
  'u': ['ū', 'ú', 'ǔ', 'ù', 'u'],
  'ü': ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü']
};

let currentVowel = '';
let pinyinInputMode = false;
let showingToneOptions = false;

function createPinyinKeyboard() {
  const keyboard = document.getElementById('pinyinKeyboard');
  keyboard.innerHTML = '';
  showingToneOptions = false;
  pinyinInputMode = true; // 🔥 Enable typing behavior

  baseVowels.forEach(vowel => {
    const btn = document.createElement('button');
    btn.className = 'pinyin-key';
    btn.textContent = vowel;
    btn.onclick = () => showToneOptions(vowel);
    keyboard.appendChild(btn);
  });
}

function showToneOptions(vowel) {
  const keyboard = document.getElementById('pinyinKeyboard');
  keyboard.innerHTML = '';
  currentVowel = vowel;
  showingToneOptions = true;

  toneMapping[vowel].slice(0, vowel === 'ü' ? 4 : 5).forEach((toneChar, index) => {
    const container = document.createElement('div');
    container.className = 'tone-container';

    const label = document.createElement('div');
    label.className = 'tone-label';
    label.textContent = index < 4 ? index + 1 : vowel;  // Show vowel instead of "5"

    const btn = document.createElement('button');
    btn.className = 'tone-key';
    btn.textContent = toneChar;
    btn.onclick = () => insertTonedVowel(toneChar);

    container.appendChild(btn);
    container.appendChild(label);
    keyboard.appendChild(container);
  });
}

function insertTonedVowel(toneChar) {
  const input = document.getElementById('pinyinInput');
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const currentValue = input.value;

  input.value = currentValue.slice(0, start) + toneChar + currentValue.slice(end);
  input.setSelectionRange(start + 1, start + 1);
  input.focus();

  createPinyinKeyboard(); // Reset keyboard
}

// Keyboard tone selection
window.addEventListener('keydown', e => {
  if (showingToneOptions && currentVowel) {
    const keyAsInt = parseInt(e.key);
    if (keyAsInt >= 1 && keyAsInt <= 4) {
      e.preventDefault();
      const toneChar = toneMapping[currentVowel][keyAsInt - 1];
      insertTonedVowel(toneChar);
      return;
    }

    if (e.key.toLowerCase() === currentVowel) {
      e.preventDefault();
      const baseChar = toneMapping[currentVowel][4]; // index 4 = base vowel
      insertTonedVowel(baseChar);
      return
    }
  }

  if (
    pinyinInputMode &&
    !showingToneOptions &&
    !e.ctrlKey &&
    !e.metaKey &&
    !e.altKey
  ) {
    const char = e.key.toLowerCase();
    if (['a', 'e', 'i', 'o', 'u', 'v'].includes(char)) {
      e.preventDefault();
      const vowel = char === 'v' ? 'ü' : char;
      showToneOptions(vowel);
    }
  }
});

// ==== EVENT BINDINGS ====

img.addEventListener('mousedown', onImageMouseDown);
img.addEventListener('load', () => {
  fetchFlashcardsData(img.src);  // This will fetch the flashcards based on the current image's source path.
});

window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mouseup', onMouseUp);
selectAreaBtn.addEventListener('click', enableSelectionMode);


document.getElementById('exitOverlayBtn').addEventListener('click', () => {
  resetCardOverlay();
});

window.addEventListener('keydown', (e) => {
  // === Cancel tone selection if open ===
  if (e.key === 'Escape' && showingToneOptions) {
    e.preventDefault();
    createPinyinKeyboard(); // Reset to base vowels
    return;
  }

  // === Then check for overlay dismissal ===
  const overlayVisible = document.getElementById('cardDataCollection-Overlay').style.display === 'flex';
  if (e.key === 'Escape' && overlayVisible) {
    e.preventDefault();
    resetCardOverlay();
  }
});

// ==== IMAGE LOADING ====

fetch('/api/images')
  .then(res => res.json())
  .then(files => {
    const menu = document.getElementById('imageMenu');
    files.forEach(file => {
      const item = document.createElement('div');
      item.className = 'menuItem';
      item.textContent = file;
      item.setAttribute('data-src', `/images/${file}`);
      item.addEventListener('click', () => {
        img.src = `/images/${file}`;
        imgContainer.style.display = 'block';
        scale = 1;
        offsetX = 0;
        offsetY = 0;
        updateImageTransform();
      });
      menu.appendChild(item);
    });
  })
  .catch(err => console.error('Error loading image list:', err));

function fetchFlashcardsData(imgPath) {
  console.log('Fetching flashcards data for image:', imgPath);

  fetch('/api/cards/read_by_imgPath', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imgPath })
  })
  .then(response => response.json())
  .then(data => {
    console.log('received flashcards (given imgPath):', data.flashcards);
    console.log('data type:', typeof data.flashcards);
    if (data.flashcards && Array.isArray(data.flashcards)) {
      console.log('here');
      displayFlashCardGhosts(data.flashcards);
    }
  })
  .catch(err => console.error('Error fetching flashcards:', err));
}

// ==== APIs ====

async function saveCardToDatabase(card) {
  try {
    const response = await fetch('/api/cards/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ card }),
    });

    const data = await response.json(); // ✅ Wait for the body to parse

    if (data.flashcardId) {
      console.log(`Card succesfully created. Card ID: ${data.flashcardId}`);
    } else {
      console.error('Failed to save card to DB');
    }
  } catch (err) {
    console.error('Error saving card:', err);
  }
}

