// public/js/api/deleteDeck.js

export async function deleteDeck(deckId) {
  try {
    const res = await fetch('/api/decks/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deckId }),
    });
    const data = await res.json();
    console.log('Response from deleteDeck API:', data);
    if (!data.success) throw new Error('Failed to delete deck');
    return data.success;
  } catch (err) {
    alert('Error deleting deck: ' + err.message);
  }
}