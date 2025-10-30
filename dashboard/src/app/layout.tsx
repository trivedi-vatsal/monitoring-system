import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Inter } from "next/font/google"
import "./globals.css"
import { siteConfig } from "./siteConfig"

import { ClientProvider } from "@/contexts/ClientContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { AuthModal } from "@/components/ui/auth/AuthModal"
import { AuthenticatedLayout } from "@/components/ui/auth/AuthenticatedLayout"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: ["service monitoring", "health check", "uptime monitoring", "api monitoring", "status page"],
  authors: [
    {
      name: "Service Monitoring Team",
      url: "",
    },
  ],
  creator: "Service Monitoring Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} overflow-y-scroll scroll-auto antialiased selection:bg-indigo-100 selection:text-indigo-700 dark:bg-gray-950`}
        suppressHydrationWarning
      >
        <div className="mx-auto max-w-screen-2xl">
          <ThemeProvider defaultTheme="system" attribute="class">
            <AuthProvider>
              <AuthModal />
              <ClientProvider>
                <AuthenticatedLayout>{children}</AuthenticatedLayout>
              </ClientProvider>
            </AuthProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}
