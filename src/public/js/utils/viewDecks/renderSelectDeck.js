// public/js/utils/viewDecks/renderSelectDeck.js

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
  const root = decks.filter(d => d.PARENT_DECK_ID === null)
    .sort((a, b) => a.DECK_NAME.localeCompare(b.DECK_NAME));

  // State
  let currentDeck = null; // null = root
  let selectedDeckId = null; // track which deck is selected

  function render() {
    container.innerHTML = '';
    container.className = 'deck-breadcrumb-container-vertical';

    if (!currentDeck) {
      // At root: show all top-level decks as vertical list
      root.forEach(deck => {
        const deckTile = document.createElement('div');
        deckTile.className = 'deck-nav-parent-vertical deck-tile-vertical';
        deckTile.textContent = deck.DECK_NAME;

        // Highlight if selected
        if (selectedDeckId === deck.DECK_ID) {
          deckTile.classList.add('selected-deck');

          // TO-DO: Nothing happens here, diag and clean house
        }

        // Decide whether to go in or select
        deckTile.onclick = () => {
          const deckInMap = deckMap.get(deck.DECK_ID);
          if (deckInMap.children.length > 0) {
            currentDeck = deck.DECK_ID;
            selectedDeckId = deck.DECK_ID; // Auto-select parent
            onSelect(deck.DECK_ID, deck.DECK_NAME); // Auto-select parent
            render();
          } else {
            selectedDeckId = deck.DECK_ID;
            onSelect(deck.DECK_ID, deck.DECK_NAME);
            render();
          }
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
      parentTile.textContent = deck.DECK_NAME;

      if (selectedDeckId === deck.DECK_ID) {
        parentTile.classList.add('selected-deck');
        addEditButton(parentTile, deck);
      }

      parentTile.onclick = () => {
        selectedDeckId = deck.DECK_ID;
        onSelect(deck.DECK_ID, deck.DECK_NAME);
        render();
      };
      container.appendChild(parentTile);

      // Children (if any)
      if (deck.children.length > 0) {
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'deck-children-scroll-container';

        // Sort children alphabetically before rendering
        deck.children
          .slice() // copy to avoid mutating original
          .sort((a, b) => a.DECK_NAME.localeCompare(b.DECK_NAME))
          .forEach(child => {
            const childTile = document.createElement('div');
            childTile.className = 'deck-nav-child-vertical deck-tile-vertical';
            childTile.textContent = child.DECK_NAME;

            if (selectedDeckId === child.DECK_ID) {
              childTile.classList.add('selected-deck');
              addEditButton(childTile, child);
            }

            childTile.onclick = () => {
              const childDeck = deckMap.get(child.DECK_ID);
              if (childDeck.children.length > 0) {
                currentDeck = child.DECK_ID;
                selectedDeckId = child.DECK_ID; // Auto-select parent
                onSelect(child.DECK_ID, child.DECK_NAME); // Auto-select parent
                render();
              } else {
                selectedDeckId = child.DECK_ID;
                onSelect(child.DECK_ID, child.DECK_NAME);
                render();
              }
            };

            scrollContainer.appendChild(childTile);
          });

        container.appendChild(scrollContainer);
      }
    }
  }

  function addEditButton(deckTile, deck) {
    // --- Add edit button ---
    const editBtn = document.createElement('button');
    editBtn.textContent = '✎';
    editBtn.title = 'Edit Deck';
    editBtn.className = 'deck-edit-btn';
    // TODO: Add edit handler here
    deckTile.appendChild(editBtn);
  }
  render();
}
