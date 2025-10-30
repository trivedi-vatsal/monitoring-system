// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import type { Application } from '../../declarations'
import { UptimeStatsService, getOptions } from './uptime-stats.class'
import { uptimeStatsPath, uptimeStatsMethods } from './uptime-stats.shared'

export * from './uptime-stats.class'

// A configure function that registers the service and its hooks via `app.configure`
export const uptimeStats = (app: Application) => {
  // Register our service on the Feathers application
  app.use(uptimeStatsPath, new UptimeStatsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: uptimeStatsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(uptimeStatsPath).hooks({
    around: {
      all: []
    },
    before: {
      all: [],
      find: [],
      get: [],
      create: [],
      patch: [],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [uptimeStatsPath]: UptimeStatsService
  }
}
