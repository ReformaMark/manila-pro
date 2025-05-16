'use client'
import React from 'react'
import {motion} from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { RatingStars } from '@/components/rating-stars'
import { MapPin, MessageSquare, Phone, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Loading from '@/components/loading'
import { Agent } from '@/lib/types'
import AgentLoading from './agent-loading'

interface AgentListProps {
    results: Agent[];
    status: "CanLoadMore" | "LoadingMore" | "LoadingFirstPage" | "Exhausted";
    handleReset: () => void;
    loadMore: (numItems: number) => void;
}

function AgentList({
    results,
    status,
    handleReset,
    loadMore
}: AgentListProps) {
  return (
    <div className='contents'>
        
          <div className="mb-6">
            <p className="text-gray-700">
            Found <span className="font-semibold">{results.length}</span> 
            {status === "CanLoadMore" ? "+" : ""} agents matching your criteria
            </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {status === "LoadingFirstPage" && (
            <AgentLoading number={10}/>
        )}
          {results.map((agent) => (
            <motion.div
              key={agent._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border border-gray-200 shadow-sm h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="size-2o ">
                      <AvatarImage src={agent.imageUrl} alt="Agent Image" />
                      <AvatarFallback className="bg-gray-800 text-white uppercase">{agent?.fname.charAt(1)} {agent?.lname.charAt(1)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Link href={`/properties/agents/${agent._id}`} className="hover:text-brand-orange">
                        <h3 className="font-semibold text-gray-900 capitalize">{agent?.fname} {agent?.lname}</h3>
                      </Link>
                      <p className="text-sm text-gray-500">{agent.agentInfo?.title ?? "No title"}</p>
                      <p className="text-sm text-gray-500">{agent.agentInfo?.agency ?? "No agency"}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex ">
                          <RatingStars edit={false} size={30} average={agent.rating}/>
                        </div>
                        <span className="text-xs text-gray-500 ml-1">({agent.reviews})</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{agent.city}</span>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-700 line-clamp-2">{agent.agentInfo?.bio ?? "This agent has not added a bio yet."}</p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {agent.agentInfo?.specializations.slice(0, 2).map((specialization: string) => (
                      <Badge
                        key={specialization}
                        variant="outline"
                        className="bg-gray-50 text-gray-700 border-gray-300"
                      >
                        {specialization}
                      </Badge>
                    ))}
                    {agent.agentInfo && agent.agentInfo.specializations?.length > 2 && (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
                        +{(agent.agentInfo?.specializations?.length ?? 0) - 2} more
                      </Badge>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">{agent.agentInfo?.experience ?? 0} yrs</p>
                      <p className="text-gray-500">Experience</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">{agent.transactions}+</p>
                      <p className="text-gray-500">Deals</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">{agent.agentInfo?.languages.length ?? "No language added"}</p>
                      <p className="text-gray-500">Languages</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button className="flex-1 bg-brand-orange hover:bg-brand-orange/90 text-white">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
         
        </div>

        {/* No Results */}
        {results.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2 text-gray-900">No agents found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filters to see more results</p>
            <Button
              onClick={handleReset}
              className="bg-brand-orange hover:bg-brand-orange/90 text-white"
            >
              Reset Filters
            </Button>
          </div>
        )}

        {status === "LoadingMore" ?
            <Loading/>
         : status === "CanLoadMore" && (
        <div className="mt-8 text-center">
            <Button
            onClick={() => loadMore(10)}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
            Load More Agents
            </Button>
        </div>
        )}

        {/* Become an Agent */}
        <div className="mt-12">
          <Card className="border border-gray-200 shadow-sm bg-gray-50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="md:w-2/3">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Are you a real estate professional?</h3>
                  <p className="text-gray-700">
                    Join our platform to connect with potential clients and grow your business. Our tools help you
                    showcase your expertise and manage your listings effectively.
                  </p>
                </div>
                <div className="md:w-1/3 flex justify-center md:justify-end">
                  <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white">Become an Agent</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  )
}

export default AgentList