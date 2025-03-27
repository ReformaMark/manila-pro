'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
interface AgentLoadingProps {
    number: number
}

function AgentLoading({number}: AgentLoadingProps) {
  return (
    <div className='contents'>
        {Array.from({ length: number }).map((_, index) => (
            <Card key={index} className='w-full h-fit'>
                <CardContent className='p-6 space-y-3'>
                    <div className="flex items-start gap-x-3  ">
                        <Skeleton className="size-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-5 w-40" />
                        </div>
                    </div>
                    <div className="">
                        <Skeleton className="h h-60 w-50" />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
  )
}

export default AgentLoading