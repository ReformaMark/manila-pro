"use client"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, CheckCircle, XCircle, MessageSquare, Home, Calendar, User, DollarSign, AlertCircle, FileText } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { formatPrice } from "@/lib/utils"
import { ProposalStatus } from "@/types/proposals"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

export default function ProposalDetailPage() {
  const router = useRouter()
  const params = useParams()
  const proposalId = params.id as Id<'deal'>
  const acceptCounterOffer = useMutation(api.deal.acceptCounterOffer)

  const proposal = useQuery(api.deal.getProposalById, {id:proposalId})
  
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

  const handleAcceptCounterOffer = (isAccepted: boolean) => {
    toast.promise(acceptCounterOffer({ id: proposalId, isAccepted: isAccepted }), {
      loading: "Accepting counter offer...",
      
      success: "Counter offer accepted!",
      error: (err) => `Error: ${err}`,
    })
  }

  if (!proposal || !proposal.property || !proposal.agent) {
    return (
      <div className="min-h-screen">
        <div >
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center mb-6">
              <Button variant="ghost" size="sm" className="mr-2 text-gray-700" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Proposal Details</h1>
            </div>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6 text-center">
                <p className="text-gray-700 mb-4">Proposal not found or has been removed.</p>
                <Button
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white"
                  onClick={() => router.push("/proposals")}
                >
                  View All Proposals
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" className="mr-2 text-gray-700" onClick={() => router.push("/proposals")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Proposals
            </Button>
            
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Proposal Details</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-gray-900">Proposal Summary</CardTitle>
                  <div className="flex items-center">
                    {getStatusIcon(proposal.status)}
                    <span className="ml-2">{getStatusBadge(proposal.status)}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{proposal.property.propertyName}</h3>
                      <p className="text-gray-700">{proposal.property.city}</p>

                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center text-sm font-medium text-gray-500">
                            <Home className="h-4 w-4 mr-1 text-brand-orange" />
                            Type
                          </div>
                          <p className="text-gray-900 capitalize">{proposal.property.transactionType}</p>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center text-sm font-medium text-gray-500">
                            <DollarSign className="h-4 w-4 mr-1 text-brand-orange" />
                            Offer
                          </div>
                          <p className="text-gray-900">
                            {formatPrice(proposal.proposal.offer)}{" "}
                            {proposal.property.transactionType === "buy" && ""}
                            {(proposal.property.transactionType === "rent" || proposal.property.transactionType === "lease") && "/month"}
                          </p>
                        </div>

                        {proposal.proposal.moveInDate && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center text-sm font-medium text-gray-500">
                              <Calendar className="h-4 w-4 mr-1 text-brand-orange" />
                              Move-in
                            </div>
                            <p className="text-gray-900">{format(new Date(proposal.proposal.moveInDate), "MMM d, yyyy")}</p>
                          </div>
                        )}

                        {proposal.proposal.duration && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center text-sm font-medium text-gray-500">
                              <Clock className="h-4 w-4 mr-1 text-brand-orange" />
                              Duration
                            </div>
                            <p className="text-gray-900">{proposal.proposal.duration} months</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Your Message</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{proposal.proposal.message}</p>
                      </div>
                    </div>
{/* 
                    {proposal.specialConditions && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Special Conditions</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700">{proposal.specialConditions}</p>
                        </div>
                      </div>
                    )} */}

                    {proposal.proposal.counterOffer && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Counter Offer</h3>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-medium text-gray-900">
                              New Price: {formatPrice(proposal.proposal.counterOffer.price)}
                              {(proposal.property.transactionType === "rent" || proposal.property.transactionType === "lease") && "/month"}
                            </p>
                            <Badge className="bg-blue-500 text-white">Counter Offer</Badge>
                          </div>
                          <p className="text-gray-700 mb-4">{proposal.proposal.counterOffer.message}</p>
                          <p className="text-sm text-gray-500 mb-4">
                            Received {formatDistanceToNow(proposal.proposal.counterOffer.createdAt, { addSuffix: true })}
                          </p>

                          {proposal.status === "negotiating" && (
                            <div className="flex gap-2">
                              <Button
                                className="bg-green-500 hover:bg-green-600 text-white"
                                onClick={() => handleAcceptCounterOffer(true)}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Accept Counter Offer
                              </Button>
                              <Button
                                variant="outline"
                                className="border-blue-500 text-blue-500 hover:bg-blue-50"
                                asChild
                              >
                                <Link href={`/messages?agent=${proposal.agent._id}`}>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Negotiate
                                </Link>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Timeline</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mt-0.5 mr-3">
                            <Clock className="h-4 w-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Proposal Submitted</p>
                            <p className="text-sm text-gray-500">
                              {format(proposal.createdAt, "PPP")} (
                              {formatDistanceToNow(proposal.proposal.createdAt, { addSuffix: true })})
                            </p>
                          </div>
                        </div>

                        {proposal.counterOffer && (
                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-3">
                              <MessageSquare className="h-4 w-4 text-blue-500" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Counter Offer Received</p>
                              <p className="text-sm text-gray-500">
                                {format(proposal.counterOffer.createdAt, "PPP")} (
                                {formatDistanceToNow(proposal.counterOffer.createdAt, { addSuffix: true })})
                              </p>
                            </div>
                          </div>
                        )}

                        {proposal.status === "accepted" && (
                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-3">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Proposal Accepted</p>
                              <p className="text-sm text-gray-500">
                                {format(proposal.updatedAt, "PPP")} (
                                {formatDistanceToNow(proposal.updatedAt, { addSuffix: true })})
                              </p>
                            </div>
                          </div>
                        )}

                        {proposal.status === "rejected" && (
                          <div className="flex items-start">
                            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mt-0.5 mr-3">
                              <XCircle className="h-4 w-4 text-red-500" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Proposal Rejected</p>
                              <p className="text-sm text-gray-500">
                                {format(proposal.updatedAt, "PPP")} (
                                {formatDistanceToNow(proposal.updatedAt, { addSuffix: true })})
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div> */}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border border-gray-200 shadow-sm mb-6">
                <CardHeader>
                  <CardTitle className="text-gray-900">Agent Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 mr-3 overflow-hidden">
                      <Avatar className="h-12 w-12 ">
                        <AvatarImage src={proposal.agent.imageUrl ?? undefined} alt="User" />
                        <AvatarFallback className="bg-gray-800 text-white uppercase">{proposal.agent.fname.charAt(1)} {proposal.agent?.lname.charAt(1)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{proposal.agent.fname} {proposal.agent.lname}</p>
                      <p className="text-sm text-gray-500">{proposal.agent.agentInfo?.title}</p>
                    </div>
                  </div>

                  <Separator className="bg-gray-200 my-4" />

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <User className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{proposal.agent.email}</span>
                    </div>

                    <div className="flex items-center text-gray-700">
                      <Home className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{proposal.agent.city}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <Button className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white" asChild>
                      <Link href={`/messages?agent=${proposal.agent._id}`}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message Agent
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      asChild
                    >
                      <Link href={`/properties/${proposal.property._id}`}>
                        <Home className="h-4 w-4 mr-2" />
                        View Property
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {proposal.status === "pending_approval" && (
                      <p className="text-gray-700">
                        Your proposal is currently under review by the agent. They will respond with an acceptance,
                        rejection, or counter offer soon.
                      </p>
                    )}

                    {proposal.status === "negotiating" && (
                      <p className="text-gray-700">
                        The agent has made a counter offer. You can accept it or continue negotiating via messages.
                      </p>
                    )}

                    {proposal.status === "approved" && (
                      <p className="text-gray-700">
                        Congratulations! Your proposal has been accepted. The agent will contact you to arrange the next
                        steps in the {proposal.property.transactionType === "buy" ? "purchase" : proposal.property.transactionType} process.
                      </p>
                    )}

                    {proposal.status === "rejected" && (
                      <p className="text-gray-700">
                        Unfortunately, your proposal was not accepted. You can contact the agent for more information or
                        browse other properties.
                      </p>
                    )}

                    {proposal.status === "completed" && (
                      <p className="text-gray-700">
                        This deal has been completed. The property is now{" "}
                        {proposal.property.transactionType === "buy" ? "owned" : proposal.property.transactionType === "rent" ? "rented" : "leased"} by you.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

