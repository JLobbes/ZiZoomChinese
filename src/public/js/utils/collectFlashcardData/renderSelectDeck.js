// public/js/utils/collectFlashCardData.js/renderSelectDeck.js

export function renderDeckSelection(container, decks, onSelect) {
  container.innerHTML = '';

  // Build deck map
  const deckMap = new Map();
  decks.forEach(deck => deckMap.set(deck.DECK_ID, { ...deck, children: [] }));
  decks.forEach(deck => {
    if (deck.PARENT_DECK_ID !== null) {
      const parent = deckMap.get(deck.PARENT_DECK_ID);
      if (parent) parent.children.push(deckMap.get(deck.DECK_ID));
    }
  });

  // Find root decks (no parent)
  const root = decks.filter(d => d.PARENT_DECK_ID === null);

  // State: current deck ID (null = root)
  let currentDeck = null;

  function render() {
    container.innerHTML = '';
    container.className = 'deck-breadcrumb-container-vertical';

    if (!currentDeck) {
      // At root: show all top-level decks as vertical list
      root.forEach(deck => {
        const deckTile = document.createElement('div');
        deckTile.className = 'deck-nav-parent-vertical deck-tile-vertical';
        deckTile.textContent = deck.DECK_NAME;
        deckTile.onclick = () => {
          currentDeck = deck.DECK_ID;
          render();
        };
        container.appendChild(deckTile);
      });
    } else {
      // Not at root: show up arrow, parent tile, and children vertically
      const deck = deckMap.get(currentDeck);
      const parentDeck = deck.PARENT_DECK_ID ? deckMap.get(deck.PARENT_DECK_ID) : null;

      // Up arrow
      const upArrow = document.createElement('div');
      upArrow.textContent = '← Back';
      upArrow.className = 'deck-nav-arrow-vertical';
      upArrow.onclick = () => {
        currentDeck = parentDeck ? parentDeck.DECK_ID : null;
        render();
      };
      container.appendChild(upArrow);

      // Parent tile (select current deck)
      const parentTile = document.createElement('div');
      parentTile.className = 'deck-nav-parent-vertical deck-tile-vertical';
      parentTile.textContent = deck.DECK_NAME + ''; // Can add more info if needed to mark for selection
      parentTile.onclick = () => {
        onSelect(deck.DECK_ID, deck.DECK_NAME);
      };
      container.appendChild(parentTile);

      // Children (if any)
      if (deck.children.length > 0) {
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'deck-children-scroll-container';
        deck.children.forEach(child => {
          const childTile = document.createElement('div');
          childTile.className = 'deck-nav-child-vertical deck-tile-vertical';
          childTile.textContent = child.DECK_NAME;
          childTile.onclick = () => {
            currentDeck = child.DECK_ID;
            render();
          };
          scrollContainer.appendChild(childTile);
        });
        container.appendChild(scrollContainer);
      }
    }
  }

  render();
}
