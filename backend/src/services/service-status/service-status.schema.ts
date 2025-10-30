// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import type { FromSchema } from '@feathersjs/schema'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { ServiceStatusService } from './service-status.class'

// Main data model schema
export const serviceStatusSchema = {
  $id: 'ServiceStatus',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'service_id', 'status', 'latency_ms', 'checked_at'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    service_id: { type: 'string', format: 'uuid' },
    status: { type: 'string', enum: ['up', 'down', 'degraded'] },
    status_code: { type: 'number' },
    latency_ms: { type: 'number' },
    error_message: { type: 'string' },
    metadata: { type: 'object' },
    response: { type: 'object' },
    checked_at: { type: 'string', format: 'date-time' },
    created_at: { type: 'string', format: 'date-time' },
    service: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        endpoint_url: { type: 'string' },
        active: { type: 'boolean' }
      }
    }
  }
} as const
export type ServiceStatus = FromSchema<typeof serviceStatusSchema>
export const serviceStatusValidator = getValidator(serviceStatusSchema, dataValidator)
export const serviceStatusResolver = resolve<ServiceStatus, HookContext<ServiceStatusService>>({})

export const serviceStatusExternalResolver = resolve<ServiceStatus, HookContext<ServiceStatusService>>({})

// Schema for creating new data
export const serviceStatusDataSchema = {
  $id: 'ServiceStatusData',
  type: 'object',
  additionalProperties: false,
  required: ['service_id', 'status', 'latency_ms', 'checked_at'],
  properties: {
    service_id: { type: 'string', format: 'uuid' },
    status: { type: 'string', enum: ['up', 'down', 'degraded'] },
    status_code: { type: 'number' },
    latency_ms: { type: 'number' },
    error_message: { type: 'string' },
    metadata: { type: 'object' },
    response: { type: 'object' },
    checked_at: { type: 'string', format: 'date-time' }
  }
} as const
export type ServiceStatusData = FromSchema<typeof serviceStatusDataSchema>
export const serviceStatusDataValidator = getValidator(serviceStatusDataSchema, dataValidator)
export const serviceStatusDataResolver = resolve<ServiceStatusData, HookContext<ServiceStatusService>>({})

// Schema for updating existing data
export const serviceStatusPatchSchema = {
  $id: 'ServiceStatusPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...serviceStatusDataSchema.properties,
    id: { type: 'string', format: 'uuid' }
  }
} as const
export type ServiceStatusPatch = FromSchema<typeof serviceStatusPatchSchema>
export const serviceStatusPatchValidator = getValidator(serviceStatusPatchSchema, dataValidator)
export const serviceStatusPatchResolver = resolve<ServiceStatusPatch, HookContext<ServiceStatusService>>({})

// Schema for allowed query properties (exclude the populated 'service' field)
export const serviceStatusQuerySchema = {
  $id: 'ServiceStatusQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax({
      id: serviceStatusSchema.properties.id,
      service_id: serviceStatusSchema.properties.service_id,
      status: serviceStatusSchema.properties.status,
      status_code: serviceStatusSchema.properties.status_code,
      latency_ms: serviceStatusSchema.properties.latency_ms,
      error_message: serviceStatusSchema.properties.error_message,
      metadata: serviceStatusSchema.properties.metadata,
      response: serviceStatusSchema.properties.response,
      checked_at: serviceStatusSchema.properties.checked_at,
      created_at: serviceStatusSchema.properties.created_at,
      client_id: { type: 'string', format: 'uuid' }
    })
  }
} as const
export type ServiceStatusQuery = FromSchema<typeof serviceStatusQuerySchema>
export const serviceStatusQueryValidator = getValidator(serviceStatusQuerySchema, queryValidator)
export const serviceStatusQueryResolver = resolve<ServiceStatusQuery, HookContext<ServiceStatusService>>({})
