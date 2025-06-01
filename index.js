const express = require("express");
const cors = require("cors");
const { GenerativeAI } = require("@google/genai");  // <-- Correct import
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GenerativeAI({ apiKey: process.env.GEMINI_API_KEY });  // <-- Correct instantiation

app.post("/api/gemini", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Missing prompt." });

  try {
    const model = genAI.getModel("models/text-bison-001"); // example model id, adjust if needed
    const result = await model.generate({
      prompt: prompt,
      maxTokens: 512,
    });
    res.json({ success: true, reply: result?.candidates?.[0]?.output || "" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("✅ Server running on port 3000");
});
