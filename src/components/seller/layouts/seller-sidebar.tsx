"use client"

import { cn } from "@/lib/utils";
import { Building2, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarItem {
    icon: React.ElementType;
    label: string;
    href?: string;
    subItems?: { label: string; href: string; }[];
}

export const sellerSidebarItems: SidebarItem[] = [
    {
        icon: LayoutGrid,
        label: "Dashboard",
        href: "/seller",
    },
    {
        icon: Building2,
        label: "My Properties",
        href: "/seller/properties",
    },
]

export const SellerSidebar = () => {
    const pathname = usePathname();

    return (
        <>
            <section className='border-r bg-bg1 border-none w-[263px] pt-[85px] px-5 hidden lg:block'>
                {sellerSidebarItems.map((item) => (
                    <div key={item.label}>
                        {item.href ? (
                            <Link
                                href={item.href}
                                className={cn(
                                    "w-full flex gap-2 justify-start hover:bg-gray-100 hover:text-black text-white hover:rounded-[27px] py-3 px-4 cursor-pointer items-center",
                                    item.href === pathname && "bg-gray-100 text-dark font-bold text-[16px] rounded-[27px]",
                                )}
                            >
                                <div className='flex items-center gap-2 ml-7'>
                                    <item.icon className={cn(
                                        "h-5 w-5 text-[#A1A7AE]",
                                        item.href === pathname && "text-dark"
                                    )} />
                                    <span>{item.label}</span>
                                </div>
                            </Link>
                        ) : (
                            <></>
                        )}
                    </div>
                ))}
            </section>
        </>
    )
}