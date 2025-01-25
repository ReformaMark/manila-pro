"use client"
import { Building2, Calculator, FileCheck, Files, FolderOpen, LayoutGrid, Menu, MessageCircle, Package, PiggyBank, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
  } from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCurrentUser } from '@/hooks/use-current-user';
import { NavUser } from './nav-user';
import { NavMain } from './nav-main';
interface SidebarItem {
    icon: React.ElementType;
    label: string;
    href: string;
}

export const sidebarItems: SidebarItem[] = [
 
]

export function AppSidebar({
    header = "Buyer Portal",
    value = "buyer",
    ...props
  }: React.ComponentProps<typeof Sidebar> & {
    header?: string,
    value?: "admin" | "buyer" | "seller"
  }) {
    const pathname = usePathname()

    const adminNav = [
        {
            icon: LayoutGrid,
            label: "Dashboard",
            href: "/admin",
        },
        {
            icon: FolderOpen,
            label: "Our Projects",
            href: "/admin/projects"
        },
        {
            icon: Package,
            label: "Inventory",
            href: "/admin/inventory"
        },
        {
            icon: Building2,
            label: "Realties",
            href: "/admin/realties"
        },
        {
            icon: Calculator,
            label: "Accounting",
            href: "/admin/accounting"
        },
        {
            icon: Users,
            label: "Users",
            href: "/admin/accounts",
        },
        {
            icon: FileCheck,
            label: "Deal Finalization",
            href: "/admin/deals"
        },
        {
            icon: PiggyBank,
            label: "Commission",
            href: "/admin/commission"
        },
        {
            icon: Files,
            label: "Documents",
            href: "/admin/documents"
        },
        {
            icon: MessageCircle,
            label: "Chat Support",
            href: "/admin/support"
        }
    ]
    const buyerNav =  [
        {
            icon: LayoutGrid,
            label: "Dashboard",
            href: "/admin",
        },
        {
            icon: FolderOpen,
            label: "Our Projects",
            href: "/admin/projects"
        },
        {
            icon: Package,
            label: "Inventory",
            href: "/admin/inventory"
        },
        {
            icon: Building2,
            label: "Realties",
            href: "/admin/realties"
        },
        {
            icon: Calculator,
            label: "Accounting",
            href: "/admin/accounting"
        },
        {
            icon: Users,
            label: "Users",
            href: "/admin/accounts",
        },
        {
            icon: FileCheck,
            label: "Deal Finalization",
            href: "/admin/deals"
        },
        {
            icon: PiggyBank,
            label: "Commission",
            href: "/admin/commission"
        },
        {
            icon: Files,
            label: "Documents",
            href: "/admin/documents"
        },
        {
            icon: MessageCircle,
            label: "Chat Support",
            href: "/admin/support"
        }
    ]

    const sellerNav = [
        {
            icon: LayoutGrid,
            label: "Dashboard",
            href: "/admin",
        },
        {
            icon: FolderOpen,
            label: "Our Projects",
            href: "/admin/projects"
        },
        {
            icon: Package,
            label: "Inventory",
            href: "/admin/inventory"
        },
        {
            icon: Building2,
            label: "Realties",
            href: "/admin/realties"
        },
        {
            icon: Calculator,
            label: "Accounting",
            href: "/admin/accounting"
        },
        {
            icon: Users,
            label: "Users",
            href: "/admin/accounts",
        },
        {
            icon: FileCheck,
            label: "Deal Finalization",
            href: "/admin/deals"
        },
        {
            icon: PiggyBank,
            label: "Commission",
            href: "/admin/commission"
        },
        {
            icon: Files,
            label: "Documents",
            href: "/admin/documents"
        },
        {
            icon: MessageCircle,
            label: "Chat Support",
            href: "/admin/support"
        }
    ]
    const navigationMap = {
        admin: adminNav,
        buyer: buyerNav,
        seller: sellerNav,
    };

    const { user: user } = useCurrentUser();

    if (!user) return null;

    const navItems = navigationMap[value];
    const baseUrl = value === 'admin' ? '/admin' : value === 'buyer' ? '/buyer' : '/seller';
    
    const SidebarContents = () => (
        <div className="bg-white h-screen">
          <SidebarHeader>
            <Link href={baseUrl} className="flex flex-col items-center">
              <div className="bg-primary w-full py-4 rounded-md flex flex-col items-center">
                <h1 className="text-sm font-semibold text-center text-white mt-2 px-2">
                  {header}
                </h1>
              </div>
            </Link>
          </SidebarHeader>
    
          <SidebarContent className="flex-1 overflow-y-auto">
            <NavMain items={navItems} />
          </SidebarContent>
    
          <SidebarFooter>
            <NavUser />
          </SidebarFooter>
        </div>
    );

    return (
        <>
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar collapsible="none" {...props} className="bg-white h-screen sticky top-0 left-0">
            <SidebarContents />
            <SidebarRail />
          </Sidebar>
        </div>
  
        {/* Mobile Sheet */}
        <div className="md:hidden fixed top-4 left-4 z-[9999]">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 bg-white rounded-md shadow-md">
                <Menu className="size-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[300px] z-[9999]">
              <SidebarContents />
            </SheetContent>
          </Sheet>
        </div>
      </>
    )
}
