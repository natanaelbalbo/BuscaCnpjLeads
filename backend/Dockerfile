FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Build-time only: dummy URL so Prisma postinstall hooks pass during npm ci
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm ci
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

COPY . .

RUN npm run build

# Copy the entrypoint script
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 8080

# Railway MUST inject DATABASE_URL at runtime. The entrypoint script
# checks for it and shows diagnostics if missing.
CMD ["./entrypoint.sh"]
