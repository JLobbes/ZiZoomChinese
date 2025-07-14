// models/decks/create.js

const db = require('../../lib/db');

async function createDeck({ name, parentId }) {
  
  const conn = await db.getConnection();
  try {
    const result = await conn.query(
      'INSERT INTO DECKS (DECK_NAME, PARENT_DECK_ID) VALUES (?, ?)',
      [name, parentId || null]
    );

    const deckId = Number(result.insertId); // or String(result.insertId)
    const rows = await conn.query(
      'SELECT * FROM DECKS WHERE DECK_ID = ?',
      [deckId]
    );

    console.log('From ../models/decks/create.js: Deck created with ID:', Number(result.insertId));
    return rows[0];
  } finally {
    conn.release();
  }
}

module.exports = { createDeck };