const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 6061; // Port number for the server
const jsonFilesDirectory = path.join(__dirname, 'public', '/json'); 

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// webroot path
app.get('/', (req, res) => {
  // Construct the absolute path to the gallery.html file
  const absolutePath = path.join(__dirname, 'public', 'gallery.html');
  
  // Send the file as the response
  res.sendFile(absolutePath);
});

// static file serving
app.use(express.static('public'));

// Endpoint to list all JSON
app.get('/api/read-files', (req, res) => {
  fs.readdir(jsonFilesDirectory, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).send('Error reading directory', jsonFilesDirectory);
    }

    console.log(`fetching files...`);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    res.json(jsonFiles);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


