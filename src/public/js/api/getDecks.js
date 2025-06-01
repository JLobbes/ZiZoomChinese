// public/js/api/getDecks.js

export async function getDecks() {
  try {
    const res = await fetch('/api/decks');
    if (!res.ok) throw new Error('Failed to fetch decks');
    const data = await res.json();
    return data.decks; 
  } catch (err) {
    console.error('getDecks error:', err);
    return [];
  }
}