from google import genai
import os

# Inicializa o cliente com sua chave de API
client = genai.Client(api_key="AIzaSyAU5o2I3NMaGx4d5fv4RW7lixgJ15J5pdw")

# Lista de temas de redação
temas = [
    "A importância da educação no Brasil",
    "O impacto das redes sociais na juventude",
    "Sustentabilidade e preservação ambiental",
    "Tecnologia e futuro do trabalho"
]

# Cria uma pasta para salvar as redações, se não existir
if not os.path.exists("redacoes"):
    os.makedirs("redacoes")

# Gera redações e salva em arquivos
for i, tema in enumerate(temas, start=1):
    print(f"Gerando redação sobre: {tema} ...")
    
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"Escreva uma redação sobre '{tema}', com introdução, desenvolvimento e conclusão."
    )
    
    texto = response.text
    
    # Salva cada redação em um arquivo .txt
    nome_arquivo = f"redacoes/redacao_{i}.txt"
    with open(nome_arquivo, "w", encoding="utf-8") as f:
        f.write(f"Tema: {tema}\n\n")
        f.write(texto)
    
    print(f"Redação salva em: {nome_arquivo}\n")

print("Todas as redações foram geradas e salvas!")
