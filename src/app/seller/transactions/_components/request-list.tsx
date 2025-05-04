"use client";

import { Input } from "@/components/ui/input";
import { useQuery } from "convex/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import {
  cn,
  formatDateListed,
  formatPrice,
  formatPriceInput,
  parsePriceInput,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { dealStatusColorMap, dealStatusDisplayMap } from "@/types/constants";
import { Button } from "@/components/ui/button";
import { ClockIcon, EyeIcon } from "lucide-react";
import useViewModal from "@/store/modals";
import { ViewRequestModal } from "./view-request-modal";
import { FunctionReturnType } from "convex/server";
import { EmptyState } from "@/components/empty-state";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AcceptDealSchema, AcceptDealSchemaType } from "@/types/zod";

type GetPropertiesReturnType = FunctionReturnType<
  typeof api.property.getPropertiesByRequestDeals
>;

type PropertyType = GetPropertiesReturnType[number];

export const RequestList = () => {
  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { toggleModal } = useViewModal();
  const requestDeals = useQuery(api.property.getPropertiesByRequestDeals);
  const [selectedDeal, setSelectedDeal] = useState<PropertyType | null>(null);
  const [selectedAcceptDeal, setSelectedAcceptDeal] =
    useState<PropertyType | null>(null);

  if (!requestDeals || requestDeals === undefined) return <div>Loading...</div>;

  const filteredRequestDeals = requestDeals.filter((r) => {
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

  const handleView = (deal: (typeof requestDeals)[number]) => {
    setSelectedDeal(deal);

    if (deal) {
      toggleModal();
    }
  };

  const handleAccept = (deal: (typeof requestDeals)[number]) => {
    setIsOpen(true);
    setSelectedAcceptDeal(deal);
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

        {filteredRequestDeals.length === 0 ? (
          <EmptyState
            title="No requests at the moment"
            description="Post your properties now to get recognized!"
            actionLabel="Click Here"
            href={"/seller/properties"}
          />
        ) : (
          <>
            <div className="bg-amber-100 border border-amber-300 rounded-md p-3 mt-7 text-amber-700">
              <div className="flex flex-row gap-2">
                <ClockIcon className="w-6 h-6 " />
                <h1 className="font-semibold ">Pending Approval</h1>
              </div>
              <p className="text-sm ">New offers awaiting your response</p>
            </div>
            {filteredRequestDeals.map((deal) => {
              const monthly = deal.proposal.offer / deal.proposal.duration!;

              return (
                <>
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
                      </div>

                      <div className="mt-3 flex flex-col">
                        <p className="text-zinc-700">Buyer</p>
                        <p className="text-lg font-semibold">
                          {deal.buyer.fname} {deal.buyer.lname}
                        </p>
                        <p className="text-zinc-600 text-base">
                          {deal.buyer.email}
                        </p>
                        <p className="text-zinc-600 text-base">
                          {deal.buyer.contact}
                        </p>
                      </div>

                      <div className="mt-3 flex flex-col">
                        <p className="text-zinc-700">Offer Details</p>
                        <p className="text-lg font-semibold">
                          {formatPrice(deal.proposal.offer)}
                        </p>
                        <p className="text-zinc-600 text-base">
                          {deal.agreedMonthlyAmortization ? (
                            <p>
                              Monthly Payment:{" "}
                              {formatPrice(deal.agreedMonthlyAmortization)}/mo
                            </p>
                          ) : (
                            <p>Monthly Payment: {formatPrice(monthly)}/mo</p>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h1 className="text-base font-semibold">Message:</h1>
                      <p className="text-zinc-600">{deal.proposal.message}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-5">
                      <Button
                        variant="default"
                        disabled={isOpen}
                        onClick={() => handleAccept(deal)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        className="hover:bg-zinc-100 hover:text-black"
                        onClick={() => handleView(deal)}
                        disabled={isOpen}
                      >
                        <EyeIcon className="w-5 h-5" />
                        View
                      </Button>
                    </div>
                  </div>
                </>
              );
            })}
          </>
        )}
      </div>

      {selectedDeal && (
        <ViewRequestModal
          requestDeal={selectedDeal}
          setSelectedDeal={setSelectedDeal}
        />
      )}

      {/* <AcceptFormDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        dealId={deal._id}
        propertyId={deal.property._id}
        propertyName={deal.property.propertyName}
      /> */}

      <AcceptFormDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        deal={selectedAcceptDeal}
        setSelectedAcceptDeal={setSelectedAcceptDeal}
      />
    </>
  );
};

const AcceptFormDialog = ({
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
      ``;
      return toast.success("Success!");
    },
  });
  const [AcceptDialog, confirmAccept] = useConfirm(
    "Are you sure?",
    `By confirming, you agree to accept the request. Continue?`
  );
  const form = useForm<AcceptDealSchemaType>({
    resolver: zodResolver(AcceptDealSchema),
    defaultValues: {
      agreedTermInMonths: undefined,
      downPayment: undefined,
      finalDealPrice: undefined,
    },
  });

  if (!deal) return <div>Error: No deal found.</div>;

  const finalDealPriceValue = form.watch("finalDealPrice");
  const isActualNaN = Number.isNaN(finalDealPriceValue);
  const priceToFormat =
    finalDealPriceValue === undefined ||
    finalDealPriceValue === null ||
    isActualNaN
      ? 0
      : finalDealPriceValue;

  const formattedFinalDealPrice = formatPrice(priceToFormat);

  const downPaymentValue = form.watch("downPayment");
  const isDownPaymentActualNaN = Number.isNaN(downPaymentValue);
  const downPaymentToFormat =
    downPaymentValue === undefined ||
    downPaymentValue === null ||
    isDownPaymentActualNaN
      ? 0
      : downPaymentValue;
  const formattedDownPayment = formatPrice(downPaymentToFormat);

  const onSubmit = async (
    dealId: Id<"deal">,
    propertyId: Id<"property">,
    status: DealStatus,
    values: AcceptDealSchemaType
    // finalDealPrice: number,
    // downPayment: number,
    // agreedTermInMonths: number,
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
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Deal Offer</DialogTitle>
            <DialogDescription>
              Currently Dealing: {deal.property.propertyName}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) =>
                onSubmit(deal._id, deal.property._id, "active", data)
              )}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="finalDealPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex flex-row gap-2">
                      <p>Final Deal Price</p>
                      <p>{formattedFinalDealPrice}</p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        type="number"
                        {...field}
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      The final agreed price for the property.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreedTermInMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agreed Term (Months)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        type="number"
                        {...field}
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      The agreed payment term in months.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="downPayment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex flex-row gap-2">
                      <p>Down Payment</p>
                      <p>{formattedDownPayment}</p>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        type="number"
                        {...field}
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      The agreed down payment amount.
                    </FormDescription>
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

      <AcceptDialog />
    </>
  );
};
