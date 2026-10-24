# EstateHub - DevOps & Deployment Guide

## 1. Local Development Prerequisites
- **Java**: 21 LTS
- **Node.js**: 20+ (Node 26 supported)
- **npm**: 10+
- **PostgreSQL**: 14+ (Local port 5432 or via Docker)
- **Maven**: 3.9+ (or included wrapper)
- **Docker & Docker Compose**: Optional for containerized deployment

## 2. Environment Configuration
Copy `.env.example` to `.env` in the root and set appropriate variables:
```bash
cp .env.example .env
```

Key environment parameters:
- `DB_HOST`: PostgreSQL hostname (default: `localhost`)
- `DB_PORT`: PostgreSQL port (default: `5432`)
- `DB_NAME`: Database name (default: `realestate_db`)
- `DB_USER`: Database username (default: `postgres`)
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: 256-bit hexadecimal or Base64 secret key
- `JWT_EXPIRATION_MS`: 86400000 (24 hours)
- `UPLOAD_DIR`: Local folder for uploaded property images (e.g. `./uploads`)
- `CORS_ALLOWED_ORIGINS`: Frontend URL (default: `http://localhost:5173,http://localhost:3000`)

## 3. Running Locally Without Containers

### Database Setup
Ensure PostgreSQL is running and the database exists:
```sql
CREATE DATABASE realestate_db;
```

### Running Backend (Spring Boot 3.3.4)
```bash
cd backend
mvn spring-boot:run
```
The backend initializes database tables via Flyway and starts on `http://localhost:8080`.
Swagger UI is accessible at `http://localhost:8080/swagger-ui/index.html`.

### Running Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
The frontend starts on `http://localhost:5173`.

## 4. Containerized Deployment with Docker Compose
To run PostgreSQL, Backend, and Frontend together:
```bash
docker-compose up --build -d
```
Services:
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8080`
- **PostgreSQL**: `localhost:5432`

## 5. Production Hardening Checklist
- [ ] Set unique, strong `JWT_SECRET` in environment variables.
- [ ] Enforce SSL/TLS via reverse proxy (e.g., Nginx, Caddy, Cloudflare).
- [ ] Configure S3 or Cloudinary storage credentials for externalized asset storage.
- [ ] Configure transactional SMTP provider in `application.yml` for email notifications.
- [ ] Set up periodic automated PostgreSQL pg_dump backups.
