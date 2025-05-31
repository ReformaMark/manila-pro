'use client'
import React, { useRef } from 'react'
import {motion, useScroll, useTransform} from 'framer-motion'
import SubHero from './SubHero'
import ManilaProOffice from './manila-pro-office'
import {  Building, Home, MapPin } from 'lucide-react'

function ParallaxScrollSection() {

 
    const container = useRef(null)
    const {scrollYProgress} = useScroll({
        target: container,
        offset:['start start', 'end end']
    })

    const scale4 = useTransform(scrollYProgress, [0,1], [1,4])



  return (
    <div ref={container} className='h-[300vh] hidden lg:block  relative'>
        <div className="h-screen w-screen  sticky inset-0 overflow-hidden">
            <motion.div  style={{scale:scale4}}  className="absolute size-full inset-0 flex items-center justify-center ">
                    <div className="absolute top-0 left-0 w-full h-[25vh] flex items-center justify-center  ">
                        <div className="max-w-7xl mx-auto text-center">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Explore Properties by Category</h2>
                            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                                Browse our extensive collection of properties for sale, rent, and lease
                            </p>
                            </div>
                    </div>
            </motion.div>
            <motion.div  style={{scale:scale4}}  className="absolute size-full inset-0 flex items-center justify-center ">
                    <div  className=" lg:w-[25vw] lg:h-[25vh]  shadow-md  overflow-hidden">
                        <ManilaProOffice />
                         
                    </div>
                  
            </motion.div>
            {scrollYProgress && (
                <motion.div
            
                    style={{
                        scale: scale4,
                        opacity: useTransform(scrollYProgress, [0.5, 1], [0, 1]),
                        y: useTransform(scrollYProgress, [0.5, 1], [-20, 0]),
                       
                        pointerEvents: useTransform(scrollYProgress, [0.99, 1], ['none', 'auto']),
                    }}
                    className="z-[1000] absolute size-full inset-0 flex items-center justify-center"
                >
                    <div>
                        <SubHero />
                    </div>
                </motion.div>
            )}
            <motion.div  style={{scale:scale4}}  className="absolute hidden size-full inset-0 lg:flex items-center justify-center ">
                    <div  className="absolute top-56 left-36 w-[25vw]    overflow-hidden">
                        <motion.div
                            className="bg-gray-50 p-6 rounded-xl h-full border border-gray-100 shadow-sm"
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
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
                    </div>
            </motion.div>
            <motion.div  style={{scale:scale4}}  className="absolute size-full inset-0 flex items-center justify-center ">
                    <div  className="absolute bottom-56 left-36 w-[25vw] h-[25vh]   overflow-hidden">
                        
                    <motion.div
                        className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.3 }}
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
                    </div>
            </motion.div>
            <motion.div  style={{scale:scale4}}  className="absolute size-full inset-0 flex items-center justify-center ">
                    <div  className="absolute top-56 right-36 w-[25vw] h-[25vh]   overflow-hidden">
                        
                        <motion.div
                            className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm"
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
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
                    </div>
            </motion.div>
            <motion.div  style={{scale:scale4}}  className="absolute size-full inset-0 flex items-center justify-center ">
                    <div  className="absolute bottom-56 right-36 w-[25vw] h-[25vh]   overflow-hidden">
                        
                        <motion.div
                            className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm"
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
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
                    </div>
            </motion.div>
        
           


        </div>

    </div>
  )
}

export default ParallaxScrollSection