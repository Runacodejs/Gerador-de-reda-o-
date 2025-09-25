const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

// Vercel serverless function
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { tema } = req.body;

  if (!tema) {
    return res.status(400).json({ error: 'Tema é obrigatório' });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY não está configurada');
    return res.status(500).json({ error: 'Configuração do servidor incorreta' });
  }

  try {
    const redacao = await generateEssayWithGemini(tema);
    res.status(200).json({ redacao });
  } catch (error) {
    console.error('Erro na API de redação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
