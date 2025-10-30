// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ClientsService } from './clients.class'

// Main data model schema
export const clientsSchema = {
  $id: 'Clients',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'name', 'slug'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string' },
    slug: { type: 'string' },
    active: { type: 'boolean' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' }
  }
} as const
export type Clients = FromSchema<typeof clientsSchema>
export const clientsValidator = getValidator(clientsSchema, dataValidator)
export const clientsResolver = resolve<Clients, HookContext<ClientsService>>({})

export const clientsExternalResolver = resolve<Clients, HookContext<ClientsService>>({})

// Schema for creating new data
export const clientsDataSchema = {
  $id: 'ClientsData',
  type: 'object',
  additionalProperties: false,
  required: ['name', 'slug'],
  properties: {
    name: { type: 'string' },
    slug: { type: 'string' },
    active: { type: 'boolean' }
  }
} as const
export type ClientsData = FromSchema<typeof clientsDataSchema>
export const clientsDataValidator = getValidator(clientsDataSchema, dataValidator)
export const clientsDataResolver = resolve<ClientsData, HookContext<ClientsService>>({})

// Schema for updating existing data
export const clientsPatchSchema = {
  $id: 'ClientsPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string' },
    slug: { type: 'string' },
    active: { type: 'boolean' }
  }
} as const
export type ClientsPatch = FromSchema<typeof clientsPatchSchema>
export const clientsPatchValidator = getValidator(clientsPatchSchema, dataValidator)
export const clientsPatchResolver = resolve<ClientsPatch, HookContext<ClientsService>>({})

// Schema for allowed query properties
export const clientsQuerySchema = {
  $id: 'ClientsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(clientsSchema.properties)
  }
} as const
export type ClientsQuery = FromSchema<typeof clientsQuerySchema>
export const clientsQueryValidator = getValidator(clientsQuerySchema, queryValidator)
export const clientsQueryResolver = resolve<ClientsQuery, HookContext<ClientsService>>({})
