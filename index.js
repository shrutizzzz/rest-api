const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // To parse JSON requests

// Hardcoded user details
const userDetails = {
  user_id: "john_doe_17091999",
  email: "john@xyz.com",
  roll_number: "ABCD123",
};

// POST method for the /bfhl route
app.post('/bfhl', (req, res) => {
  const data = req.body.data;

  if (!Array.isArray(data)) {
    return res.status(400).json({ is_success: false, message: "Invalid input" });
  }

  const numbers = data.filter(item => !isNaN(item));
  const alphabets = data.filter(item => isNaN(item));
  const highestAlphabet = alphabets.length ? [alphabets.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).pop()] : [];

  res.json({
    is_success: true,
    user_id: userDetails.user_id,
    email: userDetails.email,
    roll_number: userDetails.roll_number,
    numbers: numbers,
    alphabets: alphabets,
    highest_alphabet: highestAlphabet
  });
});

// GET method for the /bfhl route
app.get('/bfhl', (req, res) => {
  res.json({
    operation_code: 1
  });
});

// Start the server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
