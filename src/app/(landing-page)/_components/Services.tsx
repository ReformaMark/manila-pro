'use client'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import React from 'react'
import { Button } from '@/components/ui/button'
import {motion} from 'framer-motion'
import { containerVariants, itemVariants } from './framerVariants'
import { Building, Handshake, Key } from 'lucide-react'

function Services() {
  return (
    <motion.div 
        initial="hidden"
        whileInView='visible'
        viewport={{once: true}}
        variants={containerVariants}
        className='bg-gray-50 grid grid-cols-1 gap-5 lg:grid-cols-3 px-5 md:px-10 xl:px-40 py-10 min-h-fit gap-x-10'
    >
          <motion.div 
            initial='hidden'
            whileInView={'visible'}
            variants={itemVariants}
            className=""
         >
        <Card className='shadow-xl rounded-3xl flex flex-col justify-between'>
            <CardHeader className='flex justify-center items-center'>
                <Building className='bg-black rounded-full size-20 text-white p-2'/>
            </CardHeader>

            <CardContent className='space-y-2'>
                <h1 className='text-2xl text-center font-black font-sans'>Browse properties</h1>
                <p className='text-center'>
                    Explore a wide range of homes with immersive photo galleries and access the largest selection of listings, including exclusive properties you won&apos;t find anywhere else.
                </p>
            </CardContent>

            <CardFooter className='flex justify-center items-center my-10'>
                <Button variant={'outline'} className='border-2 font-semibold border-black text-lg p-4'>Browse Listings</Button>
            </CardFooter>
        </Card>
        </motion.div>
        <motion.div 
            initial='hidden'
            whileInView={'visible'}
            variants={itemVariants}
            className=""
         >

        <Card className='shadow-xl rounded-3xl flex flex-col justify-between'>
            <CardHeader className='flex justify-center items-center'>
                <Handshake className='bg-black rounded-full size-20 text-white p-2'/>
            </CardHeader>

            <CardContent className='space-y-2'>
                <h1 className='text-2xl text-center font-black font-sans'>Buy a property</h1>
                <p className='text-center'>Discover your perfect home with an immersive photo experience and the largest selection of listings, including exclusive ones you won't find anywhere else.</p>
            </CardContent>

            <CardFooter className='flex justify-center items-center my-10'>
                <Button variant={'outline'} className='border-2 font-semibold border-black text-lg p-4'>Start Exploring</Button>
            </CardFooter>
        </Card>
        </motion.div>
        <motion.div 
            initial='hidden'
            whileInView={'visible'}
            variants={itemVariants}
            className=""
         >
        <Card className='shadow-xl rounded-3xl flex flex-col justify-between'>
            <CardHeader className='flex justify-center items-center'>
                <Key className='bg-black rounded-full size-20 text-white p-2'/>
            </CardHeader>

            <CardContent className='space-y-2'>
                <h1 className='text-2xl text-center font-black font-sans'>Rent a property</h1>
                <p className='text-center'>We&apos;re building a smooth online journey &mdash; from browsing the biggest rental network to submitting applications and paying rent.</p>
            </CardContent>

            <CardFooter className='flex justify-center items-center my-10'>
                <Button variant={'outline'} className='border-2 font-semibold border-black text-lg p-4'>See Your Options</Button>
            </CardFooter>
        </Card>
        </motion.div>
      
    </motion.div>
  )
}

export default Services