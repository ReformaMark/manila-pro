export type ProposalStatus = "pending_approval" | "approved" | "rejected" | "negotiating" | "active" | "completed" | "cancelled"

export type ProposalType = "buy" | "rent" | "lease"

export interface Proposal {
  id: string
  propertyId: string
  userId: string
  agentId: string
  type: ProposalType
  price: number
  status: ProposalStatus
  message: string
  createdAt: number
  updatedAt: number
  moveInDate?: string
  duration?: number // in months, for rent/lease
  specialConditions?: string
  counterOffer?: {
    price: number
    message: string
    createdAt: number
  }
}

