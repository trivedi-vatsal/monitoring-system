// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  UptimeStats,
  UptimeStatsData,
  UptimeStatsPatch,
  UptimeStatsQuery,
  UptimeStatsService
} from './uptime-stats.class'

export type { UptimeStats, UptimeStatsData, UptimeStatsPatch, UptimeStatsQuery }

export type UptimeStatsClientService = Pick<
  UptimeStatsService<Params<UptimeStatsQuery>>,
  (typeof uptimeStatsMethods)[number]
>

export const uptimeStatsPath = 'uptime-stats'

export const uptimeStatsMethods: Array<keyof UptimeStatsService> = [
  'find',
  'get',
  'create',
  'patch',
  'remove'
]

export const uptimeStatsClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(uptimeStatsPath, connection.service(uptimeStatsPath), {
    methods: uptimeStatsMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [uptimeStatsPath]: UptimeStatsClientService
  }
}
