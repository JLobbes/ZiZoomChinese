const input = document.getElementById('fileInput');
const imgContainer = document.getElementById('viewerContainer');
const img = document.getElementById('viewer');

input.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) {
    img.src = URL.createObjectURL(file);
    imgContainer.style.display = 'flex';
  }
});

let scale = 1;

document.addEventListener('keydown', e => {
  if (e.shiftKey && (e.key === '+' || e.key === '=')) {
    scale = Math.min(scale + 0.5, 5);
    console.log('zoom in!')
  } else if (e.shiftKey && (e.key === '-' || e.key === '_')) {
    console.log('zoom out!')
    scale = Math.max(scale - 0.5, 0.5);
  } else {
    return;
  }
    // img.style.transform = `scale(${scale})`;
  img.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;

});

let isDragging = false;
let startX, startY;
let currentX = 0, currentY = 0;

function setTransform() {
  img.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
}

// Start drag 
img.addEventListener('mousedown', e => {
  isDragging = true;
  startX = e.clientX - currentX;
  startY = e.clientY - currentY;
  img.style.cursor = 'grabbing';

  // Prevent image dragging ghost
  e.preventDefault();
});

// Move
window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  currentX = e.clientX - startX;
  currentY = e.clientY - startY;
  setTransform();
});

// End drag
window.addEventListener('mouseup', () => {
  isDragging = false;
  img.style.cursor = 'grab';
});
