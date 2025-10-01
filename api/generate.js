
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inicializa o cliente do Gemini AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Exporta a função serverless que a Vercel irá executar
export default async function handler(req, res) {
  // Permite que a API seja chamada de qualquer origem (CORS) e especifica que é um POST
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Lida com a requisição pre-flight do CORS
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'O prompt é obrigatório.' });
    }
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Envia a resposta de volta para o frontend
    res.status(200).json({ generatedText: text });

  } catch (error) {
    console.error('Error in serverless function:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao gerar o texto no servidor.' });
  }
}
