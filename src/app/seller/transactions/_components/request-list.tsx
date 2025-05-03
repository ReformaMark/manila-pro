"use client";

import { Input } from "@/components/ui/input";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { cn, formatDateListed, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { dealStatusColorMap, dealStatusDisplayMap } from "@/types/constants";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import useViewModal from "@/store/modals";
import { ViewRequestModal } from "./view-request-modal";
import { FunctionReturnType } from "convex/server";
import { EmptyState } from "@/components/empty-state";

type GetPropertiesReturnType = FunctionReturnType<
  typeof api.property.getPropertiesByRequestDeals
>;

type PropertyType = GetPropertiesReturnType[number];

export const RequestList = () => {
  const [search, setSearch] = useState<string>("");
  const { toggleModal } = useViewModal();
  const requestDeals = useQuery(api.property.getPropertiesByRequestDeals);
  const [selectedDeal, setSelectedDeal] = useState<PropertyType | null>(null);

  console.log("Selected Deal", selectedDeal);

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
            {filteredRequestDeals.map((deal) => {
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
                        {deal.downPayment ? (
                          <p>
                            Down payment: {formatPrice(deal.downPayment)}/mo
                          </p>
                        ) : (
                          <p>Down payment: {formatPrice(monthly)}/mo</p>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h1 className="text-base font-semibold">Message:</h1>
                    <p className="text-zinc-600">{deal.proposal.message}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <Button variant="default">Accept</Button>
                    <Button
                      variant="outline"
                      className="hover:bg-zinc-100 hover:text-black"
                      onClick={() => handleView(deal)}
                    >
                      <EyeIcon className="w-5 h-5" />
                      View
                    </Button>
                  </div>
                </div>
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
    </>
  );
};
