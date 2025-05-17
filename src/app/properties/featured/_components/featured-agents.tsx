'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useQuery } from 'convex/react'
import { ArrowRight, Router } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { api } from '../../../../../convex/_generated/api'
import { RatingStars } from '@/components/rating-stars'
import { useRouter } from 'next/navigation'
import CallDialog from '../../agents/_components/call-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

function FeaturedAgents() {
  const  agents = useQuery(api.users.featuredAgents)
  const router = useRouter()
  return (
    <div className="mt-12" >
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold text-gray-900">Our Featured Agents</h2>
      <Link href={'/properties/agents'} className='contents'>
        <Button variant="link" className="text-brand-orange hover:text-brand-orange/80 p-0">
          View All Agents <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </Link>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {agents?.map((agent) => (
        <Card key={agent._id} className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-full">
                 <Avatar>
                    <AvatarImage src={agent.imageUrl ?? undefined} alt={agent.lname} />
                    <AvatarFallback className="bg-brand-orange text-white">
                        {agent.fname?.charAt(0)} 
                        {agent.lname?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{agent.fname} {agent.lname}</h3>
                <p className="text-sm text-gray-500">{agent.agentInfo?.title}</p>
                <div className="flex items-center mt-1">
                  <RatingStars size={20} edit={false} average={agent.rating}/>
                  <span className="text-xs text-gray-500 ml-1">(({agent.reviews}) reviews)</span>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2  gap-x-10">
              <Button
                onClick={() =>router.push(`/properties/agents/${agent._id}`)}
                variant="default"
                className=""
              >
                Profile
              </Button>
              <CallDialog agent={agent}/>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
  )
}

export default FeaturedAgents