FROM node:20-slim

# Install OpenSSL - required by Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and prisma schema first
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDeps for build)
RUN npm ci

# Generate Prisma client (does NOT need DATABASE_URL)
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 3333

# DATABASE_URL is injected by Railway at runtime
CMD ["sh", "-c", "npx prisma db push && node dist/server.js"]
