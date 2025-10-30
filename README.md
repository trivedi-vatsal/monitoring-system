# Service Status Monitoring System

A comprehensive, full-stack monitoring solution for tracking the health and uptime of multiple services across different client organizations. Built with modern technologies and designed for reliability, security, and real-time insights.

## 🎯 Overview

This system provides automated health monitoring for services, credential encryption, real-time status updates, and a beautiful dashboard for visualizing service health across multiple clients.

### Key Features

- ✅ **Automated Health Checks** - Scheduled monitoring with configurable cron patterns
- 🏢 **Multi-Client Support** - Organize and monitor services by client organizations
- 🔐 **Secure Credential Management** - Encrypted Basic Auth credentials at rest
- 📊 **Real-time Dashboard** - Live status updates via WebSocket
- 📈 **Uptime Analytics** - Track availability and performance over time
- 🔔 **Status Notifications** - Get alerted when services go down
- 🎨 **Modern UI** - Responsive, accessible dashboard built with Next.js
- 🔌 **REST & WebSocket API** - Comprehensive backend API

## 🏗️ Architecture

```
monitoring-system/
├── backend/          # FeathersJS API server
│   ├── PostgreSQL database
│   ├── pg-boss job scheduler
│   ├── REST + WebSocket APIs
│   └── Credential encryption
│
└── dashboard/        # Next.js frontend
    ├── Real-time monitoring UI
    ├── Service management
    ├── Analytics & charts
    └── Client organization
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 20.19.0
- **PostgreSQL** >= 12
- **npm** or **pnpm** package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd monitoring-system
   ```

2. **Set up the backend**

   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your database URL and encryption key
   
   # Run migrations
   npm run migrate
   
   # Start backend server
   npm run dev
   ```

   Backend will run at `http://localhost:3030`

3. **Set up the dashboard**

   ```bash
   cd ../dashboard
   npm install
   
   # Create .env.local file
   echo "NEXT_PUBLIC_API_URL=http://localhost:3030" > .env.local
   
   # Start dashboard
   npm run dev
   ```

   Dashboard will run at `http://localhost:3000`

### Environment Variables

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://username:password@localhost:5432/monitoring_db
ENCRYPTION_KEY=your-32-character-encryption-key-here
HOST=localhost
PORT=3030
```

**Dashboard** (`dashboard/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3030
```

## 📚 Documentation

- **[Backend Documentation](./backend/README.md)** - API server, database, and health checking
- **[Dashboard Documentation](./dashboard/README.md)** - Frontend application and UI components

## 🔧 Technology Stack

### Backend

| Technology | Purpose |
|-----------|---------|
| [FeathersJS](https://feathersjs.com) | Real-time API framework |
| [PostgreSQL](https://www.postgresql.org) | Relational database |
| [Knex.js](https://knexjs.org) | SQL query builder & migrations |
| [pg-boss](https://github.com/timgit/pg-boss) | PostgreSQL-based job scheduling |
| [Koa](https://koajs.com) | Web framework |
| [TypeScript](https://www.typescriptlang.org) | Type-safe development |

### Dashboard

| Technology | Purpose |
|-----------|---------|
| [Next.js 14](https://nextjs.org) | React framework with App Router |
| [React 18](https://react.dev) | UI library |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS |
| [Radix UI](https://www.radix-ui.com) | Accessible component primitives |
| [Recharts](https://recharts.org) | Data visualization |
| [TanStack Table](https://tanstack.com/table) | Advanced data tables |

## 📊 Features in Detail

### Health Monitoring

- **Automated Checks** - Configure health checks with cron patterns (e.g., every 5 minutes)
- **Manual Triggers** - Run health checks on-demand via dashboard or API
- **Parallel Execution** - Check multiple services simultaneously
- **Response Storage** - Store full response data and metadata
- **Status Determination** - Intelligent up/degraded/down status logic

### Client & Service Management

- **Multi-tenant** - Organize services by client organizations
- **Service Configuration** - Define endpoints, credentials, timeouts, and expected status codes
- **Bulk Operations** - Manage multiple services efficiently
- **Slug-based URLs** - SEO-friendly client and service identifiers

### Security

- **AES-256-GCM Encryption** - All credentials encrypted at rest
- **Single Master Key** - Environment-based encryption key
- **No Frontend Exposure** - Credentials never sent to dashboard
- **Database Isolation** - Proper access controls and permissions
- **Transport Security** - HTTPS recommended for production

### Analytics & Reporting

- **Uptime Percentages** - Calculate availability over time periods
- **Response Time Trends** - Track performance metrics
- **Historical Data** - View complete health check history
- **Status Tracking** - 90-day status visualizations
- **Incident Patterns** - Identify recurring issues

### Dashboard Features

- **Overview Page** - Grid view of all clients with status summaries
- **Client Detail** - View all services for a specific client
- **Service Detail** - Detailed metrics, charts, and history
- **Real-time Updates** - WebSocket-powered live status changes
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Mode** - Theme support for comfortable viewing

## 🔌 API Overview

### REST Endpoints

```bash
# Clients
GET    /clients
POST   /clients
GET    /clients/:id
PATCH  /clients/:id
DELETE /clients/:id

