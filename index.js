require('dotenv').config();
const express = require('express');
const gemini = require('./ai/gemini');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.send('✅ Gemini AI API is running.');
});

// Gemini route
app.post('/api/gemini', gemini);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});
