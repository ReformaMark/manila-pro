"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useViewModal from "@/store/modals";
import { FunctionReturnType } from "convex/server";
import Image from "next/image";
import { api } from "../../../../../convex/_generated/api";
import { dealStatusColorMap, dealStatusDisplayMap } from "@/types/constants";
import { Dispatch, SetStateAction } from "react";
import { cn, formatDate, formatDateListed, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { useConfirm } from "@/hooks/use-confirm";
import { Id } from "../../../../../convex/_generated/dataModel";
import { DealStatus } from "@/lib/types";
import { toast } from "sonner";

type PropertyDeals = FunctionReturnType<
  typeof api.property.getPropertiesByRequestDeals
>;

type RequestDeal = PropertyDeals[number];

interface ViewActiveModalProps {
  requestDeal: RequestDeal;
  setSelectedDeal: Dispatch<SetStateAction<RequestDeal | null>>;
}

export const ViewActiveModal = ({
  requestDeal,
  setSelectedDeal,
}: ViewActiveModalProps) => {
  const { isOpen, toggleModal } = useViewModal();
  const { mutate: updateDealStatus, isPending } = useMutation({
    mutationFn: useConvexMutation(api.deal.handleDealStatus),
    onSuccess: () => {
      toast.success("Cancelled");
      setSelectedDeal(null);
    },
  });
  const [CancelDialog, confirmAccept] = useConfirm(
    "Are you sure?",
    `By confirming, you agree to cancel the deal. Continue?`
  );
  const deal = requestDeal;
  const monthly = deal.proposal.offer / deal.proposal.duration!;

  const onOpenChange = () => {
    toggleModal();
    setSelectedDeal(null);
  };

  const handleCancel = async (
    dealId: Id<"deal">,
    propertyId: Id<"property">,
    status: DealStatus
  ) => {
    const confirmed = await confirmAccept();

    if (status !== "cancelled") {
      return toast.error("Invalid action");
    }

    if (confirmed) {
      try {
        await updateDealStatus({
          dealId,
          propertyId,
          status,
        });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="rounded-lg overflow-y-auto max-w-4xl max-h-[700px]">
          <DialogHeader>
            <DialogTitle>Deal Details</DialogTitle>
            <DialogDescription>
              Complete information about this deal
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-center md:justify-start">
              {deal.property.displayImageUrl && (
                <div className="w-[350px] sm:w-[300px] md:w-[250px]">
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={deal.property.displayImageUrl}
                      alt={deal.property.propertyName}
                      className="rounded-md object-cover"
                      fill
                    />
                  </AspectRatio>
                </div>
              )}
              <div className="mt-2">
                <h1 className="text-lg font-semibold">
                  {deal.property.propertyName}
                </h1>
                <p className="text-sm text-zinc-600">
                  Posted at: {formatDate(deal.property.createdAt)}
                </p>
              </div>
            </div>

            <div className="col-span-2 space-y-3">
              <div className="text-base">
                <h1>Deal Status</h1>
                <Badge
                  className={cn("rounded-lg", dealStatusColorMap[deal.status])}
                >
                  {dealStatusDisplayMap[deal.status]}
                </Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div>
                  <p className="text-sm text-zinc-600">Buyer Information</p>
                  <h1 className="text-[17px]">
                    {deal.buyer.fname} {deal.buyer.lname}
                  </h1>
                  <p className="text-sm">{deal.buyer.email}</p>
                  <p className="text-sm">{deal.buyer.contact}</p>
                </div>

                <div>
                  <p className="text-sm text-zinc-600">Timeline</p>
                  <div className="text-sm">
                    <span className="font-semibold mr-1">Request:</span>{" "}
                    {formatDateListed(deal.requestDate)}
                  </div>

                  <div className="text-sm">
                    <span className="font-semibold mr-1">Approved:</span>{" "}
                    {deal.approvalDate ? formatDate(deal.approvalDate) : "N/A"}
                  </div>

                  <div className="text-sm">
                    <span className="font-semibold mr-1">Move-in-Date:</span>
                    {deal.proposal.moveInDate
                      ? deal.proposal.moveInDate
                      : "N/A"}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h1>Financial Details</h1>

                <div className="grid grid-cols-2">
                  <div>
                    <p className="text-sm mt-2">Original Price</p>
                    <h3 className="text-sm font-semibold">
                      {formatPrice(deal.property.totalSellingPrice)}
                    </h3>
                  </div>

                  <div>
                    <p className="text-sm mt-2">Final Deal Price</p>
                    <h3 className="text-lg font-semibold">
                      {deal.finalDealPrice
                        ? formatPrice(deal.finalDealPrice)
                        : "N/A"}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2">
                  <div>
                    <p className="text-sm mt-2">Down Payment</p>
                    <h3 className="text-sm font-semibold">
                      {deal.downPayment ? formatPrice(deal.downPayment) : "N/A"}
                    </h3>
                  </div>

                  <div>
                    <p className="text-sm mt-2">Monthly Payment</p>
                    <h3 className="text-lg font-semibold">
                      {deal.agreedMonthlyAmortization
                        ? formatPrice(deal.agreedMonthlyAmortization)
                        : "N/A"}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2">
                  <div>
                    <p className="text-sm mt-2">Agreed Monthly Term</p>
                    <h3 className="text-sm font-semibold">
                      {deal.agreedTermInMonths ? (
                        <div>{deal.agreedTermInMonths} months</div>
                      ) : (
                        "N/A"
                      )}
                    </h3>
                  </div>
                </div>
              </div>

              <Separator />

              {deal.proposal.message && (
                <div>
                  <p>Message from Buyer</p>
                  <div className="mt-1 bg-slate-200 p-3 rounded-lg text-sm">
                    {deal.proposal.message}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 w-full">
                {/* <Button
                  disabled={isPending}
                  onClick={() => {
                    handleAccept(deal._id, deal.property._id, "active");
                  }}
                >
                  Accept Offer
                </Button>
                <Button
                  variant="destructive"
                  disabled={isPending}
                  onClick={() =>
                    handleReject(deal._id, deal.property._id, "rejected")
                  }
                >
                  Reject
                </Button> */}
                <Button
                  variant="outline"
                  className="w-full hover:bg-zinc-100 hover:text-black"
                  onClick={onOpenChange}
                  disabled={isPending}
                >
                  Close
                </Button>

                <Button
                  variant="destructive"
                  onClick={() =>
                    handleCancel(deal._id, deal.propertyId, "cancelled")
                  }
                >
                  Cancel
                </Button>
                {/* <div className="w-full col-span-2">
                  <Button
                    variant="outline"
                    className="w-full hover:bg-zinc-100 hover:text-black"
                    onClick={onOpenChange}
                    disabled={isPending}
                  >
                    Close
                  </Button>
                </div> */}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CancelDialog />
    </>
  );
};
