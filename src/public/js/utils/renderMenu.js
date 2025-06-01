// public/js/utils/renderMenu.js

import { getImages } from '../api/getImages.js';
import { getDecks } from '../api/getDecks.js';
import uiState from '../uiState.js';

export async function renderMenu() {
  const imageMenu = document.getElementById('imageMenu');
  imageMenu.innerHTML = '';

  // === IMAGES ===
  try {
    const images = await getImages();
    const folderTree = buildFolderTree(images);
    appendFoldersToMenu(imageMenu, folderTree);
  } catch (err) {
    console.error('Error loading images:', err);
  }

  // === DECKS ===
  try {
    const decks = await getDecks();
    const deckTree = buildDeckTree(decks);
    appendDecksToMenu(imageMenu, deckTree);
  } catch (err) {
    console.error('Error loading decks:', err);
  }

  // === Other menu items
  imageMenu.appendChild(createMenuItem('🧠 Quiz Mode', () => console.log('Quiz')));
  imageMenu.appendChild(createMenuItem('⚙️ Settings', () => console.log('Settings')));
}

// === Images: Folder structure
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

function appendFoldersToMenu(container, tree) {
  for (const key in tree) {
    const node = tree[key];

    if (node.__file) {
      container.appendChild(
        createMenuItem(node.name, () => {
          uiState.viewedImg.src = `/${node.path}`;
          uiState.viewerContainer.style.display = 'flex';
          uiState.scale = 1;
          uiState.offsetX = 0;
          uiState.offsetY = 0;
        })
      );
    } else {
      const folderItem = createMenuItem(key);
      const subMenu = document.createElement('div');
      subMenu.className = 'submenu';
      appendFoldersToMenu(subMenu, node);
      folderItem.appendChild(subMenu);
      container.appendChild(folderItem);
    }
  }
}

// === Decks: Tree structure
function buildDeckTree(decks) {
  const deckMap = new Map();
  const root = [];

  decks.forEach(deck => {
    deck.children = [];
    deckMap.set(deck.DECK_ID, deck);
  });

  decks.forEach(deck => {
    if (deck.PARENT_DECK_ID === null) {
      root.push(deck);
    } else {
      const parent = deckMap.get(deck.PARENT_DECK_ID);
      if (parent) parent.children.push(deck);
    }
  });

  return root;
}

function appendDecksToMenu(container, decks) {
  decks.forEach(deck => {
    const item = createMenuItem(deck.DECK_NAME, () => {
      console.log(`Load deck: ${deck.DECK_NAME}`);
    });

    if (deck.children.length > 0) {
      const subMenu = document.createElement('div');
      subMenu.className = 'submenu';
      appendDecksToMenu(subMenu, deck.children);
      item.appendChild(subMenu);
    }

    container.appendChild(item);
  });
}

// === Helper
function createMenuItem(text, onClick = null) {
  const el = document.createElement('div');
  el.className = 'menuItem';
  el.textContent = text;
  if (onClick) el.addEventListener('click', onClick);
  return el;
}
