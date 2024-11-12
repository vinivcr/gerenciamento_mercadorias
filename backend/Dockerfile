# backend/Dockerfile
FROM python:3.9

# Configurar diretório de trabalho
WORKDIR /app

# Copiar arquivos de código e requisitos
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Expor a porta onde o Flask irá rodar
EXPOSE 5000

# Rodar o Flask
CMD ["python", "app.py"]
