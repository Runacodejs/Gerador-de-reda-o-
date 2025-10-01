
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Usa module.exports para compatibilidade com o ambiente Node.js padrão da Vercel
module.exports = async (req, res) => {
  // Define os cabeçalhos para permitir CORS (Cross-Origin Resource Sharing)
  // Isso permite que o seu site chame a API, mesmo que no futuro eles estejam em domínios diferentes.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // A Vercel lida com requisições OPTIONS automaticamente, mas é uma boa prática ter isso.
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // O corpo da requisição já é parseado pela Vercel em projetos de API como este.
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'O prompt é obrigatório.' });
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.status(200).json({ generatedText: text });

  } catch (error) {
    console.error('Error in serverless function:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao gerar o texto no servidor.' });
  }
};
