import swagger from 'feathers-swagger'
import type { Application } from './declarations'
import { generateOpenAPIComponents, generateOpenAPITags } from './utils/swagger-generator'

export default (app: Application) => {
  app.configure(
    swagger({
      specs: {
        info: {
          title: 'Monitoring System API',
          description: 'API documentation for the Service Monitoring System',
          version: '1.0.0',
          contact: {
            name: 'API Support'
          }
        },
        servers: [
          {
            url: 'http://localhost:3030',
            description: 'Development server'
          }
        ],
        components: {
          securitySchemes: {
            httpBearer: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          },
          schemas: generateOpenAPIComponents()
        },
        security: [],
        tags: generateOpenAPITags()
      },
      ui: swagger.swaggerUI({ docsPath: '/docs' })
    })
  )
}
