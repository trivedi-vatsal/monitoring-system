"use client"

import { Badge } from "@/components/Badge"
import { type ServiceStatus } from "@/lib/api"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { RiInformationLine } from "@remixicon/react"

const columnHelper = createColumnHelper<ServiceStatus>()

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

export const serviceStatusColumns = [
  columnHelper.accessor((row) => row.service?.name || "Unknown Service", {
    id: "service_name",
    header: "Service",
    cell: ({ getValue }) => (
      <span className="font-medium text-gray-900 dark:text-gray-50">
        {getValue()}
      </span>
    ),
    enableSorting: false,
    meta: {
      displayName: "Service",
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue()
      return (
        <Badge
          variant={
            status === "up"
              ? "success"
              : status === "degraded"
              ? "warning"
              : "error"
          }
        >
          {status.toUpperCase()}
        </Badge>
      )
    },
    enableSorting: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    meta: {
      displayName: "Status",
    },
  }),
  columnHelper.accessor("status_code", {
    header: "Status Code",
    cell: ({ getValue }) => (
      <span className="text-gray-600 dark:text-gray-400">
        {getValue() || "N/A"}
      </span>
    ),
    enableSorting: false,
    meta: {
      displayName: "Status Code",
    },
  }),
  columnHelper.accessor("latency_ms", {
    header: "Latency",
    cell: ({ getValue }) => (
      <span className="text-gray-600 dark:text-gray-400">
        {getValue()}ms
      </span>
    ),
    enableSorting: false,
    meta: {
      displayName: "Latency",
    },
  }),
  columnHelper.accessor("checked_at", {
    header: "Checked At",
    cell: ({ getValue }) => (
      <span className="text-gray-600 dark:text-gray-400">
        {formatDate(getValue())}
      </span>
    ),
    enableSorting: false,
    meta: {
      displayName: "Checked At",
    },
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const status = row.original
      return (
        <button
          onClick={(e) => {
            e.stopPropagation()
            // This will be handled by the parent component
            const event = new CustomEvent('viewStatusDetails', { 
              detail: status,
              bubbles: true 
            })
            e.currentTarget.dispatchEvent(event)
          }}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <RiInformationLine className="mr-1 size-4" />
          View Details
        </button>
      )
    },
    enableSorting: false,
    enableHiding: false,
    meta: {
      displayName: "Actions",
    },
  }),
] as ColumnDef<ServiceStatus>[]
