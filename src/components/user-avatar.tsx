"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { BiLogOut } from "react-icons/bi";
import { FaSpinner } from "react-icons/fa";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

export default function UserAvatar() {
  const { user, isLoading } = useCurrentUser();
  const { signOut } = useAuthActions();
  isLoading && (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <FaSpinner className="text-4xl animate-spin text-orange-500 mb-2" />
        <span className="text-lg font-medium text-gray-700">
          Loading please wait...
        </span>
      </div>
    </div>
  );
  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback className="bg-gray-800 text-white">
              MP
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-brand-black border-gray-800"
      >
        {/* <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-800" />
          <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-gray-800">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-gray-800">
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Messages</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-gray-300 focus:text-white focus:bg-gray-800">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-800" /> */}
        <DropdownMenuItem
          onClick={async () => await signOut()}
          className="text-gray-300 focus:text-white focus:bg-gray-800"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Link href={"/auth"}>
      <Button variant={"orange"} className="">
        Sign In
      </Button>
    </Link>
  );
}
