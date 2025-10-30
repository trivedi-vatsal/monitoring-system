// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Application } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'

import { uptimeStatsClient } from './services/uptime-stats/uptime-stats.shared'
export type {
  UptimeStats,
  UptimeStatsData,
  UptimeStatsQuery,
  UptimeStatsPatch
} from './services/uptime-stats/uptime-stats.shared'

import { serviceStatusClient } from './services/service-status/service-status.shared'
export type {
  ServiceStatus,
  ServiceStatusData,
  ServiceStatusQuery,
  ServiceStatusPatch
} from './services/service-status/service-status.shared'

import { clientServicesClient } from './services/client-services/client-services.shared'
export type {
  ClientServices,
  ClientServicesData,
  ClientServicesQuery,
  ClientServicesPatch
} from './services/client-services/client-services.shared'

import { clientsClient } from './services/clients/clients.shared'
export type { Clients, ClientsData, ClientsQuery, ClientsPatch } from './services/clients/clients.shared'

export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>

/**
 * Returns a typed client for the monitoring-system app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any,>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<AuthenticationClientOptions> = {}
) => {
  const client: ClientApplication = feathers()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))
  client.set('connection', connection)

  client.configure(clientsClient)
  client.configure(clientServicesClient)
  client.configure(serviceStatusClient)
  client.configure(uptimeStatsClient)
  return client
}
