'use client'
import { usePaginatedQuery } from 'convex/react'
import React from 'react'
import { api } from '../../../../convex/_generated/api'

import PropertyCard from './PropertyCard'
import {motion} from 'framer-motion'
import PropertyFilter from '@/components/property-filter'
import { containerVariants } from '@/app/(landing-page)/_components/framerVariants'
import { Filter } from 'lucide-react'

function PropertyList() {
    const { results, status, loadMore } = usePaginatedQuery(
        api.property.getProperties,
        {},
        { initialNumItems: 5 },
      );

  return (
    <div className="pt-2 p-2 text-muted-foreground">
        <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{once: true}}
            variants={containerVariants}
            className=''
        >
            <h1 className='flex items-center text-muted-foreground text-xs gap-x-2'>Filters <Filter className='size-4'/></h1>
            <div className="px-2">

            <PropertyFilter/>
            </div>

        
        </motion.div>
        <h1 className='mt-5'>Properties</h1>
        <div className='min-h-fit max-h-screen overflow-y-auto grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 p-2 md:p-5 transition-all duration-500 ease-in-out'>
            {results?.map(property =>(
                <PropertyCard property={property}/>
            ))}
        </div>
    </div>
  )
}

export default PropertyList