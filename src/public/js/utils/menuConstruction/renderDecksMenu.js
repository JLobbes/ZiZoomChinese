// public/js/utils/menuConstruction/renderDecksMenu.js

import { getDecks } from '../../api/getDecks.js';
import { createMenuItem, appendAddSubfolderBtn } from './menuHelpers.js';

export async function renderDeckSection(container) {
  try {
    const decks = await getDecks();
    const deckTree = buildDeckTree(decks);
    appendDecksToMenu(container, deckTree);
  } catch (err) {
    console.error('Error loading decks:', err);
  }
}

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

      appendAddSubfolderBtn(subMenu, 'Deck', (name) => {
        console.log(`Create deck "${name}" under "${deck.DECK_NAME}"`);
        // TODO: backend integration
      });

      item.appendChild(subMenu);
    }

    container.appendChild(item);
  });
}
