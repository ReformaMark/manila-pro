'use client'
import React from 'react'
import {motion} from "framer-motion"
import { containerVariants, itemVariants } from './framerVariants'
import Image from 'next/image'
import BG from '@/../public/images/luxury.jpg'
import { Button } from '@/components/ui/button'

function SubHero() {
  

  return (
    

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{once: true}}
        variants={containerVariants}
        className='w-full px-10 xl:px-52 py-40 size-full inset-0 relative'
        > 
        <div className="absolute inset-0 z-50 flex gap-y-5 flex-col items-center justify-center px-5">
        
          <motion.h1 
            variants={itemVariants}
            className='z-20  text-center font-sans font-extrabold tracking-widest text-xl xl:text-xl text-black '
            >
            Let&apos;s find your dream home!
          </motion.h1> 
          <motion.p
            variants={itemVariants}
            className='text-black text-center font-extralight'>Save a few homes you like, and we&apos;ll help you discover more recommendations just for you.</motion.p>
            <div className="">
              <Button className='bg-orange-600 hover:bg-orange-400'>Sign In</Button>
            </div>
        </div>
      
      </motion.div>
     

  )
}

export default SubHero