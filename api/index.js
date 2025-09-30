
require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'O prompt é obrigatório.' });
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.send({ generatedText: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao gerar o texto.' });
  }
});

app.get('/api', (req, res) => {
  res.send('Hello from the API!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
