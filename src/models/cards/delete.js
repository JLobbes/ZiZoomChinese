// models/cards/delete.js

const db = require('../../lib/db');

async function deleteFlashcard(cardId) {
  const conn = await db.getConnection();

  console.log('received cardId for delete:', cardId);

  try {
    const query = `
      DELETE FROM FLASHCARDS
      WHERE FLASHCARD_ID = ?`;

    const values = [cardId];

    const result = await conn.query(query, values);
    return result.affectedRows > 0;
  } finally {
    conn.release();
  }
}

module.exports = { deleteFlashcard }