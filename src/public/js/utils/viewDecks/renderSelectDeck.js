// public/js/utils/viewDecks/renderSelectDeck.js
import { createDeck } from "../../api/createDeck.js";
import { deleteDeck } from "../../api/deleteDeck.js"; 

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
  console.log('Deck map created:', deckMap);

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
            // childless Tiles are still parents because they can have children added
            currentDeck = deck.DECK_ID;
            selectedDeckId = deck.DECK_ID;
            onSelect(deck.DECK_ID, deck.DECK_NAME);
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
      const scrollContainer = document.createElement('div');
      scrollContainer.className = 'deck-children-scroll';

      if (deck.children.length > 0) {
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
              // childless Tiles are still parents because they can have children added
              currentDeck = child.DECK_ID;
              selectedDeckId = child.DECK_ID;
              onSelect(child.DECK_ID, child.DECK_NAME);
              render();
            };

            scrollContainer.appendChild(childTile);
          });
      }

      // --- Add Deck Button (always shown) ---
      const addDeckBtn = document.createElement('button');
      addDeckBtn.textContent = '+ Add Deck';
      addDeckBtn.className = 'deck-add-btn';
      addDeckBtn.onclick = (e) => {
        e.stopPropagation();
        showAddDeckPopup(deck.DECK_ID, container);
      };
      scrollContainer.appendChild(addDeckBtn);

      container.appendChild(scrollContainer);
    }
  }

  function editDeckFolder(deck, deckTile) {
    // Remove any existing popup
    document.querySelectorAll('.deck-edit-popup').forEach(p => p.remove());

    // Save original name and content
    const originalName = deck.DECK_NAME;
    const originalContent = deckTile.textContent;

    // Remove all children (including edit button)
    deckTile.innerHTML = '';

    // Create input for editing name
    const input = document.createElement('input');
    input.type = 'text';
    input.value = originalName;
    input.id = 'deck-edit-input';
    input.style.width = '80%';
    deckTile.appendChild(input);
    input.focus();

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'deck-edit-popup';

    // Save, Cancel, Delete buttons
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

    // Handlers
    saveBtn.onclick = (e) => {
      e.stopPropagation();
      // TODO: Save logic (e.g., update deck name in backend)
      deck.DECK_NAME = input.value;
      popup.remove();
      deckTile.innerHTML = '';
      deckTile.textContent = deck.DECK_NAME;
      // Optionally re-add edit button if needed
      addEditButton(deckTile, deck);
    };
    cancelBtn.onclick = (e) => {
      e.stopPropagation();
      popup.remove();
      deckTile.innerHTML = '';
      deckTile.textContent = originalName;
      addEditButton(deckTile, deck);
    };
    deleteBtn.onclick = async (e) => {
      e.stopPropagation();
      // Call API to delete deck
      try {
        const success = await deleteDeck(deck.DECK_ID);
        if (success) {
          // Remove deck from decks array and deckMap
          decks = decks.filter(d => d.DECK_ID !== deck.DECK_ID);
          deckMap.delete(deck.DECK_ID);
          // If it has a parent, remove from parent's children
          if (deck.PARENT_DECK_ID !== null) {
            const parent = deckMap.get(deck.PARENT_DECK_ID);
            if (parent) {
              parent.children = parent.children.filter(child => child.DECK_ID !== deck.DECK_ID);
            }
          }
          render();
        }
      } catch (err) {
        alert('Error deleting deck: ' + err.message);
      }
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

  function showAddDeckPopup(parentDeckId, container) {
    // Remove any existing popup
    document.querySelectorAll('.deck-add-popup').forEach(p => p.remove());

    const popup = document.createElement('div');
    popup.className = 'deck-add-popup';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'New deck name';
    input.style.width = '80%';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = '✔';
    saveBtn.title = 'Create';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '✖';
    cancelBtn.title = 'Cancel';

    saveBtn.onclick = async (e) => {
      e.stopPropagation();
      const deckName = input.value.trim();
      if (!deckName) return;
      await createDeck(deckName, parentDeckId).then(newDeck => {
        if (newDeck) { 
          // Add new deck to decks array
          decks.push(newDeck);
          // Add new deck to deckMap
          deckMap.set(newDeck.DECK_ID, { ...newDeck, children: [] });
          // If it has a parent, add to parent's children
          if (newDeck.PARENT_DECK_ID !== null) {
            const parent = deckMap.get(newDeck.PARENT_DECK_ID);
            if (parent) parent.children.push(deckMap.get(newDeck.DECK_ID));
          }
          render();
        }
      });
      popup.remove();
      // Refetch decks and re-render
    };

    cancelBtn.onclick = (e) => {
      e.stopPropagation();
      popup.remove();
    };

    popup.append(input, saveBtn, cancelBtn);

    // Add popup to container
    container.appendChild(popup);
  }

  render();
}