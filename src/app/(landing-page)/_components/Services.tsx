import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import Browse from '@/../public/images/browse.png'
import Rent from '@/../public/images/rent.png'
import Buy from '@/../public/images/buy.png'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

function Services() {
  return (
    <div className='bg-gray-50 grid grid-cols-1 lg:grid-cols-3 px-5 md:px-10 xl:px-40 py-10 min-h-fit gap-x-10'>
        <Card className='shadow-xl rounded-3xl flex flex-col justify-between'>
            <CardHeader className='flex justify-center items-center'>
                <Image src={Buy} alt='Browse' className='object-contain rounded-full size-[70%]'/>
            </CardHeader>

            <CardContent className='space-y-2'>
                <h1 className='text-2xl text-center font-black font-sans'>Buy a property</h1>
                <p className='text-center'>Discover your perfect home with an immersive photo experience and the largest selection of listings, including exclusive ones you won't find anywhere else.</p>
            </CardContent>

            <CardFooter className='flex justify-center items-center my-10'>
                <Button variant={'outline'} className='border-2 font-semibold border-black text-lg p-4'>Start Exploring</Button>
            </CardFooter>
        </Card>
        <Card className='shadow-xl rounded-3xl flex flex-col justify-between'>
            <CardHeader className='flex justify-center items-center'>
                <Image src={Rent} alt='Browse' className='object-contain size-[70%]'/>
            </CardHeader>

            <CardContent className='space-y-2'>
                <h1 className='text-2xl text-center font-black font-sans'>Rent a property</h1>
                <p className='text-center'>We&apos;re building a smooth online journey &mdash; from browsing the biggest rental network to submitting applications and paying rent.</p>
            </CardContent>

            <CardFooter className='flex justify-center items-center my-10'>
                <Button variant={'outline'} className='border-2 font-semibold border-black text-lg p-4'>See Your Options</Button>
            </CardFooter>
        </Card>
        <Card className='shadow-xl rounded-3xl flex flex-col justify-between'>
            <CardHeader className='flex justify-center items-center'>
                <Image src={Browse} alt='Browse' className='object-contain rounded-full size-[70%]'/>
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
    </div>
  )
}

export default Services