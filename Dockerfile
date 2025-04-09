FROM node:18-alpine 
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=$

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate
# RUN npx prisma migrate deploy
RUN npm run build

# COPY .env /app/.env

EXPOSE 3000

ENTRYPOINT ["npm", "start"]
