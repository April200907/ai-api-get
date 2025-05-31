const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Make sure this is set in Render Environment
});

// Home route (optional)
app.get("/", (req, res) => {
  res.send("✅ AI API is working! Use POST to interact.");
});

// AI route
app.post("/ai", async (req, res) => {
  const prompt = req.body.message;

  if (!prompt) {
    return res.status(400).json({ error: "Missing 'message' in request body." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    });

    const reply = completion.choices[0].message.content.trim();
    res.json({ reply });

  } catch (err) {
    console.error("❌ OpenAI Error:", err);
    res.status(500).json({ error: "Something went wrong with OpenAI." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
