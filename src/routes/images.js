// src/routes/images.js

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

function getAllImages(dir, baseUrl = 'images') {
  let results = [];

  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(getAllImages(fullPath, path.join(baseUrl, file)));
    } else if (/\.(jpe?g|png|gif|webp)$/i.test(file)) {
      results.push({
        name: path.basename(file, path.extname(file)),
        path: path.join(baseUrl, file)
      });
    }
  });

  return results;
}

router.get('/', (req, res) => {
  const imagesDir = path.join(__dirname, '..', 'public', 'images');

  try {
    const imageData = getAllImages(imagesDir);
    res.json(imageData);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read directory' });
  }
});

module.exports = router;
