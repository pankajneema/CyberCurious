# CyberSentinel

Unified Cyber Risk Orchestration Platform by CuriousDevs

## Overview

CyberSentinel combines Attack Surface Management (ASM), automated vulnerability scanning, adversary emulation, and compliance automation into a single cockpit. Predict, test, and remediate cyber risks with enterprise-grade security.

## Architecture

- **Frontend**: Next.js 14 (App Router) with TypeScript, Tailwind CSS
- **Backend**: API Service (FastAPI)
  - Single API Service with organized routes
  - Background workers for heavy processing
- **Infrastructure**: Kubernetes, Terraform
- **Databases**: PostgreSQL, ClickHouse, Redis

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Python 3.11+ (for backend services)

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:3000

### Backend Services (Local)

```bash
docker-compose up
```

This starts:
- PostgreSQL (port 5432)
- Redis (port 6379)
- ClickHouse (ports 8123, 9000)
- API Service (port 8000)

### Backend API Service

```bash
# API Service
cd backend/api-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Project Structure

```
CyberCurious/
├── frontend/          # Next.js application
├── backend/           # Backend services
│   ├── api-service/  # Main API with all routes
│   └── workers/      # Background workers
├── infrastructure/    # Terraform & K8s configs
└── docs/             # Documentation
```

## Features

### Available (MVP)
- ✅ Landing page with marketing content
- ✅ Authentication (signup, login, SSO)
- ✅ Dashboard with risk scoring
- ✅ Attack Surface Management (ASM)
- ✅ Vulnerability Scanning (VS)

### Coming Soon
- Breach & Attack Simulation (BAS)
- Threat Intelligence
- Incident Response Orchestration
- Compliance & Audit automation
- Marketplace for expert services

## Environment Variables

See `.env.local.example` in frontend directory and `.env.example` in each backend service.

## Development

### Running Tests

```bash
# Frontend
cd frontend
npm test

# Backend
cd backend/auth-service
pytest
```

### Building for Production

```bash
# Frontend
cd frontend
npm run build
npm start

# Backend services use Docker
docker build -t cybersentinel-auth-service ./backend/auth-service
```

## API Documentation

API documentation is available at:
- API Service: http://localhost:8000/docs (Swagger UI)
- See `docs/API.md` for complete API reference

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

Proprietary - CuriousDevs © 2024

## Support

For support, email support@cybersentinel.com or visit our [contact page](/contact).

