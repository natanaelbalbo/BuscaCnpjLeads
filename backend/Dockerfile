FROM node:20-slim

# Install OpenSSL - required by Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Dummy DATABASE_URL for build time — both `prisma` CLI and `@prisma/client`
# run postinstall hooks during `npm ci` that validate the schema and need this.
# Railway injects the REAL DATABASE_URL at container runtime, overriding this.
ENV DATABASE_URL="postgresql://user:password@localhost:5432/db"

RUN npm ci
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3333

CMD ["sh", "-c", "npx prisma db push && node dist/server.js"]
