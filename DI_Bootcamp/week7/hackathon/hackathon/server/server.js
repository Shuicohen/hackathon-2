const express = require('express');
const db = require('../config/db.js');
const bodyParser = require('body-parser');
const cors = require('cors'); // Enable CORS to allow front-end access
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Log requests for debugging
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
});

// Serve project data from JSON file
app.get('/api/projects', (req, res) => {
    console.log('Fetching project data from JSON file...');
    try {
        const filePath = path.join(__dirname, '..', 'projects.json');  // Adjusted path
        const projects = JSON.parse(fs.readFileSync(filePath, 'utf-8'));  // Read and parse JSON
        res.json(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
        res.status(500).json({ error: 'Failed to load projects.' });
    }
});

app.post('/contact', async (req, res) => {
    console.log('Received contact form data:', req.body);  // Log incoming form data for debugging

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        console.error('Missing form data');
        return res.status(400).send('Missing form data');
    }

    try {
        await db('contacts').insert({ name, email, message });
        console.log('Data inserted into database');  // Log success
        res.status(200).send('Message received and stored!');
    } catch (error) {
        console.error('Error saving the message:', error);  // Log any database errors
        res.status(500).send('Error saving the message.');
    }
});


// db('contacts').insert({
//     name: 'Test Name',
//     email: 'test@example.com',
//     message: 'This is a test message.'
// })
// .then(() => {
//     console.log('Test data inserted successfully.');
// })
// .catch(err => {
//     console.error('Error inserting test data:', err);
// });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
