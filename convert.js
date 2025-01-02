const fs = require('fs');
const path = require('path');

// Specify the path to your JPEG file
const filePath = './media_file'; // Replace with your actual file path

// Read the JPEG file and convert it to Base64
fs.readFile(filePath, (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  const base64Image = data.toString('base64');
  console.log('Base64 Encoded Image:');
  console.log(`data:image/jpeg;base64,${base64Image}`);
  
  // Optionally write the Base64 image to a file
  fs.writeFile('image_base64.txt', `data:image/jpeg;base64,${base64Image}`, (writeErr) => {
    if (writeErr) {
      console.error('Error writing the Base64 file:', writeErr);
    } else {
      console.log('Base64 image written to image_base64.txt');
    }
  });
});