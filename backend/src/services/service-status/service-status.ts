// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import { populate } from 'feathers-hooks-common'
import type { HookContext } from '../../declarations'

import {
  serviceStatusDataValidator,
  serviceStatusPatchValidator,
  serviceStatusQueryValidator,
  serviceStatusResolver,
  serviceStatusExternalResolver,
  serviceStatusDataResolver,
  serviceStatusPatchResolver,
  serviceStatusQueryResolver
} from './service-status.schema'

import type { Application } from '../../declarations'
import { ServiceStatusService, getOptions } from './service-status.class'
import { serviceStatusPath, serviceStatusMethods } from './service-status.shared'

export * from './service-status.class'
export * from './service-status.schema'

// Custom hook to filter by client_id
const filterByClientId = async (context: HookContext) => {
  const { params } = context
  const clientId = params.query?.client_id

  if (clientId) {
    // Get all services for this client
    const services = await context.app.service('client-services').find({
      query: {
        client_id: clientId,
        $select: ['id'],
        $limit: 1000
      },
      paginate: false
    } as any)

    const serviceArray = Array.isArray(services) ? services : (services as any).data
    const serviceIds = serviceArray.map((s: any) => s.id)

    // Filter service-status by these service IDs
    if (serviceIds.length > 0) {
      context.params.query = {
        ...context.params.query,
        service_id: { $in: serviceIds }
      }
    } else {
      // No services for this client, return empty result
      context.params.query = {
        ...context.params.query,
        service_id: null
      }
    }

    // Remove client_id from query as it's not a field in service-status
    delete context.params.query.client_id
  }

  return context
}

// Populate hook configuration to include service details
const populateServiceSchema = {
  include: [
    {
      service: 'client-services',
      nameAs: 'service',
      parentField: 'service_id',
      childField: 'id',
      query: {
        $select: ['id', 'name', 'endpoint_url', 'active']
      }
    }
  ]
}

// A configure function that registers the service and its hooks via `app.configure`
export const serviceStatus = (app: Application) => {
  // Register our service on the Feathers application
  const serviceOptions = {
    methods: serviceStatusMethods,
    events: [],
    docs: {
      description: 'Service health status tracking and monitoring',
      tag: 'service-status',
      operations: {
        find: { description: 'Retrieve service status records' },
        get: { description: 'Retrieve a specific service status record by ID' },
        create: { description: 'Create a new service status record' },
        patch: { description: 'Update an existing service status record' },
        remove: { description: 'Delete a service status record' }
      }
    }
  }

  app.use(serviceStatusPath, new ServiceStatusService(getOptions(app)), serviceOptions)
  // Initialize hooks
  app.service(serviceStatusPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(serviceStatusExternalResolver),
        schemaHooks.resolveResult(serviceStatusResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(serviceStatusQueryValidator),
        schemaHooks.resolveQuery(serviceStatusQueryResolver)
      ],
      find: [filterByClientId],
      get: [],
      create: [
        schemaHooks.validateData(serviceStatusDataValidator),
        schemaHooks.resolveData(serviceStatusDataResolver)
      ],
      patch: [
        schemaHooks.validateData(serviceStatusPatchValidator),
        schemaHooks.resolveData(serviceStatusPatchResolver)
      ],
      remove: []
    },
    after: {
      all: [],
      find: [populate({ schema: populateServiceSchema })],
      get: [populate({ schema: populateServiceSchema })]
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [serviceStatusPath]: ServiceStatusService
  }
}
