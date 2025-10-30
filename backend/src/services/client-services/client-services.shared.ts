// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  ClientServices,
  ClientServicesData,
  ClientServicesPatch,
  ClientServicesQuery,
  ClientServicesService
} from './client-services.class'

export type { ClientServices, ClientServicesData, ClientServicesPatch, ClientServicesQuery }

export type ClientServicesClientService = Pick<
  ClientServicesService<Params<ClientServicesQuery>>,
  (typeof clientServicesMethods)[number]
>

export const clientServicesPath = 'client-services'

export const clientServicesMethods: Array<keyof ClientServicesService> = [
  'find',
  'get',
  'create',
  'patch',
  'remove'
]

export const clientServicesClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(clientServicesPath, connection.service(clientServicesPath), {
    methods: clientServicesMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [clientServicesPath]: ClientServicesClientService
  }
}
