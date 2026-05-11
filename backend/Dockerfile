FROM node:20-slim

# Install OpenSSL - required by Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and prisma schema first
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDeps for build)
RUN npm ci

# Provide a dummy DATABASE_URL at build time so Prisma WASM can validate
# the schema without the real connection string (only needed at runtime).
# Railway injects the real DATABASE_URL as a runtime environment variable.
ARG DATABASE_URL=postgresql://user:password@localhost:5432/db
ENV DATABASE_URL=${DATABASE_URL}

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 3333

# DATABASE_URL is injected by Railway at runtime
CMD ["sh", "-c", "npx prisma db push && node dist/server.js"]
