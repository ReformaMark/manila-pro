"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Home,
  Building,
  Heart,
  Map,
  DollarSign,
  Key,
  FileText,
  Users,
  BarChart,
  ChevronRight,
  Compass,
  Star,
  Briefcase,
} from "lucide-react"

interface SidenavProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidenav({ isOpen, onClose }: SidenavProps) {
  const [activeItem, setActiveItem] = useState("properties")

  const navItems = [
    {
      section: "Discover",
      items: [
        { id: "properties", label: "All Properties", icon: Building, href: "/properties" },
        { id: "featured", label: "Featured", icon: Star, href: "/featured" },
        { id: "map", label: "Map View", icon: Map, href: "/map" },
        { id: "favorites", label: "Saved Properties", icon: Heart, href: "/favorites" },
      ],
    },
  
    {
      section: "Transactions",
      items: [
        { id: "buy", label: "Buy", icon: DollarSign, href: "/buy" },
        { id: "rent", label: "Rent", icon: Key, href: "/rent" },
        { id: "lease", label: "Lease", icon: FileText, href: "/lease" },
      ],
    },
    {
      section: "Resources",
      items: [
        { id: "agents", label: "Find Agents", icon: Users, href: "/agents" },
        { id: "market", label: "Market Trends", icon: BarChart, href: "/market" },
      ],
    },
  ]

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-brand-black text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 pt-16",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <ScrollArea className="flex-1 py-4">
            {navItems.map((section) => (
              <div key={section.section} className="mb-6">
                <h3 className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {section.section}
                </h3>
                <ul>
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 text-sm transition-colors",
                          activeItem === item.id
                            ? "bg-brand-orange text-white"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white",
                        )}
                        onClick={() => {
                          setActiveItem(item.id)
                          if (window.innerWidth < 768) {
                            onClose()
                          }
                        }}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                        {activeItem === item.id && <ChevronRight className="h-4 w-4 ml-auto" />}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </ScrollArea>
        </div>
      </aside>
    </>
  )
}

