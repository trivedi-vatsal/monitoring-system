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
import { DropdownMenuItem } from "@/components/Dropdown"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { clientsApi } from "@/lib/api"
import React from "react"

export type ModalProps = {
  itemName: string
  onSelect: () => void
  onOpenChange: (open: boolean) => void
}

export function ModalAddClient({
  itemName,
  onSelect,
  onOpenChange,
}: ModalProps) {
  const [clientName, setClientName] = React.useState("")
  const [slug, setSlug] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Auto-generate slug from client name
  React.useEffect(() => {
    if (clientName) {
      const generatedSlug = clientName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setSlug(generatedSlug)
    }
  }, [clientName])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await clientsApi.create({
        name: clientName,
        slug: slug,
        active: true,
      })
      
      // Reset form
      setClientName("")
      setSlug("")
      
      // Close dialog and refresh list
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create client')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger className="w-full text-left">
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault()
              onSelect && onSelect()
            }}
          >
            {itemName}
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add new client</DialogTitle>
              <DialogDescription className="mt-1 text-sm leading-6">
                Create a new client organization to monitor their services.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="client-name" className="font-medium">
                  Client name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="client-name"
                  name="client-name"
                  placeholder="e.g., Acme Corporation"
                  className="mt-2"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  The display name for this client organization
                </p>
              </div>
              <div>
                <Label htmlFor="slug" className="font-medium">
                  Slug <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="acme-corporation"
                  className="mt-2"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  pattern="[a-z0-9-]+"
                />
                <p className="mt-1 text-xs text-gray-500">
                  URL-friendly identifier (lowercase, numbers, hyphens only)
                </p>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
                  <p className="text-sm text-red-800 dark:text-red-400">
                    {error}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button
                  className="mt-2 w-full sm:mt-0 sm:w-fit"
                  variant="secondary"
                  type="button"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                className="w-full sm:w-fit"
                type="submit"
                disabled={isSubmitting || !clientName || !slug}
              >
                {isSubmitting ? 'Creating...' : 'Create client'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
