// public/js/ui/renderMenu.js

// Image Data

// [
//   { name: "page1.jpg", path: "charlottes_web/page1.jpg" },
//   { name: "page2.jpg", path: "charlottes_web/page2.jpg" },
//   { name: "cover.jpg", path: "harry_potter/cover.jpg" }
// ]

// public/js/ui/renderMenu.js

import { getImages } from '../api/getImages.js';
import { getDecks } from '../api/getDecks.js';
import uiState from '../uiState.js';

export async function renderMenu() {
  const imageMenu = document.getElementById('imageMenu');
  imageMenu.innerHTML = '';

  // === IMAGES ===
  const imagesHeader = createHeader('📂 Images');
  imageMenu.appendChild(imagesHeader);

  try {
    const images = await getImages();
    console.log('images:', images);
    const folderTree = buildFolderTree(images);
    appendFoldersToMenu(imageMenu, folderTree);
  } catch (err) {
    console.error('Error loading images:', err);
  }

  // // === DECKS ===
  // const decksHeader = createHeader('🗂️ Decks');
  // imageMenu.appendChild(decksHeader);

  // try {
  //   const decks = await getDecks();
  //   decks.forEach(deck => {
  //     const item = document.createElement('div');
  //     item.className = 'menuItem';
  //     item.textContent = deck.DECK_NAME;
  //     item.addEventListener('click', () => {
  //       console.log(`Load deck: ${deck.DECK_NAME}`);
  //     });
  //     imageMenu.appendChild(item);
  //   });
  // } catch (err) {
  //   console.error('Error loading decks:', err);
  // }

  const quizItem = createMenuItem('🧠 Quiz Mode', () => console.log('Quiz'));
  const settingsItem = createMenuItem('⚙️ Settings', () => console.log('Settings'));

  imageMenu.appendChild(quizItem);
  imageMenu.appendChild(settingsItem);
}

// === Build folder tree from flat paths
function buildFolderTree(images) {
  const root = {};
  images.forEach(({ name, path }) => {
    const parts = path.split('/');
    let current = root;
    parts.forEach((part, i) => {
      if (!current[part]) {
        current[part] = (i === parts.length - 1) ? { __file: true, name, path } : {};
      }
      current = current[part];
    });
  });
  return root;
}

// === Recursively build DOM
function appendFoldersToMenu(container, tree) {
  for (const key in tree) {
    const node = tree[key];

    if (node.__file) {
      const fileItem = createMenuItem(node.name, () => {
        uiState.viewedImg.src = `/${node.path}`;
        uiState.viewerContainer.style.display = 'flex';
        uiState.scale = 1;
        uiState.offsetX = 0;
        uiState.offsetY = 0;
      });
      container.appendChild(fileItem);
    } else {
      const folderItem = document.createElement('div');
      folderItem.className = 'menuItem';
      folderItem.textContent = key;

      const subMenu = document.createElement('div');
      subMenu.className = 'submenu';
      appendFoldersToMenu(subMenu, node);
      folderItem.appendChild(subMenu);

      container.appendChild(folderItem);
    }
  }
}

// === Helpers
function createHeader(text) {
  const el = document.createElement('div');
  el.className = 'menuHeader';
  el.textContent = text;
  return el;
}

function createMenuItem(text, onClick) {
  const el = document.createElement('div');
  el.className = 'menuItem';
  el.textContent = text;
  el.addEventListener('click', onClick);
  return el;
}