# Services
GET    /client-services
POST   /client-services
GET    /client-services/:id
PATCH  /client-services/:id
DELETE /client-services/:id
POST   /client-services/:id/check  # Trigger health check

# Status & Analytics
GET    /service-status              # Health check history
GET    /uptime-stats                # Uptime calculations
```

### WebSocket Events

```javascript
// Real-time status updates
socket.on('service-status created', (status) => {
  console.log('New status:', status)
})

// Service configuration changes
socket.on('client-services patched', (service) => {
  console.log('Service updated:', service)
})
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

Tests include:
- Service CRUD operations
- Health check logic
- Credential encryption/decryption
- Uptime calculations

### Dashboard Development

```bash
cd dashboard
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Code linting
```

## 🔄 Development Workflow

1. **Backend Development**
   - Make changes in `backend/src/`
   - Tests auto-reload with nodemon
   - Add migrations for schema changes: `npm run migrate:make <name>`

2. **Dashboard Development**
   - Make changes in `dashboard/src/`
   - Hot reload enabled by default
   - Add components in `dashboard/src/components/`

3. **Database Changes**
   - Create migration: `cd backend && npm run migrate:make <name>`
   - Edit migration in `backend/migrations/`
   - Run migration: `npm run migrate`

## 📈 Production Deployment

### Backend Deployment

1. Set production environment variables
2. Run migrations: `npm run migrate`
3. Build: `npm run compile`
4. Start: `npm start`

### Dashboard Deployment

1. Set production API URL in environment
2. Build: `npm run build`
3. Start: `npm start`
4. Or deploy to Vercel, Netlify, etc.

### Recommended Setup

- **Database**: Managed PostgreSQL (e.g., AWS RDS, DigitalOcean)
- **Backend**: Node.js hosting (e.g., AWS EC2, DigitalOcean Droplets)
- **Dashboard**: Static hosting or serverless (Vercel, Netlify, AWS S3 + CloudFront)
- **Monitoring**: Set up health checks for the monitoring system itself!

## 🛠️ Configuration

### Backend Configuration

Configuration files in `backend/config/`:
- `default.json` - Default settings
- `custom-environment-variables.json` - Environment variable mappings
- `test.json` - Test environment overrides

### Dashboard Configuration

- `dashboard/src/app/siteConfig.ts` - Site metadata
- `dashboard/tailwind.config.ts` - Theme customization
- `dashboard/next.config.mjs` - Next.js settings

## 🔍 Monitoring Service Requirements

Services monitored by this system should implement standard health check endpoints:

### Example Health Endpoint

```javascript
GET /health

// Healthy response (200 OK)
{
  "status": "healthy",
  "timestamp": "2025-10-30T10:00:00.000Z",
  "version": "1.0.0",
  "checks": {
    "database": "healthy",
    "cache": "healthy"
  }
}

// Unhealthy response (503 Service Unavailable)
{
  "status": "unhealthy",
  "timestamp": "2025-10-30T10:00:00.000Z",
  "error": "Database connection failed"
}
```

See [Backend README](./backend/README.md) for more health check examples.

## 🐛 Troubleshooting

### Backend Issues

```bash
# Check logs
cd backend
npm run dev  # Verbose logging

# Verify database connection
psql $DATABASE_URL -c "SELECT 1"

# Check pg-boss jobs
psql $DATABASE_URL -c "SELECT * FROM pgboss.job"
```

### Dashboard Issues

```bash
# Check connection to backend
curl http://localhost:3030/clients

# Clear Next.js cache
cd dashboard
rm -rf .next
npm run dev
```

### Common Issues

1. **Migration errors**: Check PostgreSQL version compatibility
2. **Encryption errors**: Ensure `ENCRYPTION_KEY` is exactly 32 characters
3. **Connection refused**: Verify backend is running and ports are correct
4. **WebSocket issues**: Check CORS settings and firewall rules

## 🤝 Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation
4. Use conventional commit messages
5. Test both backend and dashboard changes

## 📝 License

This project is private and proprietary.

## 🙏 Acknowledgments

Built with:
- [FeathersJS](https://feathersjs.com) - Excellent real-time API framework
- [Next.js](https://nextjs.org) - Amazing React framework
- [Radix UI](https://www.radix-ui.com) - Accessible component primitives
- [Tailwind CSS](https://tailwindcss.com) - Fantastic utility-first CSS

## 📞 Support

For issues, questions, or contributions:

- Check the [Backend README](./backend/README.md)
- Check the [Dashboard README](./dashboard/README.md)

---

**Happy Monitoring! 🚀**
