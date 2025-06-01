const express = require("express");
const cors = require("cors");
const { TextGenerationModel, TextGenerationClient } = require("@google/genai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new TextGenerationClient({ apiKey: process.env.GEMINI_API_KEY });
const model = new TextGenerationModel(client, "models/text-bison-001");

app.post("/api/gemini", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Missing prompt." });

  try {
    const response = await model.generate({
      prompt,
      maxTokens: 512,
    });
    res.json({ success: true, reply: response.candidates[0].output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("✅ Server running on port 3000");
});
