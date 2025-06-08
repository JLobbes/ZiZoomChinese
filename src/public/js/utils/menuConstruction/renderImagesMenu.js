// public/js/utils/menuConstruction/renderImagesMenu.js

import uiState from '../../uiState.js';
import uiElements from '../../uiElements.js';

import { getImages } from '../../api/getImages.js';
import { createMenuItem, appendAddSubfolderBtn } from './menuHelpers.js';
import { fetchFlashcardsData } from '../../api/getFlashcards.js';
import { displayFlashcardGhosts } from '../../utils/displayFlashcardGhosts.js';

export async function renderImageSection(container) {
  try {
    const images = await getImages();
    const folderTree = buildFolderTree(images);
    appendFoldersToMenu(container, folderTree);
  } catch (err) {
    console.error('Error loading images:', err);
  }
}

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
        createMenuItem(node.name, async () => {
          const imgPath = `/${node.path}`;
          uiElements.viewedImg.src = imgPath;
          uiElements.viewerContainer.style.display = 'flex';
          uiState.scale = 1;
          uiState.offsetX = 0;
          uiState.offsetY = 0;

          // Wait for image to finish loading before placing ghosts
          uiElements.viewedImg.onload = async () => {
            const cards = await fetchFlashcardsData(uiElements.viewedImg.src);
            displayFlashcardGhosts(cards);
          };
        })
      );
    } else {
      const folderItem = createMenuItem(capitalize(key));
      const subMenu = document.createElement('div');
      subMenu.className = 'submenu';
      appendFoldersToMenu(subMenu, node);

      appendAddSubfolderBtn(subMenu, 'Folder', (name) => {
        console.log(`Create folder "${name}" under "${key}"`);
        // TODO: backend integration
      });

      folderItem.appendChild(subMenu);
      container.appendChild(folderItem);
    }
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
