'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {  MapPin } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { cn } from '@/lib/utils'
function Hero() {

    const [selected, setSelected] = useState<string>('')
  return (
    <div className="hero flex flex-col justify-center items-center">
      
        <div className="flex flex-col justify-center px-5 xl:px-36 w-full xl:w-[65%] size-full space-y-3 z-50">
            <motion.div 
                className="z-50 flex h-14 gap-x-2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    duration: 0.5,
                    delay: 1
                }}
            >
                
               
                <div className="flex h-14 bg-red-200 border-gray-500 border-2">
                    <Button className={cn('rounded-none bg-white text-black  transition-colors duration-700 ease-in h-full w-32', selected === "buy" && "border-b-4 border-b-blue-500")} onClick={()=> setSelected("buy")}>Buy</Button>
                    <Button className={cn('rounded-none bg-white text-black transition-colors duration-700 ease-in h-full w-32', selected === "rent" && "border-b-4 border-b-blue-500")} onClick={()=> setSelected("rent")}>Rent</Button>
                </div>
                <Select>
                    <SelectTrigger className="w-1/4 h-14 border-gray-500 border-2 bg-white/95">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="condominium">Condominium</SelectItem>
                    </SelectContent>
                </Select>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.5,
                    delay: 1.5
                }}
                className="flex gap-x-3 shadow-lg  z-50"> 
               
                <div className="relative w-full">
                   
                    <Input 
                        name=''
                        className='bg-white/95 h-14 border-2 text-xs lg: border-gray-500 shadow-md'
                        placeholder='Find locations or development names.'
                    />
                    <MapPin className='absolute top-3 right-1 size-6 lg:size-8 text-gray-500'/>
                </div>
                <Button variant={'default'} className='h-14 w-1/4 text-lg font-semibold tracking-widest'>Search</Button>
            </motion.div>
            <h1 className="text-white text-3xl xl:text-5xl font-[1000] text-pretty font-sans "> BROWSE. BUY. RENT.</h1>
        </div>
       
    </div>
  )
}

export default Hero