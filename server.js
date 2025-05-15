const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { createFlashCard } = require('./model/cards/create');
const { readByImgPath } = require('./model/cards/read_by_imgPath');

const app = express();
const PORT = 3000;

// ====  MIDDLEWARE ====

app.use(bodyParser.json()); // Parse JSON request bodies
app.use(express.static('public')); // Serve static files from /public
app.use('/images', express.static('images')); // Serve images from /images

// ==== API ROUTES ====

app.get('/api/images', (req, res) => {
  const imagesDir = path.join(__dirname, 'images');
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read directory' });
    }
    const imageFiles = files.filter(file => /\.(jpe?g|png|gif|webp)$/i.test(file));
    res.json(imageFiles);
  });
});

app.post('/api/cards/create', async (req, res) => {
  try {
    const id = await createFlashCard(req.body.card);
    res.status(201).json({ flashcardId: id });
  } catch (err) {
    console.error('Error adding flashcard:', err);
    res.status(500).json({ error: 'Failed to add flashcard' });
  }
});

app.post('/api/cards/read_by_imgPath', async (req, res) => {
  try {
    const imagePath = req.body.imgPath
    const flashcards = await readByImgPath(imagePath);
    res.status(201).json({ flashcards });
  } catch (err) {
    console.error('Error retrieving flashcard:', err);
    res.status(500).json({ error: 'Failed to retrieve flashcard data for img:', imagePath });
  }
});

// ==== SERVER START ====

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
