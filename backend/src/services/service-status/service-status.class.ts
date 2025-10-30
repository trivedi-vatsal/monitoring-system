// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type {
  ServiceStatus,
  ServiceStatusData,
  ServiceStatusPatch,
  ServiceStatusQuery
} from './service-status.schema'

export type { ServiceStatus, ServiceStatusData, ServiceStatusPatch, ServiceStatusQuery }

export interface ServiceStatusParams extends KnexAdapterParams<ServiceStatusQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class ServiceStatusService<ServiceParams extends Params = ServiceStatusParams> extends KnexService<
  ServiceStatus,
  ServiceStatusData,
  ServiceStatusParams,
  ServiceStatusPatch
> {}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'service-status'
  }
}
