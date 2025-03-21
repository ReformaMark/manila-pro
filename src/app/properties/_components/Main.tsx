'use client'
import React from 'react'
import { Sidenav } from './SideNav'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
interface MainProps {
  children: React.ReactNode
}
function Main({ children }: MainProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    
  return (
    <div className="flex  h-dvh overflow-hidden max-h-screen flex-col antialiased w-full">
         <Header isOpen={isOpen} setIsOpen={setIsOpen}/>
      
        <div className="m w-full ">
        <Sidenav isOpen={isOpen} onClose={() => setIsOpen(false)}/>
        <main className="flex-1 overflow-auto pl-0 md:pl-64">{children}</main>
        </div>
     
                
   
   
    </div>
  )
}

export default Main