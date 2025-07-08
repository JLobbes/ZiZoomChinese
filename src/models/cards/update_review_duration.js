// src/models/cards/update_review_duration.js

const db = require('../../lib/db');

async function updateFlashcardReviewDuration(flashcardId, duration) {
  const conn = await db.getConnection();
  try {
    const query = `
      UPDATE FLASHCARDS
      SET FLASHCARD_LAST_REVIEW_DURATION = ?
      WHERE FLASHCARD_ID = ?
    `;
    const values = [duration, flashcardId];
    const result = await conn.query(query, values);
    return result.affectedRows > 0;
  } finally {
    conn.release();
  }
}

module.exports = { updateFlashcardReviewDuration }; 