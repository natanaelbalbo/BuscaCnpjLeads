FROM node:20-slim

# Install OpenSSL - required by Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Disable @prisma/client postinstall hook that auto-runs `prisma generate`
# during `npm ci` — at that point DATABASE_URL doesn't exist yet.
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1

RUN npm ci

# Now run generate manually with a dummy URL so Prisma WASM can validate the schema.
# The real DATABASE_URL from Railway is injected at container runtime.
RUN DATABASE_URL="postgresql://user:password@localhost:5432/db" npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3333

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
