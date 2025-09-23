import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// Rota para gerar redação com Gemini
app.post("/api/redacao", async (req, res) => {
  try {
      const { tema } = req.body;
          if (!tema) return res.status(400).json({ error: "Tema é obrigatório." });

              const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
                    method: "POST",
                          headers: {
                                  "Content-Type": "application/json",
                                          "X-goog-api-key": process.env.GEMINI_API_KEY
                                                },
                                                      body: JSON.stringify({
                                                              contents: [
                                                                        {
                                                                                    parts: [
                                                                                                  {
                                                                                                                  text: `Escreva uma redação completa e bem estruturada sobre o seguinte tema: "${tema}".`
                                                                                                                                }
                                                                                                                                            ]
                                                                                                                                                      }
                                                                                                                                                              ]
                                                                                                                                                                    })
                                                                                                                                                                        });

                                                                                                                                                                            const data = await response.json();

                                                                                                                                                                                const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Não foi possível gerar a redação.";

                                                                                                                                                                                    res.json({ redacao: texto });
                                                                                                                                                                                      } catch (error) {
                                                                                                                                                                                          console.error(error);
                                                                                                                                                                                              res.status(500).json({ error: "Erro ao gerar redação." });
                                                                                                                                                                                                }
                                                                                                                                                                                                });

                                                                                                                                                                                                app.listen(PORT, () => {
                                                                                                                                                                                                  console.log(`🚀 Redação Turbo rodando em http://localhost:${PORT}`);
                                                                                                                                                                                                  });