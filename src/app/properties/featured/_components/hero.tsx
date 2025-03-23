'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
import FeaturedBg from '@/../public/images/featured.jpg'
import { scrollToSection } from '@/lib/utils'

function Hero() {
  return (
    <div className="relative rounded-xl overflow-hidden mb-8">
    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10"></div>
    <div className="relative h-64 md:h-80">
      <Image
        src={FeaturedBg}
        alt="Featured Background image"
        className="w-full h-full object-cover"
      />
    </div>
    <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Properties</h1>
      <p className="text-lg text-white/90 max-w-2xl mb-6">
        Discover our handpicked selection of premium properties across Manila's most desirable locations.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => scrollToSection("featured-properties")} className="bg-brand-orange hover:bg-brand-orange/90 text-white">Explore All</Button>
        <Button onClick={() => scrollToSection("agents")} variant="outline" className="bg-white/20 border-white/40 text-white hover:bg-white/30">
          Contact an Agent
        </Button>
      </div>
    </div>
  </div>
  )
}

export default Hero