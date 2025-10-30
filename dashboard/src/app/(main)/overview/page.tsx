"use client"

import React from "react"
import { Card } from "@/components/Card"
import { ServiceUptimeCard } from "@/components/ui/services/ServiceUptimeCard"
import { uptimeStatsApi, type ServiceUptime } from "@/lib/api"
import { useClient } from "@/contexts/ClientContext"
import { RiServerLine } from "@remixicon/react"

export default function OverviewPage() {
  const { selectedClient } = useClient()
  const [services, setServices] = React.useState<ServiceUptime[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchUptimeData = async () => {
      if (!selectedClient) {
        setServices([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const data = await uptimeStatsApi.getAll(selectedClient.id, 90)
        setServices(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load uptime data")
      } finally {
        setLoading(false)
      }
    }

    fetchUptimeData()

    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchUptimeData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [selectedClient])

  return (
    <>
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        All services status
      </h1>

      {/* Status legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="text-gray-700 dark:text-gray-300">Operational</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-red-500" aria-hidden="true" />
          <span className="text-gray-700 dark:text-gray-300">Downtime</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-yellow-500" aria-hidden="true" />
          <span className="text-gray-700 dark:text-gray-300">Degraded</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-gray-400 dark:bg-gray-600" aria-hidden="true" />
          <span className="text-gray-700 dark:text-gray-300">No Data</span>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-3 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-gray-500">Loading service status...</p>
          </div>
        ) : services.length === 0 ? (
          <Card className="flex h-96 flex-col items-center justify-center">
            <RiServerLine
              className="size-12 text-gray-400 dark:text-gray-600"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-gray-50">
              No services yet
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
              Get started by adding your first service endpoint.
            </p>
          </Card>
        ) : (
          <Card className="space-y-4">
            {services.map((service, index) => (
              <React.Fragment key={service.serviceId}>
                <ServiceUptimeCard service={service} />
                {index < services.length - 1 && (
                  <div className="h-px w-full bg-gray-200 dark:bg-gray-800" aria-hidden="true" />
                )}
              </React.Fragment>
            ))}
          </Card>
        )}
      </div>
    </>
  )
}
