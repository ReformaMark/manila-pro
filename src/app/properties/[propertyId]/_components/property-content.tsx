import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowRight, Bath, Bed, Building, Calendar, Check, Mail, Maximize, MessageSquare, Phone, Star } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import PropertyCard from '../../_components/PropertyCard'
import { PropertyTypesWithImageUrls } from '@/lib/types'
import { calculateRatingsAve, formatDateListed, formatPrice } from '@/lib/utils'
import { CarouselApi } from '@/components/ui/carousel'
import { RatingStars } from '@/components/rating-stars'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useQuery } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import Link from 'next/link'
import MortgageCalculator from './mortgage-calculator'
import { QuickProposalDialog } from '@/app/proposals/_components/quick-proposal-dialog'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import SendMessageDialog from './send-message-dialog'
import MapComponent from './map'

interface PropertyContentProps{
    property: PropertyTypesWithImageUrls
    setCurrentImageIndex: (value: number) => void
    currentImageIndex: number
    setApi: (value: CarouselApi) => void
    carouselApi: CarouselApi
}

function PropertyContent({property, carouselApi, setCurrentImageIndex}: PropertyContentProps) {
  const similarProperties = useQuery(api.property.similarProp, {
    sellerId: property.sellerId,
    propertyId: property._id
  })

  const nearbyPlaces = useQuery(api.nearby_places.nearbyPlaces, {
    propertyId: property._id
  })
  const agent = property.agent

  const shuffledProperties = similarProperties
    ?.sort(() => Math.random() - 0.5)
    .slice(0, 2)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Main Content */}
    <div className="lg:col-span-2">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="bg-gray-100 text-gray-600">
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-brand-orange data-[state=active]:text-white"
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="features"
            className="data-[state=active]:bg-brand-orange data-[state=active]:text-white"
          >
            Features
          </TabsTrigger>
          <TabsTrigger
            value="location"
            className="data-[state=active]:bg-brand-orange data-[state=active]:text-white"
          >
            Location
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-sm font-medium text-gray-500">
                    <Bed className="h-4 w-4 mr-2 text-brand-orange" />
                    Bedrooms
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{property.bedrooms}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-sm font-medium text-gray-500">
                    <Bath className="h-4 w-4 mr-2 text-brand-orange" />
                    Bathrooms
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{property.bathrooms}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-sm font-medium text-gray-500">
                    <Maximize className="h-4 w-4 mr-2 text-brand-orange" />
                    Lot Area
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{property.lotArea} sqm</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-sm font-medium text-gray-500">
                    <Building className="h-4 w-4 mr-2 text-brand-orange" />
                    Storey
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{property.storeys ?? "-"}</p>
                </div>
              </div>
         

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>

                <Separator className="bg-gray-200 my-6" />

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Property Information</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex justify-between">
                        <span>Property Type:</span>
                        <span className="font-medium text-gray-900 capitalize">{property.unitType}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Transaction:</span>
                        <span className="font-medium text-gray-900 capitalize">{property.transactionType}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Max Occupants:</span>
                        <span className="font-medium text-gray-900">{property.maximumOccupants}</span>
                      </li>
                
                     
                       <li className="flex justify-between">
                        <span>Listed:</span>
                        <span className="font-medium text-gray-900">{formatDateListed(property._creationTime)}</span>
                      </li>
                    </ul>
                  </div>

                  {/* <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Additional Details</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex justify-between">
                        <span>Parking:</span>
                        <span className="font-medium text-gray-900">1 Slot</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Pet Policy:</span>
                        <span className="font-medium text-gray-900">Allowed</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Property ID:</span>
                        <span className="font-medium text-gray-900">MP-{property._id}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Listed:</span>
                        <span className="font-medium text-gray-900">{formatDateListed(property._creationTime)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Available From:</span>
                        <span className="font-medium text-gray-900">Immediate</span>
                      </li>
                    </ul>
                  </div> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-4">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Amenities & Facilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Amenities</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                    {property?.amenities ? property?.amenities.map((amenity) => (
                      <li key={amenity.name} className="flex items-center text-gray-700">
                        <Check className="h-4 w-4 mr-2 text-brand-orange" />
                        {amenity.name}
                      </li>
                    )) : (
                        <h1 className='text-nowrap'>No Listed Amenities</h1>
                    )}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Facilities</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                    {property?.facilities ? property?.facilities.map((facility) => (
                      <li key={facility.name} className="flex items-center text-gray-700">
                        <Check className="h-4 w-4 mr-2 text-brand-orange" />
                        {facility.name}
                      </li>
                    )): (
                        <h1 className='text-nowrap'>No Listed Facilities</h1>
                    )}
                  </ul>
                </div>
              </div>

              <Separator className="bg-gray-200 my-6" />

              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Property Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {property.imageUrls?.map((image, index) => (
                    <div
                      key={index}
                      className="relative h-32 rounded-md overflow-hidden cursor-pointer shadow-sm"
                      onClick={() => {
                        setCurrentImageIndex(index + 1)
                        carouselApi?.scrollTo(index)
                    }}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${property.propertyName} - Image ${index + 1}`}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="mt-4">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Location & Neighborhood</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative  mb-6 rounded-lg">
                {property.coordinates ? (

                  <MapComponent property={property} />
                ) : (
                  <div className="text-gray-500">No location data available</div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Nearby Places</h3>
                  <ul className="space-y-3">
                    {nearbyPlaces && nearbyPlaces?.length > 0 ? nearbyPlaces?.filter((place) => place.type !== 'transportation').map((place, index) => (
                      <li key={index} className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-brand-orange/20 flex items-center justify-center mt-0.5 mr-2">
                          <span className="text-xs font-medium text-brand-orange">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{place.name}</p>
                          <p className="text-sm text-gray-500 capitalize">{place.type}</p>
                        </div>
                      </li>
                    )) : (
                      <li className="flex items-start">
                      
                        <div>
                      
                            <p className="text-sm text-gray-500">No nearby places have been added by the agent.</p>
                        </div>
                      </li>
                    )}
                 
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Transportation</h3>
                  <ul className="space-y-3">
                    {nearbyPlaces && nearbyPlaces?.length > 0 ? nearbyPlaces?.filter((place) => place.type === 'transportation').map((place, index) => (
                      <li key={index} className="flex items-start">
                        <div className="h-6 w-6 rounded-full bg-brand-orange/20 flex items-center justify-center mt-0.5 mr-2">
                          <span className="text-xs font-medium text-brand-orange">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{place.name}</p>
                          <p className="text-sm text-gray-500 capitalize">{place.type}</p>
                        </div>
                      </li>
                    )) : (
                      <li className="flex items-start">
                       
                        <div>
                         
                          <p className="text-sm text-gray-500">No transportation options have been added by the agent.</p>
                        </div>
                      </li>
                    )}
                
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Similar Properties */}
      <div className="mt-6">
        <div className="flex justify-between">
            <h2 className="text-xl font-bold mb-4 text-gray-900">More Properties from this Agent</h2>
            <Link href={`/properties/agents/${property.agent?._id}`} className='contents'>
              <Button
                  variant={'link'}
                  className="text-brand-orange"
                  >
                  View Agent Property listing
                  <ArrowRight  className="text-brand-orange"/>
              </Button>
            </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shuffledProperties?.map((property) => (
            <Link key={property._id} href={`/properties/${property._id}`} className='contents'>

              <PropertyCard  property={property} onClick={() => {}} />
            </Link>
          ))}
        </div>
      </div>
    </div>

    {/* Sidebar */}
    <aside>
      {/* Agent Contact */}
      <Card className="border border-gray-200 shadow-sm mb-6">
        <CardHeader>
          <CardTitle className="text-gray-900">Contact Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="flex gap-x-3">
            
              <Avatar className="h-16 w-16 ">
                <AvatarImage src={agent?.userImageUrl} alt="User" />
                <AvatarFallback className="bg-gray-800 text-white uppercase">{agent?.fname.charAt(1)} {agent?.lname.charAt(1)}</AvatarFallback>
              </Avatar>
              <div className="">

                <h3 className="font-semibold text-gray-900">{agent?.fname} {agent?.lname}</h3>
                <p className="text-sm text-gray-500">{agent?.agentInfo ? agent.agentInfo.title : "No job title"}</p>
                <div className="mt-1">
                <RatingStars 
                  edit={false}
                  size={30}
                  average={calculateRatingsAve(agent?.ratingsAndReviews)}
                />
                <span className="text-xs text-gray-500 ml-1">({agent?.ratingsAndReviews.length ?? 0} reviews)</span>
              </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <Button
              variant="outline"
              className="w-full justify-start border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              <Phone className="h-4 w-4 mr-2 text-brand-orange" />
              {agent?.contact}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              <Mail className="h-4 w-4 mr-2 text-brand-orange" />
              {agent?.email}
            </Button>
          </div>

          <div className="space-y-4">
            <QuickProposalDialog
              property={property}
              agentId={property.sellerId}
              buttonClassName="w-full bg-brand-orange hover:bg-brand-orange/90"
            />
            
          {property.agent && (
            <SendMessageDialog agentId={property.agent._id}/>
          )}
          </div>
        </CardContent>
      </Card>
      {/* {property.transactionType?.toLowerCase() === "buy" && (
        <MortgageCalculator property={property}/>
      )} */}
    </aside>
  </div>
  )
}

export default PropertyContent