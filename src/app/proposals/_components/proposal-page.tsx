"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, MessageSquare, ArrowRight, Plus } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { formatPrice } from "@/lib/utils"
import { ProposalStatus } from "@/types/proposals"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

export default function ProposalsPage() {
  const proposals = useQuery(api.deal.proposals)
  const [activeTab, setActiveTab] = useState<ProposalStatus | "all">("all")


  const getStatusBadge = (status: ProposalStatus) => {
    switch (status) {
      case "pending_approval":
        return <Badge className="bg-yellow-500 text-white">Pending Approval</Badge>
      case "approved":
        return <Badge className="bg-green-500 text-white">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-500 text-white">Rejected</Badge>
      case "negotiating":
        return <Badge className="bg-blue-500 text-white">Negotiating</Badge>
      case "active":
        return <Badge className="bg-gray-500 text-white">Active</Badge>
      case "completed":
        return <Badge className="bg-brand-orange text-white">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-gray-300 text-gray-700">Cancelled</Badge>
      default:
        return null
    }
  }

  const getStatusIcon = (status: ProposalStatus) => {
    switch (status) {
      case "pending_approval":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "negotiating":
        return <MessageSquare className="h-5 w-5 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-brand-orange" />
      case "active":
        return <FileText className="h-5 w-5 text-gray-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-gray-400" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const filteredProposals =
    activeTab === "all" ? proposals : proposals?.filter((proposal) => proposal.status === activeTab)

  return (
    <div className="min-h-screen ">
      <div >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Proposals</h1>

            <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white" asChild>
              <Link href="/properties">
                <Plus className="h-4 w-4 mr-2" />
                New Proposal
              </Link>
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ProposalStatus | "all")}>
            <TabsList className="bg-gray-100 text-gray-600 mb-6 flex flex-wrap gap-2 p-2 rounded-lg">
              <TabsTrigger
              value="all"
              className="data-[state=active]:bg-brand-orange data-[state=active]:text-white px-4 py-2 rounded-md"
              >
              All
              </TabsTrigger>
              <TabsTrigger
              value="pending_approval"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white px-4 py-2 rounded-md"
              >
              Pending Approval
              </TabsTrigger>
              <TabsTrigger
                value="negotiating"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white px-4 py-2 rounded-md"
              >
                Negotiating
              </TabsTrigger>
              <TabsTrigger
                value="approved"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white px-4 py-2 rounded-md"
              >
                Approved
              </TabsTrigger>
           
           
              <TabsTrigger
                value="rejected"
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white px-4 py-2 rounded-md"
              >
                Rejected
              </TabsTrigger>
             
              <TabsTrigger
                value="active"
                className="data-[state=active]:bg-gray-500 data-[state=active]:text-white px-4 py-2 rounded-md"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="data-[state=active]:bg-brand-orange data-[state=active]:text-white px-4 py-2 rounded-md"
              >
                Completed
              </TabsTrigger>
              <TabsTrigger
                value="cancelled"
                className="data-[state=active]:bg-gray-300 data-[state=active]:text-gray-700 px-4 py-2 rounded-md"
              >
                Cancelled
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {!filteredProposals ? <>Loading</> : filteredProposals?.length > 0 ? (
                <div className="space-y-4">
                  {filteredProposals.map((proposal) => {

                    if (!proposal.property || !proposal.agent) return null

                    return (
                      <Card key={proposal._id} className="border border-gray-200 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mt-1">
                                {getStatusIcon(proposal.status)}
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-gray-900">{proposal.property.propertyName}</h3>
                                  {getStatusBadge(proposal.status)}
                                </div>

                                <p className="text-sm text-gray-500 mb-1">
                                  <span className="capitalize">{proposal.property.transactionType}</span> proposal for{" "}
                                  {formatPrice(proposal.proposal.offer)}{" "}
                                  {proposal.property.transactionType === "buy" && ""}
                                  {(proposal.property.transactionType === "rent" || proposal.property.transactionType === "lease") && "/month"}
                                </p>

                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>Submitted {formatDistanceToNow(proposal._creationTime, { addSuffix: true })}</span>
                                </div>

                                {proposal.proposal.moveInDate && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Move-in date: {format(new Date(proposal.proposal.moveInDate), "PPP")}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
                              <div className="text-sm text-gray-700">Agent: {proposal.agent.fname} {proposal.agent.lname}</div>

                              <Link href={`/proposals/${proposal._id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-brand-orange text-brand-orange hover:bg-brand-orange/10"
                                >
                                  View Details
                                  <ArrowRight className="h-3 w-3 ml-1" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card className="border border-gray-200">
                  <CardContent className="p-6 text-center">
                    <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No proposals found</h3>
                    <p className="text-gray-500 mb-4">
                      {activeTab === "all"
                        ? "You haven't submitted any proposals yet."
                        : `You don't have any ${activeTab} proposals.`}
                    </p>
                    <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white" asChild>
                      <Link href="/properties">Browse Properties</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

