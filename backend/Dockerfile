FROM node:20-slim

# Install OpenSSL - required by Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Pass dummy DATABASE_URL inline so Prisma WASM validator sees it during build.
# The real DATABASE_URL from Railway is injected at container runtime.
RUN DATABASE_URL="postgresql://user:password@localhost:5432/db" npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3333

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
