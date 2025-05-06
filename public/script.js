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
      offsetX -= moveStep; animate = true; break;
    case 'ArrowRight':
      offsetX += moveStep; animate = true; break;
    case 'ArrowUp':
      offsetY -= moveStep; animate = true; break;
    case 'ArrowDown':
      offsetY += moveStep; animate = true; break;
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
        imgContainer.style.display = 'flex';
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
