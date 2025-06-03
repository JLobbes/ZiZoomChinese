// public/js/api/getFlashcardsByDeck.js

export async function getCardsByDeck(deckID) {
  const res = await fetch(`/api/cards/byDeck/${deckID}`);
  if (!res.ok) throw new Error('Failed to fetch cards');
  return await res.json();
}
