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
        <main className="flex-1">{children}</main>
    </div>
  )
}

export default Main