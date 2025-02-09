import Image from 'next/image'
import React from 'react'
import Subhero from '@/../public/images/subhero.png'
function SubHero() {
  return (
    <div className='h-[40vh] w-full px-10 xl:px-52 grid grid-cols-3 justify-center items-center'>
        <div className="col-span-2 space-y-3">
            <h1 className='text-left font-sans font-bold tracking-widest xl:text-xl text-black '>"Let&apos;s find your dream home!</h1> 
            <h3 className='text-gray-700 font-extralight'>Save a few homes you like, and we&apos;ll help you discover more recommendations just for you."</h3>
        </div>
        <div className="col-span-1 ">
            <Image src={Subhero} alt='' className='object-contain size-1/2'/>
        </div>
       
    </div>
  )
}

export default SubHero