const fs = require('fs');

// Path to the text file containing the Base64 string
const inputFilePath = './image_base64.txt';

// Path to save the decoded image
const outputImagePath = './decoded_image.jpeg';

// Read the Base64 string from the file
fs.readFile(inputFilePath, 'utf8', (err, base64Data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  // Remove the prefix (if present) to decode the pure Base64 data
  const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');

  // Decode and save the image
  const imageBuffer = Buffer.from(base64Image, 'base64');
  fs.writeFile(outputImagePath, imageBuffer, (writeErr) => {
    if (writeErr) {
      console.error('Error writing the image file:', writeErr);
    } else {
      console.log(`Image successfully saved as ${outputImagePath}`);
    }
  });
});
