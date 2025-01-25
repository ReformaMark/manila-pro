'use client'
import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LocateIcon } from 'lucide-react'

function Hero() {
  return (
    <div className="hero ">
        <div className="px-36 w-[65%] pt-32  size-full ">
            <motion.div 
                className="bg-black/50 rounded-2xl h-fit p-4"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                    duration: 0.5,
                    delay: 1
                }}
            >
                <h1 className="text-white text-5xl font-extrabold"> Your Trusted Partner in Urban Living and Real Estate</h1>
            </motion.div>
            <div className="bg-blue-300"></div>
            <div className="flex"> 

                <div className="">
                <Input 
                    name=''
                    className='bg-white/85 h-14'
                    placeholder='Find locations or development names'
                />
                <LocateIcon/>
                </div>
                <Button variant={'default'} className='h-14'>Search</Button>
            </div>
        </div>
       
    </div>
  )
}

export default Hero