# Quick Start Guide

## 🎯 One-Command Setup

Run the setup script to automatically configure everything:

```bash
./setup.sh
```

This will:
1. ✅ Start all Docker containers
2. ✅ Install PHP dependencies via Composer
3. ✅ Generate Laravel application key
4. ✅ Run database migrations
5. ✅ Set proper file permissions

## 🌐 Access Points

After setup completes:

- **Application**: http://localhost:8000
- **Vite Dev Server**: http://localhost:5173

## 📋 Manual Setup (Alternative)

If you prefer manual setup:

```bash
# 1. Start Docker containers
docker-compose up -d

# 2. Install PHP dependencies
docker-compose exec app composer install

# 3. Generate app key
docker-compose exec app php artisan key:generate

# 4. Run migrations
docker-compose exec app php artisan migrate

# 5. Fix permissions
docker-compose exec app chmod -R 777 storage bootstrap/cache
```

## 🔧 Development Workflow

### Start Development
```bash
docker-compose up -d
```

### Stop Development
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f node
```

### Rebuild (after changes to Docker config)
```bash
docker-compose up -d --build
```

## 🎨 Frontend Development

The Vite dev server runs automatically with hot module replacement (HMR).

Edit files in:
- `resources/js/Pages/` - React page components
- `resources/js/Components/` - Reusable React components  
- `resources/css/app.css` - Tailwind CSS styles

Changes will automatically reload in your browser!

## 🗄️ Database

Access MySQL:
- **Host**: localhost
- **Port**: 3306
- **Database**: ecom
- **Username**: ecom_user
- **Password**: password

Or via Docker:
```bash
docker-compose exec db mysql -u ecom_user -p ecom
```

## 📦 Adding Dependencies

### PHP (Composer)
```bash
docker-compose exec app composer require package-name
```

### JavaScript (NPM)
```bash
docker-compose exec node npm install package-name
```

## 🐛 Common Issues

### Port already in use
Change ports in `docker-compose.yml`:
- nginx: `8000:80` → `8080:80`
- mysql: `3306:3306` → `3307:3306`
- node: `5173:5173` → `5174:5173`

### Permission denied
```bash
docker-compose exec app chmod -R 777 storage bootstrap/cache
```

### Clear Laravel cache
```bash
docker-compose exec app php artisan optimize:clear
```

## 🚀 Next Steps

1. ✅ Visit http://localhost:8000 to see the welcome page
2. ✅ Click "Go to Dashboard" to see the dashboard page
3. ✅ Start building your e-commerce features!

## 📚 Documentation

- Full documentation: See [README.md](README.md)
- Laravel: https://laravel.com/docs
- Inertia.js: https://inertiajs.com
- React: https://react.dev
