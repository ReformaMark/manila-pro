'use client'
import { PropertyTypes } from '@/lib/types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import { cn, formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Bed, House} from 'lucide-react'
import Link from 'next/link'
import { FaPeopleArrows } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { propertyCardVariants } from '@/app/(landing-page)/_components/framerVariants'

interface PropertyCardProps {
    property: PropertyTypes
}
function PropertyCard({property}: PropertyCardProps) {
  return (
    <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{once: true}}
        variants={propertyCardVariants}
        className=""
    >
        <Link key={property._id} href={`/properties/${property._id}`} className='z-40'>
            <Card  className='h h-80 flex flex-col justify-between'>
                <CardHeader className='h-1/2 w-full p-0 rounded-t-xl shadow-md  bg-orange-500/20 overflow-hidden relative'>
                {property.displayImage ? (
                    <Image src={property.displayImage} alt="Property Image" width={500} height={500} className='w-full h-full object-cover'/>
                ) : (
                    <div className="size-full flex text-xs items-center justify-center  ">
                        <h1>No Uploaded Image</h1>
                    </div>
                )}
                <h4 className={cn(
                    property.transactionType?.toLowerCase() === "buy" && "bg-green-500",
                    property.transactionType?.toLowerCase() === "rent" && "bg-blue-500",
                    property.transactionType?.toLowerCase() === "lease" && "bg-yellow-500",
                    'uppercase text-xs text-white font-semibold rotate-45 shadow-md  text-center absolute px-10 top-5 right-[-30px]')}
                >
                    For {property.transactionType?.toLowerCase() === "buy" ? "Sale" : property.transactionType}
                </h4>


                <div className="absolute rounded-xl bottom-2 z-20 left-0 px-2 w-full flex flex-wrap gap-2 ">
                    {property.amenities?.map((amenities) =>(
                        <Badge key={amenities.name} className='bg-white/50 text-black font-normal  text-xs capitalize'>{amenities.name}</Badge>
                    ))}
                </div>
            
            
                {/* <Heart className='z-50 hover:bg-red-500 size-7 hover:cursor-pointer bg-white transition-colors duration-300 ease-linear  px-1 rounded-full absolute bottom-2 right-2'/> */}
            
            
                </CardHeader>
                <CardContent className='px-2 text-xs font-semibold space-y-2 h-2/6'>
                    <div className="space-y-2">
                        <h4 className='text-lg  text-nowrap line-clamp-1 overflow-ellipsis '>{property.propertyName}</h4>
                        <p className='text-xs text-muted-foreground font-normal text-nowrap line-clamp-1'>{property.address ? property.address : "No added address" }</p>
                        <h4 className='font-normal text-nowrap line-clamp-1 capitalize'>{property.unitType}</h4>
                        <div className="flex items-center justify-start">
                            {/* <div className="flex items-center font-normal text-gray-500">
                                <Star fill='yellow' size={20}/>
                                No ratings & reviews
                            </div> */}
                            <h4 className='font-semibold text-right text-xs md:text-sm  w-full'>{formatPrice(property.totalSellingPrice)} <span className='font-normal'>{  property.transactionType?.toLowerCase() === "buy" ? "" : "/month"}</span></h4>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className='h-10 rounded-b-xl  bg-gray-50 p-2 flex justify-between text-gray-600'>
                    <h3 className='flex items-center gap-2 text-xs'><Bed className='size-4'/> {property.bedrooms}</h3>
                    <h3 className='flex items-center gap-2 text-xs'><FaPeopleArrows className='size-4'/> {property.maximumOccupants}</h3>
                    <h3 className='flex items-center gap-2 text-xs'><House className='size-4'/> {property.lotArea} sqm</h3>
                </CardFooter>
            </Card>
        </Link>
    </motion.div>
  )
}

export default PropertyCard