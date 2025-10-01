require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.use(express.json());

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'O prompt é obrigatório.' });
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.send({ generatedText: text });
  } catch (error) {
    console.error('Error in API route:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao gerar o texto no servidor.' });
  }
});

// A Vercel gerencia o servidor, então não precisamos de app.listen()
// A linha abaixo é o que permite à Vercel usar seu app Express
module.exports = app;
