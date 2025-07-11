# Ecotunga Backend - Docker Setup

This document provides instructions for running the Ecotunga backend using Docker.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. **Clone and navigate to the backend directory:**
   ```bash
   cd ecotunga_backend
   ```

2. **Copy the environment file:**
   ```bash
   cp env.example .env
   ```

3. **Edit the .env file with your configuration:**
   ```bash
   nano .env
   ```
   
   Update the following variables:
   - `JWT_SECRET`: A strong secret key for JWT tokens
   - `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`: Your email configuration
   - Database credentials if you want to change defaults

4. **Build and start the services:**
   ```bash
   docker-compose up --build
   ```

5. **Run database migrations and seeds (in a new terminal):**
   ```bash
   docker-compose exec backend npm run migrate
   docker-compose exec backend npm run seed
   ```

## Services

The Docker setup includes:

- **Backend API**: Node.js application running on port 5001
- **MySQL Database**: MySQL 8.0 running on port 3306

## Environment Variables

### Database Configuration
- `DB_HOST`: Database host (default: mysql)
- `DB_USER`: Database user (default: ecotunga_user)
- `DB_PASSWORD`: Database password (default: ecotunga_password)
- `DB_NAME`: Database name (default: ecotunga)
- `DB_ROOT_PASSWORD`: MySQL root password (default: rootpassword)

### JWT Configuration
- `JWT_SECRET`: Secret key for JWT tokens

### Email Configuration
- `SMTP_HOST`: SMTP server host
- `SMTP_PORT`: SMTP server port (default: 587)
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password
- `SMTP_FROM`: From email address

### Server Configuration
- `PORT`: Server port (default: 5001)
- `NODE_ENV`: Environment (default: development)

## Useful Commands

### Start services
```bash
docker-compose up
```

### Start services in background
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f backend
```

### Access MySQL
```bash
docker-compose exec mysql mysql -u ecotunga_user -p ecotunga
```

### Run migrations
```bash
docker-compose exec backend npm run migrate
```

### Run seeds
```bash
docker-compose exec backend npm run seed
```

### Access backend container
```bash
docker-compose exec backend sh
```

## Data Persistence

- MySQL data is persisted in a Docker volume named `mysql_data`
- Uploads directory is mounted to `./uploads` for file persistence

## Health Checks

- MySQL: Checks if the database is responding
- Backend: Checks if the API is responding on port 5001

## Troubleshooting

### Database Connection Issues
1. Ensure MySQL container is healthy:
   ```bash
   docker-compose ps
   ```

2. Check MySQL logs:
   ```bash
   docker-compose logs mysql
   ```

### Backend Issues
1. Check backend logs:
   ```bash
   docker-compose logs backend
   ```

2. Restart the backend service:
   ```bash
   docker-compose restart backend
   ```

### Port Conflicts
If port 5001 or 3306 are already in use, modify the ports in `docker-compose.yml`:
```yaml
ports:
  - "5002:5001"  # Change external port
```

## Production Considerations

For production deployment:

1. Use strong passwords and secrets
2. Enable SSL/TLS
3. Set up proper backup strategies
4. Configure proper logging
5. Use environment-specific configurations
6. Consider using Docker secrets for sensitive data 