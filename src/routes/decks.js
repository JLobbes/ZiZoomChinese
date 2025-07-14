// server/routes/decks.js

const express = require('express');
const { readAll } = require('../models/decks/read_all');
const { createDeck } = require('../models/decks/create');

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

router.post('/create', async (req, res) => {
  const { name, parentId } = req.body;
  try {
    await createDeck({ name, parentId }).then(newDeck => {
      console.log('From ../routes/decks.js: New deck created:', newDeck);
      if (!newDeck) {
        throw new Error('Failed to create deck');
      }
      res.json({ newDeck }); 
      console.log(' :', );
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

