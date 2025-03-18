'use client'
import React from 'react'
import { Id } from '../../../../convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import ImageCarousel from './_components/ImageCarousel'
import Loading from '@/components/loading'
import BackBtn from '@/components/back-button'

interface PageProps {
    params: {
        propertyId: Id<'property'>
}}

function Page({params}: PageProps) {
    const property = useQuery(api.property.getProperty, {
        id: params.propertyId
    })

    if(!property) return <Loading/>

  return (
    <div className='p-2'>
        <BackBtn/>
        <ImageCarousel images={property?.imageUrls}/>
    </div>
  )
}

export default Page