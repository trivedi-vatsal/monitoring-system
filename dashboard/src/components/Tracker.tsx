// Tremor Raw Tracker Component

"use client"

import React from "react"
import { cx } from "@/lib/utils"
import * as HoverCardPrimitives from "@radix-ui/react-hover-card"
import { RiCheckboxCircleFill, RiErrorWarningFill, RiAlertFill } from "@remixicon/react"

export interface TrackerBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  tooltip?: string
  color?: string
  status?: 'up' | 'down' | 'degraded' | 'no-data'
  date?: string
  percentage?: number
  checksCount?: number
}

const TrackerBlock = React.forwardRef<HTMLDivElement, TrackerBlockProps>(
  ({ tooltip, color, status, date, percentage, checksCount, className, ...props }, forwardedRef) => {
    const [open, setOpen] = React.useState(false)
    
    const blockElement = (
      <div
        ref={forwardedRef}
        className={cx(
          "h-6 w-full rounded-sm transition-colors hover:opacity-75 cursor-pointer",
          color === "emerald-500" && "bg-emerald-500",
          color === "red-500" && "bg-red-500",
          color === "yellow-500" && "bg-yellow-500",
          color === "gray-300" && "bg-gray-300 dark:bg-gray-700",
          !color && "bg-gray-200 dark:bg-gray-800",
          className
        )}
        onClick={() => setOpen(true)}
        {...props}
      />
    )

    if (!tooltip) {
      return blockElement
    }

    return (
      <HoverCardPrimitives.Root
        open={open}
        onOpenChange={setOpen}
        openDelay={0}
        closeDelay={0}
      >
        <HoverCardPrimitives.Trigger asChild>
          {blockElement}
        </HoverCardPrimitives.Trigger>
        <HoverCardPrimitives.Portal>
          <HoverCardPrimitives.Content
            sideOffset={10}
            side="top"
            align="center"
            avoidCollisions
            className={cx(
              // base
              "min-w-44 max-w-52 rounded-md shadow-lg z-50",
              // text
              "text-gray-900 dark:text-gray-50",
              // background
              "bg-white dark:bg-gray-950",
              // border
              "border border-gray-200 dark:border-gray-800",
            )}
          >
            <p className="flex items-center gap-2 px-3 py-2 text-sm font-medium">
              {status === 'up' && (
                <RiCheckboxCircleFill
                  className="size-5 shrink-0 text-emerald-500"
                  aria-hidden={true}
                />
              )}
              {status === 'down' && (
                <RiErrorWarningFill
                  className="size-5 shrink-0 text-red-500"
                  aria-hidden={true}
                />
              )}
              {status === 'degraded' && (
                <RiAlertFill
                  className="size-5 shrink-0 text-yellow-500"
                  aria-hidden={true}
                />
              )}
              {status === 'up' && 'Operational'}
              {status === 'down' && 'Downtime'}
              {status === 'degraded' && 'Degraded'}
              {status === 'no-data' && 'No Data'}
            </p>
            <div
              className="h-px w-full bg-gray-200 dark:bg-gray-800"
              aria-hidden={true}
            />
            <div className="px-3 py-2 text-xs text-gray-600 dark:text-gray-400">
              <p>{date}</p>
              {percentage !== undefined && (
                <p className="mt-1 font-medium">Uptime: {percentage}%</p>
              )}
              {checksCount !== undefined && (
                <p className="mt-0.5">Checks: {checksCount}</p>
              )}
            </div>
          </HoverCardPrimitives.Content>
        </HoverCardPrimitives.Portal>
      </HoverCardPrimitives.Root>
    )
  }
)

TrackerBlock.displayName = "TrackerBlock"

export interface TrackerProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Array<{
    tooltip?: string
    color?: string
    status?: 'up' | 'down' | 'degraded' | 'no-data'
    date?: string
    percentage?: number
    checksCount?: number
  }>
}

const Tracker = React.forwardRef<HTMLDivElement, TrackerProps>(
  ({ data = [], className, ...props }, forwardedRef) => {
    return (
      <div
        ref={forwardedRef}
        className={cx("flex w-full gap-0.5", className)}
        {...props}
      >
        {data.map((item, index) => (
          <TrackerBlock
            key={index}
            tooltip={item.tooltip}
            color={item.color}
            status={item.status}
            date={item.date}
            percentage={item.percentage}
            checksCount={item.checksCount}
          />
        ))}
      </div>
    )
  }
)

Tracker.displayName = "Tracker"

export { Tracker, TrackerBlock }
