const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 6060; // Port number for the server
const jsonFilesDirectory = path.join(__dirname, '/json-files'); 

// Endpoint to list all JSON files
app.get('/api/json-files', (req, res) => {
  fs.readdir(jsonFilesDirectory, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).send('Error reading directory');
    }

    const jsonFiles = files.filter(file => file.endsWith('.json'));
    res.json(jsonFiles);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

