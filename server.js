import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// DON'T DELETE THIS COMMENT
// Using Gemini integration blueprint: javascript_gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

app.use(express.json());
app.use(express.static("public"));

// Rota para gerar redação com Gemini
app.post("/api/redacao", async (req, res) => {
  try {
    const { tema } = req.body;
    if (!tema) return res.status(400).json({ error: "Tema é obrigatório." });

    const prompt = `Escreva uma redação completa e bem estruturada sobre o seguinte tema: "${tema}".`;

    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const texto = response.text() || "Não foi possível gerar a redação.";
    res.json({ redacao: texto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao gerar redação." });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Redação Turbo rodando em http://0.0.0.0:${PORT}`);
});
