// public/js/getImages.js

export function getImages() {
  return fetch('/api/images')
    .then(res => res.json())
    .catch(err => {
      console.error('Error loading image list:', err);
      throw err; // rethrow the error for further handling if needed
    });
}