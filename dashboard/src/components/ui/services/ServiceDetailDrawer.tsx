"use client"

import { Button } from "@/components/Button"
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
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { Badge } from "@/components/Badge"
import { clientServicesApi, type ClientService } from "@/lib/api"
import { RiEditLine, RiSaveLine, RiExternalLinkLine, RiToggleLine } from "@remixicon/react"
import React from "react"
import { CronDescription } from "./CronDescription"

export type ServiceDetailDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  service: ClientService | null
  onUpdate: () => void
}

export function ServiceDetailDrawer({
  open,
  onOpenChange,
  service,
  onUpdate,
}: ServiceDetailDrawerProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState<Partial<ClientService> & { basic_auth_password?: string }>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isTogglingStatus, setIsTogglingStatus] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [currentService, setCurrentService] = React.useState<ClientService | null>(service)
  const [isLoading, setIsLoading] = React.useState(false)

  // Fetch fresh service data when the drawer opens
  React.useEffect(() => {
    const fetchServiceData = async () => {
      if (open && service?.id) {
        setIsLoading(true)
        setError(null)
        try {
          const freshData = await clientServicesApi.getById(service.id)
          setCurrentService(freshData)
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load service data")
        } finally {
          setIsLoading(false)
        }
      }
    }
    
    fetchServiceData()
  }, [open, service?.id])

  React.useEffect(() => {
    if (currentService) {
      setFormData({
        name: currentService.name,
        slug: currentService.slug,
        endpoint_url: currentService.endpoint_url,
        cron_pattern: currentService.cron_pattern,
        expected_status_code: currentService.expected_status_code,
        timeout_ms: currentService.timeout_ms,
        basic_auth_username: currentService.basic_auth_username || "",
        basic_auth_password: "",
        active: currentService.active,
      })
      setIsEditing(false)
      setError(null)
    }
  }, [currentService])

  if (!currentService) return null

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setFormData({
      ...formData,
      name: newName,
      slug: generateSlug(newName)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Clean up the data before sending
      const updateData: Partial<ClientService> & { basic_auth_password?: string } = {
        name: formData.name,
        slug: formData.slug,
        endpoint_url: formData.endpoint_url,
        cron_pattern: formData.cron_pattern,
        expected_status_code: formData.expected_status_code,
        timeout_ms: formData.timeout_ms,
        active: formData.active,
      }

      // Only include basic auth username if it has a value
      if (formData.basic_auth_username) {
        updateData.basic_auth_username = formData.basic_auth_username
      }

      // Only include password if it's been changed (not empty)
      if (formData.basic_auth_password) {
        updateData.basic_auth_password = formData.basic_auth_password
      }

      await clientServicesApi.update(currentService.id, updateData)
      
      // Fetch fresh data after update
      const freshData = await clientServicesApi.getById(currentService.id)
      setCurrentService(freshData)
      
      setIsEditing(false)
      onUpdate()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update service")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: currentService.name,
      slug: currentService.slug,
      endpoint_url: currentService.endpoint_url,
      cron_pattern: currentService.cron_pattern,
      expected_status_code: currentService.expected_status_code,
      timeout_ms: currentService.timeout_ms,
      basic_auth_username: currentService.basic_auth_username || "",
      basic_auth_password: "",
      active: currentService.active,
    })
    setIsEditing(false)
    setError(null)
  }

  const handleToggleStatus = async () => {
    if (!currentService) return
    setIsTogglingStatus(true)
    setError(null)

    try {
      const newStatus = !currentService.active
      await clientServicesApi.update(currentService.id, { active: newStatus })
      
      // Fetch fresh data after status toggle
      const freshData = await clientServicesApi.getById(currentService.id)
      setCurrentService(freshData)
      
      onUpdate()
      // Keep the drawer open - removed onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle status")
    } finally {
      setIsTogglingStatus(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="sm:max-w-lg">
        <DrawerHeader>
          <DrawerTitle>Service Details</DrawerTitle>
          <DrawerDescription>
            {isEditing ? "Update service configuration" : "View service information"}
          </DrawerDescription>
        </DrawerHeader>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <DrawerBody className="space-y-4">
              <div>
                <Label htmlFor="edit-name" className="font-medium">
                  Service name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-name"
                  className="mt-2"
                  value={formData.name || ""}
                  onChange={handleNameChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-slug" className="font-medium">
                  Slug <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-slug"
                  className="mt-2"
                  value={formData.slug || ""}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  pattern="[a-z0-9-]+"
                  title="Only lowercase letters, numbers, and hyphens allowed"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Used in URLs (lowercase, numbers, and hyphens only)</p>
              </div>

              <div>
                <Label htmlFor="edit-endpoint_url" className="font-medium">
                  Endpoint URL <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-endpoint_url"
                  type="url"
                  className="mt-2"
                  value={formData.endpoint_url || ""}
                  onChange={(e) => setFormData({ ...formData, endpoint_url: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-cron_pattern" className="font-medium">
                  Cron pattern <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-cron_pattern"
                  className="mt-2"
                  value={formData.cron_pattern || ""}
                  onChange={(e) => setFormData({ ...formData, cron_pattern: e.target.value })}
                  required
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  <CronDescription expression={formData.cron_pattern || ""} />
                </p>
              </div>

              <div>
                <Label htmlFor="edit-timeout_ms" className="font-medium">
                  Timeout (ms) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-timeout_ms"
                  type="number"
                  min="1000"
                  max="60000"
                  className="mt-2"
                  value={formData.timeout_ms || 10000}
                  onChange={(e) =>
                    setFormData({ ...formData, timeout_ms: parseInt(e.target.value) || 10000 })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-expected_status_code" className="font-medium">
                  Expected status code
                </Label>
                <Input
                  id="edit-expected_status_code"
                  type="number"
                  min="100"
                  max="599"
                  className="mt-2"
                  value={formData.expected_status_code || 200}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expected_status_code: parseInt(e.target.value) || 200,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="edit-basic_auth_username">Basic Auth Username</Label>
                <Input
                  id="edit-basic_auth_username"
                  className="mt-2"
                  value={formData.basic_auth_username || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, basic_auth_username: e.target.value })
                  }
                  placeholder="Optional"
                />
              </div>

              <div>
                <Label htmlFor="edit-basic_auth_password">Basic Auth Password</Label>
                <Input
                  id="edit-basic_auth_password"
                  type="password"
                  className="mt-2"
                  value={formData.basic_auth_password || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, basic_auth_password: e.target.value })
                  }
                  placeholder="Optional - leave blank to keep existing"
                />
              </div>

              <div>
                <Label htmlFor="edit-active" className="font-medium">
                  Status
                </Label>
                <select
                  id="edit-active"
                  className="mt-2 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950"
                  value={formData.active ? "true" : "false"}
                  onChange={(e) => setFormData({ ...formData, active: e.target.value === "true" })}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
                  <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
                </div>
              )}
            </DrawerBody>

            <DrawerFooter className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                <RiSaveLine className="size-4 mr-1" />
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </DrawerFooter>
          </form>
        ) : (
          <>
            <DrawerBody className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-gray-500">Loading service details...</p>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Service Name
                    </h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-50">{currentService.name}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Slug
                    </h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-50">{currentService.slug}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Endpoint URL
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-sm text-gray-900 dark:text-gray-50 break-all">
                        {currentService.endpoint_url}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(currentService.endpoint_url, "_blank")
                        }}
                        className="shrink-0 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Open in new tab"
                        aria-label="Open endpoint in new tab"
                      >
                        <RiExternalLinkLine className="size-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                    <div className="mt-1">
                      <Badge variant={currentService.active ? "success" : "neutral"}>
                        {currentService.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Cron Pattern
                      </h3>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-50">
                        {currentService.cron_pattern}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        <CronDescription expression={currentService.cron_pattern} />
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Timeout</h3>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-50">
                        {currentService.timeout_ms}ms
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Expected Status Code
                    </h3>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-50">
                      {currentService.expected_status_code}
                    </p>
                  </div>

                  {currentService.basic_auth_username && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Basic Authentication
                      </h3>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-50">
                        Username: {currentService.basic_auth_username}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</h3>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-50">
                        {formatDate(currentService.created_at)}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Last Updated
                      </h3>
                      <p className="mt-1 text-sm text-gray-900 dark:text-gray-50">
                        {formatDate(currentService.updated_at)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </DrawerBody>

            {error && (
              <div className="mx-6 mb-4 rounded-md bg-red-50 p-3 dark:bg-red-900/20">
                <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
              </div>
            )}

            <DrawerFooter className="flex flex-row gap-2">
              <Button
                variant="secondary"
                onClick={handleToggleStatus}
                disabled={isTogglingStatus || isLoading}
                className="flex-1"
              >
                <RiToggleLine className="size-4 mr-1" />
                {isTogglingStatus ? "Updating..." : currentService.active ? "Deactivate" : "Activate"}
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setIsEditing(true)} 
                className="flex-1"
                disabled={isLoading}
              >
                <RiEditLine className="size-4 mr-1" />
                Edit
              </Button>
              <DrawerClose asChild>
                <Button variant="secondary" className="flex-1">
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}
