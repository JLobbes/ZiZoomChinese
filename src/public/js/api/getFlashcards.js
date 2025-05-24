// public/js/api/getFlashcards.js

export async function fetchFlashcardsData(imgPath) {
  try {
    console.log('Fetching flashcards data for image:', imgPath);

    const response = await fetch('/api/cards/read_by_imgPath', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imgPath }),
    });

    const data = await response.json();
    console.log('received flashcards (given imgPath):', data.flashcards);
    console.log('data type:', typeof data.flashcards);

    if (data.flashcards && Array.isArray(data.flashcards)) {
      return data.flashcards;
    } else {
      return [];
    }
  } catch (err) {
    console.error('Error fetching flashcards:', err);
    return [];
  }
}
