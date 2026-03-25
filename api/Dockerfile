FROM node:18-alpine

WORKDIR /app

# Copiar package.json
COPY package*.json ./

RUN npm install

# Instalar dependencias
RUN npm ci --only=production

# Copiar código del servidor
COPY server.js ./

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "server.js"]
