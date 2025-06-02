// public/js/utils/collectFlashCardData.js/renderDeckSelection.js

export function renderDeckSelection(container, decks, onSelect) {
  container.innerHTML = ''; // clear previous content

  const deckTree = buildDeckTree(decks);

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

  function appendDecks(container, decks) {
    decks.forEach(deck => {
      const item = document.createElement('div');
      item.className = 'menuItem';
      item.textContent = deck.DECK_NAME;

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelect(deck.DECK_ID, deck.DECK_NAME);
      });

      if (deck.children.length > 0) {
        const subMenu = document.createElement('div');
        subMenu.className = 'submenu';
        appendDecks(subMenu, deck.children);
        item.appendChild(subMenu);
      }

      container.appendChild(item);
    });
  }

  appendDecks(container, deckTree);
}
