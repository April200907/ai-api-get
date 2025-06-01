const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

const DEEPAI_API_KEY = process.env.DEEPAI_API_KEY;

app.post("/api/upscale", async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: "Missing imageUrl in request body" });
  }

  try {
    // Call DeepAI Super Resolution API
    const response = await axios.post(
      "https://api.deepai.org/api/torch-srgan",
      { image: imageUrl },
      { headers: { "api-key": DEEPAI_API_KEY } }
    );

    if (response.data && response.data.output_url) {
      return res.json({ success: true, upscaledImage: response.data.output_url });
    } else {
      return res.status(500).json({ error: "Failed to upscale image" });
    }
  } catch (error) {
    console.error("Upscale API error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Error processing the upscale request" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Upscale API running on port ${PORT}`);
});
