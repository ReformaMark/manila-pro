"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import { PropertyTypesWithImageUrls } from "@/lib/types"
import { ProposalType } from "@/types/proposals"
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"
import { toast } from "sonner"

interface QuickProposalFormProps {
  property: PropertyTypesWithImageUrls
  agentId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function QuickProposalForm({ property, agentId, onSuccess, onCancel }: QuickProposalFormProps) {
  const router = useRouter()
  const createProposal = useMutation(api.deal.createProposal)

  const [formData, setFormData] = useState({
    duration: 120,
    price: property.totalSellingPrice || 0,
    message: "",
    moveInDate: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? 0 : Number(value),
    }))
  }

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value as ProposalType,
    }))
  } 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    toast.promise(createProposal({
      propertyId: property._id,
      agentId: agentId as Id<'users'>,
      price: formData.price,
      message: formData.message,
      duration: formData.duration,
      moveInDate: formData.moveInDate,
    }),{
      loading: "Submitting proposal...",
      success: () => { 
        router.push("/proposals")
      
        return "Proposal submited."},
      error: "Error submitting proposal."
    }
    
  )

    if (onSuccess) {
      onSuccess()
    } else {
      router.push("/proposals")
    }
  }

  const handleAdvancedProposal = () => {
    router.push(`/proposals/new?propertyId=${property._id}&agentId=${agentId}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="duration" className="text-gray-700">
          Duration (in months)
        </Label>
        <Input
          id="duration"
          name="duration"
          type="number"
          value={formData.duration}
          onChange={handleNumberChange}
          className="bg-white border-gray-300 text-gray-900"
          required
        />
        <p className="text-sm text-gray-500">
          Specify the duration for the proposal.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price" className="text-gray-700">
          {property.transactionType === "buy" ? "Offer Price" : "Monthly Payment Offer"}
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₱</span>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleNumberChange}
            className="pl-8 bg-white border-gray-300 text-gray-900"
            required
          />
        </div>
        <p className="text-sm text-gray-500">
          {property.transactionType?.toLowerCase() === "buy"
            ? "Listed price: " + formatPrice(property.totalSellingPrice) + " (one-time payment)"
            : "Listed price: " + formatPrice(property.totalSellingPrice) + "/month"}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-gray-700">
          Message to Agent
        </Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Introduce yourself and explain why you're interested in this property..."
          className="bg-white border-gray-300 text-gray-900 min-h-[100px]"
          required
        />
      </div>

      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel || handleAdvancedProposal}
          className="border-gray-300 text-gray-700"
        >
          {onCancel ? "Cancel" : "Advanced Options"}
        </Button>
        <Button type="submit" className="bg-brand-orange hover:bg-brand-orange/90 text-white">
          Submit Proposal
        </Button>
      </div>
    </form>
  )
}

