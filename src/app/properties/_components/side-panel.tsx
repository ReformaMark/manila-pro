'use client '
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PropertyTypesWithImageUrls } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { Badge, Grid, List, Search } from 'lucide-react'
import React from 'react'
import Image from 'next/image'
import { ScrollArea } from '@/components/ui/scroll-area'
import ManilaPro from "@/../public/images/manilaPro.png"
import { PropertyDetails } from './PropertyDetails'

export default function SidePanel({
    properties
}:{
    properties:PropertyTypesWithImageUrls[]
}) {

    const filteredProperties = properties.filter((property) => property.status === 'available')
  return (
    <div className="md:w-1/2 p-4 overflow-y-auto border-r">
        <div className="mb-4">
            <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search properties..." className="pl-10" />
            </div>
        </div>

        <Tabs defaultValue="list">
            <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Properties ({filteredProperties.length})</h2>
            <TabsList className="bg-transparent">
                <TabsTrigger value="list">
                <List className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="grid">
                <Grid className="h-4 w-4" />
                </TabsTrigger>
            </TabsList>
            </div>

            <TabsContent value="list" className="space-y-4 mt-0">
                <ScrollArea className="h-[75vh] pt-2 pb-5 px-2 bg-white shadow-sm rounded-md">
                    {filteredProperties.map((item) => (
                        <Card key={item._id} className="overflow-hidden">
                        <div className="flex">
                            <div className="w-24 h-24 relative">
                                <Image src={item.displayImageUrl || ManilaPro} alt={item.propertyName} width={100} height={100} className="w-full h-full object-cover" />
                                <div
                                className={`absolute top-2 left-2 text-xs text-white p-1 rounded
                                    ${
                                    item.transactionType === 'Buy'
                                        ? 'bg-emerald-600'
                                        : item.transactionType === 'Rent'
                                        ? 'bg-blue-600'
                                        : item.transactionType === 'Lease'
                                        ? 'bg-yellow-600'
                                        : 'bg-emerald-600'
                                    }
                                `}
                                >
                                {item.transactionType}
                                </div>
                            </div>
                            <CardContent className="p-3 flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                <h3 className="font-medium">{item.propertyName}</h3>
                                <p className="text-sm text-muted-foreground">{item.city}</p>
                                </div>
                                <p className="font-semibold text-emerald-600">{formatPrice(item.totalSellingPrice, item.transactionType ?? "")}</p>
                            </div>
                            <div className="flex items-center mt-2 text-xs text-muted-foreground">
                            <PropertyDetails property={item} />
                            </div>
                            </CardContent>
                        </div>
                        </Card>
                    ))}
               </ScrollArea>
            </TabsContent>

            <TabsContent value="grid" className=" mt-0 overflow-hidden ">
            <ScrollArea className="h-[76vh] pt-2 pb-5 px-2 bg-white shadow-sm rounded-md">
                <div className="grid grid-cols-2 gap-4">

             
                {filteredProperties.map((item) => (
                    <Card key={item._id} className="overflow-hidden h-80">
                    <div className="h-32 bg-muted relative">
                        <Image src={item.displayImageUrl || ManilaPro} blurDataURL={item.displayImageUrl ?? ""} alt={item.propertyName} fill placeholder='blur' className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2">
                        <div  
                            className={`absolute top-2 left-2 text-xs text-white p-1 rounded
                                ${
                                item.transactionType === 'Buy'
                                    ? 'bg-emerald-600'
                                    : item.transactionType === 'Rent'
                                    ? 'bg-blue-600'
                                    : item.transactionType === 'Lease'
                                    ? 'bg-yellow-600'
                                    : 'bg-emerald-600'
                                }
                            `}
                        >{item.transactionType}</div>
                        </div>
                    </div>
                    <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                        <h3 className="font-medium line-clamp-3">{item.propertyName}</h3>
                        <p className="font-semibold text-emerald-600">{formatPrice(item.totalSellingPrice, item.transactionType ?? "")}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.city}</p>
                        <div className="flex items-center mt-2 text-xs text-muted-foreground">
                            <PropertyDetails property={item} />
                        </div>
                    </CardContent>
                    </Card>
                ))}
                </div>
            </ScrollArea>
            </TabsContent>
        </Tabs>
    </div>
  )
}