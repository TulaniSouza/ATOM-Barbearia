# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# Aproveita o cache de camadas para dependências
COPY package.json package-lock.json* ./
RUN npm install

# Copia o código fonte e gera o build de produção
COPY . .
RUN npm run build

# Stage 2: Production Runtime
FROM nginx:alpine

# Configuração personalizada do Nginx para suportar SPA (Vite/React)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia apenas os arquivos estáticos gerados no build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
