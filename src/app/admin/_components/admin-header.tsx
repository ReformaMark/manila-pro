"use client"

import HomeAvatar from "@/components/home-avatar"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTrigger
} from "@/components/ui/sheet"
import { UserDropdown } from "@/components/user-dropdown"
import { useCurrentUser } from "@/hooks/use-current-user"
import { cn } from "@/lib/utils"
import { Loader2Icon, MenuIcon } from 'lucide-react'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { adminSidebarItems } from "./admin-sidebar"
// import HomeAvatar from "./home-avatar"
// import { adminSidebarItems } from './sidebar'
// import { UserDropdown } from "./user-dropdown"
// import { useProjectStore } from "@/store/project-store"
// import { SelectWithImages } from "./select-with-images"
// import { usePropertyStore } from "@/store/property-store"
// import { SelectProperTy } from "./select-property"


// interface NavItem {
//     title: string
//     href: string
//     isActive?: boolean
// }

// const navItems: NavItem[] = [
//     {
//         title: "HDC Properties",
//         href: "/admin/inventory",
//     },
//     {
//         title: "Other Properties",
//         href: "/admin/other-properties",
//     },
// ]

// const accountItems: NavItem[] = [
//     {
//         title: "Buyers",
//         href: "/admin/accounts",
//     },
//     {
//         title: "Sellers",
//         href: "/admin/sellers",
//     },
//     {
//         title: "Admins",
//         href: "/admin/account-admin",
//     },
// ]

// const buyerCategoryItems: NavItem[] = [
//     {
//         title: "Owned Properties",
//         href: "/buyer/owned-properties",
//     },
//     {
//         title: "Active Advertisements",
//         href: "/buyer/active-advertisements",
//     },
// ]


export function AdminHeader() {
    const { user } = useCurrentUser()
    const pathname = usePathname()
    // const setSelectedProjectId = useProjectStore(state => state.setSelectedProjectId)
    // const setSelectedPropertyId = usePropertyStore(state => state.setSelectedPropertyId)

    const fullname = user?.fname + " " + user?.lname

    // const updatedNavItems = navItems.map(item => ({
    //     ...item,
    //     isActive: pathname === item.href,
    // }))

    // const updatedAccountItems = accountItems.map(item => ({
    //     ...item,
    //     isActive: pathname === item.href,
    // }))

    // const updatedBuyerCategoryItems = buyerCategoryItems.map(item => ({
    //     ...item,
    //     isActive: pathname === item.href,
    // }))

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white">
            <div className="flex h-16 items-center max-md:justify-between px-4 md:px-6">
                <div className="flex items-center gap-4 ml-12">
                    <HomeAvatar />
                    {/* {pathname === "/admin/inventory" && (
                        <nav className="hidden md:flex items-center gap-12 ml-[120px]">
                            {updatedNavItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary relative py-4",
                                        item.isActive ? "text-dark" : "text-muted-foreground"
                                    )}
                                >
                                    {item.title}
                                    {item.isActive && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-dark" />
                                    )}
                                </Link>
                            ))}
                        </nav>
                    )} */}

                    {/* {(pathname === "/admin/accounts" || pathname === "/admin/sellers" || pathname === "/admin/account-admin") && (
                        <nav className="hidden md:flex items-center gap-12 ml-[120px]">
                            {updatedAccountItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary relative py-4",
                                        item.isActive ? "text-dark" : "text-muted-foreground"
                                    )}
                                >
                                    {item.title}
                                    {item.isActive && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-dark" />
                                    )}
                                </Link>
                            ))}
                        </nav>
                    )} */}

                    {/* for buyers dashboard*/}
                    {/* {(pathname === "/buyer" || pathname === "/buyer/dashboard" || pathname === '/buyer/owned-properties' || pathname === "/buyer/active-advertisements") && (
                        <nav className="hidden md:flex items-center gap-12 ml-[120px]">
                            {updatedBuyerCategoryItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary relative py-4",
                                        item.isActive ? "text-dark" : "text-muted-foreground"
                                    )}
                                >
                                    {item.title}
                                    {item.isActive && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-dark" />
                                    )}
                                </Link>
                            ))}
                        </nav>
                    )} */}

                </div>

                <div className="ml-auto items-center gap-4 mr-12 hidden lg:flex">
                    {/* {
                        (pathname === "/admin/inventory" ||
                            pathname === "/admin/other-properties" ||
                            pathname === "/admin/deals" ||
                            pathname === "/buyer/owned-properties" ||
                            pathname === "/buyer/active-advertisements" ||
                            pathname === "/buyer/soa"
                        ) && (
                            <SelectWithImages
                                onProjectSelect={setSelectedProjectId}
                            />
                    )} */}
                    {/* { ( pathname === "/buyer/soa" && (
                        <SelectProperTy
                            onPropertySelect={setSelectedPropertyId}
                        />
                    ))} */}

                    {/* <Button variant="ghost" size="icon">
                        <DownloadIcon className="h-5" />
                        <span className="sr-only">User account</span>
                    </Button>

                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-green-500" />
                        <span className="sr-only">Notifications</span>
                    </Button> */}

                    {user ? (
                        <UserDropdown
                            avatarUrl={user.image!}
                            name={fullname}
                            role={user.role!}
                            key={user.accountId!}
                        />
                    ) : <Loader2Icon className="w-6 h-6 animate-spin" />}
                </div>

                {/* Sheet */}
                <div className='ml-auto mr-7 lg:hidden'>
                    <Sheet>
                        <SheetTrigger>
                            <MenuIcon className='w-6 h-6' />
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <section
                                    className='bg-[#FFFFFF]'
                                >
                                    {adminSidebarItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href!}
                                            className={cn(
                                                "w-full flex gap-2 justify-start hover:bg-gray-100 hover:rounded-[27px] py-3 px-4 cursor-pointer items-center",
                                                item.href === pathname && "bg-gray-100 text-dark font-bold text-[16px] rounded-[27px]"
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
                                    ))}
                                </section>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                </div>

            </div>
        </header>
    )
}