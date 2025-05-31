const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('✅ LLaMA API is running! Send POST /ai with { prompt }');
});

app.post('/ai', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    if (!prompt) return res.status(400).json({ error: 'Walang prompt.' });

    // HuggingFace LLaMA 2 7B chat model (walang API key needed para demo, pero may limit)
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf',
      {
        inputs: prompt,
        parameters: { max_new_tokens: 100 },
      }
      // No headers needed here for free endpoint
    );

    const data = response.data;

    // HuggingFace response usually nasa ganitong format:
    const output = data?.generated_text || data?.[0]?.generated_text || 'Walang sagot.';

    res.json({ response: output });
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
    res.status(500).json({ error: '❌ May error sa AI request.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
