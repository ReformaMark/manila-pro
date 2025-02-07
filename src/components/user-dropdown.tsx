"use client"

import { ChevronDown, LogOutIcon, SettingsIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useAuthActions } from "@convex-dev/auth/react";

interface UserDropdownProps {
    name: string;
    role: string;
    avatarUrl: string;
}

export const UserDropdown = ({
    name,
    avatarUrl,
    role,
}: UserDropdownProps) => {
    const { signOut } = useAuthActions()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus-visible:outline-none">
                <div className="flex items-center gap-2 bg-accent rounded-md px-2 text-accent-foreground cursor-pointer">
                    <Avatar className="h-6 w-6 p-[15px] bg-dark rounded-full">
                        <AvatarImage src={avatarUrl} alt={name} />
                        <AvatarFallback className="text-white font-normal">{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-sm mr-5">
                        <div className="font-medium">{name}</div>
                        <div className="text-xs text-muted-foreground">{role}</div>
                    </div>
                    <ChevronDown className="text-sm text-muted-foreground w-5 h-5" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem className="cursor-pointer">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={() => signOut()}
                >
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}