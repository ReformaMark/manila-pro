'use client'
import { AgentType } from '@/types/agents'
import { useQuery } from 'convex/react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { api } from '../../../../../../convex/_generated/api'
import { Id } from '../../../../../../convex/_generated/dataModel'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Flag, Mail, MapPin, MessageSquare, Phone, PhoneCall, Share2, Star } from 'lucide-react'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AgentBasicInfo from './agent-basic-info'
import AgentBioAndDetails from './agent-bio-details'
import AgentContactCard from './agent-contact-card'
import AgentContent from './agent-content'

function AgentComponent() {
    const params = useParams()
    const agentId = params.id as Id<'users'>
    const agent = useQuery(api.users.getAgentById, {id: agentId})
  
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        if (agent) {
            setIsLoading(false)
        } else {
            setIsLoading(true)
        }
    }, [agent])


    
  if (isLoading) {
    return (
      <div className="min-h-screen ">
        <div>
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-center items-center h-[60vh]">
              <div className="animate-pulse text-xl text-gray-900">Loading agent profile...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-brand-dark text-white">
       
        <div >
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Agent Not Found</h2>
              <p className="text-gray-500 mb-6">The agent you're looking for doesn't exist or has been removed.</p>
              <Link href="/agents">
                <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white">Browse All Agents</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className='min-h-screen container'>
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link href="/properties/agents" className="hover:text-brand-orange transition-colors">
              Agents
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{agent.fname} {agent.lname}</span>
          </div>

          {/* Agent Profile Header */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
             
         
               {agent && (
                <>
                {/* Left Column - Photo and Basic Info */}
                <AgentBasicInfo agent={agent}/>

                {/* Middle Column - Bio and Details */}
                <AgentBioAndDetails agent={agent}/>

                  {/* Right Column - Contact Card */}
                <AgentContactCard agent={agent}/>
                </>
              )}
            
             
            </div>
          </div>

          {/* Agent Content */}
          {agent && (
            <AgentContent agent={agent}/>
          )}
  
    </div>
  )
}

export default AgentComponent