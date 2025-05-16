"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Menu, User, LogOut, Settings, MessageSquare } from "lucide-react"
import { useAuthActions } from "@convex-dev/auth/react"
import { useCurrentUser } from "@/hooks/use-current-user"
import Loading from "./loading"
import { useIsMobile } from "@/hooks/use-mobile"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

interface HeaderProps {
  setIsOpen?: (isOpen: boolean) => void,
  isOpen?: boolean 
}

export function Header() {
  const { user, isLoading } = useCurrentUser()
  const { signOut } = useAuthActions()
  const isMobile = useIsMobile()
  const userImageUrl = useQuery(api.users.getImageUrl)

  return (
    <header className="bg-brand-black text-white sticky top-0 py-2 z-40  border-b border-gray-800" style={{ height: 'var(--header-height)' }}>
      <div className=" px-10  h-full ">
        <div className="flex items-center justify-between h-full transition-all duration-500 ease-in-out">
          {isMobile && (
            <div className="opacity-0">iiiii</div>
          )}
          <div className="flex items-center gap-4 ">
            <Link href="/" className="flex items-center gap-2 text-center">
              <h1 className="font-bold text-xl text-white">Manila<span className="text-xl font-extrabold text-brand-orange">Pro</span></h1>
            </Link>
          </div>
            {!isLoading ? user ? (
              <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand-orange"></span>
              </Button>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userImageUrl ?? undefined} alt="User" />
                        <AvatarFallback className="bg-gray-800 text-white">
                        {user?.fname?.[0]?.toUpperCase()}{user?.lname?.[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-brand-black border-gray-800">
                
                  <DropdownMenuSeparator className="bg-gray-800" />
                
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem onClick={async()=> await signOut()} className="text-gray-300 focus:text-white focus:bg-gray-800">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
            ): (
              <Link href={'/auth'} className="">
                <Button variant={'orange'} size={'sm'} className="h-10">
                    Sign In
                </Button>
              </Link>
            ) : 
            <div className="h-10">
              <Loading/>
            </div>
            }
          
        
        </div>
      </div>
    </header>
  )
}

