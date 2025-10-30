# Monitoring System Backend

A robust backend service for monitoring the health and uptime of multiple services across different client instances. Built with [FeathersJS](https://feathersjs.com) and PostgreSQL.

## 🌟 Features

- **Automated Health Checks** - Scheduled monitoring using pg-boss job queue
- **Multi-Client Support** - Manage services across multiple client organizations
- **Credential Encryption** - Secure storage of Basic Auth credentials
- **Real-time Updates** - WebSocket support for live status updates
- **Uptime Analytics** - Calculate and track uptime percentages
- **Flexible Scheduling** - Configure health checks with cron patterns
- **RESTful API** - Comprehensive API for dashboard integration

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20.19.0
- [PostgreSQL](https://www.postgresql.org/) >= 12
- npm or yarn package manager

### Installation

1. **Install dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**

   Create a `.env` file in the backend directory:

   ```env
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/monitoring_db

   # Encryption Key (32 characters)
   ENCRYPTION_KEY=your-32-character-encryption-key

   # Server Configuration (optional)
   HOST=localhost
   PORT=3030
   ```

3. **Run database migrations**

   ```bash
   npm run migrate
   ```

4. **Start the development server**

   ```bash
   npm run dev  # Development mode with hot reload
   npm start    # Production mode
   ```

   The server will start at `http://localhost:3030`

## 📁 Project Structure

```
backend/
├── config/                          # Configuration files
│   ├── default.json                # Default configuration
│   ├── custom-environment-variables.json  # Environment variable mapping
│   └── test.json                   # Test configuration
├── migrations/                      # Knex database migrations
├── src/
│   ├── services/                   # Feathers services
│   │   ├── clients/               # Client management
│   │   ├── client-services/       # Service configuration
│   │   ├── service-status/        # Health check status
│   │   └── uptime-stats/          # Uptime analytics
│   ├── hooks/                     # Service hooks
│   ├── utils/                     # Utility functions
│   │   ├── encryption.ts          # Credential encryption
│   │   └── health-checker.ts      # Health check logic
│   ├── app.ts                     # Feathers app setup
│   ├── index.ts                   # Application entry point
│   ├── scheduler.ts               # Job scheduling (pg-boss)
│   └── postgresql.ts              # Database configuration
└── test/                          # Test files
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm start` | Start production server |
| `npm test` | Run test suite |
| `npm run migrate` | Run database migrations |
| `npm run migrate:make <name>` | Create new migration |
| `npm run prettier` | Format code with Prettier |

## 🗄️ Database Schema

### Tables

- **clients** - Client organizations
- **client_services** - Service configurations with encrypted credentials
- **service_status** - Health check results and history
- **pgboss.job** - Job queue for scheduled health checks

### Key Features

- Encrypted credential storage using AES-256-GCM
- Automatic timestamp tracking (created_at, updated_at)
- Cascading deletes for data integrity
- Optimized indexes for query performance

## 🔐 Security

### Credential Encryption

All Basic Auth credentials are encrypted at rest using AES-256-GCM encryption:

```typescript
// Credentials are automatically encrypted on create/update
const service = await app.service('client-services').create({
  name: 'API Gateway',
  endpoint_url: 'https://api.example.com/health',
  basic_auth_username: 'monitor',
  basic_auth_password: 'secret123', // Encrypted before storage
  client_id: 1
})
```

### Environment Variables

- `ENCRYPTION_KEY` - 32-character key for credential encryption
- `DATABASE_URL` - PostgreSQL connection string

## 📡 API Endpoints

### Clients

```
GET    /clients          # List all clients
GET    /clients/:id      # Get client details
POST   /clients          # Create new client
PATCH  /clients/:id      # Update client
DELETE /clients/:id      # Delete client
```

### Client Services

```
GET    /client-services               # List all services
GET    /client-services/:id           # Get service details
POST   /client-services               # Create new service
PATCH  /client-services/:id           # Update service
DELETE /client-services/:id           # Delete service
POST   /client-services/:id/check     # Trigger manual health check
```

### Service Status

```
GET    /service-status                # List status history
GET    /service-status/:id            # Get status details
```

### Uptime Stats

```
GET    /uptime-stats?service_id=123&period=7d  # Get uptime statistics
```

## 🔄 Health Check System

### Automated Monitoring

Health checks are scheduled using pg-boss and execute based on cron patterns:

```javascript
// Example: Check every 5 minutes
{
  "cron_schedule": "*/5 * * * *",
  "enabled": true
}
```

### Manual Checks

Trigger immediate health checks via API:

```bash
POST /client-services/123/check
```

### Health Check Logic

1. Fetch active services from database
2. Decrypt Basic Auth credentials
3. Make HTTP request with authentication
4. Measure response time and status
5. Determine health status (Up/Degraded/Down)
6. Store results in service_status table

### Status Determination

- **Up (200-299)** - Successful response
- **Degraded (300-499)** - Redirects, client errors, or slow responses
- **Down (500-599, timeouts)** - Server errors or connection failures

## 📊 WebSocket Events

Real-time updates are available via WebSocket connection:

```javascript
const socket = io('http://localhost:3030')

// Listen for status updates
socket.on('service-status created', (status) => {
  console.log('New status:', status)
})

// Listen for service changes
socket.on('client-services patched', (service) => {
  console.log('Service updated:', service)
})
```

## 🛠️ Configuration

Configuration is managed through JSON files in the `config/` directory:

- **default.json** - Default settings for all environments
- **custom-environment-variables.json** - Environment variable mappings
- **test.json** - Test-specific overrides

### Key Configuration Options

```json
{
  "host": "localhost",
  "port": 3030,
  "public": "./public/",
  "paginate": {
    "default": 50,
    "max": 100
  },
  "postgresql": "postgresql://localhost:5432/monitoring_db"
}
```


## 🧪 Testing

Run the test suite:

```bash
npm test
```

Tests use a separate test database configured in `config/test.json`.

## 🐛 Debugging

Enable debug logging:

```bash
DEBUG=* npm run dev
```

View pg-boss job status:

```sql
-- Check scheduled jobs
SELECT * FROM pgboss.job WHERE name = 'check-service-health';

-- View job history
SELECT * FROM pgboss.archive WHERE name = 'check-service-health';
```

## 📚 Technology Stack

- **[FeathersJS](https://feathersjs.com)** - Real-time API framework
- **[Koa](https://koajs.com)** - Web framework
- **[Knex.js](https://knexjs.org)** - SQL query builder
- **[PostgreSQL](https://www.postgresql.org)** - Database
- **[pg-boss](https://github.com/timgit/pg-boss)** - Job scheduling
- **[TypeScript](https://www.typescriptlang.org)** - Type safety

---

## 🔌 Health Check API Examples (For Services Being Monitored)

The monitoring system expects monitored services to provide health check endpoints that return standardized health status information.

### 1. Basic Health Check Endpoint

**Endpoint:** `GET /health`

**Expected Response (HTTP 200):**

```json
{
  "status": "healthy",
  "timestamp": "2025-10-29T10:00:00.000Z",
  "version": "1.2.3",
  "uptime": 3600
}
```

**Alternative Response (HTTP 503):**

```json
{
  "status": "unhealthy",
  "timestamp": "2025-10-29T10:00:00.000Z",
  "error": "Database connection failed",
  "details": {
    "database": "disconnected",
    "cache": "healthy"
  }
}
```

#### 2. Detailed Health Check Endpoint

**Endpoint:** `GET /health/detailed`

**Expected Response (HTTP 200):**

```json
{
  "status": "healthy",
  "timestamp": "2025-10-29T10:00:00.000Z",
  "version": "1.2.3",
  "uptime": 86400,
  "checks": {
    "database": {
      "status": "healthy",
      "response_time": 45,
      "details": "PostgreSQL 14.2 connected"
    },
    "redis": {
      "status": "healthy",
      "response_time": 12,
      "details": "Redis 6.2 connected"
    },
    "external_api": {
      "status": "healthy",
      "response_time": 234,
      "details": "Payment API responding"
    }
  },
  "metrics": {
    "memory_usage": "256MB",
    "cpu_usage": "15%",
    "active_connections": 42
  }
}
```

#### 3. Kubernetes-Style Health Check

**Endpoint:** `GET /healthz`

**Expected Response (HTTP 200):**

```json
{
  "status": "ok"
}
```

#### 4. Service-Specific Health Check Examples

**API Gateway Health Check:**

```json
GET /health
{
  "status": "healthy",
  "services": {
    "auth_service": "up",
    "user_service": "up",
    "payment_service": "degraded"
  },
  "response_time": 150
}
```

**Database Service Health Check:**

```json
GET /health
{
  "status": "healthy",
  "database": {
    "connections": 15,
    "active_queries": 3,
    "slow_queries": 0
  },
  "replication": {
    "status": "healthy",
    "lag_seconds": 0
  }
}
```

**Microservice Health Check:**

```json
GET /health
{
  "status": "healthy",
  "service": "user-service",
  "dependencies": {
    "database": "healthy",
    "cache": "healthy",
    "message_queue": "healthy"
  },
  "last_request": "2025-10-29T09:59:45.000Z"
}
```

### Health Check Response Standards

#### Status Values

- `"healthy"` or `"ok"` - Service is fully operational
- `"unhealthy"` or `"error"` - Service has critical issues
- `"degraded"` or `"warning"` - Service is operational but with issues

#### HTTP Status Codes

- `200 OK` - Service is healthy
- `503 Service Unavailable` - Service is unhealthy/unavailable
- `429 Too Many Requests` - Service is rate limiting (considered degraded)

#### Response Headers

```http
Content-Type: application/json
X-Health-Check-Version: 1.0
X-Response-Time: 145ms
```

### Implementing Health Checks in Your Services

#### Node.js/Express Example

```javascript
app.get('/health', (req, res) => {
  // Perform health checks
  const dbHealthy = checkDatabaseConnection();
  const cacheHealthy = checkRedisConnection();

  const status = dbHealthy && cacheHealthy ? 'healthy' : 'unhealthy';

  res.status(status === 'healthy' ? 200 : 503).json({
    status,
    timestamp: new Date().toISOString(),
    checks: {
      database: dbHealthy ? 'healthy' : 'unhealthy',
      cache: cacheHealthy ? 'healthy' : 'unhealthy'
    }
  });
});
```

#### Python/FastAPI Example

```python
@app.get("/health")
async def health_check():
    # Perform health checks
    db_status = await check_database()
    redis_status = await check_redis()

    status = "healthy" if db_status and redis_status else "unhealthy"

    return {
        "status": status,
        "timestamp": datetime.now().isoformat(),
        "checks": {
            "database": "healthy" if db_status else "unhealthy",
            "redis": "healthy" if redis_status else "unhealthy"
        }
    }
```

#### Go Example

```go
func healthHandler(w http.ResponseWriter, r *http.Request) {
    checks := map[string]bool{
        "database": checkDatabase(),
        "redis":    checkRedis(),
    }

    status := "healthy"
    for _, healthy := range checks {
        if !healthy {
            status = "unhealthy"
            break
        }
    }

    response := map[string]interface{}{
        "status":    status,
        "timestamp": time.Now().Format(time.RFC3339),
        "checks":    checks,
    }

    w.Header().Set("Content-Type", "application/json")
    if status == "healthy" {
        w.WriteHeader(http.StatusOK)
    } else {
        w.WriteHeader(http.StatusServiceUnavailable)
    }
    json.NewEncoder(w).Encode(response)
}
```

### Monitoring System Configuration

When configuring services in the monitoring system, set:

```json
{
  "endpoint_url": "https://your-service.com/health",
  "expected_status_code": 200,
  "timeout_ms": 5000,
  "basic_auth_username": "monitor",
  "basic_auth_password": "your-secret"
}
```

The monitoring system will:

1. Call your health endpoint at configured intervals
2. Expect HTTP 200 for healthy status
3. Measure response time and status codes
4. Store results in the service-status table
5. Trigger alerts for unhealthy services

## Testing

Run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

This app comes with a powerful command line interface for Feathers. Here are a few things it can do:

```bash
npx feathers help                           # Show all commands
npx feathers generate service               # Generate a new Service
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).
