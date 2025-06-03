// models/cards/read_by_deck_recursive.js

const db = require('../../lib/db');

async function getCardsRecursive(deckID) {
  const conn = await db.getConnection();

  try {
    const query = `
      WITH RECURSIVE deck_tree AS (
        SELECT DECK_ID FROM DECKS WHERE DECK_ID = ?
        UNION ALL
        SELECT d.DECK_ID FROM DECKS d
        INNER JOIN deck_tree dt ON d.PARENT_DECK_ID = dt.DECK_ID
      )
      SELECT * FROM FLASHCARDS WHERE DECK_ID IN (SELECT DECK_ID FROM deck_tree)
    `;

    const rows = await conn.query(query, [deckID]);
    console.log('cards found:', rows);
    return rows;

  } finally {
    conn.release();
  }
}

module.exports = { getCardsRecursive };
