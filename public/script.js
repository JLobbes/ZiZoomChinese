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
  img.style.transition = smooth ? 'transform 0.3s ease' : '';
  img.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
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
}

// ==== IMAGE SELECTION ====

function enableSelectionMode() {
  if (selectionModeEnabled) return;
  if (!img.src) return alert("Please load an image first.");

  selectionModeEnabled = true;
  img.style.cursor = 'crosshair';
  console.log('Selection mode active. Drag to select.');

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

  selectionBox.style.left = `${(left / naturalWidth) * rect.width + rect.left}px`;
  selectionBox.style.top = `${(top / naturalHeight) * rect.height + rect.top}px`;
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

  console.log('Selected area in image coordinates:', box);

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

function collectCardData(croppedImageLocation) {
  const newCard = { croppedImageLocation };
  showCardOverlay(croppedImageLocation);
  startTermStep(newCard);
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

function startTermStep(card) {
  const termStep = document.getElementById('termStep');
  const pinyinStep = document.getElementById('pinyinStep');
  const termInput = document.getElementById('termInput');
  const btn = document.getElementById('saveTermBtn');

  termStep.style.display = 'flex';
  pinyinStep.style.display = 'none';
  termInput.focus();

  btn.textContent = 'Next';
  btn.onclick = () => {
    const term = termInput.value.trim();
    if (!term) return alert('Please enter a word.');
    card.term = term;
    startPinyinStep(card);
  };
}

function startPinyinStep(card) {
  const termStep = document.getElementById('termStep');
  const pinyinStep = document.getElementById('pinyinStep');
  const pinyinInput = document.getElementById('pinyinInput');
  const btn = document.getElementById('saveTermBtn');

  termStep.style.display = 'none';
  pinyinStep.style.display = 'flex';
  pinyinInput.focus();
  createPinyinKeyboard();

  btn.textContent = 'Save';
  btn.onclick = () => {
    const pinyin = pinyinInput.value.trim();
    if (!pinyin) return alert('Please enter Pinyin.');
    card.pinyin = pinyin;

    console.log('Flashcard saved:', card);
    resetCardOverlay();
  };
}

function resetCardOverlay() {
  document.getElementById('cardDataCollection-Overlay').style.display = 'none';
  document.getElementById('termInput').value = '';
  document.getElementById('pinyinInput').value = '';
  document.getElementById('croppedPreview').src = '';
}

// ==== PinYin Input ====

const baseVowels = ['a', 'e', 'i', 'o', 'u', 'ü'];  // Basic vowels without tones
const toneMapping = {
  'a': ['ā', 'á', 'ǎ', 'à', 'a'],  // Vowel "a" and its tones (1, 2, 3, 4) and no tone
  'e': ['ē', 'é', 'ě', 'è', 'e'],
  'i': ['ī', 'í', 'ǐ', 'ì', 'i'],
  'o': ['ō', 'ó', 'ǒ', 'ò', 'o'],
  'u': ['ū', 'ú', 'ǔ', 'ù', 'u'],
  'ü': ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü']  // Adding ü with tones and no tone (vowel)
};

let currentVowel = '';  // Store the current vowel being typed

function createPinyinKeyboard() {
  const keyboard = document.getElementById('pinyinKeyboard');
  keyboard.innerHTML = ''; // Clear old keys if needed

  baseVowels.forEach(vowel => {
    const btn = document.createElement('button');
    btn.className = 'pinyin-key';
    btn.textContent = vowel;
    btn.onclick = () => {
      // Set the current vowel when clicked
      currentVowel = vowel;
      console.log('current Vowel:', currentVowel);
      const input = document.getElementById('pinyinInput');
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const currentValue = input.value;

      // Insert the vowel into the input field
      input.value = currentValue.slice(0, start) + vowel + currentValue.slice(end);
      input.setSelectionRange(start + 1, start + 1); // Move cursor after inserted char
      input.focus();
    };
    keyboard.appendChild(btn);
  });

  // Listen for tone key presses
  window.addEventListener('keydown', e => {
    if (!currentVowel) return;  // If no vowel is typed yet, do nothing

    let toneIndex;
    switch (e.key) {
      case '1': toneIndex = 0; break;  // Tone 1
      case '2': toneIndex = 1; break;  // Tone 2
      case '3': toneIndex = 2; break;  // Tone 3
      case '4': toneIndex = 3; break;  // Tone 4
      case '5': toneIndex = 4; break;  // No tone
      default: return;
    }

    // Replace the last vowel typed with the corresponding tone
    const input = document.getElementById('pinyinInput');
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const currentValue = input.value;

    // Get the tone for the current vowel
    const tone = toneMapping[currentVowel][toneIndex];

    // Insert the toned vowel into the input field
    input.value = currentValue.slice(0, start) + tone + currentValue.slice(end);
    input.setSelectionRange(start + 1, start + 1); // Move cursor after inserted tone
    input.focus();

    // Reset currentVowel after inserting tone
    currentVowel = '';
  });
}

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

// ==== EVENT BINDINGS ====

img.addEventListener('mousedown', onImageMouseDown);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mouseup', onMouseUp);
selectAreaBtn.addEventListener('click', enableSelectionMode);
