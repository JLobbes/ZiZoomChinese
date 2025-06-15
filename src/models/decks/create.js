const db = require('../../lib/db');

async function createDeck({ name, parentId }) {
  
  const conn = await db.getConnection();
  try {
    const result = await conn.query(
      'INSERT INTO DECKS (DECK_NAME, PARENT_DECK_ID) VALUES (?, ?)',
      [name, parentId || null]
    );
    console.log('Deck created with ID:', result.insertId);
    return result.insertId;
  } finally {
    conn.release();
  }
}

module.exports = { createDeck };