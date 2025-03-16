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
    <div className="hero relative ">
            <div className="absolute inset-0 size-full bg-black/30 flex flex-col justify-center items-center  px-5 sm:px-5 md:px-20 lg:px-40 xl:px-72 2xl:px-80 transition-all duration-300 ease-linear">
              
            <motion.div 
                className="z-50 flex h-14 gap-x-2 w-full"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    duration: 0.5,
                    delay: 1
                }}
            >
                <div className="flex h-10 gap-x-2 ">
                    <div className="flex h-full">

                        <Button size={'default'} className={cn('hover:bg-gray-300 rounded-none bg-white text-black transition-colors duration-400 ease-in h-full', selected === "buy" && "border-b-4 border-b-blue-500")} onClick={()=> setSelected("buy")}>Buy</Button>
                        <Button size={'default'} className={cn('hover:bg-gray-300 rounded-none bg-white text-black transition-colors duration-400 ease-in h-full ', selected === "rent" && "border-b-4 border-b-blue-500")} onClick={()=> setSelected("rent")}>Rent</Button>
                    </div>
               
                <Select>
                    <SelectTrigger className="h-full bg-white">
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
                </div>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{   
                    duration: 0.5,
                    delay: 1.5
                }}
                className="flex  gap-x-3 shadow-lg w-full"
            > 
                <Input 
                    name='location'
                    className='bg-white text-xs md:text-sm py-5'
                    placeholder='Find locations or development names.'
                />
                <Button variant={'orange'} className='h-full'>Search</Button>
            </motion.div>
            <h1 className="text-white text-3xl xl:text-5xl font-[1000] w-full text-pretty font-sans mt-5"> BROWSE. BUY. RENT.</h1>
   
         
            </div>
    </div>
  )
}

export default Hero