// server/routes/decks.js

app.get('/api/decks', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM DECKS');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
