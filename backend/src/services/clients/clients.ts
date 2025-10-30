// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  clientsDataValidator,
  clientsPatchValidator,
  clientsQueryValidator,
  clientsResolver,
  clientsExternalResolver,
  clientsDataResolver,
  clientsPatchResolver,
  clientsQueryResolver
} from './clients.schema'

import type { Application } from '../../declarations'
import { ClientsService, getOptions } from './clients.class'
import { clientsPath, clientsMethods } from './clients.shared'

export * from './clients.class'
export * from './clients.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const clients = (app: Application) => {
  // Register our service on the Feathers application
  const serviceOptions = {
    methods: clientsMethods,
    events: [],
    docs: {
      description: 'Client management service',
      tag: 'clients',
      operations: {
        find: { description: 'Retrieve all clients' },
        get: { description: 'Retrieve a specific client by ID' },
        create: { description: 'Create a new client' },
        patch: { description: 'Update an existing client' },
        remove: { description: 'Delete a client' }
      }
    }
  }

  app.use(clientsPath, new ClientsService(getOptions(app)), serviceOptions)
  // Initialize hooks
  app.service(clientsPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(clientsExternalResolver), schemaHooks.resolveResult(clientsResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(clientsQueryValidator), schemaHooks.resolveQuery(clientsQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(clientsDataValidator), schemaHooks.resolveData(clientsDataResolver)],
      patch: [schemaHooks.validateData(clientsPatchValidator), schemaHooks.resolveData(clientsPatchResolver)],
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
    [clientsPath]: ClientsService
  }
}
