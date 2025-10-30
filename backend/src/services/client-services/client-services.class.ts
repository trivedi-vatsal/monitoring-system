// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  ClientServices,
  ClientServicesData,
  ClientServicesPatch,
  ClientServicesQuery
} from './client-services.schema'

export type { ClientServices, ClientServicesData, ClientServicesPatch, ClientServicesQuery }

export interface ClientServicesParams extends KnexAdapterParams<ClientServicesQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ClientServicesService<ServiceParams extends Params = ClientServicesParams> extends KnexService<
  ClientServices,
  ClientServicesData,
  ClientServicesParams,
  ClientServicesPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'client-services'
  }
}
