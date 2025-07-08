// src/routes/cards.js

const express = require('express');
const { createFlashcard } = require('../models/cards/create');
const { updateFlashcard } = require('../models/cards/update'); 
const { deleteFlashcard } = require('../models/cards/delete'); 
const { getCardsRecursive } = require('../models/cards/read_by_deck_recursive');
const { readByImgPath } = require('../models/cards/read_by_imgPath');
const { updateFlashcardReviewDuration } = require('../models/cards/update_review_duration');

const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const id = await createFlashcard(req.body.card);
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

router.put('/update', async (req, res) => {
  try {
    const updated = await updateFlashcard(req.body.card);
    if (updated) {
      res.status(200).json({ success: true, flashcardId: req.body.card.id });
    } else {
      res.status(404).json({ success: false, error: 'Flashcard not found' });
    }
  } catch (err) {
    console.error('Error updating flashcard:', err);
    res.status(500).json({ error: 'Failed to update flashcard' });
  }
});

router.put('/update_review_duration', async (req, res) => {
  try {
    const { flashcardId, duration } = req.body;
    console.log('Updating flashcard duration:', 'Card:', flashcardId, 'New Duration:', duration);
    if (!flashcardId || typeof duration !== 'number') {
      return res.status(400).json({ success: false, error: 'Missing flashcardId or duration' });
    }
    const updated = await updateFlashcardReviewDuration(flashcardId, duration); 
    if (updated) {
      res.status(200).json({ success: true, flashcardId });
    } else {
      res.status(404).json({ success: false, error: 'Flashcard not found' });
    }
  } catch (err) {
    console.error('Error updating flashcard duration:', err);
    res.status(500).json({ error: 'Failed to update flashcard duration' });
  }
});

router.delete('/delete', async (req, res) => {
  try {
    const cardId = req.body.cardId;
    if (!cardId) {
      return res.status(400).json({ success: false, error: 'Missing cardId' });
    }
    const deleted = await deleteFlashcard(cardId);
    if (deleted) {
      res.status(200).json({ success: true, cardId });
    } else {
      res.status(404).json({ success: false, error: 'Flashcard not found' });
    }
  } catch (err) {
    console.error('Error deleting flashcard:', err);
    res.status(500).json({ success: false, error: 'Failed to delete flashcard' });
  }
});

module.exports = router;
