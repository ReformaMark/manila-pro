'use client'
import { Header } from '@/components/header'
import React from 'react'
interface MainProps {
  children: React.ReactNode
}
function Main({children}:MainProps) {
  return (
    <div>
        <Header/>
        <main className="flex-1 min-h-screen pt-[70px]">{children}</main>
    </div>
  )
}

export default Main