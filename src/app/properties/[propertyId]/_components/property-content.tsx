import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bath, Bed, Building, Calendar, Check, Mail, Maximize, MessageSquare, Phone, Star } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import PropertyCard from '../../_components/PropertyCard'
import { PropertyTypesWithImageUrls } from '@/lib/types'
import { formatDateListed } from '@/lib/utils'
import { CarouselApi } from '@/components/ui/carousel'

interface PropertyContentProps{
    property: PropertyTypesWithImageUrls
    setCurrentImageIndex: (value: number) => void
    currentImageIndex: number
    setApi: (value: CarouselApi) => void
    api: CarouselApi
}

function PropertyContent({property, api, setCurrentImageIndex}: PropertyContentProps) {
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
                        <span>Year Built:</span>
                        <span className="font-medium text-gray-900">2020</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Furnishing:</span>
                        <span className="font-medium text-gray-900">Fully Furnished</span>
                      </li>
                    </ul>
                  </div>

                  <div>
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
                      {/* <li className="flex justify-between">
                        <span>Property ID:</span>
                        <span className="font-medium text-gray-900">MP-{property._id}</span>
                      </li> */}
                      <li className="flex justify-between">
                        <span>Listed:</span>
                        <span className="font-medium text-gray-900">{formatDateListed(property._creationTime)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Available From:</span>
                        <span className="font-medium text-gray-900">Immediate</span>
                      </li>
                    </ul>
                  </div>
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
                        api?.scrollTo(index)
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
              <div className="bg-gray-100 h-80 rounded-lg mb-6 flex items-center justify-center">
                <p className="text-gray-500">Interactive map would be displayed here</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Nearby Places</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-brand-orange/20 flex items-center justify-center mt-0.5 mr-2">
                        <span className="text-xs font-medium text-brand-orange">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Greenbelt Mall</p>
                        <p className="text-sm text-gray-500">5 minutes walk</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-brand-orange/20 flex items-center justify-center mt-0.5 mr-2">
                        <span className="text-xs font-medium text-brand-orange">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Ayala Triangle Gardens</p>
                        <p className="text-sm text-gray-500">10 minutes walk</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-brand-orange/20 flex items-center justify-center mt-0.5 mr-2">
                        <span className="text-xs font-medium text-brand-orange">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Makati Medical Center</p>
                        <p className="text-sm text-gray-500">15 minutes drive</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Transportation</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-brand-orange/20 flex items-center justify-center mt-0.5 mr-2">
                        <span className="text-xs font-medium text-brand-orange">A</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Ayala MRT Station</p>
                        <p className="text-sm text-gray-500">8 minutes walk</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-brand-orange/20 flex items-center justify-center mt-0.5 mr-2">
                        <span className="text-xs font-medium text-brand-orange">B</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Bus Terminal</p>
                        <p className="text-sm text-gray-500">5 minutes walk</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-brand-orange/20 flex items-center justify-center mt-0.5 mr-2">
                        <span className="text-xs font-medium text-brand-orange">C</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">NAIA Terminal 3</p>
                        <p className="text-sm text-gray-500">25 minutes drive</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Similar Properties */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Similar Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* {similarProperties.map((property) => (
            <PropertyCard key={property.id} property={property} onClick={() => {}} />
          ))} */}
        </div>
      </div>
    </div>

    {/* Sidebar */}
    <div>
      {/* Agent Contact */}
      <Card className="border border-gray-200 shadow-sm mb-6">
        <CardHeader>
          <CardTitle className="text-gray-900">Contact Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4">
              <Image src="/placeholder.svg" alt="Agent" fill className="object-cover" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Maria Santos</h3>
              <p className="text-sm text-gray-500">Senior Real Estate Agent</p>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-gray-300" />
                <span className="text-xs text-gray-500 ml-1">(42 reviews)</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <Button
              variant="outline"
              className="w-full justify-start border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              <Phone className="h-4 w-4 mr-2 text-brand-orange" />
              +63 912 345 6789
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              <Mail className="h-4 w-4 mr-2 text-brand-orange" />
              maria.santos@manilapro.com
            </Button>
          </div>

          <div className="space-y-4">
            <Button className="w-full bg-brand-orange hover:bg-brand-orange/90">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button
              variant="outline"
              className="w-full border-brand-orange text-brand-orange hover:bg-brand-orange/10"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Viewing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mortgage Calculator */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Mortgage Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Property Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₱</span>
                <input
                  type="text"
                  value="15,000,000"
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-8 text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Down Payment (20%)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₱</span>
                <input
                  type="text"
                  value="3,000,000"
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-8 text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Loan Term</label>
              <select className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange">
                <option>15 years</option>
                <option>20 years</option>
                <option selected>30 years</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Interest Rate</label>
              <select className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand-orange focus:border-brand-orange">
                <option>4.5%</option>
                <option selected>5.0%</option>
                <option>5.5%</option>
                <option>6.0%</option>
              </select>
            </div>

            <Separator className="bg-gray-200" />

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700">Monthly Payment:</span>
                <span className="text-lg font-bold text-brand-orange">₱64,282</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Total Loan Amount:</span>
                <span>₱12,000,000</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Total Interest:</span>
                <span>₱11,141,520</span>
              </div>
            </div>

            <Button className="w-full bg-brand-orange hover:bg-brand-orange/90">Apply for Pre-approval</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
  )
}

export default PropertyContent