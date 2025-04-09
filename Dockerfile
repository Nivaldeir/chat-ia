FROM node:18-alpine 
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npm run build

# COPY .env /app/.env

EXPOSE 3000

ENTRYPOINT ["npm", "start"]
