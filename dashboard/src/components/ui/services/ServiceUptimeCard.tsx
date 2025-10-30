"use client"

import React from "react"
import { Tracker } from "@/components/Tracker"
import { RiCheckboxCircleFill, RiErrorWarningFill, RiTimeFill } from "@remixicon/react"
import type { ServiceUptime } from "@/lib/api"

interface ServiceUptimeCardProps {
  service: ServiceUptime
}

export function ServiceUptimeCard({ service }: ServiceUptimeCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up':
        return <RiCheckboxCircleFill className="size-4 shrink-0 text-emerald-500" aria-hidden="true" />
      case 'down':
        return <RiErrorWarningFill className="size-4 shrink-0 text-red-500" aria-hidden="true" />
      case 'degraded':
        return <RiErrorWarningFill className="size-4 shrink-0 text-yellow-500" aria-hidden="true" />
      case 'no-data':
        return <RiTimeFill className="size-4 shrink-0 text-gray-500" aria-hidden="true" />
      default:
        return <RiTimeFill className="size-4 shrink-0 text-gray-500" aria-hidden="true" />
    }
  }

  // Get last 90, 60, and 30 days for different screen sizes with enhanced data
  const last90Days = service.uptimeDays.slice(-90).map(day => ({
    color: day.color,
    tooltip: day.tooltip,
    status: day.status,
    date: day.tooltip,
    percentage: day.percentage,
    checksCount: day.checksCount
  }))
  const last60Days = service.uptimeDays.slice(-60).map(day => ({
    color: day.color,
    tooltip: day.tooltip,
    status: day.status,
    date: day.tooltip,
    percentage: day.percentage,
    checksCount: day.checksCount
  }))
  const last30Days = service.uptimeDays.slice(-30).map(day => ({
    color: day.color,
    tooltip: day.tooltip,
    status: day.status,
    date: day.tooltip,
    percentage: day.percentage,
    checksCount: day.checksCount
  }))

  return (
    <div>
      {/* Compact row with icon, name, status pill, and uptime */}
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="flex items-center gap-1.5">
          {getStatusIcon(service.currentStatus)}
          <span className="text-gray-900 dark:text-gray-50">
            {service.serviceName}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
              service.active
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            {service.active ? 'Active' : 'Inactive'}
          </span>
        </span>
        <span className="text-gray-900 dark:text-gray-50">
          {service.uptimePercentage}% uptime
        </span>
      </div>

      {/* Tracker - 90 days on large screens */}
      <Tracker data={last90Days} className="mt-2 hidden w-full lg:flex" />
      
      {/* Tracker - 60 days on medium screens */}
      <Tracker data={last60Days} className="mt-2 hidden w-full sm:flex lg:hidden" />
      
      {/* Tracker - 30 days on mobile */}
      <Tracker data={last30Days} className="mt-2 flex w-full sm:hidden" />

      {/* Timeline labels */}
      <div className="mt-1.5 flex items-center justify-between text-[10px] text-gray-600 dark:text-gray-400">
        <span className="hidden lg:block">90 days ago</span>
        <span className="hidden sm:block lg:hidden">60 days ago</span>
        <span className="sm:hidden">30 days ago</span>
        <span>Today</span>
      </div>
    </div>
  )
}
