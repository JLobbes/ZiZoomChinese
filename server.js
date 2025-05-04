const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use('/images', express.static('images'));

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

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
