"use client"
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from 'convex/react'
import {
    Building,
    FileText,
    TrendingUp,
    UserCog
} from 'lucide-react'
import { api } from '../../../../convex/_generated/api'

export const AdminCards = () => {
    const counts = useQuery(api.users.getCounts)

    if (!counts) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="p-4">
                        <Skeleton className="h-20 w-full" />
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4">
                <div className="flex items-center gap-4">
                    <UserCog className="h-8 w-8 text-blue-500" />
                    <div>
                        <p className="text-sm text-gray-500">Total Users</p>
                        <p className="text-2xl font-bold">{counts.total}</p>
                        <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                            <span>Buyers: {counts.buyers}</span>
                            <span>•</span>
                            <span>Sellers: {counts.sellers}</span>
                            <span>•</span>
                            <span>Admins: {counts.admins}</span>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="p-4">
                <div className="flex items-center gap-4">
                    <Building className="h-8 w-8 text-green-500" />
                    <div>
                        <p className="text-sm text-gray-500">Properties Listed</p>
                        <p className="text-2xl font-bold">0</p>
                    </div>
                </div>
            </Card>

            <Card className="p-4">
                <div className="flex items-center gap-4">
                    <FileText className="h-8 w-8 text-yellow-500" />
                    <div>
                        <p className="text-sm text-gray-500">Transactions</p>
                        <p className="text-2xl font-bold">0</p>
                    </div>
                </div>
            </Card>

            <Card className="p-4">
                <div className="flex items-center gap-4">
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                    <div>
                        <p className="text-sm text-gray-500">Price Forecasts</p>
                        <p className="text-2xl font-bold">0</p>
                    </div>
                </div>
            </Card>
        </div>
    )
}