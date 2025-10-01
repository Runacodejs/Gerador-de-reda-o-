
require('dotenv').config();
const OpenAI = require('openai');

// Inicializa o cliente da OpenAI com a nova chave de API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
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

    // Chama a API da OpenAI para gerar o texto
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Um modelo rápido e eficiente
      messages: [
        { role: "system", content: "Você é um assistente de escrita criativa que gera redações completas." },
        { role: "user", content: prompt }
      ],
    });

    // Extrai o texto gerado da resposta
    const generatedText = completion.choices[0].message.content;

    res.status(200).json({ generatedText: generatedText });

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: `Erro no servidor ao chamar a API da OpenAI: ${error.message}` });
  }
};
