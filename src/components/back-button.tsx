'use client'
import { ArrowLeftCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

interface BackRouterProps{
    size?: number
}

function BackBtn({size}: BackRouterProps) {
    const router = useRouter()
  return (

    <ArrowLeftCircle size={size? size : 30} onClick={() => router.back()}className='hover:scale-105 hover:text-orange-500 transition-all duration-500 ease-out hover:cursor-pointer'/>
   
  )
}

export default BackBtn