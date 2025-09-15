from jinja2 import Environment, FileSystemLoader
import os
import markdown

# Pasta dos templates e criação da pasta de saída
template_dir = 'templates'
env = Environment(loader=FileSystemLoader(template_dir))
os.makedirs("rotas", exist_ok=True)

# Processa todos os templates filhos
for arquivo in os.listdir(template_dir):
    if arquivo.endswith(".html") and arquivo != "base.html":
        template = env.get_template(arquivo)

        # Caminho do Markdown correspondente
        md_path = f"textos/{arquivo.replace('.html', '.md')}"
        conteudo_html = ""  # valor padrão: vazio, mantém conteúdo do template se não houver Markdown

        if os.path.exists(md_path):
            with open(md_path, "r", encoding="utf-8") as f:
                conteudo_md = f.read()
            conteudo_html = markdown.markdown(conteudo_md)

        # Renderiza template passando o Markdown convertido como 'texto'
        html_final = template.render(texto=conteudo_html)

        # Salva HTML final na pasta 'rotas'
        with open(f"rotas/{arquivo}", "w", encoding="utf-8") as f:
            f.write(html_final)

print("✅ HTML finais gerados na pasta 'rotas/' com Markdown, quando disponível!")
# Para rodar: python gerar_rota.py
