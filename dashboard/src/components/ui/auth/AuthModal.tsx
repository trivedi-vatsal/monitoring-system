"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "next-themes"
import { RiLockLine, RiEyeLine, RiEyeOffLine, RiSunLine, RiMoonLine } from "@remixicon/react"

export function AuthModal() {
  const { isAuthenticated, authenticate } = useAuth()
  const { theme, setTheme, systemTheme } = useTheme()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset form when modal is shown (after logout)
  useEffect(() => {
    if (!isAuthenticated) {
      setPassword("")
      setError("")
      setShowPassword(false)
    }
  }, [isAuthenticated])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!password.trim()) {
      setError("Please enter a password")
      return
    }

    const success = authenticate(password)
    if (!success) {
      setError("Invalid password. Please try again.")
      setPassword("")
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const currentTheme = theme === "system" ? systemTheme : theme

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-50/95 backdrop-blur-sm dark:bg-gray-900/95">
      {/* Theme Toggle Button - Fixed Top Right */}
      {mounted && (
        <button
          type="button"
          onClick={toggleTheme}
          className="fixed right-6 top-6 z-[10000] rounded-md border border-gray-300 bg-white p-2 text-gray-700 shadow-lg transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="Toggle theme"
        >
          {currentTheme === "dark" ? (
            <RiSunLine className="size-5" aria-hidden="true" />
          ) : (
            <RiMoonLine className="size-5" aria-hidden="true" />
          )}
        </button>
      )}

      <div className="w-full max-w-md px-4">
        <div className="rounded-lg border border-gray-300 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-950">
          {/* Lock Icon */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-indigo-500/10 p-4">
              <RiLockLine className="size-8 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            </div>
          </div>

          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
              Monitoring System
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              This application is password protected. Please enter the password to continue.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoFocus
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <RiEyeOffLine className="size-5" aria-hidden="true" />
                  ) : (
                    <RiEyeLine className="size-5" aria-hidden="true" />
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-950"
            >
              Unlock Application
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Contact your administrator if you need access
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
