# Dockerfile para Railway - Backend
FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (necesarias para el build)
RUN npm ci

# Copiar código del backend
COPY backend/ ./backend/

# Exponer puerto (Railway asigna el puerto automáticamente)
EXPOSE 3001

# Comando para iniciar el servidor
CMD ["node", "backend/index.js"]

