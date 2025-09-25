const express = require('express');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 5000;

// Check for required environment variables at startup
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is required but not set in environment variables');
  process.exit(1);
}

// Initialize Gemini AI - From javascript_gemini integration
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Function to generate essay using Gemini AI
async function generateEssayWithGemini(tema) {
  const prompt = `Escreva uma redação completa em português brasileiro sobre o tema: "${tema}"

Por favor, siga a estrutura clássica de redação:
- Introdução (com apresentação do tema e tese)
- Desenvolvimento (2-3 parágrafos com argumentos fundamentados)
- Conclusão (com retomada da tese e proposta de solução)

A redação deve ter entre 25-30 linhas, linguagem culta, argumentos consistentes, e seguir as normas da língua portuguesa. Use conectivos apropriados e desenvolva ideias de forma clara e coerente.

Tema: ${tema}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  if (!response.text) {
    throw new Error('Gemini retornou resposta vazia');
  }

  return response.text;
}

// API endpoint for essay generation
app.post('/api/redacao', async (req, res) => {
  const { tema } = req.body;
  
  if (!tema) {
    return res.status(400).json({ error: 'Tema é obrigatório' });
  }

  try {
    const redacao = await generateEssayWithGemini(tema);
    res.json({ redacao });
  } catch (error) {
    console.error('Erro na API de redação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
});
