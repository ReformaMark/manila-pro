"use client"
import { Building, Building2, Calculator, FileCheck, Files, FolderOpen, Handshake, Home, Key, LayoutGrid, Menu, MessageCircle, Package, PiggyBank, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCurrentUser } from '@/hooks/use-current-user';
import { NavMain } from './nav-main';
import UserAvatar from './user-avatar';
import { NavLocation } from './nav-locations';
import { Button } from './ui/button';
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
    const buyerNav = [
        {
            icon: Home,
            label: "Properties",
            href: "/properties",
        },
        {
            icon: Handshake,
            label: "Buy a Property",
            href: "/properties/buy"
        },
        {
            icon: Key,
            label: "Rent a Property",
            href: "/properties/rent"
        },
        {
            icon: Building,
            label: "Lease a Property",
            href: "/properties/lease"
        },



    ]

    const navLocations = [
        {
            icon: Building2,
            label: "Makati City",
            href: "/properties/all/Makati"
        },
        {
            icon: Building2,
            label: "Pasay City",
            href: "/properties/all/Pasay"
        },
        {
            icon: Building2,
            label: "Taguig City",
            href: "/properties/all/Taguig"
        },
    ]

    const sellerNav = [
        {
            icon: LayoutGrid,
            label: "Dashboard",
            href: "/seller",
        },
        {
            icon: Building2,
            label: "Property",
            href: "/seller/properties"
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

    const { user } = useCurrentUser();

    if (!user) return null;

    const navItems = navigationMap[value];
    const baseUrl = value === 'admin' ? '/admin' : value === 'buyer' ? '/buyer' : '/seller';

    const SidebarContents = () => (
        <div className="bg-black h-screen">
        

            <SidebarContent className="flex-1 overflow-y-auto ">
                <NavMain items={navItems} />
                {value === "buyer" && (
                    <>
                        <NavLocation items={navLocations} />

                    </>
                )}

            </SidebarContent>
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
            <div className={cn("md:hidden fixed top-3 left-4 z-[9999]")}>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-gray-800 md:hidden"
             
                        >
                        <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="p-0 w-[300px] z-[9999]">
                        <SidebarContents />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    )
}
