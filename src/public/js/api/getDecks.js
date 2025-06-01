// public/js/api/getDecks.js

export async function getDecks() {
  try {
    const res = await fetch('/api/decks');
    if (!res.ok) throw new Error('Failed to fetch decks');
    const data = await res.json();
    return data; // Expected: [{ DECK_ID, DECK_NAME, PARENT_DECK_ID }, ...]
  } catch (err) {
    console.error('getDecks error:', err);
    return [];
  }
}
