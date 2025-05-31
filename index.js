require("dotenv").config();
const express = require("express");
const { OpenAI } = require("openai");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.send("✅ AI API is working! Use POST /ai to interact.");
});

app.post("/ai", async (req, res) => {
  try {
    const prompt = req.body.message;
    if (!prompt) return res.status(400).json({ error: "Walang message." });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
