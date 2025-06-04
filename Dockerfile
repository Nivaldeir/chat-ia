FROM node:18-alpine

WORKDIR /app

# Instala as dependências
COPY package.json package-lock.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Variáveis de ambiente para OpenAI e o Banco
ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Gera o cliente Prisma
RUN npx prisma generate

# Aplica as migrações no banco (para produção, usa migrate deploy)
RUN npx prisma migrate deploy

# Build do Next.js
RUN npm run build

# Porta que a aplicação expõe
EXPOSE 3000

# Comando para rodar o container
CMD ["npm", "start"]
