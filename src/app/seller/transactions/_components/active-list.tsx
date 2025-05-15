"use client";

import { EmptyState } from "@/components/empty-state";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn, formatDate, formatDateListed, formatPrice } from "@/lib/utils";
import useViewModal from "@/store/modals";
import { dealStatusColorMap, dealStatusDisplayMap } from "@/types/constants";
import { useQuery } from "convex/react";
import { FunctionReturnType } from "convex/server";
import { CheckIcon, EyeIcon } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { ViewRequestModal } from "./view-request-modal";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CancelDealSchema, CancelDealSchemaType } from "@/types/zod";
import { Id } from "../../../../../convex/_generated/dataModel";
import { DealStatus } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ViewActiveModal } from "./view-active-modal";

type GetPropertiesReturnType = FunctionReturnType<
  typeof api.property.getPropertyByAcceptedDeals
>;

type PropertyType = GetPropertiesReturnType[number];

export const ActiveList = () => {
  const [search, setSearch] = useState<string>("");
  const [selectedDeal, setSelectedDeal] = useState<PropertyType | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const activeDeals = useQuery(api.property.getPropertyByAcceptedDeals);
  const { toggleModal } = useViewModal();

  if (!activeDeals || activeDeals === undefined) return <div>Loading...</div>;

  const filteredActiveDeals = activeDeals.filter((r) => {
    // * 1.) Make it case insensitive
    const searchedTerm = search.toLowerCase();

    // * 2.) Return all if undefined or empty search value
    if (searchedTerm === "") return true;

    // * 3.) Filter by property name OR buyer full name
    const propertyName = r.property.propertyName
      .toLowerCase()
      .includes(searchedTerm);

    const buyerName = `${r.buyer.fname} ${r.buyer.lname}`
      .toLowerCase()
      .includes(searchedTerm);

    return propertyName || buyerName;
  });

  const handleView = (deal: (typeof activeDeals)[number]) => {
    setSelectedDeal(deal);

    if (deal) {
      toggleModal();
    }
  };

  const handleCancel = (deal: (typeof activeDeals)[number]) => {
    setSelectedDeal(deal);

    if (deal) {
      setIsOpen(true);
    }
  };

  return (
    <>
      <div className="mt-7">
        <Input
          className=""
          type="text"
          placeholder="Search by property name or buyer..."
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredActiveDeals.length === 0 ? (
          <EmptyState
            title="No active transactions at the moment"
            description="Consider checking your requests or post a property!"
          />
        ) : (
          <>
            <div className="bg-green-100 border border-green-300 rounded-md p-3 mt-7 text-green-700">
              <div className="flex flex-row gap-2">
                <CheckIcon className="w-6 h-6 " />
                <h1 className="font-semibold ">Active</h1>
              </div>
              <p className="text-sm ">Deals that are in progress</p>
            </div>
            {filteredActiveDeals.map((deal) => {
              const monthly = deal.proposal.offer / deal.proposal.duration!;

              return (
                <div
                  key={deal._id}
                  className="border border-gray-300 rounded-md p-4 mt-6"
                >
                  <div className="flex flex-row items-center gap-3">
                    <div className="w-[90px]">
                      <AspectRatio ratio={4 / 4}>
                        <Image
                          src={deal.property.displayImageUrl || "/next.svg"}
                          alt={deal.property.propertyName}
                          fill
                          className="rounded-md object-cover"
                        />
                      </AspectRatio>
                    </div>
                    <div>
                      <h1>{deal.property.propertyName}</h1>
                      <p className="text-muted-foreground text-sm">
                        Requested: {formatDateListed(deal.requestDate)}
                      </p>
                    </div>
                  </div>

                  <Separator className="mt-4 w-full" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="mt-3 flex flex-col">
                      <p className="text-zinc-700">Status</p>
                      <Badge
                        className={cn(
                          "w-fit rounded-full my-1",
                          dealStatusColorMap[deal.status]
                        )}
                      >
                        {dealStatusDisplayMap[deal.status]}
                      </Badge>
                      <p className="text-zinc-600 text-sm">
                        Approved:{" "}
                        {deal.approvalDate
                          ? formatDate(deal.approvalDate)
                          : "N/A"}
                      </p>
                      <p className="text-zinc-600 text-sm">
                        Move in date:{" "}
                        {deal.proposal.moveInDate
                          ? deal.proposal.moveInDate
                          : "N/A"}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-col">
                      <p className="text-zinc-700">Buyer</p>
                      <p className="text-lg font-semibold">
                        {deal.buyer.fname} {deal.buyer.lname}
                      </p>
                      <p className="text-zinc-600 text-sm">
                        {deal.buyer.email}
                      </p>
                      <p className="text-zinc-600 text-sm">
                        {deal.buyer.contact}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-col">
                      <p className="text-zinc-700">Deal Details</p>
                      <p className="text-lg font-semibold">
                        {deal.finalDealPrice
                          ? formatPrice(deal.finalDealPrice)
                          : "N/A"}
                      </p>
                      <div className="text-zinc-600 text-base">
                        {/* {deal.downPayment ? (
                          <p className="text-sm">
                            Down payment: {formatPrice(deal.downPayment)}/mo
                          </p>
                        ) : (
                          <p className="text-sm">
                            Down payment: {formatPrice(monthly)}/mo
                          </p>
                        )} */}
                        <p className="text-sm">
                          Agreed Monthly Term: {deal.agreedTermInMonths}
                        </p>
                        <p className="text-sm">
                          Down payment:{" "}
                          {deal.downPayment
                            ? formatPrice(deal.downPayment)
                            : "N/A"}
                        </p>
                        <p className="text-sm">
                          Monthly payment:{" "}
                          {deal.agreedMonthlyAmortization
                            ? formatPrice(deal.agreedMonthlyAmortization)
                            : "N/A"}
                          /mo
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h1 className="text-base font-semibold">Message:</h1>
                    <p className="text-zinc-600 text-sm">
                      {deal.proposal.message}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-5 max-w-[500px]">
                    {/* <Button variant="default">Accept</Button> */}
                    <Button
                      variant="outline"
                      className="hover:bg-zinc-100 hover:text-black"
                      onClick={() => handleView(deal)}
                    >
                      <EyeIcon className="w-5 h-5" />
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleCancel(deal)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {selectedDeal && (
        <ViewActiveModal
          requestDeal={selectedDeal}
          setSelectedDeal={setSelectedDeal}
        />
      )}

      <CancelFormDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        deal={selectedDeal}
        setSelectedAcceptDeal={setSelectedDeal}
      />
    </>
  );
};

const CancelFormDialog = ({
  isOpen,
  setIsOpen,
  deal,
  setSelectedAcceptDeal,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  deal: PropertyType | null;
  setSelectedAcceptDeal: Dispatch<SetStateAction<PropertyType | null>>;
}) => {
  const { mutate: updateDealStatus, isPending } = useMutation({
    mutationFn: useConvexMutation(api.deal.handleDealStatus),
    onSuccess: () => {
      form.reset();
      return toast.success("Cancelled");
    },
  });
  const [CancelDialog, confirmAccept] = useConfirm(
    "Are you sure?",
    `By confirming, you agree to cancel the deal. Continue?`
  );
  const form = useForm<CancelDealSchemaType>({
    resolver: zodResolver(CancelDealSchema),
    defaultValues: {
      remarks: "",
    },
  });

  const onSubmit = async (
    dealId: Id<"deal">,
    propertyId: Id<"property">,
    status: DealStatus,
    values: CancelDealSchemaType
  ) => {
    const confirmed = await confirmAccept();

    if (confirmed) {
      try {
        await updateDealStatus({
          dealId,
          propertyId,
          status,
          ...values,
        });
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const onOpenChange = () => {
    setIsOpen(false);
    setSelectedAcceptDeal(null);
    form.reset();
  };

  return (
    <>
      {deal ? (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Ongoing Deal</DialogTitle>
              <DialogDescription className="text-rose-500">
                Warning you are currently cancelling the deal:{" "}
                {deal.property.propertyName}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) =>
                  onSubmit(deal._id, deal.property._id, "cancelled", data)
                )}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex flex-row gap-2">
                        Remarks
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please give a reason why you are cancelling the ongoing deal."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" variant="default" disabled={isPending}>
                  {isPending ? "Accepting..." : "Accept"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent>Loading Deals...</DialogContent>
        </Dialog>
      )}

      <CancelDialog />
    </>
  );
};
