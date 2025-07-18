// models/decks/delete.js

const db = require('../../lib/db');

async function deleteDeck(deckId) {
  const conn = await db.getConnection();
  try {
    // Query the parent deck ID first
    const [parentRows] = await conn.query(
      'SELECT PARENT_DECK_ID FROM DECKS WHERE DECK_ID = ?',
      [deckId]
    );
    const parentOfDeleted = parentRows.length > 0 ? parentRows[0].PARENT_DECK_ID : null;

    // Delete the deck
    const result = await conn.query(
      'DELETE FROM DECKS WHERE DECK_ID = ?',
      [deckId]
    );
    console.log('From ../models/decks/delete.js: Deck deleted with ID:', deckId);

    return {
      DELETED_DECK_ID: deckId,
      PARENT_DECK_ID: parentOfDeleted
    };
  } finally {
    conn.release();
  }
}

module.exports = { deleteDeck };