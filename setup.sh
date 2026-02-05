#!/bin/bash

echo "🚀 Setting up Laravel + Inertia + React + Docker project..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "📦 Starting Docker containers..."
docker-compose up -d

echo ""
echo "⏳ Waiting for containers to be ready..."
sleep 10

echo ""
echo "📥 Installing Composer dependencies..."
docker-compose exec -T app composer install

echo ""
echo "🔑 Generating application key..."
docker-compose exec -T app php artisan key:generate

echo ""
echo "📝 Setting up database..."
docker-compose exec -T app php artisan migrate --force

echo ""
echo "🔐 Setting permissions..."
docker-compose exec -T app chmod -R 777 storage bootstrap/cache

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 You can now access the application at:"
echo "   - Main App: http://localhost:8000"
echo "   - Vite HMR: http://localhost:5173"
echo ""
echo "📝 Note: The Node.js container will automatically install npm packages"
echo "   and start the Vite dev server. This may take a few minutes."
echo ""
echo "🔍 To view logs, run: docker-compose logs -f"
