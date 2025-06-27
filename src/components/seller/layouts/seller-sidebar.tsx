"use client";

import { cn } from "@/lib/utils";
import {
  BookOpen,
  Building2,
  ChevronDown,
  LayoutGrid,
  MapIcon,
  MessageSquareIcon,
  SettingsIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  subItems?: { label: string; href: string }[];
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
  {
    icon: MapIcon,
    label: "Map Locations",
    href: "/seller/map-locations",
  },
  {
    icon: BookOpen,
    label: "Transactions",
    subItems: [
      {
        label: "Requests",
        href: "/seller/transactions/requests",
      },
      {
        label: "Active",
        href: "/seller/transactions/active",
      },
      {
        label: "History",
        href: "/seller/transactions/history",
      },
    ],
  },
  {
    icon: MessageSquareIcon,
    label: "Messages",
    href: "/seller/messages",
  },
  {
    icon: SettingsIcon,
    label: "Settings",
    href: "/seller/user-profile",
  },
];

export const SellerSidebar = () => {
  const pathname = usePathname();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleExpand = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  return (
    <>
      <section className="border-r bg-bg1 border-none w-[263px] pt-[85px] px-5 hidden lg:block">
        {sellerSidebarItems.map((item) => (
          <div key={item.label}>
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  "w-full flex gap-2 justify-start hover:bg-gray-100 hover:text-black text-white hover:rounded-[27px] py-3 px-4 cursor-pointer items-center",
                  item.href === pathname &&
                    "bg-gray-100 text-dark font-bold text-[16px] rounded-[27px]"
                )}
              >
                <div className="flex items-center gap-2 ml-7">
                  <item.icon
                    className={cn(
                      "h-5 w-5 text-[#A1A7AE]",
                      item.href === pathname && "text-dark"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
              </Link>
            ) : (
              <>
                <div
                  onClick={() => toggleExpand(item.label)}
                  className={cn(
                    "w-full flex gap-2 justify-start hover:bg-gray-100 hover:text-black text-white hover:rounded-[27px] rounded-[27px] py-3 px-4 cursor-pointer items-center"
                    // expandedItem === item.label && "bg-gray-100"
                  )}
                >
                  <div className="flex items-center gap-2 ml-7">
                    <item.icon className="h-5 w-5 text-[#A1A7AE]" />
                    <span>{item.label}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        expandedItem === item.label && "transform rotate-180"
                      )}
                    />
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
                          pathname === subItem.href &&
                            "bg-gray-100 text-dark font-bold text-[16px] rounded-[27px]"
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
  );
};
