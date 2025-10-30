"use client"

import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { Divider } from "@/components/Divider"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/Table"
import { clientServicesApi, type ClientService } from "@/lib/api"
import { ModalAddService } from "@/components/ui/services/ModalAddService"
import { ServiceDetailDrawer } from "@/components/ui/services/ServiceDetailDrawer"
import { useClient } from "@/contexts/ClientContext"
import {
  RiGlobalLine,
  RiExternalLinkLine,
  RiSearchLine,
  RiLayoutGridLine,
  RiListCheck,
} from "@remixicon/react"
import React from "react"

type StatusFilter = "all" | "active" | "inactive"
type LayoutView = "grid" | "list"

export default function ServicesPage() {
  const { selectedClient } = useClient()
  const [services, setServices] = React.useState<ClientService[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedService, setSelectedService] =
    React.useState<ClientService | null>(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all")
  const [layoutView, setLayoutView] = React.useState<LayoutView>("grid")

  // Filter and search services
  const filteredServices = React.useMemo(() => {
    let filtered = services

    // Apply status filter
    if (statusFilter === "active") {
      filtered = filtered.filter((s) => s.active)
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter((s) => !s.active)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.endpoint_url.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [services, statusFilter, searchQuery])

  // Group services by status for badge counts
  const groupedServices = React.useMemo(() => {
    const active = services.filter((s) => s.active)
    const inactive = services.filter((s) => !s.active)
    return { active, inactive }
  }, [services])

  React.useEffect(() => {
    fetchServices()
  }, [selectedClient])

  const fetchServices = async () => {
    if (!selectedClient) {
      setServices([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const result = await clientServicesApi.getAll(selectedClient.id)
      setServices(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch services")
    } finally {
      setLoading(false)
    }
  }

  const handleServiceClick = (service: ClientService) => {
    setSelectedService(service)
    setDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
    setTimeout(() => setSelectedService(null), 300)
  }

  const handleServiceUpdate = () => {
    fetchServices()
  }

  const handleStatusFilterClick = (filter: StatusFilter) => {
    setStatusFilter(filter)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-96 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Services
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Monitor and manage all your service endpoints and health checks.
          </p>
        </div>
        <ModalAddService
          selectedClient={selectedClient}
          onSuccess={fetchServices}
        />
      </div>

      {error && (
        <Card className="mt-6 border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
        </Card>
      )}

      {/* Search and filters bar */}
      <div className="mt-6 flex items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
        <div className="relative flex-1">
          <RiSearchLine
            className="absolute left-0 top-1/2 size-5 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search all services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-0 bg-transparent pl-7 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 dark:text-gray-50 dark:placeholder-gray-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStatusFilterClick("all")}
            className="focus:outline-none"
          >
            <Badge
              variant="neutral"
              className={
                statusFilter === "all"
                  ? "cursor-pointer ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-950"
                  : "cursor-pointer opacity-60 hover:opacity-100"
              }
            >
              All {services.length}
            </Badge>
          </button>
          <button
            onClick={() => handleStatusFilterClick("active")}
            className="focus:outline-none"
          >
            <Badge
              variant="success"
              className={
                statusFilter === "active"
                  ? "cursor-pointer ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-950"
                  : "cursor-pointer opacity-60 hover:opacity-100"
              }
            >
              Active {groupedServices.active.length}
            </Badge>
          </button>
          <button
            onClick={() => handleStatusFilterClick("inactive")}
            className="focus:outline-none"
          >
            <Badge
              variant="neutral"
              className={
                statusFilter === "inactive"
                  ? "cursor-pointer ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-950"
                  : "cursor-pointer opacity-60 hover:opacity-100"
              }
            >
              Inactive {groupedServices.inactive.length}
            </Badge>
          </button>

          <Divider className="!my-0 h-6" />

          {/* Layout switcher */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLayoutView("grid")}
              className={`rounded-md p-1.5 focus:outline-none ${
                layoutView === "grid"
                  ? "bg-gray-100 ring-1 ring-inset ring-gray-200 dark:bg-[#090E1A] dark:ring-gray-800"
                  : "text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400"
              }`}
              title="Grid view"
              aria-label="Grid view"
            >
              <RiLayoutGridLine className="size-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => setLayoutView("list")}
              className={`rounded-md p-1.5 focus:outline-none ${
                layoutView === "list"
                  ? "bg-gray-100 ring-1 ring-inset ring-gray-200 dark:bg-[#090E1A] dark:ring-gray-800"
                  : "text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400"
              }`}
              title="List view"
              aria-label="List view"
            >
              <RiListCheck className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Services grid/list view */}
      {layoutView === "grid" ? (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.length === 0 ? (
            <div className="col-span-full">
              <Card className="flex h-96 flex-col items-center justify-center">
                <RiGlobalLine
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
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="col-span-full">
              <Card className="flex h-64 flex-col items-center justify-center">
                <RiSearchLine
                  className="size-12 text-gray-400 dark:text-gray-600"
                  aria-hidden="true"
                />
                <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-gray-50">
                  No services found
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                  Try adjusting your search or filters.
                </p>
              </Card>
            </div>
          ) : (
            filteredServices.map((service) => (
              <Card
                key={service.id}
                asChild
                className="group relative !p-4 transition-shadow hover:shadow-lg"
              >
                <div>
                  <div className="space-y-3">
                    {/* Service name and URL */}
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-gray-900 dark:text-gray-50">
                        {service.name}
                      </h3>
                      <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-500">
                        {service.endpoint_url}
                      </p>
                    </div>
                  </div>

                  {/* Footer with status and action */}
                  <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
                    <Badge
                      variant={service.active ? "success" : "neutral"}
                      className="shrink-0"
                    >
                      {service.active ? "Active" : "Inactive"}
                    </Badge>
                    <button
                      onClick={() => handleServiceClick(service)}
                      className="text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-400"
                    >
                      View details &#8594;
                    </button>
                  </div>

                  {/* External link icon - top right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(service.endpoint_url, "_blank")
                    }}
                    className="pointer-events-auto absolute right-4 top-4 text-gray-400 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-500"
                    title="Open in new tab"
                    aria-label="Open endpoint in new tab"
                  >
                    <RiExternalLinkLine className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="mt-6">
          {services.length === 0 ? (
            <Card className="flex h-96 flex-col items-center justify-center">
              <RiGlobalLine
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
          ) : filteredServices.length === 0 ? (
            <Card className="flex h-64 flex-col items-center justify-center">
              <RiSearchLine
                className="size-12 text-gray-400 dark:text-gray-600"
                aria-hidden="true"
              />
              <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-gray-50">
                No services found
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                Try adjusting your search or filters.
              </p>
            </Card>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Service</TableHeaderCell>
                  <TableHeaderCell>Slug</TableHeaderCell>
                  <TableHeaderCell>Endpoint</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow
                    key={service.id}
                    className="hover:bg-gray-50 hover:dark:bg-gray-900"
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-gray-50">
                      {service.name}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {service.slug}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm">
                          {service.endpoint_url}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(service.endpoint_url, "_blank")
                          }}
                          className="shrink-0 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Open in new tab"
                          aria-label="Open endpoint in new tab"
                        >
                          <RiExternalLinkLine className="size-4" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={service.active ? "success" : "neutral"}>
                        {service.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleServiceClick(service)}
                        className="text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-400"
                      >
                        View details &#8594;
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      <ServiceDetailDrawer
        open={drawerOpen}
        onOpenChange={handleDrawerClose}
        service={selectedService}
        onUpdate={handleServiceUpdate}
      />
    </>
  )
}
