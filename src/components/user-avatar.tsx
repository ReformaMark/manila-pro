'use client'
import React from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"

import { BiLogOut } from 'react-icons/bi';
import { FaSpinner } from 'react-icons/fa'
import { Button } from './ui/button'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useAuthActions } from '@convex-dev/auth/react';


export default function UserAvatar() {
    const { user, isLoading } = useCurrentUser()
    const { signOut } = useAuthActions()
    isLoading && (<div className="flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center">
                        <FaSpinner className="text-4xl animate-spin text-orange-500 mb-2" />
                        <span className="text-lg font-medium text-gray-700">Loading please wait...</span>
                    </div>
                </div>)
    return (
        user ? (  <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div className="flex items-center gap-x-3">
                                        <Avatar>
                                            <AvatarImage src={user?.image || ""} />
                                            <AvatarFallback
                                                className='bg-orange-500 text-white'
                                            >{user?.fname?.charAt(0)}{user?.lname?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="text-center">
                                            <h3 className='text-sm'>{user?.lname}, {user?.fname}</h3>
                                        </div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem
                                        onClick={() => signOut()}
                                        className="cursor-pointer"
                                    >
                                        <BiLogOut className="mr-2 h-4 w-4" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>) : (
                        <Link href={'/auth'}>
                            <Button variant={'orange'} className="">
                                Sign In
                            </Button>
                        </Link>
                        )
    )
}