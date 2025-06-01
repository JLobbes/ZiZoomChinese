// src/routes/cards.js

const express = require('express');
const { createFlashCard } = require('../models/cards/create');
const { readByImgPath } = require('../models/cards/read_by_imgPath');

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

module.exports = router;
