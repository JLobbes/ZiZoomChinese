// public/js/getImages.js

export function getImages() {
  return fetch('/api/images')
    .then(res => res.json())
    .catch(err => {
      console.error('Error loading image list:', err);
      throw err; // rethrow the error for further handling if needed
    });
}

export function loadImages(files) {
  const menu = document.getElementById('imageMenu');
  files.forEach(file => {
    const item = document.createElement('div');
    item.className = 'menuItem';
    item.textContent = file;
    item.setAttribute('data-src', `/images/${file}`);
    item.addEventListener('click', () => {
      viewedImg.src = `/images/${file}`;
      viewerContainer.style.display = 'flex';
      scale = 1;
      offsetX = 0;
      offsetY = 0;
      updateImageTransform();
    });
    menu.appendChild(item);
  });
}
