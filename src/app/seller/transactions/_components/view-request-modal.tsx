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

interface ViewRequestModalProps {
  requestDeal: RequestDeal;
  setSelectedDeal: Dispatch<SetStateAction<RequestDeal | null>>;
}

export const ViewRequestModal = ({
  requestDeal,
  setSelectedDeal,
}: ViewRequestModalProps) => {
  const { isOpen, toggleModal } = useViewModal();
  const { mutate: updateDealStatus, isPending } = useMutation({
    mutationFn: useConvexMutation(api.deal.handleDealStatus),
    onSuccess: () => toast.success("Success!"),
  });
  const [RejectDialog, confirmReject] = useConfirm(
    "Are you sure?",
    `By confirming, you agree to decline  the current request of ${requestDeal.buyer.fname} ${requestDeal.buyer.lname}`
  );
  const [AcceptDialog, confirmAccept] = useConfirm(
    "Are you sure?",
    `By confirming, you agree to accept the current request of ${requestDeal.buyer.fname} ${requestDeal.buyer.lname}`
  );
  const deal = requestDeal;
  const monthly = deal.proposal.offer / deal.proposal.duration!;

  const onOpenChange = () => {
    toggleModal();
    setSelectedDeal(null);
  };

  const handleReject = async (
    dealId: Id<"deal">,
    propertyId: Id<"property">,
    status: DealStatus
  ) => {
    const confirmed = await confirmReject();

    if (status !== "rejected") {
      toast.error("Invalid action");
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

  const handleAccept = async (
    dealId: Id<"deal">,
    propertyId: Id<"property">,
    status: DealStatus
  ) => {
    const confirmed = await confirmAccept();

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
                  <p className="text-sm">
                    <span className="font-semibold mr-1">Request:</span>{" "}
                    {formatDateListed(deal.requestDate)}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold mr-1">Move-in-Date:</span>
                    {deal.proposal.moveInDate
                      ? deal.proposal.moveInDate
                      : "N/A"}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h1>Financial Details</h1>

                <div className="grid grid-cols-2">
                  <div>
                    <p className="text-sm mt-2">Offer</p>
                    <h1 className="text-lg font-semibold">
                      {formatPrice(deal.proposal.offer)}
                    </h1>
                  </div>

                  <div>
                    {/* <p className="text-sm mt-2">Down payment:</p> */}
                    <h1 className="text-base">
                      {deal.agreedMonthlyAmortization ? (
                        <p>
                          Monthly Payment:{" "}
                          {formatPrice(deal.agreedMonthlyAmortization)}/mo
                        </p>
                      ) : (
                        <p>Monthly Payment: {formatPrice(monthly)}/mo</p>
                      )}
                    </h1>
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

              <div className="grid grid-cols-1 gap-3 w-full">
                {/* <Button
                  disabled={isPending}
                  onClick={() => {
                    handleAccept(deal._id, deal.property._id, "active");
                  }}
                >
                  Accept Offer
                </Button> */}
                <Button
                  variant="destructive"
                  disabled={isPending}
                  onClick={() =>
                    handleReject(deal._id, deal.property._id, "rejected")
                  }
                >
                  Reject
                </Button>
                <div className="w-full col-span-2">
                  <Button
                    variant="outline"
                    className="w-full hover:bg-zinc-100 hover:text-black"
                    onClick={onOpenChange}
                    disabled={isPending}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <RejectDialog />
      <AcceptDialog />
    </>
  );
};
