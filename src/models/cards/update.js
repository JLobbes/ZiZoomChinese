// models/cards/update.js

const db = require('../../lib/db');

async function updateFlashcard(flashcard) {
  const conn = await db.getConnection();

  console.log('received flashcard data for update:', flashcard);

  try {
    const query = `
      UPDATE FLASHCARDS SET
        DECK_ID = ?,
        FLASHCARD_REAR = ?,
        FLASHCARD_FRONT = ?,
        FLASHCARD_PINYIN = ?,
        FLASHCARD_SOURCE_IMG_PATH = ?,
        FLASHCARD_CROP_X = ?,
        FLASHCARD_CROP_Y = ?,
        FLASHCARD_CROP_WIDTH = ?,
        FLASHCARD_CROP_HEIGHT = ?,
        FLASHCARD_LAST_REVIEWED = ?,
        FLASHCARD_LAST_REVIEW_DURATION = ?
      WHERE FLASHCARD_ID = ?`; 

    const values = [
      flashcard.DECK_ID,
      flashcard.FLASHCARD_REAR,
      flashcard.FLASHCARD_FRONT,
      flashcard.FLASHCARD_PINYIN,
      flashcard.FLASHCARD_SOURCE_IMG_PATH,
      flashcard.FLASHCARD_CROP_X,
      flashcard.FLASHCARD_CROP_Y,
      flashcard.FLASHCARD_CROP_WIDTH,
      flashcard.FLASHCARD_CROP_HEIGHT,
      flashcard.FLASHCARD_LAST_REVIEWED,
      flashcard.FLASHCARD_LAST_REVIEW_DURATION,
      flashcard.FLASHCARD_ID 
    ];

    const result = await conn.query(query, values);
    return result.affectedRows > 0;
  } finally {
    conn.release();
  }
}

module.exports = { updateFlashcard };