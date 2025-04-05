"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { FileCheck } from "lucide-react"
import { useState } from "react"
import { QuickProposalForm } from "./quick-proposal-form"
import { PropertyTypesWithImageUrls } from "@/lib/types"

interface QuickProposalDialogProps {
  property: PropertyTypesWithImageUrls
  agentId: string
  buttonText?: string
  buttonVariant?: "default" | "outline" | "ghost"
  buttonSize?: "default" | "sm" | "lg" | "icon"
  buttonClassName?: string
  fullWidth?: boolean
  icon?: boolean
}

export function QuickProposalDialog({
  property,
  agentId,
  buttonText = "Submit Proposal",
  buttonVariant = "default",
  buttonSize = "default",
  buttonClassName = "",
  fullWidth = false,
  icon = true,
}: QuickProposalDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant as any}
          size={buttonSize as any}
          className={`${buttonClassName} ${fullWidth ? "w-full" : ""}`}
        >
          {icon && <FileCheck className="h-4 w-4 mr-2" />}
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit Proposal for {property.propertyName}</DialogTitle>
          <DialogDescription>
            Fill out this form to submit your proposal for this property. The agent will review your offer and get back
            to you.
          </DialogDescription>
        </DialogHeader>
        <QuickProposalForm
          property={property}
          agentId={agentId}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

