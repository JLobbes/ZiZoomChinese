// public/js/api/updateFlashcard.js

export async function updateCardInDatabase(card) {
  console.log('card to update:', card);

  try {
    const response = await fetch(`/api/cards/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ card }),
    });

    const data = await response.json();

    if (data.success) {
      console.log(`Card successfully updated. Card ID: ${card.id || data.flashcardId}`);
    } else {
      console.error('Failed to update card in DB');
    }
  } catch (err) {
    console.error('Error updating card:', err);
  }
}

export async function updateReviewDurationInDatabase(flashcardId, duration) {
  try {
    const response = await fetch(`/api/cards/update_review_duration`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flashcardId, duration }),
    });
    const data = await response.json();
    if (!data.success) {
      console.error('Failed to update card duration in DB');
    }
  } catch (err) {
    console.error('Error updating card duration:', err);
  }
}