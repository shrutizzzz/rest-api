const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mime = require('mime-types');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
const upload = multer(); // For file uploads

// POST Endpoint
app.post('/bfhl', upload.single('file'), (req, res) => {
    const { full_name, dob, collegeEmail, collegeRollNo, data } = req.body;

    // User ID formatting
    const user_id = `${full_name.replace(/\s+/g, '_')}_${dob.split('-').reverse().join('')}`;

    // Initialize arrays
    const numbers = [];
    const alphabets = [];
    let highestLowercase = [];
    let file_valid = false;
    let file_mime_type = null;
    let file_size_kb = 0;

    // Process input data
    if (data && Array.isArray(data)) {
        data.forEach(item => {
            if (!isNaN(item)) {
                numbers.push(item);
            } else if (typeof item === 'string' && item.length === 1) {
                alphabets.push(item);
            }
        });

        // Find the highest lowercase alphabet
        const lowercaseAlphabets = alphabets.filter(char => char >= 'a' && char <= 'z');
        if (lowercaseAlphabets.length > 0) {
            const highestAlphabet = lowercaseAlphabets.sort().pop();
            highestLowercase.push(highestAlphabet);
        }
    }

    // File handling
    if (req.file) {
        file_valid = true;
        file_mime_type = mime.lookup(req.file.originalname);
        file_size_kb = (req.file.size / 1024).toFixed(2); // Size in KB
    }

    // Response object
    const response = {
        is_success: true,
        user_id: user_id,
        email: collegeEmail,
        roll_number: collegeRollNo,
        numbers: numbers,
        alphabets: alphabets,
        highest_lowercase_alphabet: highestLowercase,
        file_valid: file_valid,
        file_mime_type: file_mime_type,
        file_size_kb: file_size_kb
    };

    res.json(response);
});

// GET Endpoint
app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
