// API client for FeathersJS backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030'

export type Client = {
  id: string
  name: string
  slug: string
  active: boolean
  created_at: string
  updated_at: string
}

export type ClientService = {
  id: string
  client_id: string
  name: string
  slug: string
  endpoint_url: string
  cron_pattern: string
  expected_status_code: number
  timeout_ms: number
  basic_auth_username?: string
  active: boolean
  created_at: string
  updated_at: string
}

export type ServiceStatus = {
  id: string
  service_id: string
  status: 'up' | 'down' | 'degraded'
  status_code?: number
  latency_ms: number
  error_message?: string
  metadata?: Record<string, any>
  response?: any
  checked_at: string
  created_at: string
  service?: {
    id: string
    name: string
    endpoint_url: string
    active: boolean
  }
}

export type UptimeDay = {
  date: string
  tooltip: string
  status: 'up' | 'down' | 'degraded' | 'no-data'
  color: string
  percentage?: number
  checksCount?: number
}

export type ServiceUptime = {
  serviceId: string
  serviceName: string
  endpointUrl: string
  active: boolean
  currentStatus: 'up' | 'down' | 'degraded' | 'no-data'
  lastChecked: string | null
  uptimeDays: UptimeDay[]
  uptimePercentage: number
}

// Generic fetch wrapper
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(error.message || 'API request failed')
  }

  return response.json()
}

// Clients API
export const clientsApi = {
  async getAll(): Promise<{ data: Client[]; total: number; limit: number; skip: number }> {
    return apiFetch('/clients')
  },

  async getById(id: string): Promise<Client> {
    return apiFetch(`/clients/${id}`)
  },

  async create(data: { name: string; slug: string; active?: boolean }): Promise<Client> {
    return apiFetch('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async update(id: string, data: Partial<Client>): Promise<Client> {
    return apiFetch(`/clients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  async delete(id: string): Promise<Client> {
    return apiFetch(`/clients/${id}`, {
      method: 'DELETE',
    })
  },
}

// Client Services API
export const clientServicesApi = {
  async getAll(clientId?: string): Promise<{ data: ClientService[] }> {
    const query = clientId ? `?client_id=${clientId}` : ''
    return apiFetch(`/client-services${query}`)
  },

  async getById(id: string): Promise<ClientService> {
    return apiFetch(`/client-services/${id}`)
  },

  async create(data: Partial<ClientService>): Promise<ClientService> {
    return apiFetch('/client-services', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async update(id: string, data: Partial<ClientService>): Promise<ClientService> {
    return apiFetch(`/client-services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  async delete(id: string): Promise<ClientService> {
    return apiFetch(`/client-services/${id}`, {
      method: 'DELETE',
    })
  },
}

// Service Status API
export const serviceStatusApi = {
  async getAll(
    serviceId?: string,
    limit?: number,
    skip?: number,
    startDate?: string,
    endDate?: string,
    status?: string,
    clientId?: string
  ): Promise<{ data: ServiceStatus[]; total: number; limit: number; skip: number }> {
    const params = new URLSearchParams()
    if (clientId) params.append('client_id', clientId)
    if (serviceId) params.append('service_id', serviceId)
    if (limit) params.append('$limit', limit.toString())
    if (skip) params.append('$skip', skip.toString())
    if (startDate) params.append('checked_at[$gte]', startDate)
    if (endDate) params.append('checked_at[$lte]', endDate)
    if (status) params.append('status', status)
    params.append('$sort[checked_at]', '-1') // Sort by checked_at descending
    
    const query = params.toString() ? `?${params.toString()}` : ''
    return apiFetch(`/service-status${query}`)
  },

  async getById(id: string): Promise<ServiceStatus> {
    return apiFetch(`/service-status/${id}`)
  },

  async getLatestByServiceId(serviceId: string): Promise<ServiceStatus | null> {
    const result = await apiFetch<{ data: ServiceStatus[] }>(
      `/service-status?service_id=${serviceId}&$sort[checked_at]=-1&$limit=1`
    )
    return result.data[0] || null
  },
}

// Uptime Stats API
export const uptimeStatsApi = {
  async getAll(clientId?: string, days?: number): Promise<ServiceUptime[]> {
    const params = new URLSearchParams()
    if (clientId) params.append('clientId', clientId)
    if (days) params.append('days', days.toString())
    
    const query = params.toString() ? `?${params.toString()}` : ''
    return apiFetch(`/uptime-stats${query}`)
  },

  async getById(serviceId: string, days?: number): Promise<ServiceUptime> {
    const params = new URLSearchParams()
    if (days) params.append('days', days.toString())
    
    const query = params.toString() ? `?${params.toString()}` : ''
    return apiFetch(`/uptime-stats/${serviceId}${query}`)
  },
}
