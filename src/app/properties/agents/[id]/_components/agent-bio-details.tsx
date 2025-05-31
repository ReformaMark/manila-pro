import { Badge } from '@/components/ui/badge'
import { AgentType } from '@/lib/types'
import { useQuery } from 'convex/react'
import React from 'react'
import { api } from '../../../../../../convex/_generated/api'
import { MapPin } from 'lucide-react'

function AgentBioAndDetails({
    agent
}:{
    agent: AgentType
}) {
    const transactions = useQuery(api.deal.getTransactions,{agentId: agent._id})
    const activeListings = useQuery(api.property.getAgentActiveListings,{agentId: agent._id})
  return (
    <div className="md:w-2/4">
        <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{agent.fname} {agent.lname}</h1>
            <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>
        </div>
        <p className="text-lg text-gray-700">
            {agent.agentInfo?.title && agent.agentInfo?.agency
            ? `${agent.agentInfo.title} at ${agent.agentInfo.agency}`
            : <span className="italic text-gray-400">Agent hasn't added a title or agency yet.</span>
            }
        </p>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-500">Experience</p>
            <p className="text-xl font-bold text-gray-900">
                {agent.agentInfo?.experience && agent.agentInfo.experience > 0
                    ? `${agent.agentInfo.experience} years`
                    : <span className="italic text-gray-400">Not specified</span>
                }
            </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-500">Transactions</p>
            <p className="text-xl font-bold text-gray-900">{transactions?.length}+</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="text-sm text-gray-500">Active Listings</p>
            <p className="text-xl font-bold text-gray-900">{activeListings?.properties?.length}</p>
            </div>
        </div>

        <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900">About</h3>
            <p className="mt-2 text-gray-700">
                {agent.bio && agent.bio.trim().length > 0
                    ? agent.bio
                    : <span className="italic text-gray-400">Agent hasn't added a bio yet.</span>
                }
            </p>
        </div>

        <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900">Specializations</h3>
            <div className="mt-2 flex flex-wrap gap-2">
            {agent.agentInfo?.specializations && agent.agentInfo.specializations.length > 0 ? (
            agent.agentInfo.specializations.map((specialization) => (
                <Badge
                key={specialization}
                variant="outline"
                className="bg-gray-50 text-gray-700 border-gray-300"
                >
                {specialization}
                </Badge>
            ))
            ) : (
            <span className="italic text-gray-400">Agent hasn't added specializations yet.</span>
            )}
            </div>
        </div>

        <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900">Areas Served</h3>
            <div className="mt-2 flex flex-wrap gap-2">
            {agent.agentInfo?.areasServed && agent.agentInfo.areasServed.length > 0 ? (
            agent.agentInfo.areasServed.map((area) => (
                <Badge key={area} variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
                <MapPin className="h-3 w-3 mr-1" />
                {area}
                </Badge>
            ))
            ) : (
            <span className="italic text-gray-400">Agent hasn't added areas served yet.</span>
            )}
            </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
            <h3 className="text-lg font-semibold text-gray-900">Languages</h3>
            <div className="mt-2">
            {agent.agentInfo?.languages && agent.agentInfo.languages.length > 0 ? (
                <p className="text-gray-700">{agent.agentInfo.languages.join(", ")}</p>
            ) : (
                <span className="italic text-gray-400">Agent hasn't added languages yet.</span>
            )}
            </div>
            </div>
            <div>
            <h3 className="text-lg font-semibold text-gray-900">License</h3>
            <div className="mt-2">
            {agent.agentInfo?.licenseNumber && agent.agentInfo.licenseNumber.trim().length > 0 ? (
                <p className="text-gray-700">{agent.agentInfo.licenseNumber}</p>
            ) : (
                <span className="italic text-gray-400">Agent hasn't added license number yet.</span>
            )}
            </div>
            </div>
        </div>
    </div>
  )
}

export default AgentBioAndDetails