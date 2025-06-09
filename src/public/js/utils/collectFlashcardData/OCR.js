// // public/js/utils/collectFlashcardData/OCR.js

const progressSteps = [
  "loading tesseract core",
  "initializing tesseract",
  "initialized tesseract",
  "loading language traineddata",
  "loaded language traineddata",
  "initializing api",
  "initialized api",
  "recognizing text"
];

const ranges = [
  [0, 5],
  [5, 10],
  [10, 15],
  [15, 30],
  [30, 35],
  [35, 45],
  [45, 50],
  [50, 100]
];

function getProgressPercent(status, progress) {
  const stepIndex = progressSteps.indexOf(status);
  if (stepIndex === -1) {
    return Math.round(progress * 100);
  }
  const [start, end] = ranges[stepIndex];
  return Math.round(start + progress * (end - start));
}

export function ocrImageFromCanvas(canvas, onProgress) {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(
      canvas.toDataURL(),
      'eng', // later add 'chi_sim' for Chinese support
      {
        logger: m => {
          // Calculate percentage progress
          if (m.status && typeof m.progress === 'number') {
            const percent = getProgressPercent(m.status, m.progress);
            // Send % progress out to UI if callback provided
            if (onProgress) onProgress(percent);
          }

          // log for debugging
          // console.log(m);
        }
      }
    )
      .then(({ data: { text } }) => {
        resolve(text.trim());
      })
      .catch(reject);
  });
}

