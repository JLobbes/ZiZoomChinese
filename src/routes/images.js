// src/images.js

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
  const imagesDir = path.join(__dirname, '..', 'images');
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read directory' });
    }
    const imageFiles = files.filter(file => /\.(jpe?g|png|gif|webp)$/i.test(file));
    res.json(imageFiles);
  });
});

module.exports = router;
