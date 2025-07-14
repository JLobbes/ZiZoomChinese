// public/js/api/createDeck.js

export async function createDeck(name, parentId) {
  try {
    const res = await fetch('/api/decks/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, parentId }),
    });
    const data = await res.json();
    console.log('Response from createDeck API:', data);
    if (!data.newDeck) throw new Error('Failed to create deck');
    return data.newDeck;
  } catch (err) {
    alert('Error creating deck: ' + err.message);
  }
}