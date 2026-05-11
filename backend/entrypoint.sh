#!/bin/sh
set -e

echo "=== DIAGNOSTIC: Checking environment ==="

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is NOT set!"
  echo ""
  echo "=== All database/postgres related vars: ==="
  env | grep -i database || echo "(none found with 'database')"
  env | grep -i postgres || echo "(none found with 'postgres')"
  env | grep -i pg || echo "(none found with 'pg')"
  echo ""
  echo "=== All environment variables: ==="
  env | sort
  echo ""
  echo "FIX: Go to Railway Dashboard → Backend Service → Variables tab"
  echo "     Add: DATABASE_URL = \${{Postgres.DATABASE_URL}}"
  exit 1
fi

echo "DATABASE_URL is set ✓"
echo "Running prisma db push..."
npx prisma db push --skip-generate

echo "Starting server..."
exec node dist/server.js
