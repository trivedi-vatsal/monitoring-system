import axios from 'axios'
import { app } from '../app'
import { decrypt } from '../utils/encryption'

interface HealthCheckResult {
  status: 'up' | 'down' | 'degraded'
  status_code: number | null
  latency_ms: number
  error_message: string | null
  metadata: Record<string, any>
  response: any
}

export const performHealthCheck = async (serviceId: string): Promise<void> => {
  const serviceStatusService = app.service('service-status')
  const clientServicesService = app.service('client-services')

  const service = await clientServicesService.get(serviceId)
  const startTime = Date.now()
  let result: HealthCheckResult

  try {
    const headers: Record<string, string> = {}
    if (service.basic_auth_username_encrypted && service.basic_auth_password_encrypted) {
      const username = decrypt(JSON.parse(service.basic_auth_username_encrypted))
      const password = decrypt(JSON.parse(service.basic_auth_password_encrypted))
      const token = Buffer.from(`${username}:${password}`).toString('base64')
      headers['Authorization'] = `Basic ${token}`
    }

    const response = await axios.get(service.endpoint_url, {
      headers,
      timeout: service.timeout_ms || 10000,
      validateStatus: () => true // Do not throw on non-2xx status
    })

    const latency = Date.now() - startTime
    const { status } = response

    // Capture response data and metadata
    const responseData = response.data
    const metadata = {
      service_name: service.name,
      endpoint: service.endpoint_url,
      method: 'GET',
      headers: Object.keys(headers).filter(key => key !== 'Authorization') // Don't log auth headers
    }

    if (status >= 200 && status < 300) {
      result = {
        status: 'up',
        status_code: status,
        latency_ms: latency,
        error_message: null,
        metadata,
        response: responseData
      }
    } else if (status >= 300 && status < 500) {
      result = {
        status: 'degraded',
        status_code: status,
        latency_ms: latency,
        error_message: `Received status ${status}`,
        metadata,
        response: responseData
      }
    } else {
      result = {
        status: 'down',
        status_code: status,
        latency_ms: latency,
        error_message: `Received status ${status}`,
        metadata,
        response: responseData
      }
    }
  } catch (error: any) {
    const latency = Date.now() - startTime
    const metadata = {
      service_name: service.name,
      endpoint: service.endpoint_url,
      method: 'GET',
      error_type: error.code || 'UNKNOWN'
    }
    result = {
      status: 'down',
      status_code: null,
      latency_ms: latency,
      error_message: error.message,
      metadata,
      response: null
    }
  }

  const createData: any = {
    service_id: serviceId,
    ...result,
    checked_at: new Date().toISOString()
  }

  if (createData.status_code === null) {
    delete createData.status_code
  }
  if (createData.error_message === null) {
    delete createData.error_message
  }
  if (createData.response === null) {
    delete createData.response
  }

  await serviceStatusService.create(createData)
}
