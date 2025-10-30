"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Sidebar } from "@/components/ui/navigation/Sidebar"

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Sidebar />
      <main className="lg:pl-72">{children}</main>
    </>
  )
}
