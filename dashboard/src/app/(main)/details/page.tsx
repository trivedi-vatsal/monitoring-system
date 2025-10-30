"use client"

import React from "react"
import { DataTable } from "@/components/ui/data-table/DataTable"
import { serviceStatusColumns } from "@/components/ui/data-table/serviceStatusColumns"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/Drawer"
import { Button } from "@/components/Button"
import { Badge } from "@/components/Badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
import { DateRangePicker } from "@/components/DatePicker"
import { serviceStatusApi, clientServicesApi, type ServiceStatus, type ClientService } from "@/lib/api"
import { useClient } from "@/contexts/ClientContext"

export default function DetailsPage() {
  const { selectedClient } = useClient()
  const [statusData, setStatusData] = React.useState<ServiceStatus[]>([])
  const [services, setServices] = React.useState<ClientService[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = React.useState<ServiceStatus | null>(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  
  // Filters
  const [selectedServiceId, setSelectedServiceId] = React.useState<string>("")
  const [selectedStatusFilter, setSelectedStatusFilter] = React.useState<string>("")
  const [dateRange, setDateRange] = React.useState<{ from: Date | undefined; to?: Date | undefined } | undefined>(undefined)
  
  // Pagination
  const [totalRows, setTotalRows] = React.useState(0)
  const [pageIndex, setPageIndex] = React.useState(0)
  const pageSize = 20

  React.useEffect(() => {
    const fetchServices = async () => {
      if (!selectedClient) {
        setServices([])
        return
      }

      try {
        const result = await clientServicesApi.getAll(selectedClient.id)
        setServices(result.data)
        // Reset service filter when client changes
        setSelectedServiceId("")
      } catch (err) {
        console.error("Failed to load services:", err)
      }
    }

    fetchServices()
  }, [selectedClient])

  React.useEffect(() => {
    const fetchStatusData = async () => {
      if (!selectedClient) {
        setStatusData([])
        setTotalRows(0)
        setLoading(false)
        return
      }

      // If client has no services, don't fetch any data
      if (services.length === 0) {
        setStatusData([])
        setTotalRows(0)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const startDate = dateRange?.from ? dateRange.from.toISOString() : undefined
        const endDate = dateRange?.to ? dateRange.to.toISOString() : undefined
        
        // Make a single API call with either specific service_id or client_id
        const result = await serviceStatusApi.getAll(
          selectedServiceId || undefined,  // serviceId (if specific service selected)
          pageSize,
          pageIndex * pageSize,
          startDate,
          endDate,
          selectedStatusFilter || undefined,
          selectedServiceId ? undefined : selectedClient.id  // clientId (only if no specific service)
        )
        
        setStatusData(result.data)
        setTotalRows(result.total)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load status data")
      } finally {
        setLoading(false)
      }
    }

    fetchStatusData()

    // Listen for view details events from the DataTable
    const handleViewDetails = (event: Event) => {
      const customEvent = event as CustomEvent<ServiceStatus>
      setSelectedStatus(customEvent.detail)
      setDrawerOpen(true)
    }

    document.addEventListener('viewStatusDetails', handleViewDetails)
    return () => {
      document.removeEventListener('viewStatusDetails', handleViewDetails)
    }
  }, [selectedClient, selectedServiceId, selectedStatusFilter, dateRange, pageIndex, services])

  const handlePaginationChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex)
  }

  const handleClearFilters = () => {
    setSelectedServiceId("")
    setSelectedStatusFilter("")
    setDateRange(undefined)
    setPageIndex(0)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <>
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        Service Health History
      </h1>
      
      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-3 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="w-full sm:w-64">
          <Select
            value={selectedServiceId}
            onValueChange={(value) => {
              setSelectedServiceId(value === "all" ? "" : value)
              setPageIndex(0)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Services" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-40">
          <Select
            value={selectedStatusFilter}
            onValueChange={(value) => {
              setSelectedStatusFilter(value === "all" ? "" : value)
              setPageIndex(0)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="up">Up</SelectItem>
              <SelectItem value="down">Down</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-auto">
          <DateRangePicker
            value={dateRange}
            onChange={(range) => {
              setDateRange(range)
              setPageIndex(0)
            }}
            placeholder="Select date range"
            className="w-full sm:w-auto"
          />
        </div>

        {(selectedServiceId || selectedStatusFilter || dateRange?.from || dateRange?.to) && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="border border-gray-200 px-2 font-semibold text-indigo-600 dark:border-gray-800 dark:text-indigo-500"
          >
            Clear filters
          </Button>
        )}
      </div>

      <div className="mt-4 sm:mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-gray-500">Loading service status data...</p>
          </div>
        ) : (
          <DataTable 
            data={statusData} 
            columns={serviceStatusColumns} 
            showFilterbar={false}
            totalRows={totalRows}
            pageIndex={pageIndex}
            pageSize={pageSize}
            onPaginationChange={handlePaginationChange}
          />
        )}
      </div>

      {/* Details Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="sm:max-w-3xl">
          <DrawerHeader>
            <DrawerTitle>Health Check Details</DrawerTitle>
            <DrawerDescription>
              Detailed information about this health check
            </DrawerDescription>
          </DrawerHeader>

          <DrawerBody className="space-y-6">
            {selectedStatus && (
              <>
                {/* Basic Information */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-3">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Service Name
                      </p>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-50">
                        {selectedStatus.service?.name || "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                      <div className="mt-1">
                        <Badge
                          variant={
                            selectedStatus.status === "up"
                              ? "success"
                              : selectedStatus.status === "degraded"
                              ? "warning"
                              : "error"
                          }
                        >
                          {selectedStatus.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status Code
                      </p>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-50">
                        {selectedStatus.status_code || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Latency</p>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-50">
                        {selectedStatus.latency_ms}ms
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Endpoint URL
                      </p>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-50 break-all">
                        {selectedStatus.service?.endpoint_url || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Checked At
                      </p>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-50">
                        {formatDate(selectedStatus.checked_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Created At
                      </p>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-50">
                        {formatDate(selectedStatus.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {selectedStatus.error_message && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-3">
                      Error Message
                    </h3>
                    <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
                      <p className="text-sm text-red-800 dark:text-red-400">
                        {selectedStatus.error_message}
                      </p>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                {selectedStatus.metadata && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-3">
                      Metadata
                    </h3>
                    <pre className="rounded-md bg-gray-50 p-4 text-xs overflow-x-auto dark:bg-gray-900">
                      {JSON.stringify(selectedStatus.metadata, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Response */}
                {selectedStatus.response && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-3">
                      Response
                    </h3>
                    <pre className="rounded-md bg-gray-50 p-4 text-xs overflow-x-auto dark:bg-gray-900">
                      {JSON.stringify(selectedStatus.response, null, 2)}
                    </pre>
                  </div>
                )}
              </>
            )}
          </DrawerBody>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="secondary" className="w-full">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
