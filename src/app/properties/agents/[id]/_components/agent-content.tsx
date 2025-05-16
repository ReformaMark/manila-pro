import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AgentType, PropertyTypesWithImageUrls } from '@/lib/types'
import { cn, formatDate, formatDateListed, formatPrice } from '@/lib/utils'
import { useQuery } from 'convex/react'
import { Award, BarChart, Building, CheckCircle, Clock, Home, MapPin, Search, Star, ThumbsUp, User, Users, Verified } from 'lucide-react'
import React, { useState } from 'react'
import { api } from '../../../../../../convex/_generated/api'
import PropertyCard from '@/app/properties/_components/PropertyCard'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

function AgentContent({
    agent
}:{
    agent: AgentType
}) {
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [filterType, setFilterType] = useState<string>('all')
    const router = useRouter()
    const data = useQuery(api.property.getAgentActiveListings,{agentId: agent._id})
    const agentRatingsAndReviews = useQuery(api.ratings_reviews.getAgentRatingsAndReviews, {agentId: agent._id})

    const filteredProperties = data?.properties.filter((property) => {
    // Filter by type
    if (filterType !== "all" && property.transactionType?.toLowerCase() !== filterType.toLowerCase()) {
      return false
    }

    // Filter by search query
    if (
      searchQuery &&
      !property.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !property.city.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    return true
  })

  const pastTransactions = data?.properties.filter(property => property.status === 'sold')
  return (
    <Tabs defaultValue="listings" className="w-full">
        <TabsList className="bg-gray-100 text-gray-600">
            <TabsTrigger
            value="listings"
            className="data-[state=active]:bg-brand-orange data-[state=active]:text-white"
            >
            <Home className="h-4 w-4 mr-2" />
            Listings
            </TabsTrigger>
            <TabsTrigger value="sold" className="data-[state=active]:bg-brand-orange data-[state=active]:text-white">
            <CheckCircle className="h-4 w-4 mr-2" />
            Past Sales
            </TabsTrigger>
            <TabsTrigger
            value="reviews"
            className="data-[state=active]:bg-brand-orange data-[state=active]:text-white"
            >
            <Star className="h-4 w-4 mr-2" />
            Reviews
            </TabsTrigger>
            <TabsTrigger
            value="credentials"
            className="data-[state=active]:bg-brand-orange data-[state=active]:text-white"
            >
            <Award className="h-4 w-4 mr-2" />
            Credentials
            </TabsTrigger>
        </TabsList>

        {/* Current Listings Tab */}
        <TabsContent value="listings" className="mt-6">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Current Listings ({filteredProperties?.length})</h2>

            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                    placeholder="Search listings..."
                    className="pl-9 bg-white border-gray-300 text-gray-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                </div>

                <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className={cn("border-gray-300 text-gray-700", filterType === "all" && "bg-gray-100")}
                    onClick={() => setFilterType("all")}
                >
                    All
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn("border-gray-300 text-gray-700", filterType === "buy" && "bg-gray-100")}
                    onClick={() => setFilterType("buy")}
                >
                    For Sale
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn("border-gray-300 text-gray-700", filterType === "rent" && "bg-gray-100")}
                    onClick={() => setFilterType("rent")}
                >
                    For Rent
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn("border-gray-300 text-gray-700", filterType === "lease" && "bg-gray-100")}
                    onClick={() => setFilterType("lease")}
                >
                    For Lease
                </Button>
                </div>
            </div>
            </div>

            {filteredProperties && filteredProperties?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                <PropertyCard
                    key={property._id}
                    property={property as PropertyTypesWithImageUrls}
                    onClick={() => router.push(`/properties/${property._id}`)}
                />
                ))}
            </div>
            ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
                <p className="text-gray-500">
                {searchQuery
                    ? `No properties match your search for "${searchQuery}"`
                    : `${agent.fname} doesn't have any ${filterType !== "all" ? filterType : ""} listings at the moment`}
                </p>
            </div>
            )}
        </TabsContent>

        {/* Past Sales Tab */}
        <TabsContent value="sold" className="mt-6">
            <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Past Transactions</h2>
            <p className="text-gray-500 mt-1">Properties successfully sold or leased by {agent.fname}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.pastTransactions.map((transaction) => (
                <Card key={transaction._id} className="overflow-hidden border border-gray-200">
                <div className="relative h-40">
                    <Image
                    src={transaction.property.displayImageUrl || "/placeholder.svg"}
                    alt={transaction.property.propertyName}
                    fill
                    className="object-cover"
                    />
                    <Badge className="absolute bottom-2 left-2 bg-green-600 text-white">
                    {transaction.property.propertyType}
                    </Badge>
                </div>
                <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{transaction.property.propertyName}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {transaction.property.city}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                    <p className="font-bold text-brand-orange">{formatPrice(transaction.finalDealPrice ?? 0)}</p>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
                        <Clock className="h-3 w-3 mr-1" />
                        { formatDateListed(transaction.approvalDate ?? 0)}
                    </Badge>
                    </div>
                </CardContent>
                </Card>
            ))}
            </div>

            <div className="mt-6 flex justify-center">
            <Button variant="outline" className="border-gray-300 text-gray-700">
                View More Transactions
            </Button>
            </div>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="mt-6">
            <div className="mb-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Client Reviews ({agentRatingsAndReviews?.reviews.length})</h2>
               
            </div>

            <div className="mt-4 flex flex-col md:flex-row items-start md:items-center gap-6 justify-center">
                <div className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg">
                <div className="text-4xl font-bold text-gray-900">{agentRatingsAndReviews?.rating}</div>
                <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(agentRatingsAndReviews?.rating ?? 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                    />
                    ))}
                </div>
                <div className="text-sm text-gray-500 mt-1 w-full text-center">{agentRatingsAndReviews?.reviews.length} reviews</div>
                </div>

            </div>
            </div>

            <div className="space-y-6">
            {agentRatingsAndReviews?.reviews?.map((review) => (
                <div key={review._id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                    {review.user.imageUrl ? (
                        <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <Image
                            src={review.user.imageUrl || "/placeholder.svg"}
                            alt={review.user.fname}
                            fill
                            className="object-cover"
                        />
                        </div>
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                        </div>
                    )}
                    <div>
                        <div className="flex items-center">
                        <h3 className="font-semibold text-gray-900">{review.user.fname} {review.user.lname}</h3>
                        {review.user.emailVerified && (
                            <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                            <Verified className="h-3 w-3 mr-1" />
                            Verified
                            </Badge>
                        )}
                        </div>
                        <div className="flex items-center mt-1">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.ratings ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                            />
                            ))}
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="text-sm text-gray-500">
                    <Clock className="h-4 w-4 inline-block mr-1" />
                    {formatDate(review._creationTime)}
                    </div>
                </div>

                {/* <div className="mt-3 flex gap-2">
                    {review.transactionType && (
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
                        {review.transactionType}
                    </Badge>
                    )}
                    {review.propertyType && (
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
                        {review.propertyType}
                    </Badge>
                    )}
                </div> */}

                <p className="mt-3 text-gray-700">{review.reviews}</p>

                <div className="mt-3 flex justify-end">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Helpful
                    </Button>
                </div>
                </div>
            ))}
            </div>

            {/* {agentRatingsAndReviews && agentRatingsAndReviews.reviews.length > 3 && (
            <div className="mt-6 text-center">
                <Button
                variant="outline"
                className="border-gray-300 text-gray-700"
                onClick={() => setShowAllTestimonials(!showAllTestimonials)}
                >
                {showAllTestimonials ? (
                    <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Show Less
                    </>
                ) : (
                    <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Show All Reviews
                    </>
                )}
                </Button>
            </div>
            )} */}
        </TabsContent>

        {/* Credentials Tab */}
        <TabsContent value="credentials" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                <CardTitle className="text-gray-900">Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                <ul className="space-y-3">
                    {agent.agentInfo?.certifications?.map((certification, index) => (
                    <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <div>
                        <p className="font-medium text-gray-900">{certification}</p>
                        </div>
                    </li>
                    ))}
                </ul>
                </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                <CardTitle className="text-gray-900">Awards & Recognition</CardTitle>
                </CardHeader>
                <CardContent>
                <ul className="space-y-3">
                    {agent.agentInfo?.awards?.map((award, index) => (
                    <li key={index} className="flex items-start">
                        <Award className="h-5 w-5 text-brand-orange mr-2 mt-0.5" />
                        <div>
                        <p className="font-medium text-gray-900">{award}</p>
                        </div>
                    </li>
                    ))}
                </ul>
                </CardContent>
            </Card>

            </div>
        </TabsContent>
    </Tabs>
  )
}

export default AgentContent