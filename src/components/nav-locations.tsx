"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function NavLocation({
  items,
}: {
  items: {
    label: string
    href: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      label: string
      href: string
    }[]
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Locations</SidebarGroupLabel>
      <SidebarMenu>
        { items.map((item) => {
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.label}
                  className={cn(
                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-gray-100 rounded-lg transition",
                    pathname === item.href ? "text-primary bg-gray-100" : "text-gray-600"
                  )}
                >
                  <Link href={item.href}>
                    {item.icon && (
                      <item.icon className={cn("h-5 w-5 mr-3",
                        pathname === item.href ? "text-orange-500" : "text-gray-500"
                      )} />
                    )}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
