# Ecotunga Backend

## Description
Ecotunga is an innovative platform that connects farmers with consumers, promoting sustainable agriculture and local food systems. The backend service provides robust APIs for user authentication, product management, order processing, and real-time communication between farmers and consumers.

## Repository
[GitHub Repository](https://github.com/your-username/ecotunga)

## Tech Stack

- Node.js
- Express.js
- MySQL (with Knex.js as query builder)
- JWT for authentication
- bcryptjs for password hashing

## Environment Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm or yarn package manager
- Git

### Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/ecotunga.git
cd ecotunga_backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=ecotunga_db

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development

# Email Configuration (if needed)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

4. Set up the database:
```bash
# Create database
mysql -u root -p
CREATE DATABASE ecotunga_db;

# Run migrations
npx knex migrate:latest

# Seed the database (if needed)
npx knex seed:run
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
ecotunga_backend/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── migrations/     # Database migrations
├── routes/         # API routes
├── server.js       # Main application file
└── knexfile.js     # Knex configuration
```

## Designs

### Figma Mockups
[View Figma Design](https://www.figma.com/design/kpt0ILLjeMGhvAQOrBaDWX/EcoTunga?node-id=0-1&p=f&t=h7zQ29e96jOAixid-0)

### Application Screenshots
![Login Screen](docs/screenshots/login.png)
![Dashboard](docs/screenshots/dashboard.png)
![Product List](docs/screenshots/products.png)

## Deployment Plan

### 1. Production Environment Setup
- Set up a production server (e.g., AWS EC2, DigitalOcean)
- Configure domain and SSL certificates
- Set up CI/CD pipeline

### 2. Database Setup
- Set up production MySQL database
- Configure database backups
- Set up database replication (if needed)

### 3. Deployment Steps
```bash
# Build the application
npm run build

# Deploy to production
npm run deploy
```

### 4. Monitoring and Maintenance
- Set up logging (e.g., Winston, ELK Stack)
- Configure monitoring tools (e.g., New Relic, Datadog)
- Set up automated backups
- Configure error tracking (e.g., Sentry)

### 5. Security Measures
- Enable HTTPS
- Configure firewall rules
- Set up rate limiting
- Implement security headers
- Regular security audits

## Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with hot-reload
- `npm test`: Run tests
- `npm run lint`: Run linting
- `npm run build`: Build the application

## API Documentation

The API endpoints are organized in the `routes` directory. Each route file corresponds to a specific resource or feature of the application. For detailed API documentation, please refer to the [API Documentation](docs/api.md).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 