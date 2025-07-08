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
    container.className = 'deck-list-container';

    if (!currentDeck) {
      // At root: show all top-level decks as vertical list
      root.forEach(deck => {
        const deckTile = document.createElement('div');
        deckTile.className = 'deck-parent deck-tile';
        deckTile.textContent = deck.DECK_NAME;

        // Highlight if selected
        if (selectedDeckId === deck.DECK_ID) {
          deckTile.classList.add('selected');
          // TO-DO: Nothing happens here, diag and clean house
        }

        deckTile.onclick = () => {
          const deckInMap = deckMap.get(deck.DECK_ID);
          if (deckInMap.children.length > 0) {
            currentDeck = deck.DECK_ID;
            selectedDeckId = deck.DECK_ID;
            onSelect(deck.DECK_ID, deck.DECK_NAME);
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
      upArrow.className = 'deck-back-btn';
      upArrow.onclick = () => {
        currentDeck = parentDeck ? parentDeck.DECK_ID : null;
        render();
      };
      container.appendChild(upArrow);

      // Parent tile (select current deck)
      const parentTile = document.createElement('div');
      parentTile.className = 'deck-parent deck-tile';
      parentTile.textContent = deck.DECK_NAME;

      if (selectedDeckId === deck.DECK_ID) {
        parentTile.classList.add('selected');
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
        scrollContainer.className = 'deck-children-scroll';

        deck.children
          .slice()
          .sort((a, b) => a.DECK_NAME.localeCompare(b.DECK_NAME))
          .forEach(child => {
            const childTile = document.createElement('div');
            childTile.className = 'deck-child deck-tile';
            childTile.textContent = child.DECK_NAME;

            if (selectedDeckId === child.DECK_ID) {
              childTile.classList.add('selected');
              addEditButton(childTile, child);
            }

            childTile.onclick = () => {
              const childDeck = deckMap.get(child.DECK_ID);
              if (childDeck.children.length > 0) {
                currentDeck = child.DECK_ID;
                selectedDeckId = child.DECK_ID;
                onSelect(child.DECK_ID, child.DECK_NAME);
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

  function editDeckFolder(deck, deckTile) {
    // Remove any existing popup
    document.querySelectorAll('.deck-edit-popup').forEach(p => p.remove());

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'deck-edit-popup';

    // Example: Add Save, Cancel, Delete buttons
    const saveBtn = document.createElement('button');
    saveBtn.textContent = '✔';
    saveBtn.title = 'Save';
    saveBtn.className = 'deck-save-btn';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '✖';
    cancelBtn.title = 'Cancel';
    cancelBtn.className = 'deck-cancel-btn';

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/>
        </svg>`;
    deleteBtn.title = 'Delete';
    deleteBtn.className = 'deck-delete-btn';

    // Add handlers (implement logic as needed)
    saveBtn.onclick = (e) => {
      e.stopPropagation();
      // TODO: Save logic
      popup.remove();
    };
    cancelBtn.onclick = (e) => {
      e.stopPropagation();
      popup.remove();
    };
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      // TODO: Delete logic
      popup.remove();
    };

    popup.append(saveBtn, cancelBtn, deleteBtn);

    // Position popup relative to deckTile
    deckTile.style.position = 'relative';
    deckTile.appendChild(popup);
  }

  function addEditButton(deckTile, deck) {
    const editBtn = document.createElement('button');
    editBtn.textContent = '✎';
    editBtn.title = 'Edit Deck';
    editBtn.id = 'deck-edit-btn';
    editBtn.onclick = (e) => {
      e.stopPropagation();
      editDeckFolder(deck, deckTile);
    };
    deckTile.appendChild(editBtn);
  }
  render();
}