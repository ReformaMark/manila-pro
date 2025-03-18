"use client"
import { Building2, ChevronDown, CreditCard, FileCheck, FilePenLine, LayoutGrid, MessageCircle, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
// import { useCheckRole } from '@/hooks/use-check-role';

interface SidebarItem {
    icon: React.ElementType;
    label: string;
    href?: string;
    subItems?: { label: string; href: string; }[];
}

export const adminSidebarItems: SidebarItem[] = [
    {
        icon: LayoutGrid,
        label: "Dashboard",
        href: "/admin",
    },
    {
        icon: Users,
        label: "Users",
        subItems: [
            {
                label: "Buyer",
                href: "/admin/accounts/buyer",
            },
            {
                label: "Seller",
                href: "/admin/accounts/seller",
            },
            {
                label: "Admin",
                href: "/admin/accounts/sub-admin",
            },
        ]
    },
    {
        icon: Building2,
        label: "Properties",
        href: "/admin/properties"
    },
    {
        icon: FileCheck,
        label: "Transactions",
        href: "/admin/transactions"
    },
]

export const AdminSidebar = () => {
    const pathname = usePathname();
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    const toggleExpand = (label: string) => {
        setExpandedItem(expandedItem === label ? null : label);
    };

    return (
        <>
            <section className='border-r bg-bg1 border-none w-[263px] pt-[85px] px-5 hidden lg:block'>
                {adminSidebarItems?.map((item) => (
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
                            <>
                                <div
                                    onClick={() => toggleExpand(item.label)}
                                    className={cn(
                                        "w-full flex gap-2 justify-start hover:bg-gray-100 hover:text-black text-white hover:rounded-[27px] rounded-[27px] py-3 px-4 cursor-pointer items-center",
                                        // expandedItem === item.label && "bg-gray-100"
                                    )}
                                >
                                    <div className='flex items-center gap-2 ml-7'>
                                        <item.icon className="h-5 w-5 text-[#A1A7AE]" />
                                        <span>{item.label}</span>
                                        <ChevronDown className={cn(
                                            "h-4 w-4 transition-transform",
                                            expandedItem === item.label && "transform rotate-180"
                                        )} />
                                    </div>
                                </div>
                                {expandedItem === item.label && item.subItems && (
                                    <div className="ml-12">
                                        {item.subItems.map((subItem) => (
                                            <Link
                                                key={subItem.href}
                                                href={subItem.href}
                                                className={cn(
                                                    "block py-2 px-4 hover:bg-gray-100 hover:text-black text-white hover:rounded-[27px]",
                                                    pathname === subItem.href && "bg-gray-100 text-dark font-bold text-[16px] rounded-[27px]"
                                                )}
                                            >
                                                {subItem.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </section>
        </>
    )
}
