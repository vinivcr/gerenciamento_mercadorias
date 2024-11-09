# Usar a imagem do Nginx para servir os arquivos estáticos do frontend
FROM nginx:alpine

# Copiar a build do frontend para o diretório do Nginx
COPY build /usr/share/nginx/html

# Copiar o package-lock.json caso precise para dependências ou para verificar o arquivo
COPY package-lock.json /usr/share/nginx/

# Expor a porta 80 para o frontend
EXPOSE 3000

# Comando para rodar o nginx
CMD ["nginx", "-g", "daemon off;"]
