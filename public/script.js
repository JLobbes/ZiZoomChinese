const imgContainer = document.getElementById('viewerContainer');
const img = document.getElementById('viewer');

// Populate Menu w/ Images
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
        currentX = 0;
        currentY = 0;
        setTransform();
      });
      menu.appendChild(item);
    });
  })
  .catch(err => console.error('Error loading image list:', err));

let scale = 1;

// Make Menu Images Clickable
document.querySelectorAll('.menuItem').forEach(item => {
  item.addEventListener('click', () => {
    const src = item.getAttribute('data-src');
    img.src = src;
    imgContainer.style.display = 'flex';
    scale = 1;
    currentX = 0;
    currentY = 0;
    setTransform();
  });
});

// Zoom listeners + logic
document.addEventListener('keydown', e => {
  if (e.shiftKey && (e.key === '+' || e.key === '=')) {
    scale = Math.min(scale + 0.5, 5);
  } else if (e.shiftKey && (e.key === '-' || e.key === '_')) {
    scale = Math.max(scale - 0.5, 0.5);
  } else {
    return;
  }
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

