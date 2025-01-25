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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import Link from "next/link"

export function NavMain({
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
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Handle Dashboard and Reports as standalone items
          if (item.label === "Dashboard" || item.label === "Employee List" || item.label === "Vouchers" || item.label === "Payroll Sheet" || item.label === "Support" || item.label === "Farms" || item.label === "Map") {
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
                        pathname === item.href ? "text-[#8BC34A]" : "text-gray-500"
                      )} />
                    )}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }

          // Handle other items with dropdowns
          return (
            <Collapsible
              key={item.label}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.label}
                    className={cn(
                      "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-gray-100 rounded-lg transition",
                      pathname === item.href ? "text-[#8BC34A] bg-gray-100" : "text-gray-600"
                    )}
                  >
                    {item.icon && (
                      <item.icon className={cn("h-5 w-5 mr-3",
                        pathname === item.href ? "text-[#8BC34A]" : "text-gray-500"
                      )} />
                    )}
                    <span>{item.label}</span>
                    <ChevronRight className={cn(
                      "ml-auto transition-transform duration-200 h-5 w-5",
                      "group-data-[state=open]/collapsible:rotate-90",
                      pathname === item.href ? "text-[#8BC34A]" : "text-gray-500"
                    )} />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.label}>
                        <SidebarMenuSubButton
                          asChild
                          className={cn(
                            "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-gray-100 rounded-lg transition",
                            pathname === subItem.href ? "text-[#8BC34A] bg-gray-100" : "text-gray-600"
                          )}
                        >
                          <Link href={subItem.href}>
                            <span>{subItem.label}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
