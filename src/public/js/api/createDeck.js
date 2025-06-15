// public/js/api/createDeck.js

export async function createDeck(name, parentId) {
  try {
    const res = await fetch('/api/decks/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, parentId }),
    });
    const data = await res.json();
    console.log('New Deck retrieved from backend:', data.deckId);
    if (!data.deckId) throw new Error('Failed to create deck');
    return data.deckId;
  } catch (err) {
    alert('Error creating deck: ' + err.message);
  }
}