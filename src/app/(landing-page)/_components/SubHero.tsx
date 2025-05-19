'use client'
import React from 'react'
import {motion} from "framer-motion"
import { containerVariants, itemVariants } from './framerVariants'
import Image from 'next/image'
import BG from '@/../public/images/luxury.jpg'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function SubHero() {
  

  return (
    

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{once: true}}
        variants={containerVariants}
        className='w-full px-10 xl:px-52 py-40 size-full inset-0 relative'
        > 
        <div className="absolute inset-0 flex flex-col justify-center px-5">
        
          <motion.h1 
            variants={itemVariants}
            className='z-20 subtitle text-4xl lg:text-sm mb-0  text-left font-sans font-extrabold tracking-widest  text-white '
            >
            Let&apos;s find your dream home!
          </motion.h1> 
          <motion.p
            variants={itemVariants}
            className='text-gray-200 text-xl leading-7 lg:leading-3 lg:text-[0.4rem] text-left font-extralight'>Discover premium real estate options in Makati, Pasay, and Taguig</motion.p>
            <motion.div variants={itemVariants} className="">
            <Link href={'/properties'} className="">
              <Button className='bg-orange-600 hover:bg-orange-400 rounded-sm mt-5 lg:mt-1 lg:h-3 lg:text-[0.4rem] w-fit'>Explore Properties</Button>
            </Link>
            </motion.div>
        </div>
      </motion.div>
     

  )
}

export default SubHero