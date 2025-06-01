const express = require("express");
const cors = require("cors");
const { TextGenerationClient, TextGenerationModel } = require("@google/genai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
  console.error("ERROR: GEMINI_API_KEY not set in environment variables.");
  process.exit(1);
}

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
    // The output text is inside candidates[0].output
    const reply = response?.candidates?.[0]?.output || "No response from model.";
    res.json({ success: true, reply });
  } catch (err) {
    console.error("Error generating content:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
