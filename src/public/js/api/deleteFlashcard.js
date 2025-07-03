// public/js/api/deleteFlashcard.js

export async function deleteFlashcard(cardId) {
  console.log('card to delete:', cardId);

  try {
    const response = await fetch(`/api/cards/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cardId }),
    });

    const data = await response.json();

    if (data.success) {
      console.log(`Card successfully deleted. Card ID: ${cardId}`);
    } else {
      console.error('Failed to delete card in DB');
      throw new Error('Failed to delete card in DB');
    }
  } catch (err) {
    console.error('Error deleting card:', err);
    throw err;
  }
}