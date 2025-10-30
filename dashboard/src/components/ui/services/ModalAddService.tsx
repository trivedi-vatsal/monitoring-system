"use client"

import { Button } from "@/components/Button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { clientServicesApi, type Client } from "@/lib/api"
import { RiAddLine } from "@remixicon/react"
import React from "react"
import { CronDescription } from "./CronDescription"

export type ModalAddServiceProps = {
  selectedClient: Client | null
  onSuccess: () => void
}

export function ModalAddService({ selectedClient, onSuccess }: ModalAddServiceProps) {
  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    slug: "",
    endpoint_url: "",
    cron_pattern: "*/5 * * * *",
    expected_status_code: 200,
    timeout_ms: 10000,
    basic_auth_username: "",
    basic_auth_password: "",
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Reset form when modal closes
  React.useEffect(() => {
    if (!open) {
      setFormData({
        name: "",
        slug: "",
        endpoint_url: "",
        cron_pattern: "*/5 * * * *",
        expected_status_code: 200,
        timeout_ms: 10000,
        basic_auth_username: "",
        basic_auth_password: "",
      })
      setError(null)
    }
  }, [open])

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

    if (!selectedClient) {
      setError("Please select a client first")
      setIsSubmitting(false)
      return
    }

    try {
      const payload: any = {
        client_id: selectedClient.id,
        name: formData.name,
        slug: formData.slug,
        endpoint_url: formData.endpoint_url,
        cron_pattern: formData.cron_pattern,
        expected_status_code: formData.expected_status_code,
        timeout_ms: formData.timeout_ms,
        active: true,
      }

      // Only include auth if provided
      if (formData.basic_auth_username && formData.basic_auth_password) {
        payload.basic_auth_username = formData.basic_auth_username
        payload.basic_auth_password = formData.basic_auth_password
      }

      await clientServicesApi.create(payload)

      // Reset form
      setFormData({
        name: "",
        slug: "",
        endpoint_url: "",
        cron_pattern: "*/5 * * * *",
        expected_status_code: 200,
        timeout_ms: 10000,
        basic_auth_username: "",
        basic_auth_password: "",
      })

      setOpen(false)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create service")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button id="add-service">
          <RiAddLine className="-ml-1 size-5" aria-hidden="true" />
          Add service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add new service</DialogTitle>
            <DialogDescription className="mt-1 text-sm leading-6">
              Configure a new service endpoint for health monitoring.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="name" className="font-medium">
                Service name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., API Gateway"
                className="mt-2"
                value={formData.name}
                onChange={handleNameChange}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="slug" className="font-medium">
                Slug <span className="text-red-500">*</span>
              </Label>
              <Input
                id="slug"
                placeholder="e.g., api-gateway"
                className="mt-2"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                pattern="[a-z0-9-]+"
                title="Only lowercase letters, numbers, and hyphens allowed"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Used in URLs (lowercase, numbers, and hyphens only)</p>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="endpoint_url" className="font-medium">
                Endpoint URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endpoint_url"
                type="url"
                placeholder="https://api.example.com/health"
                className="mt-2"
                value={formData.endpoint_url}
                onChange={(e) => setFormData({ ...formData, endpoint_url: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="cron_pattern" className="font-medium">
                Cron pattern <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cron_pattern"
                placeholder="*/5 * * * *"
                className="mt-2"
                value={formData.cron_pattern}
                onChange={(e) => setFormData({ ...formData, cron_pattern: e.target.value })}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                <CronDescription expression={formData.cron_pattern} />
              </p>
            </div>

            <div>
              <Label htmlFor="timeout_ms" className="font-medium">
                Timeout (ms) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="timeout_ms"
                type="number"
                min="1000"
                max="60000"
                className="mt-2"
                value={formData.timeout_ms}
                onChange={(e) =>
                  setFormData({ ...formData, timeout_ms: parseInt(e.target.value) || 10000 })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="expected_status_code" className="font-medium">
                Expected status code
              </Label>
              <Input
                id="expected_status_code"
                type="number"
                min="100"
                max="599"
                className="mt-2"
                value={formData.expected_status_code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expected_status_code: parseInt(e.target.value) || 200,
                  })
                }
              />
            </div>

            <div className="sm:col-span-2">
              <Label className="font-medium">Basic Authentication (Optional)</Label>
            </div>

            <div>
              <Label htmlFor="basic_auth_username">Username</Label>
              <Input
                id="basic_auth_username"
                className="mt-2"
                value={formData.basic_auth_username}
                autoComplete="off"
                onChange={(e) =>
                  setFormData({ ...formData, basic_auth_username: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="basic_auth_password">Password</Label>
              <Input
                id="basic_auth_password"
                type="password"
                className="mt-2"
                value={formData.basic_auth_password}
                autoComplete="off"
                onChange={(e) =>
                  setFormData({ ...formData, basic_auth_password: e.target.value })
                }
              />
            </div>

            {error && (
              <div className="sm:col-span-2 rounded-md bg-red-50 p-3 dark:bg-red-900/20">
                <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
              </div>
            )}

            {!selectedClient && (
              <div className="sm:col-span-2 rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/20">
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  Please select a client from the dropdown before adding a service.
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button className="mt-2 w-full sm:mt-0 sm:w-fit" variant="secondary" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="w-full sm:w-fit"
              type="submit"
              disabled={isSubmitting || !selectedClient || !formData.name || !formData.endpoint_url}
            >
              {isSubmitting ? "Creating..." : "Create service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
