#!/bin/bash
set -e

echo "========================================="
echo "HRIS Application Setup"
echo "========================================="

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "Node.js version: $(node -v)"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed."
    exit 1
fi

echo "npm version: $(npm -v)"

# Create .env file if not exists
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo ""
echo "Generating Prisma client..."
npx prisma generate

# Test dependencies
echo ""
echo "Testing dependencies..."
node test_connection.js

echo ""
echo "========================================="
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "  Option 1 - Docker (recommended):"
echo "    docker-compose up -d"
echo ""
echo "  Option 2 - Local development:"
echo "    1. Start PostgreSQL locally"
echo "    2. Update DATABASE_URL in .env"
echo "    3. npm run db:push"
echo "    4. npm run db:seed"
echo "    5. npm run dev"
echo ""
echo "Access: http://localhost:3000"
echo "========================================="
