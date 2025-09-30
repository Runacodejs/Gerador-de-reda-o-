
require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.json());

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.send({ generatedText: text });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while generating text.');
  }
});

app.get('/api', (req, res) => {
  res.send('Hello from the API!');
});

module.exports = app;
