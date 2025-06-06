// src/routes/cards.js

const express = require('express');
const { createFlashCard } = require('../models/cards/create');
const { readByImgPath } = require('../models/cards/read_by_imgPath');
const { getCardsRecursive } = require('../models/cards/read_by_deck_recursive');

const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const id = await createFlashCard(req.body.card);
    res.status(201).json({ flashcardId: id });
  } catch (err) {
    console.error('Error adding flashcard:', err);
    res.status(500).json({ error: 'Failed to add flashcard' });
  }
});

router.post('/read_by_imgPath', async (req, res) => {
  try {
    const imagePath = req.body.imgPath;
    const flashcards = await readByImgPath(imagePath);
    res.status(200).json({ flashcards });
  } catch (err) {
    console.error('Error retrieving flashcard:', err);
    res.status(500).json({ error: 'Failed to retrieve flashcard data' });
  }
});

router.get('/byDeck/:deckID', async (req, res) => {
  const deckID = parseInt(req.params.deckID);
  if (isNaN(deckID)) return res.status(400).json({ error: 'Invalid deck ID' });

  try {
    const cards = await getCardsRecursive(deckID);
    res.status(200).json( cards );
  } catch (err) {
    console.error('Error fetching cards recursively:', err);
    res.status(500).json({ error: 'Failed to fetch flashcards' });
  }
});

module.exports = router;
