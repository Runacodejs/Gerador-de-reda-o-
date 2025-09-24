from google import genai

# Inicializa o cliente com sua chave de API
client = genai.Client(api_key="AIzaSyAU5o2I3NMaGx4d5fv4RW7lixgJ15J5pdw")

# Lista de temas de redação (você pode adicionar mais)
temas = [
    "A importância da educação no Brasil",
        "O impacto das redes sociais na juventude",
            "Sustentabilidade e preservação ambiental",
                "Tecnologia e futuro do trabalho"
                ]

                # Gera redações para todos os temas da lista
                for tema in temas:
                    print(f"\n--- Redação sobre: {tema} ---\n")
                        response = client.models.generate_content(
                                model="gemini-2.5-flash",
                                        contents=f"Escreva uma redação sobre '{tema}', com introdução, desenvolvimento e conclusão."
                                            )
                                                print(response.text)
                                                    print("\n===============================\n")