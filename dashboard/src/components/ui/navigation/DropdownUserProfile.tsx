"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubMenu,
  DropdownMenuSubMenuContent,
  DropdownMenuSubMenuTrigger,
  DropdownMenuTrigger,
} from "@/components/Dropdown"
import {
  RiComputerLine,
  RiMoonLine,
  RiSunLine,
} from "@remixicon/react"
import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/AuthContext"
import * as React from "react"

export type DropdownUserProfileProps = {
  children: React.ReactNode
  align?: "center" | "start" | "end"
}

export function DropdownUserProfile({
  children,
  align = "start",
}: DropdownUserProfileProps) {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const { logout } = useAuth()
  
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = () => {
    logout()
  }

  if (!mounted) {
    return null
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align={align}>
          <DropdownMenuLabel>john.doe@monitoring.local</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuSubMenu>
              <DropdownMenuSubMenuTrigger>Theme</DropdownMenuSubMenuTrigger>
              <DropdownMenuSubMenuContent>
                <DropdownMenuRadioGroup
                  value={theme}
                  onValueChange={(value) => {
                    setTheme(value)
                  }}
                >
                  <DropdownMenuRadioItem
                    aria-label="Switch to Light Mode"
                    value="light"
                    iconType="check"
                  >
                    <RiSunLine className="size-4 shrink-0" aria-hidden="true" />
                    Light
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    aria-label="Switch to Dark Mode"
                    value="dark"
                    iconType="check"
                  >
                    <RiMoonLine
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                    Dark
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    aria-label="Switch to System Mode"
                    value="system"
                    iconType="check"
                  >
                    <RiComputerLine
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                    System
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubMenuContent>
            </DropdownMenuSubMenu>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
