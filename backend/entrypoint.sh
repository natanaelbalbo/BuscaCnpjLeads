#!/bin/sh
set -e

echo "=== Starting backend ==="
echo "PORT: $PORT"
echo "NODE_ENV: $NODE_ENV"
echo "DATABASE_URL is set: $([ -n "$DATABASE_URL" ] && echo 'yes' || echo 'NO!')"

echo ""
echo "Running prisma db push..."
npx prisma db push --accept-data-loss --skip-generate 2>&1 || {
  echo "WARNING: prisma db push failed, trying to start server anyway..."
}

echo ""
echo "Starting server..."
exec node dist/server.js
