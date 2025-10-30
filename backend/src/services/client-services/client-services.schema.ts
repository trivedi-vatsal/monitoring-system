// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax, virtual } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ClientServicesService } from './client-services.class'
import { decrypt } from '../../utils/encryption'

// Main data model schema
export const clientServicesSchema = {
  $id: 'ClientServices',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'name', 'slug', 'endpoint_url'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    client_id: { type: 'string', format: 'uuid' },
    name: { type: 'string' },
    slug: { type: 'string' },
    endpoint_url: { type: 'string' },
    basic_auth_username: { type: 'string' },
    basic_auth_password: { type: 'string' },
    basic_auth_username_encrypted: { type: 'string' },
    basic_auth_password_encrypted: { type: 'string' },
    cron_pattern: { type: 'string' },
    expected_status_code: { type: 'number' },
    timeout_ms: { type: 'number' },
    active: { type: 'boolean' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' }
  }
} as const
export type ClientServices = FromSchema<typeof clientServicesSchema>
export const clientServicesValidator = getValidator(clientServicesSchema, dataValidator)
export const clientServicesResolver = resolve<ClientServices, HookContext<ClientServicesService>>({
  basic_auth_username: virtual(async service => {
    if (service.basic_auth_username_encrypted) {
      return decrypt(JSON.parse(service.basic_auth_username_encrypted))
    }
    return undefined
  }),
  basic_auth_password: virtual(async service => {
    if (service.basic_auth_password_encrypted) {
      return decrypt(JSON.parse(service.basic_auth_password_encrypted))
    }
    return undefined
  })
})

export const clientServicesExternalResolver = resolve<ClientServices, HookContext<ClientServicesService>>({
  // Make sure encrypted fields are not sent to the client
  basic_auth_username_encrypted: async () => undefined,
  basic_auth_password_encrypted: async () => undefined
})

// Schema for creating new data
export const clientServicesDataSchema = {
  $id: 'ClientServicesData',
  type: 'object',
  additionalProperties: false,
  required: ['name', 'slug', 'endpoint_url'],
  properties: {
    client_id: { type: 'string', format: 'uuid' },
    name: { type: 'string' },
    slug: { type: 'string' },
    endpoint_url: { type: 'string' },
    basic_auth_username: { type: 'string' },
    basic_auth_password: { type: 'string' },
    cron_pattern: { type: 'string' },
    expected_status_code: { type: 'number' },
    timeout_ms: { type: 'number' },
    active: { type: 'boolean' }
  }
} as const
export type ClientServicesData = FromSchema<typeof clientServicesDataSchema>
export const clientServicesDataValidator = getValidator(clientServicesDataSchema, dataValidator)
export const clientServicesDataResolver = resolve<ClientServicesData, HookContext<ClientServicesService>>({})

// Schema for updating existing data
export const clientServicesPatchSchema = {
  $id: 'ClientServicesPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...clientServicesDataSchema.properties,
    id: { type: 'string', format: 'uuid' }
  }
} as const
export type ClientServicesPatch = FromSchema<typeof clientServicesPatchSchema>
export const clientServicesPatchValidator = getValidator(clientServicesPatchSchema, dataValidator)
export const clientServicesPatchResolver = resolve<ClientServicesPatch, HookContext<ClientServicesService>>(
  {}
)

// Schema for allowed query properties
export const clientServicesQuerySchema = {
  $id: 'ClientServicesQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(clientServicesSchema.properties)
  }
} as const
export type ClientServicesQuery = FromSchema<typeof clientServicesQuerySchema>
export const clientServicesQueryValidator = getValidator(clientServicesQuerySchema, queryValidator)
export const clientServicesQueryResolver = resolve<ClientServicesQuery, HookContext<ClientServicesService>>(
  {}
)
