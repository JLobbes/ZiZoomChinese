// src/models/decks/read_all.js

const db = require('../../lib/db');

async function readAll() {
  const conn = await db.getConnection();

  try {
    const query = `
      SELECT DECK_ID, DECK_NAME, PARENT_DECK_ID
      FROM DECKS
    `;

    const rows = await conn.query(query);

    return rows;
  } finally {
    conn.release();
  }
}

module.exports = { readAll };
