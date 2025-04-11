const express = require('express');
const cors = require('cors');
const fs = require('fs').promises; // Using promises version for cleaner async/await
const path = require('path');
const app = express();
const PORT = 6061;

const jsonFilesDirectory = path.join(__dirname, 'public', '/json');

app.use(cors());

app.get('/', (req, res) => {
    const absolutePath = path.join(__dirname, 'public', 'gallery.html');
    res.sendFile(absolutePath);
});

app.use(express.static('public'));

// Helper function to get file creation date
async function getFileCreationDate(filePath) {
    try {
        const stats = await fs.stat(filePath);
        return stats.birthtime;
    } catch (err) {
        console.error('Error getting file stats:', err);
        return new Date(0); // Return epoch date if error
    }
}

// Modified endpoint to categorize files by date
app.get('/api/read-files', async (req, res) => {
    try {
        const files = await fs.readdir(jsonFilesDirectory);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        // Get creation dates for all files
        const fileDetails = await Promise.all(
            jsonFiles.map(async (filename) => {
                const filePath = path.join(jsonFilesDirectory, filename);
                const creationDate = await getFileCreationDate(filePath);
                return {
                    filename,
                    creationDate
                };
            })
        );

        // Split files into categories
        const cutoffDate = new Date('2025-01-01');
        const result = {
            recent: [],
            archive: []
        };

        fileDetails.forEach(file => {
            if (file.creationDate >= cutoffDate) {
                result.recent.push(file.filename);
            } else {
                result.archive.push(file.filename);
            }
        });

        // Sort both arrays by filename
        result.recent.sort();
        result.archive.sort();

        res.json(result);
    } catch (err) {
        console.error('Error processing files:', err);
        res.status(500).send('Error processing files');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
