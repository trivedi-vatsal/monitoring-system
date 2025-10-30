// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  ServiceStatus,
  ServiceStatusData,
  ServiceStatusPatch,
  ServiceStatusQuery,
  ServiceStatusService
} from './service-status.class'

export type { ServiceStatus, ServiceStatusData, ServiceStatusPatch, ServiceStatusQuery }

export type ServiceStatusClientService = Pick<
  ServiceStatusService<Params<ServiceStatusQuery>>,
  (typeof serviceStatusMethods)[number]
>

export const serviceStatusPath = 'service-status'

export const serviceStatusMethods: Array<keyof ServiceStatusService> = [
  'find',
  'get',
  'create',
  'patch',
  'remove'
]

export const serviceStatusClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(serviceStatusPath, connection.service(serviceStatusPath), {
    methods: serviceStatusMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [serviceStatusPath]: ServiceStatusClientService
  }
}
