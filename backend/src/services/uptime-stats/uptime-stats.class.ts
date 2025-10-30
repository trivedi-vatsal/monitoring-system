// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'

interface UptimeDay {
  date: string
  tooltip: string
  status: 'up' | 'down' | 'degraded' | 'no-data'
  color: string
  percentage?: number
  checksCount?: number
}

interface ServiceUptime {
  serviceId: string
  serviceName: string
  endpointUrl: string
  active: boolean
  currentStatus: 'up' | 'down' | 'degraded' | 'no-data'
  lastChecked: string | null
  uptimeDays: UptimeDay[]
  uptimePercentage: number
}

type UptimeStats = ServiceUptime
type UptimeStatsData = any
type UptimeStatsPatch = any
interface UptimeStatsQuery {
  serviceId?: string
  clientId?: string
  days?: number
}

export type { UptimeStats, UptimeStatsData, UptimeStatsPatch, UptimeStatsQuery }

export interface UptimeStatsServiceOptions {
  app: Application
}

export interface UptimeStatsParams extends Params<UptimeStatsQuery> {}

const colorMapping: Record<string, string> = {
  up: 'emerald-500',
  down: 'red-500',
  degraded: 'yellow-500',
  'no-data': 'gray-300'
}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class UptimeStatsService<ServiceParams extends UptimeStatsParams = UptimeStatsParams>
  implements ServiceInterface<UptimeStats, UptimeStatsData, ServiceParams, UptimeStatsPatch>
{
  constructor(public options: UptimeStatsServiceOptions) {}

  async find(_params?: ServiceParams): Promise<UptimeStats[]> {
    const { serviceId, clientId, days = 90 } = _params?.query || {}
    const app = this.options.app

    try {
      // Get all services (both active and inactive)
      const serviceQuery: any = {}
      if (serviceId) {
        serviceQuery.id = serviceId
      }
      if (clientId) {
        serviceQuery.client_id = clientId
      }

      const servicesResult = await app.service('client-services').find({
        query: serviceQuery,
        paginate: false
      } as any)

      const services = Array.isArray(servicesResult) ? servicesResult : (servicesResult as any).data

      // Calculate date range
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Get uptime data for each service
      const uptimeData = await Promise.all(
        services.map(async (service: any) => {
          // Get status history for this service
          const statusHistory = await app.service('service-status').find({
            query: {
              service_id: service.id,
              checked_at: {
                $gte: startDate.toISOString(),
                $lte: endDate.toISOString()
              },
              $sort: { checked_at: 1 },
              $limit: 1000
            },
            paginate: false
          } as any)

          const statusArray = Array.isArray(statusHistory) ? statusHistory : (statusHistory as any).data

          // Create a map of date -> status counts
          const dateStatusMap = new Map<string, { up: number; down: number; degraded: number }>()
          
          statusArray.forEach((status: any) => {
            const date = new Date(status.checked_at).toISOString().split('T')[0]
            const statusValue = status.status as 'up' | 'down' | 'degraded'
            
            // Initialize counts for this date if not exists
            if (!dateStatusMap.has(date)) {
              dateStatusMap.set(date, { up: 0, down: 0, degraded: 0 })
            }
            
            // Increment the count for this status
            const counts = dateStatusMap.get(date)!
            counts[statusValue]++
          })
          
          // Function to determine day status based on counts
          const getDayStatus = (counts: { up: number; down: number; degraded: number }): { status: 'up' | 'down' | 'degraded', percentage: number } => {
            const total = counts.up + counts.down + counts.degraded
            const upPercentage = (counts.up / total) * 100
            
            // 100% = UP (green)
            if (upPercentage === 100) {
              return { status: 'up', percentage: upPercentage }
            }
            // 90% < percentage < 100% = DEGRADED (yellow)
            else if (upPercentage > 90 && upPercentage < 100) {
              return { status: 'degraded', percentage: upPercentage }
            }
            // < 90% = DOWN (red)
            else {
              return { status: 'down', percentage: upPercentage }
            }
          }

          // Generate array for all days in range
          const uptimeDays: UptimeDay[] = []
          const currentDate = new Date(startDate)
          
          while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split('T')[0]
            const counts = dateStatusMap.get(dateStr)
            
            let status: 'up' | 'down' | 'degraded' | 'no-data' = 'no-data'
            let percentage: number | undefined = undefined
            let checksCount: number | undefined = undefined
            
            if (counts) {
              const result = getDayStatus(counts)
              status = result.status
              percentage = Math.round(result.percentage * 100) / 100 // Round to 2 decimals
              checksCount = counts.up + counts.down + counts.degraded
            }
            
            uptimeDays.push({
              date: dateStr,
              tooltip: currentDate.toLocaleDateString('en-US', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              }),
              status,
              color: colorMapping[status],
              percentage,
              checksCount
            })
            
            currentDate.setDate(currentDate.getDate() + 1)
          }

          // Calculate uptime percentage (only count days with data)
          const daysWithData = uptimeDays.filter(d => d.status !== 'no-data')
          const upDays = daysWithData.filter(d => d.status === 'up').length
          const uptimePercentage = daysWithData.length > 0 
            ? Math.round((upDays / daysWithData.length) * 100) 
            : 0

          // Get latest status
          const latestStatus = await app.service('service-status').find({
            query: {
              service_id: service.id,
              $sort: { checked_at: -1 },
              $limit: 1
            },
            paginate: false
          } as any)

          const latestStatusArray = Array.isArray(latestStatus) ? latestStatus : (latestStatus as any).data
          const latest = latestStatusArray[0]

          return {
            serviceId: service.id,
            serviceName: service.name,
            endpointUrl: service.endpoint_url,
            active: service.active,
            currentStatus: latest?.status || 'no-data',
            lastChecked: latest?.checked_at || null,
            uptimeDays,
            uptimePercentage
          } as ServiceUptime
        })
      )

      // Sort by active status first (active = true comes before active = false)
      uptimeData.sort((a, b) => {
        if (a.active === b.active) return 0
        return a.active ? -1 : 1
      })

      return uptimeData
    } catch (error) {
      console.error('Error fetching uptime stats:', error)
      throw error
    }
  }

  async get(id: Id, _params?: ServiceParams): Promise<UptimeStats> {
    // Get uptime for a specific service
    const result = await this.find({
      ..._params,
      query: {
        ..._params?.query,
        serviceId: id.toString()
      }
    } as ServiceParams)
    
    if (result.length === 0) {
      throw new Error(`Service with id ${id} not found`)
    }
    
    return result[0]
  }

  // Remove unused methods
  async create(data: UptimeStatsData, params?: ServiceParams): Promise<UptimeStats>
  async create(data: UptimeStatsData[], params?: ServiceParams): Promise<UptimeStats[]>
  async create(
    data: UptimeStatsData | UptimeStatsData[],
    params?: ServiceParams
  ): Promise<UptimeStats | UptimeStats[]> {
    throw new Error('Method not implemented')
  }

  async update(id: NullableId, data: UptimeStatsData, _params?: ServiceParams): Promise<UptimeStats> {
    throw new Error('Method not implemented')
  }

  async patch(id: NullableId, data: UptimeStatsPatch, _params?: ServiceParams): Promise<UptimeStats> {
    throw new Error('Method not implemented')
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<UptimeStats> {
    throw new Error('Method not implemented')
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
