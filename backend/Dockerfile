FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm ci
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["node", "dist/server.js"]

