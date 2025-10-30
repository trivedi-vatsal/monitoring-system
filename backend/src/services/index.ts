import { uptimeStats } from './uptime-stats/uptime-stats'
import { serviceStatus } from './service-status/service-status'
import { clientServices } from './client-services/client-services'
import { clients } from './clients/clients'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(uptimeStats)
  app.configure(serviceStatus)
  app.configure(clientServices)
  app.configure(clients)
  // All services will be registered here
}
