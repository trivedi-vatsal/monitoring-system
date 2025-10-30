// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Clients, ClientsData, ClientsPatch, ClientsQuery } from './clients.schema'

export type { Clients, ClientsData, ClientsPatch, ClientsQuery }

export interface ClientsParams extends KnexAdapterParams<ClientsQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ClientsService<ServiceParams extends Params = ClientsParams> extends KnexService<
  Clients,
  ClientsData,
  ClientsParams,
  ClientsPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'clients'
  }
}
