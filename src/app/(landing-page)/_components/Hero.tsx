'use client'
import SearchProperty from '@/components/search-property'
import React, { useState } from 'react'



function Hero() {

  return (
    <div className="hero relative ">
            <div className="absolute inset-0 size-full bg-black/30 flex flex-col justify-center items-center  px-5 sm:px-5 md:px-20 lg:px-40 xl:px-72 2xl:px-80 transition-all duration-300 ease-linear">
             <div className="max-w-7xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Find Your Perfect Property</h1>
                
            </div>
            <SearchProperty/>
            </div>
    </div>
  )
}

export default Hero