# Usa uma imagem base do Python
FROM python:3.10

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos do backend para o diretório de trabalho
COPY . .

# Instala as dependências
RUN pip install -r requirements.txt

# Expõe a porta onde o backend vai rodar (ajuste conforme a configuração do app.py)
EXPOSE 5000

# Comando para iniciar o backend
CMD ["python", "app.py"]
