# Laravel + Inertia.js + React + Docker E-Commerce Project

This is a modern full-stack e-commerce application built with:
- **Laravel 11** - PHP backend framework
- **Laravel Boost** - AI-assisted development enhancement
- **Inertia.js** - Modern monolith architecture
- **React 18** - Frontend UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast frontend build tool
- **Docker** - Containerization platform
- **MySQL 8.0** - Database
- **Nginx** - Web server

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed on your system
- Git (optional, for version control)

### Installation Steps

1. **Navigate to the project directory:**
   ```bash
   cd /home/savosik/projects/ecom
   ```

2. **Build and start Docker containers:**
   ```bash
   docker-compose up -d
   ```

3. **Install PHP dependencies:**
   ```bash
   docker-compose exec app composer install
   ```

4. **Generate application key:**
   ```bash
   docker-compose exec app php artisan key:generate
   ```

5. **Run database migrations:**
   ```bash
   docker-compose exec app php artisan migrate
   ```

6. **Set proper permissions:**
   ```bash
   docker-compose exec app chmod -R 777 storage bootstrap/cache
   ```

7. **Install Node.js dependencies (if needed manually):**
   The Node container automatically runs `npm install && npm run dev` on startup.
   
   If you need to rebuild:
   ```bash
   docker-compose exec node npm install
   docker-compose exec node npm run build
   ```

## 🌐 Access the Application

- **Main Application**: http://localhost:8000
- **Vite Dev Server**: http://localhost:5173 (for HMR)
- **Database**: localhost:3306
  - Database: `ecom`
  - Username: `ecom_user`
  - Password: `password`

## 📦 Docker Services

- **app** - PHP-FPM 8.2 (Laravel application)
- **nginx** - Nginx web server
- **db** - MySQL 8.0 database
- **node** - Node.js 18 (for Vite and frontend build)

## 🛠️ Useful Commands

### Docker Commands
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up -d --build
```

### Laravel Artisan Commands
```bash
# Run migrations
docker-compose exec app php artisan migrate

# Create a new controller
docker-compose exec app php artisan make:controller YourController

# Create a new model
docker-compose exec app php artisan make:model YourModel -m

# Clear cache
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan route:clear
```

### Node/NPM Commands
```bash
# Install dependencies
docker-compose exec node npm install

# Run dev server
docker-compose exec node npm run dev

# Build for production
docker-compose exec node npm run build
```

### Laravel Boost Commands
```bash
# Start Laravel Boost MCP server (for AI assistants)
docker-compose exec app php artisan boost:mcp

# Update Laravel Boost guidelines
docker-compose exec app php artisan boost:update

# View all boost commands
docker-compose exec app php artisan list boost
```

## 📁 Project Structure

```
ecom/
├── app/                    # Laravel application code
│   ├── Http/
│   │   ├── Controllers/    # Controllers
│   │   └── Middleware/     # Middleware (including Inertia)
│   └── Models/             # Eloquent models
├── bootstrap/              # Laravel bootstrap files
├── config/                 # Configuration files
├── database/               # Migrations, seeders, factories
├── docker/                 # Docker configuration files
│   ├── nginx/              # Nginx configuration
│   └── php/                # PHP configuration
├── public/                 # Public web root
├── resources/              # Frontend resources
│   ├── css/                # CSS files
│   ├── js/                 # React components
│   │   ├── Pages/          # Inertia pages
│   │   └── Components/     # Reusable React components
│   └── views/              # Blade templates
├── routes/                 # Application routes
├── storage/                # Storage for logs, cache, etc.
├── .env                    # Environment variables
├── composer.json           # PHP dependencies
├── package.json            # Node dependencies
├── vite.config.js          # Vite configuration
└── docker-compose.yml      # Docker Compose configuration
```

## 🎨 Frontend Development

The project uses Inertia.js to create a modern single-page application experience without building an API.

### Creating a New Page

1. Create a new React component in `resources/js/Pages/`:
   ```jsx
   // resources/js/Pages/YourPage.jsx
   import React from 'react';
   import { Head } from '@inertiajs/react';

   export default function YourPage() {
       return (
           <>
               <Head title="Your Page" />
               <div>Your content here</div>
           </>
       );
   }
   ```

2. Add a route in `routes/web.php`:
   ```php
   use Inertia\Inertia;

   Route::get('/your-page', function () {
       return Inertia::render('YourPage');
   });
   ```

## 🔧 Configuration

### Laravel Boost (AI Development Enhancement)

This project includes **Laravel Boost v1.8.10**, which enhances AI-assisted development by providing:

- **MCP Server**: Real-time context about your Laravel application (routes, models, database schema)
- **Version-Specific Documentation**: Accurate Laravel 11.x API documentation for AI assistants
- **AI Guidelines**: Best practices and framework conventions for generating quality code

#### Using Laravel Boost with AI Assistants

Laravel Boost works with AI coding assistants like:
- GitHub Copilot
- Cursor
- VS Code with AI extensions
- Claude Desktop
- Other MCP-compatible tools

**MCP Configuration:**
The boost MCP server command is configured for Docker:
```bash
docker-compose exec -T app php artisan boost:mcp
```

**Available Boost Tools:**
- Database schema inspection
- Route listing and analysis
- Model relationships
- Configuration reading
- And more...

For more information, visit: https://boost.laravel.com

### Database Configuration
Edit `.env` file to change database settings:
```env
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=ecom
DB_USERNAME=ecom_user
DB_PASSWORD=password
```

### Application URL
```env
APP_URL=http://localhost:8000
```

## 🐛 Troubleshooting

### Permission Issues
```bash
docker-compose exec app chmod -R 777 storage bootstrap/cache
```

### Clear All Caches
```bash
docker-compose exec app php artisan optimize:clear
```

### Rebuild Docker Containers
```bash
docker-compose down
docker-compose up -d --build
```

### Node Modules Issues
```bash
docker-compose exec node rm -rf node_modules
docker-compose exec node npm install
```

## 📚 Learn More

- [Laravel Documentation](https://laravel.com/docs)
- [Inertia.js Documentation](https://inertiajs.com)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)

## 📝 License

This project is open-sourced software licensed under the MIT license.
