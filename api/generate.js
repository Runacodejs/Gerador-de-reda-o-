
require('dotenv').config();
const OpenAI = require('openai');

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

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "Você é um assistente especialista em redação. Sua tarefa é gerar redações bem estruturadas, com introdução, desenvolvimento e conclusão, sobre o tema fornecido. Use uma linguagem clara, coesa e persuasiva." 
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    const generatedText = completion.choices[0].message.content.trim();

    res.status(200).json({ generatedText });

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    let errorMessage = 'Ocorreu um erro no servidor ao processar sua solicitação.';
    if (error.response) {
      errorMessage = `Erro da API: ${error.response.status} ${error.response.data.error.message}`;
    } else if (error.message) {
      errorMessage = `Erro na solicitação: ${error.message}`;
    }
    res.status(500).json({ error: errorMessage });
  }
};
