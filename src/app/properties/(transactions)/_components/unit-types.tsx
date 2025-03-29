import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Building, DollarSign, Home } from 'lucide-react'
import React from 'react'



interface UnitTypesProps {
    apartment: number;
    condominium: number;
    singleAttachedHouse: number;
    singleDetachedHouse: number;
    townhouse: number;
    duplex: number;
}

function UnitTypes({
    apartment,
    condominium,
    duplex,
    singleAttachedHouse,
    singleDetachedHouse,
    townhouse
}: UnitTypesProps) {
    const propertyTypes = [
        { name: "Apartment", icon: Home, count: `${apartment}` },
        { name: "Condominium", icon: Building, count: `${condominium}` },
        { name: "Duplex", icon: Home,  count: `${duplex}` },
        { name: "Single Attached House", icon: Home, count: `${singleAttachedHouse}` },
        { name: "Single Detached House", icon: Home, count: `${singleDetachedHouse}` },
        { name: "Townhouse/detached Row House", icon: Home, count: `${townhouse}` },
    ]
  return (
    <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Browse by Property Type</h2>
       
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {propertyTypes.map((type) => (
            <Card
            key={type.name}
            className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => {}}
            >
            <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 bg-brand-orange/10 rounded-full flex items-center justify-center mb-4">
                <type.icon className="h-6 w-6 text-brand-orange" />
                </div>
                <h3 className="font-semibold text-gray-900">{type.name}</h3>
                <p className="text-sm text-gray-500">{type.count} Properties</p>
            </CardContent>
            </Card>
        ))}
        </div>
    </div>
  )
}

export default UnitTypes