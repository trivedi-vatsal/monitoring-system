"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Dropdown"
import { cx, focusInput } from "@/lib/utils"
import { RiArrowRightSLine, RiExpandUpDownLine } from "@remixicon/react"
import React from "react"
import { ModalAddClient } from "./ModalAddClient"
import { useClient } from "@/contexts/ClientContext"
import type { Client } from "@/lib/api"

// Generate initials from client name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Generate color based on client id
function getColor(id: string): string {
  const colors = [
    "bg-indigo-600 dark:bg-indigo-500",
    "bg-blue-600 dark:bg-blue-500",
    "bg-purple-600 dark:bg-purple-500",
    "bg-pink-600 dark:bg-pink-500",
    "bg-rose-600 dark:bg-rose-500",
    "bg-orange-600 dark:bg-orange-500",
  ]
  const index = parseInt(id.slice(0, 8), 16) % colors.length
  return colors[index]
}

export const WorkspacesDropdownDesktop = () => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const [hasOpenDialog, setHasOpenDialog] = React.useState(false)
  const { selectedClient, setSelectedClient, clients, loading, refreshClients } = useClient()
  const dropdownTriggerRef = React.useRef<null | HTMLButtonElement>(null)
  const focusRef = React.useRef<null | HTMLButtonElement>(null)

  const handleDialogItemSelect = () => {
    focusRef.current = dropdownTriggerRef.current
  }

  const handleDialogItemOpenChange = (open: boolean) => {
    setHasOpenDialog(open)
    if (open === false) {
      setDropdownOpen(false)
      // Refresh clients list after adding new client
      refreshClients()
    }
  }

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client)
    setDropdownOpen(false)
  }

  if (loading || !selectedClient) {
    return (
      <div className="flex w-full items-center gap-x-2.5 rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="h-8 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    )
  }

  return (
    <>
      {/* sidebar (lg+) */}
      <DropdownMenu
        open={dropdownOpen}
        onOpenChange={setDropdownOpen}
        modal={false}
      >
        <DropdownMenuTrigger asChild>
          <button
            ref={dropdownTriggerRef}
            className={cx(
              "flex w-full items-center gap-x-2.5 rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 hover:dark:bg-gray-900",
              focusInput,
            )}
          >
            <span
              className={cx(
                getColor(selectedClient.id),
                "flex aspect-square size-8 items-center justify-center rounded p-2 text-xs font-medium text-white"
              )}
              aria-hidden="true"
            >
              {getInitials(selectedClient.name)}
            </span>
            <div className="flex w-full items-center justify-between gap-x-4 truncate">
              <div className="truncate">
                <p className="truncate whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-50">
                  {selectedClient.name}
                </p>
                <p className="whitespace-nowrap text-left text-xs text-gray-700 dark:text-gray-300">
                  {selectedClient.active ? 'Active' : 'Inactive'}
                </p>
              </div>
              <RiExpandUpDownLine
                className="size-5 shrink-0 text-gray-500"
                aria-hidden="true"
              />
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          hidden={hasOpenDialog}
          onCloseAutoFocus={(event) => {
            if (focusRef.current) {
              focusRef.current.focus()
              focusRef.current = null
              event.preventDefault()
            }
          }}
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              Clients ({clients.length})
            </DropdownMenuLabel>
            {clients.map((client) => (
              <DropdownMenuItem 
                key={client.id}
                onSelect={() => handleClientSelect(client)}
              >
                <div className="flex w-full items-center gap-x-2.5">
                  <span
                    className={cx(
                      getColor(client.id),
                      "flex aspect-square size-8 items-center justify-center rounded p-2 text-xs font-medium text-white",
                    )}
                    aria-hidden="true"
                  >
                    {getInitials(client.name)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                      {client.name}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-400">
                      {client.active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <ModalAddClient
            onSelect={handleDialogItemSelect}
            onOpenChange={handleDialogItemOpenChange}
            itemName="Add client"
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export const WorkspacesDropdownMobile = () => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false)
  const [hasOpenDialog, setHasOpenDialog] = React.useState(false)
  const { selectedClient, setSelectedClient, clients, loading, refreshClients } = useClient()
  const dropdownTriggerRef = React.useRef<null | HTMLButtonElement>(null)
  const focusRef = React.useRef<null | HTMLButtonElement>(null)

  const handleDialogItemSelect = () => {
    focusRef.current = dropdownTriggerRef.current
  }

  const handleDialogItemOpenChange = (open: boolean) => {
    setHasOpenDialog(open)
    if (open === false) {
      setDropdownOpen(false)
      refreshClients()
    }
  }

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client)
    setDropdownOpen(false)
  }

  if (loading || !selectedClient) {
    return (
      <div className="flex items-center gap-x-1.5 rounded-md p-2">
        <div className="h-7 w-7 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    )
  }

  return (
    <>
      {/* sidebar (xs-lg) */}
      <DropdownMenu
        open={dropdownOpen}
        onOpenChange={setDropdownOpen}
        modal={false}
      >
        <DropdownMenuTrigger asChild>
          <button 
            ref={dropdownTriggerRef}
            className="flex items-center gap-x-1.5 rounded-md p-2 hover:bg-gray-100 focus:outline-none hover:dark:bg-gray-900"
          >
            <span
              className={cx(
                getColor(selectedClient.id),
                "flex aspect-square size-7 items-center justify-center rounded p-2 text-xs font-medium text-white",
              )}
              aria-hidden="true"
            >
              {getInitials(selectedClient.name)}
            </span>
            <RiArrowRightSLine
              className="size-4 shrink-0 text-gray-500"
              aria-hidden="true"
            />
            <div className="flex w-full items-center justify-between gap-x-3 truncate">
              <p className="truncate whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-50">
                {selectedClient.name}
              </p>
              <RiExpandUpDownLine
                className="size-4 shrink-0 text-gray-500"
                aria-hidden="true"
              />
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="!min-w-72"
          hidden={hasOpenDialog}
          onCloseAutoFocus={(event) => {
            if (focusRef.current) {
              focusRef.current.focus()
              focusRef.current = null
              event.preventDefault()
            }
          }}
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              Clients ({clients.length})
            </DropdownMenuLabel>
            {clients.map((client) => (
              <DropdownMenuItem 
                key={client.id}
                onSelect={() => handleClientSelect(client)}
              >
                <div className="flex w-full items-center gap-x-2.5">
                  <span
                    className={cx(
                      getColor(client.id),
                      "flex size-8 items-center justify-center rounded p-2 text-xs font-medium text-white",
                    )}
                    aria-hidden="true"
                  >
                    {getInitials(client.name)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                      {client.name}
                    </p>
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      {client.active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <ModalAddClient
            onSelect={handleDialogItemSelect}
            onOpenChange={handleDialogItemOpenChange}
            itemName="Add client"
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
