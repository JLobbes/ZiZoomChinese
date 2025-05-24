// models/cards/create.js

const db = require('../../lib/db');

async function createFlashCard(flashcard) {
  const conn = await db.getConnection();

  console.log('received flashcard data:', flashcard);

  try {
    const query = `
      INSERT INTO FLASHCARDS (
        DECK_ID, 
        FLASHCARD_ENG, 
        FLASHCARD_CHN, 
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
      flashcard.deckID, // Default Chinese deck, Languages is Deck 1 
      flashcard.english,
      flashcard.chinese, 
      flashcard.pinyin,
      flashcard.imgPath, 
      flashcard.selected_area.x, 
      flashcard.selected_area.y,
      flashcard.selected_area.width, 
      flashcard.selected_area.height,
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
