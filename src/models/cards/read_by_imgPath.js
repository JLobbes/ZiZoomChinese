// models/cards/read_by_imgPath.js

const db = require('../../lib/db');

async function readByImgPath(imgPath) {
  const conn = await db.getConnection();

  try {
    // Query to fetch all flashcards
    const query = `
      SELECT 
        FLASHCARD_ID, 
        DECK_ID, 
        FLASHCARD_REAR, 
        FLASHCARD_FRONT, 
        FLASHCARD_PINYIN,
        FLASHCARD_SOURCE_IMG_PATH, 
        FLASHCARD_CROP_X, 
        FLASHCARD_CROP_Y,
        FLASHCARD_CROP_WIDTH, 
        FLASHCARD_CROP_HEIGHT,
        FLASHCARD_LAST_REVIEWED, 
        FLASHCARD_NEXT_REVIEW,
        FLASHCARD_REVIEW_COUNT, 
        FLASHCARD_INCORRECT_COUNT,
        FLASHCARD_EASE_FACTOR
      FROM FLASHCARDS
      WHERE FLASHCARD_SOURCE_IMG_PATH = ?`;

    const values = [
      imgPath
    ];

    // Execute the query
    const rows = await conn.query(query, values);

    // Return all the matches for flashcards
    return rows;

  } finally {
    conn.release();
  }
}

module.exports = { readByImgPath };
