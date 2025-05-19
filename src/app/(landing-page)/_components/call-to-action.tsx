'use client'
import Image from 'next/image'
import React from 'react'
import ManilaPro from "@/../public/images/manilaPro.png"
import SubHero from './SubHero'
import {motion} from 'framer-motion'
import { Building, Home, MapPin } from 'lucide-react'
import { containerVariants, slideToLeft, slideToRight } from './framerVariants'
function CallToAction() {

   
  return (
    <motion.div className="lg:hidden mt-10">
        <div className="w-full mb-10 flex items-center justify-center  ">
            <div className="max-w-7xl px-10 mx-auto text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Properties by Category</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Browse our extensive collection of properties for sale, rent, and lease
                </p>
                </div>
        </div>
        <div className='h-dvh relative'>
            <div className="absolute inset-0 size-full">

                <Image
                    src={ManilaPro}
                    alt="Call to Action"
                    fill
                    placeholder='blur'
                    className='object-cover'
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80" />
                <SubHero/>
            </div>
        </div>
        <motion.div variants={containerVariants} viewport={{ once: true, amount: 0.5 }} className="container space-y-5 my-10">
            <motion.div
                initial='hidden'
                whileInView={'visible'}
                variants={slideToLeft}
                className="bg-gray-50 p-6 rounded-xl h-full border border-gray-100 shadow-sm"
            
                >
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center mr-4">
                    <Building className="h-5 w-5 text-brand-orange" />
                    </div>
                    <h3 className="font-semibold text-xl text-gray-900">Prime Locations</h3>
                </div>
                <p className="text-gray-600">
                    Strategically positioned in business districts with excellent accessibility and visibility.
                </p>
            </motion.div>
            <motion.div
                initial='hidden'
                whileInView={'visible'}
                
                variants={slideToRight}
                
                className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm"
             
            >
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center mr-4">
                    <Home className="h-5 w-5 text-brand-orange" />
                    </div>
                    <h3 className="font-semibold text-xl text-gray-900">Modern Amenities</h3>
                </div>
                <p className="text-gray-600">
                    Fully-equipped spaces with high-speed internet, meeting rooms, and premium furnishings.
                </p>
            </motion.div>
            <motion.div
                initial='hidden'
                whileInView={'visible'}
                variants={slideToLeft}
                className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm"
             
            >
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center mr-4">
                    <MapPin className="h-5 w-5 text-brand-orange" />
                    </div>
                    <h3 className="font-semibold text-xl text-gray-900">Flexible Terms</h3>
                </div>
                <p className="text-gray-600">
                    Options for short and long-term leases with customizable spaces to suit your business needs.
                </p>
            </motion.div>
            <motion.div
                initial='hidden'
                whileInView={'visible'}
                variants={slideToRight}
                className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm"
               
            >
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center mr-4">
                    <Building className="h-5 w-5 text-brand-orange" />
                    </div>
                    <h3 className="font-semibold text-xl text-gray-900">Professional Environment</h3>
                </div>
                <p className="text-gray-600">
                    Prestigious address that enhances your company's image and provides a productive workspace.
                </p>
            </motion.div>
        </motion.div>
    </motion.div>
  )
}

export default CallToAction