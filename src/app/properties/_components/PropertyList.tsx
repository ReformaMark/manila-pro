'use client'
import {  useQuery } from 'convex/react'
import React from 'react'
import { api } from '../../../../convex/_generated/api'

import PropertyShowcase from './PropertyShowCase'
import { PropertyTypesWithImageUrls } from '@/lib/types'
import PropertiesLoading from './PropertiesLoading'

function PropertyList() {
    const properties = useQuery(api.property.getProperties,{});
    if (!properties) return <PropertiesLoading/>;

  return (
    <div className="pb-20 text-muted-foreground">
        <PropertyShowcase properties={properties as PropertyTypesWithImageUrls[]}/>
    </div>
  )
}

export default PropertyList