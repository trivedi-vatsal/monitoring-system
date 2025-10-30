# Service Monitoring Dashboard

A modern, responsive dashboard for tracking service health, uptime, and performance metrics across multiple client organizations. Built with [Next.js 14](https://nextjs.org) and cutting-edge React technologies.

## 🌟 Features

- **Real-time Service Monitoring** - Live status updates via WebSocket connection
- **Health Check History** - Detailed logs with response data and metadata
- **Multi-Client Management** - Organize and track services by client organizations
- **Automated Scheduling** - Configure health checks with intuitive cron patterns
- **Performance Analytics** - Uptime percentages and response time tracking
- **Interactive Visualizations** - Charts and graphs powered by Recharts
- **Responsive Design** - Mobile-first UI built with Tailwind CSS
- **Accessible Components** - Built on Radix UI primitives

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18.0.0
- npm or pnpm package manager
- Running backend service (see `/backend` directory)

### Installation

1. **Install dependencies**

   ```bash
   cd dashboard
   npm install
   # or
   pnpm install
   ```

2. **Configure backend connection**

   Create a `.env.local` file:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3030
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**

   Visit [http://localhost:3000](http://localhost:3000) to view the dashboard.

## 📁 Project Structure

```
dashboard/
├── public/                    # Static assets
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── (main)/          # Main application routes
│   │   │   ├── page.tsx    # Dashboard overview
│   │   │   └── [clientId]/ # Client detail pages
│   │   └── settings/        # Settings pages
│   ├── components/           # Reusable UI components
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── LineChart.tsx
│   │   ├── Table.tsx
│   │   └── ui/             # Base UI primitives
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ClientContext.tsx
│   ├── data/                # Data schemas and utilities
│   │   ├── schema.ts
│   │   └── data.ts
│   └── lib/                 # Utilities and helpers
│       ├── api.ts          # API client
│       └── chartUtils.ts   # Chart configurations
├── next.config.mjs          # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server at <http://localhost:3000> |
| `npm run build` | Build production bundle |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint code linting |
| `npm run generate` | Generate sample data for development |

## 🎨 Key Components

### Dashboard Pages

- **Overview (`/`)** - Grid of all clients with status summaries
- **Client Detail (`/[clientId]`)** - Service list for specific client
- **Service Detail** - Individual service metrics and history
- **Settings** - Configuration and preferences

### UI Components

All components are built with:

- **Tailwind Variants** - Type-safe styling
- **Radix UI** - Accessible primitives
- **Custom Hooks** - Reusable logic
- **TypeScript** - Full type safety

```typescript
// Example: Using the Badge component
import { Badge } from '@/components/Badge'

<Badge variant="success">Up</Badge>
<Badge variant="error">Down</Badge>
<Badge variant="warning">Degraded</Badge>
```

## 🔌 Backend Integration

The dashboard connects to a FeathersJS backend providing:

### API Endpoints

```typescript
// Clients
GET    /clients                    # List all clients
GET    /clients/:id                # Get client details
POST   /clients                    # Create new client
PATCH  /clients/:id                # Update client
DELETE /clients/:id                # Delete client

// Services
GET    /client-services            # List all services
POST   /client-services            # Create new service
POST   /client-services/:id/check  # Trigger health check

// Status & Analytics
GET    /service-status             # Health check history
GET    /uptime-stats               # Uptime statistics
```

### WebSocket Events

Real-time updates via Socket.io:

```typescript
socket.on('service-status created', (status) => {
  // Handle new status update
})

socket.on('client-services patched', (service) => {
  // Handle service update
})
```

## 📊 Data Visualization

### Uptime Charts

- **Line Charts** - Response time trends
- **Progress Bars** - Uptime percentages
- **Status Trackers** - 90-day status history
- **Calendar Views** - Incident tracking

### Powered by Recharts

```typescript
import { LineChart } from '@/components/LineChart'

<LineChart
  data={responseTimeData}
  categories={['response_time']}
  index="timestamp"
  colors={['blue']}
/>
```

## 🎯 Features in Detail

### Client Management

- Create and manage client organizations
- View aggregated status across all services
- Track overall uptime and availability

### Service Configuration

- Configure health check endpoints
- Set check intervals with cron expressions
- Store encrypted Basic Auth credentials
- Define expected status codes and timeouts

### Health Monitoring

- Automated checks based on schedule
- Manual on-demand health checks
- Historical status tracking
- Response data preservation

### Analytics Dashboard

- Real-time status updates
- Uptime percentage calculations
- Response time trends
- Incident history and patterns

## 🛠️ Development

### Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3030

# Feature Flags (optional)
NEXT_PUBLIC_ENABLE_AUTH=true
```

### Building for Production

```bash
npm run build
npm start
```

### Generating Sample Data

For development and testing:

```bash
npm run generate
```

This creates sample clients, services, and status history.

## 📚 Technology Stack

### Core Framework

- **[Next.js 14](https://nextjs.org)** - React framework with App Router
- **[React 18](https://react.dev)** - UI library
- **[TypeScript](https://www.typescriptlang.org)** - Type safety

### Styling

- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS
- **[Tailwind Variants](https://www.tailwind-variants.org)** - Component variants
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Dark mode support

### UI Components

- **[Radix UI](https://www.radix-ui.com)** - Accessible primitives
- **[@remixicon/react](https://remixicon.com)** - Icon library
- **[clsx](https://github.com/lukeed/clsx)** - Conditional classes

### Data & State

- **[TanStack Table](https://tanstack.com/table)** - Powerful tables
- **[React Context](https://react.dev/reference/react/useContext)** - State management
- **[date-fns](https://date-fns.org)** - Date utilities

### Visualization

- **[Recharts](https://recharts.org)** - Charting library
- **[react-day-picker](https://react-day-picker.js.org)** - Date picker

### Additional Tools

- **[cronstrue](https://github.com/bradymholt/cRonstrue)** - Human-readable cron
- **[use-debounce](https://github.com/xnimorz/use-debounce)** - Debounced values

## 🎨 Customization

### Theme Configuration

Edit `tailwind.config.ts` to customize colors, spacing, and more:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: {...},
        success: {...},
        error: {...}
      }
    }
  }
}
```

### Site Configuration

Edit `src/app/siteConfig.ts`:

```typescript
export const siteConfig = {
  name: "Service Monitor",
  description: "Monitor service health and uptime",
  // ...
}
```

## 🐛 Debugging

Enable verbose logging:

```bash
DEBUG=* npm run dev
```

Check console for:

- API connection status
- WebSocket events
- Component render cycles

## 📱 Responsive Design

The dashboard is fully responsive with breakpoints:

- **Mobile** - < 640px
- **Tablet** - 640px - 1024px
- **Desktop** - > 1024px

## ♿ Accessibility

Built with accessibility in mind:

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader optimized
- Focus management
- ARIA labels and roles

## 🔐 Security

- No credentials exposed to frontend
- API authentication (when enabled)
- XSS protection
- CSRF protection
- Content Security Policy

## 📝 License

This project is private and proprietary.
├── components/       # Reusable UI components
├── data/            # Data schemas and utilities
└── lib/             # Utility functions

```
