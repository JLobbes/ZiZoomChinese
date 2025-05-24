// public/js/api/saveFlashCard.js

export async function saveCardToDatabase(card) {
  console.log('card to push:', card);

  try {
    const response = await fetch('/api/cards/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ card }),
    });

    const data = await response.json(); // ✅ Wait for the body to parse

    if (data.flashcardId) {
      console.log(`Card succesfully created. Card ID: ${data.flashcardId}`);
    } else {
      console.error('Failed to save card to DB');
    }
  } catch (err) {
    console.error('Error saving card:', err);
  }
}