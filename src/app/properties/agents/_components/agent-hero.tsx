import React from 'react'
import AgentHeroBg from "@/../public/images/agent.jpg"
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

interface AgentHeroProps {
    searchTerm: string;
    onChange: (key: string, value: any) => void;
    onSearch: () => void;
}   

function AgentHero({searchTerm, onChange, onSearch}: AgentHeroProps) {
  return (
    <div className="relative rounded-xl overflow-hidden mb-8">
    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10"></div>
    <div className="relative h-64">
      <Image
        src={AgentHeroBg}
        alt="Find Agents"
        className="w-full h-full object-cover"
      />
    </div>
    <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-12">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Find Your Perfect Real Estate Agent</h1>
      <p className="text-lg text-white/90 max-w-2xl mb-6">
        Connect with experienced professionals who can help you navigate the Manila real estate market.
      </p>

      <div className="bg-white rounded-lg p-4 max-w-3xl">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Search by name, specialization, or location..."
              value={searchTerm}
              onChange={(e) => onChange("searchTerm", e.target.value)}
              className="pl-10 bg-white border-gray-300 text-gray-900"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
          <Button  onClick={onSearch} className="bg-brand-orange hover:bg-brand-orange/90 text-white">Find Agents</Button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default AgentHero