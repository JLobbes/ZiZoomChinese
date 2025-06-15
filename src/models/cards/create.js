// models/cards/create.js

const db = require('../../lib/db');

async function createFlashCard(flashcard) {
  const conn = await db.getConnection();

  console.log('received flashcard data:', flashcard);

  try {
    const query = `
      INSERT INTO FLASHCARDS (
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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      flashcard.deckID, // Default deck is 'Decks' 
      flashcard.rear,
      flashcard.front, 
      flashcard.pinyin,
      flashcard.imgPath, 
      flashcard.imageSnippit.x, 
      flashcard.imageSnippit.y,
      flashcard.imageSnippit.width, 
      flashcard.imageSnippit.height,
      null, 
      null,
      null, 
      null,
      null,
    ];

    const result = await conn.query(query, values);
    return (Number(result.insertId));
    
  } finally {
    conn.release();
  }
}

module.exports = { createFlashCard };
