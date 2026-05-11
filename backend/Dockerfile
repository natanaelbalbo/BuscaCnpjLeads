FROM node:20-alpine

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

# At runtime, DATABASE_URL is available from Railway environment variables
# prisma db push applies the schema to the PostgreSQL database
CMD ["sh", "-c", "npx prisma db push && node dist/server.js"]
