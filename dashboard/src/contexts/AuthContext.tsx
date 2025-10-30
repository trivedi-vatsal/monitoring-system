"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  authenticate: (password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = "monitoring_system_auth"
const AUTH_PASSWORD = process.env.NEXT_PUBLIC_APP_PASSWORD || ""

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Check if password protection is enabled
    if (!AUTH_PASSWORD) {
      setIsAuthenticated(true)
      setIsLoading(false)
      return
    }

    // Check if user is already authenticated
    const authToken = sessionStorage.getItem(AUTH_STORAGE_KEY)
    if (authToken === AUTH_PASSWORD) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const authenticate = (password: string): boolean => {
    if (password === AUTH_PASSWORD) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, password)
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="size-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600 dark:border-gray-800 dark:border-t-indigo-400" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
