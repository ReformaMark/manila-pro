import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function PropertiesLoading() {
  return (
    <div className='px-3 md:px-10'>
        <div className="flex items-center  ">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-[12.5%]" />
            <Skeleton className="h-8 w-[12.5%]" />
        </div>
        <div className="flex items-center justify-between mt-5 ">

            <Skeleton className="h-12 w-1/4" />
            <Skeleton className="h-12 w-1/4" />
          
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center flex-wrap justify-between mt-10 gap-5 ">
            <Skeleton className="h-80 " />
            <Skeleton className="h-80" />
            <Skeleton className="h-80 " />
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
           
          
        </div>
    </div>
  )
}

export default PropertiesLoading