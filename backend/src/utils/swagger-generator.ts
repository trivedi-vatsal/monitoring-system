import type { Application } from '../declarations'

// Import all service schemas
import { clientsSchema, clientsDataSchema, clientsPatchSchema } from '../services/clients/clients.schema'
import {
  clientServicesSchema,
  clientServicesDataSchema,
  clientServicesPatchSchema
} from '../services/client-services/client-services.schema'
import {
  serviceStatusSchema,
  serviceStatusDataSchema,
  serviceStatusPatchSchema
} from '../services/service-status/service-status.schema'

interface ServiceSchema {
  schema: any
  dataSchema: any
  patchSchema: any
  serviceName: string
  servicePath: string
}

const serviceSchemas: ServiceSchema[] = [
  {
    schema: clientsSchema,
    dataSchema: clientsDataSchema,
    patchSchema: clientsPatchSchema,
    serviceName: 'clients',
    servicePath: 'clients'
  },
  {
    schema: clientServicesSchema,
    dataSchema: clientServicesDataSchema,
    patchSchema: clientServicesPatchSchema,
    serviceName: 'client-services',
    servicePath: 'client-services'
  },
  {
    schema: serviceStatusSchema,
    dataSchema: serviceStatusDataSchema,
    patchSchema: serviceStatusPatchSchema,
    serviceName: 'service-status',
    servicePath: 'service-status'
  }
]

export function generateOpenAPIComponents() {
  const schemas: Record<string, any> = {}

  serviceSchemas.forEach(({ schema, dataSchema, patchSchema, serviceName, servicePath }) => {
    // Main schema (lowercase for feathers-swagger compatibility)
    schemas[serviceName] = {
      type: 'object',
      required: schema.required || [],
      properties: schema.properties || {}
    }

    // Pagination schema
    schemas[`${serviceName}Pagination`] = {
      type: 'object',
      properties: {
        total: { type: 'number' },
        limit: { type: 'number' },
        skip: { type: 'number' },
        data: {
          type: 'array',
          items: { $ref: `#/components/schemas/${serviceName}` }
        }
      }
    }

    // Capitalized schemas for explicit references
    const capitalizedName = serviceName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')

    schemas[capitalizedName] = {
      type: 'object',
      required: schema.required || [],
      properties: schema.properties || {}
    }

    // Data schema (for create operations)
    schemas[`${capitalizedName}Data`] = {
      type: 'object',
      required: dataSchema.required || [],
      properties: dataSchema.properties || {}
    }

    // Patch schema (for update operations)
    schemas[`${capitalizedName}Patch`] = {
      type: 'object',
      required: patchSchema.required || [],
      properties: patchSchema.properties || {}
    }
  })

  return schemas
}

export function generateOpenAPITags() {
  return serviceSchemas.map(({ serviceName }) => ({
    name: serviceName,
    description: `${serviceName.replace('-', ' ')} endpoints`
  }))
}
