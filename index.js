const express = require("express");
const cors = require("cors");
require("dotenv").config();

let genai;
try {
  genai = require("@google/genai");
} catch (err) {
  console.error("Error loading @google/genai package:", err);
  process.exit(1);
}

// Handle if the package uses default export or direct export
if (genai.default) genai = genai.default;

const {
  TextGenerationClient,
  TextGenerationModel,
  GenerativeAIClient,
  GenerativeAIModel,
} = genai;

// Detect which client/model classes exist
const ClientClass =
  TextGenerationClient ||
  GenerativeAIClient ||
  null;
const ModelClass =
  TextGenerationModel ||
  GenerativeAIModel ||
  null;

if (!ClientClass || !ModelClass) {
  console.error(
    "Could not find suitable client/model classes in @google/genai exports:",
    Object.keys(genai)
  );
  process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
  console.error("ERROR: GEMINI_API_KEY not set in environment variables.");
  process.exit(1);
}

const client = new ClientClass({ apiKey: process.env.GEMINI_API_KEY });
const model = new ModelClass(client, "models/text-bison-001");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/gemini", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Missing prompt." });

  try {
    const response = await model.generate({
      prompt,
      maxTokens: 512,
    });
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
