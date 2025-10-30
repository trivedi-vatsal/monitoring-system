# Sample

Based on your monitoring system setup, here are the curl commands to configure the Ariya Dev client and ariya-core service with the specified health endpoint and 1-minute cron schedule:

## 1. Create the Client (Ariya Dev)

```bash
curl -X POST http://localhost:3030/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ariya Dev",
    "slug": "ariya-dev",
    "active": true
  }'
```

## 2. Create the Service (ariya-core)

```bash
curl -X POST http://localhost:3030/client-services \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "CLIENT_ID_FROM_STEP_1",
    "name": "ariya-core",
    "endpoint_url": "https://ariya-as-core-szn-dev.azurewebsites.net/api/adminportal/admin/v1/health",
    "cron_pattern": "* * * * *",
    "expected_status_code": 200,
    "timeout_ms": 5000,
    "active": true
  }'
```

**Note:** Replace `CLIENT_ID_FROM_STEP_1` with the actual client ID returned from the first command.

## 3. Verify the Service Configuration

```bash
curl -X GET "http://localhost:3030/client-services?name=ariya-core" \
  -H "Content-Type: application/json"
```

## 4. Check Service Health Status

```bash
curl -X GET "http://localhost:3030/service-status?service_name=ariya-core" \
  -H "Content-Type: application/json"
```

## 5. List All Services for Ariya Dev Client

```bash
curl -X GET "http://localhost:3030/client-services?client_id=CLIENT_ID_FROM_STEP_1" \
  -H "Content-Type: application/json"
```

## 6. Test the External Health Endpoint Directly

```bash
curl -X GET "https://ariya-as-core-szn-dev.azurewebsites.net/api/adminportal/admin/v1/health" \
  -H "Content-Type: application/json"
```

## Complete Workflow Script

Here's a bash script that does the complete setup:

```bash
#!/bin/bash

# Step 1: Create client
echo "Creating client..."
CLIENT_RESPONSE=$(curl -s -X POST http://localhost:3030/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ariya Dev",
    "slug": "ariya-dev",
    "active": true
  }')

CLIENT_ID=$(echo $CLIENT_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "Client created with ID: $CLIENT_ID"

# Step 2: Create service
echo "Creating service..."
curl -X POST http://localhost:3030/client-services \
  -H "Content-Type: application/json" \
  -d "{
    \"client_id\": \"$CLIENT_ID\",
    \"name\": \"ariya-core\",
    \"endpoint_url\": \"https://ariya-as-core-szn-dev.azurewebsites.net/api/adminportal/admin/v1/health\",
    \"cron_pattern\": \"* * * * *\",
    \"expected_status_code\": 200,
    \"timeout_ms\": 5000,
    \"active\": true
  }"

echo "Service configured successfully!"
```

## Cron Pattern Explanation

The cron pattern `"* * * * *"` means:

- `*` - Every minute
- `*` - Every hour  
- `*` - Every day of month
- `*` - Every month
- `*` - Every day of week

This will run the health check every minute as requested.

The monitoring system will now automatically check the Ariya Core service health endpoint every minute and store the results in the database. You can view the status through the `/service-status` endpoint or the Swagger documentation at `http://localhost:3030/docs`.
