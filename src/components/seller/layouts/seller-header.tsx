"use client"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTrigger
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import HomeAvatar from "@/components/home-avatar"
import UserAvatar from "@/components/user-avatar"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Loader2Icon, MenuIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { sellerSidebarItems } from "./seller-sidebar"
import Link from "next/link"

export function SellerHeader() {
    const pathname = usePathname()
    const { user } = useCurrentUser()

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-none bg-bg1 text-white">
            <div className="flex h-16 items-center max-md:justify-between px-4 md:px-6">
                <div className="flex items-center gap-4 ml12-">
                    <HomeAvatar />
                </div>

                <div className="ml-auto items-center gap-4 mr-12 hidden lg:flex">
                    {user ? (
                        <UserAvatar />
                    ) : <Loader2Icon className="w-6 h-6 animate-spin" />}
                </div>

                <div className="ml-auto mr-7 lg:hidden">
                    <Sheet>
                        <SheetTrigger>
                            <MenuIcon className='w-6 h-6' />
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader className="h-full">
                                <section className='bg-[#FFFFFF] h-full flex flex-col justify-between'>
                                    <div>
                                        <div className="mb-9 w-fit">
                                            <HomeAvatar />
                                        </div>

                                        {sellerSidebarItems.map((item) => (
                                            <div key={item.label}>
                                                {item.href ? (
                                                    <Link
                                                        href={item.href}
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
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-auto flex justify-start">
                                        {user ? (
                                            <UserAvatar />
                                        ) : <Loader2Icon className="w-6 h-6 animate-spin" />}
                                    </div>
                                </section>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}