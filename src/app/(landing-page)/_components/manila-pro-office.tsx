'use client'
import React from 'react'
import ManilaPro from "@/../public/images/manilaPro.png"
import Image from 'next/image'
import SubHero from './SubHero'

function ManilaProOffice() {
  return (
    <div className="relative w-[25vw] h-[25vh]  shadow-md  overflow-hidden">
        <div className="relative w-full h-full">
            <Image src={ManilaPro} alt='ManilaPro'  placeholder='blur' fill  className='object-cover'/>
        </div>
        <div className="absolute inset-0 bg-black/50 w-full h-full">
         
        </div>
     
    </div>
  
  )
}

export default ManilaProOffice