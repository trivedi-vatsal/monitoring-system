// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  clientServicesDataValidator,
  clientServicesPatchValidator,
  clientServicesQueryValidator,
  clientServicesResolver,
  clientServicesExternalResolver,
  clientServicesDataResolver,
  clientServicesPatchResolver,
  clientServicesQueryResolver
} from './client-services.schema'

import type { Application, HookContext } from '../../declarations'
import { ClientServicesService, getOptions } from './client-services.class'
import { clientServicesPath, clientServicesMethods } from './client-services.shared'
import { encrypt } from '../../utils/encryption'
import { scheduleJob, unscheduleJob, registerWorker } from '../../scheduler'

export * from './client-services.class'
export * from './client-services.schema'

const encryptHook = (context: HookContext) => {
  if (context.data.basic_auth_username) {
    context.data.basic_auth_username_encrypted = encrypt(context.data.basic_auth_username)
    delete context.data.basic_auth_username
  }
  if (context.data.basic_auth_password) {
    context.data.basic_auth_password_encrypted = encrypt(context.data.basic_auth_password)
    delete context.data.basic_auth_password
  }
  return context
}

// A configure function that registers the service and its hooks via `app.configure`
export const clientServices = (app: Application) => {
  // Register our service on the Feathers application
  const serviceOptions = {
    methods: clientServicesMethods,
    events: [],
    docs: {
      description: 'Service monitoring configuration management',
      tag: 'client-services',
      operations: {
        find: { description: 'Retrieve all client services' },
        get: { description: 'Retrieve a specific client service by ID' },
        create: { description: 'Create a new client service configuration' },
        patch: { description: 'Update an existing client service configuration' },
        remove: { description: 'Delete a client service configuration' }
      }
    }
  }

  app.use(clientServicesPath, new ClientServicesService(getOptions(app)), serviceOptions)
  // Initialize hooks
  app.service(clientServicesPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(clientServicesExternalResolver),
        schemaHooks.resolveResult(clientServicesResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(clientServicesQueryValidator),
        schemaHooks.resolveQuery(clientServicesQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(clientServicesDataValidator),
        schemaHooks.resolveData(clientServicesDataResolver),
        encryptHook
      ],
      patch: [
        schemaHooks.validateData(clientServicesPatchValidator),
        schemaHooks.resolveData(clientServicesPatchResolver),
        encryptHook
      ],
      remove: []
    },
    after: {
      all: [],
      create: [
        async (context: HookContext) => {
          const { result } = context
          // Register worker for new service first
          await registerWorker(result.id)
          // Only schedule if service is active
          if (result.active && result.cron_pattern) {
            await scheduleJob(result.id, result.cron_pattern)
          }
          return context
        }
      ],
      patch: [
        async (context: HookContext) => {
          const { result } = context
          
          // result contains the FULL updated record after patch
          // If service is active and has cron pattern, schedule/reschedule the job
          if (result.active === true && result.cron_pattern) {
            await scheduleJob(result.id, result.cron_pattern)
          }
          // If service is inactive, ensure no schedule exists
          else if (result.active === false) {
            await unscheduleJob(result.id)
          }
          
          return context
        }
      ],
      remove: [
        async (context: HookContext) => {
          const { result } = context
          await unscheduleJob(result.id)
          return context
        }
      ]
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [clientServicesPath]: ClientServicesService
  }
}
