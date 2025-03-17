'use client'
import SearchProperty from '@/components/search-property'
import React, { useState } from 'react'



function Hero() {

  return (
    <div className="hero relative ">
            <div className="absolute inset-0 size-full bg-black/30 flex flex-col justify-center items-center  px-5 sm:px-5 md:px-20 lg:px-40 xl:px-72 2xl:px-80 transition-all duration-300 ease-linear">
            <SearchProperty/>
       
            <h1 className="text-white text-3xl xl:text-5xl font-[1000] w-full text-pretty font-sans mt-5"> BROWSE. BUY. RENT.</h1>
   
         
            </div>
    </div>
  )
}

export default Hero