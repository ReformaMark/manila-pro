'use client'
import SearchProperty from '@/components/search-property'
import React, { useState } from 'react'



function Hero() {

  return (
    <div className="hero relative ">
            <div className="absolute inset-0 size-full bg-black/30 flex flex-col justify-center items-center  px-5 sm:px-5 md:px-20 lg:px-40 xl:px-72 2xl:px-80 transition-all duration-300 ease-linear">
            <h1 className="text-white text-3xl xl:text-6xl font-bold mb-5 w-full text-pretty font-sans mt-5 text-center"> Find Your Perfect Home</h1>
            <SearchProperty/>
       
          
   
         
            </div>
    </div>
  )
}

export default Hero