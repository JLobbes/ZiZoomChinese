// server/routes/decks.js

const express = require('express');
const { readAll } = require('../models/decks/read_all');

const router = express.Router();

// GET /api/decks
router.get('/', async (req, res) => {
  try {
    const decks = await readAll();
    res.status(200).json({ decks });
  } catch (err) {
    console.error('Error retrieving decks:', err);
    res.status(500).json({ error: 'Failed to retrieve decks' });
  }
});

module.exports = router;

