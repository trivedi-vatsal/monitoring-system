"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { clientsApi, type Client } from '@/lib/api'

interface ClientContextType {
  selectedClient: Client | null
  setSelectedClient: (client: Client | null) => void
  clients: Client[]
  loading: boolean
  error: string | null
  refreshClients: () => Promise<void>
}

const ClientContext = createContext<ClientContextType | undefined>(undefined)

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await clientsApi.getAll()
      const data = Array.isArray(response) ? response : response.data
      setClients(data)
      
      // Auto-select first client if none selected
      if (!selectedClient && data.length > 0) {
        setSelectedClient(data[0])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const refreshClients = async () => {
    await fetchClients()
  }

  return (
    <ClientContext.Provider
      value={{
        selectedClient,
        setSelectedClient,
        clients,
        loading,
        error,
        refreshClients,
      }}
    >
      {children}
    </ClientContext.Provider>
  )
}

export function useClient() {
  const context = useContext(ClientContext)
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientProvider')
  }
  return context
}
