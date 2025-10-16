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
import {
  CheckIcon,
  EyeIcon,
  FileText,
  Upload,
  CheckCircle2,
  MoreVertical,
  XCircle,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { ViewActiveModal } from "./view-active-modal";
import { ContractUpload } from "@/components/seller/contract-upload";
import { ContractList } from "@/components/seller/contract-list";

type GetPropertiesReturnType = FunctionReturnType<
  typeof api.property.getPropertyByAcceptedDeals
>;

type PropertyType = GetPropertiesReturnType[number];

export const ActiveList = () => {
  const [search, setSearch] = useState<string>("");
  const [selectedDeal, setSelectedDeal] = useState<PropertyType | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isContractListOpen, setIsContractListOpen] = useState<boolean>(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState<boolean>(false);
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

  const handleUploadContract = (deal: (typeof activeDeals)[number]) => {
    setSelectedDeal(deal);
    setIsUploadOpen(true);
  };

  const handleViewContracts = (deal: (typeof activeDeals)[number]) => {
    setSelectedDeal(deal);
    setIsContractListOpen(true);
  };

  const handleComplete = (deal: (typeof activeDeals)[number]) => {
    setSelectedDeal(deal);
    setIsCompleteOpen(true);
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
                  className="border border-gray-300 rounded-md p-4 mt-6 relative"
                >
                  {/* Contracts button in top-right corner */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewContracts(deal)}
                    className="absolute top-4 right-4"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Contracts
                  </Button>

                  <div className="flex flex-row items-center gap-3 pr-28">
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

                  <div className="flex gap-2 mt-5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(deal)}
                      className="flex-1"
                    >
                      <EyeIcon className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 flex-1"
                      onClick={() => handleComplete(deal)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Complete
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => handleUploadContract(deal)}
                          className="text-black"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Contract
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleCancel(deal)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel Deal
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

      {selectedDeal && (
        <ContractUpload
          dealId={selectedDeal._id}
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
        />
      )}

      {selectedDeal && (
        <ContractList
          dealId={selectedDeal._id}
          isOpen={isContractListOpen}
          onClose={() => setIsContractListOpen(false)}
        />
      )}

      {selectedDeal && (
        <CompleteDealDialog
          isOpen={isCompleteOpen}
          setIsOpen={setIsCompleteOpen}
          deal={selectedDeal}
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
      setIsOpen(false);
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
                  {isPending ? "Cancelling..." : "Confirm Cancel"}
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

const CompleteDealDialog = ({
  isOpen,
  setIsOpen,
  deal,
  setSelectedDeal,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  deal: PropertyType | null;
  setSelectedDeal: Dispatch<SetStateAction<PropertyType | null>>;
}) => {
  const { mutate: completeDeal, isPending } = useMutation({
    mutationFn: useConvexMutation(api.deal.markDealAsCompleted),
    onSuccess: () => {
      setIsOpen(false);
      form.reset();
      return toast.success("Deal marked as completed successfully!");
    },
  });

  const [CompleteDialog, confirmComplete] = useConfirm(
    "Complete Deal",
    `Are you sure you want to mark this deal as completed? The property will be marked as sold.`
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
    values: CancelDealSchemaType
  ) => {
    const confirmed = await confirmComplete();

    if (confirmed) {
      try {
        await completeDeal({
          dealId,
          propertyId,
          remarks: values.remarks,
        });
      } catch (error) {
        console.error("Error:", error);
        toast.error(
          error instanceof Error
            ? error.message.replace("Error: ", "")
            : "Failed to complete deal"
        );
      }
    }
  };

  const onOpenChange = () => {
    setIsOpen(false);
    setSelectedDeal(null);
    form.reset();
  };

  return (
    <>
      {deal ? (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete Deal</DialogTitle>
              <DialogDescription className="text-green-600">
                You are marking this deal as completed:{" "}
                <span className="font-semibold">
                  {deal.property.propertyName}
                </span>
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) =>
                  onSubmit(deal._id, deal.property._id, data)
                )}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Final Remarks (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any final notes or comments about the completed transaction..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This deal will be marked as completed and the property
                        will be set to sold.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onOpenChange}
                    disabled={isPending}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="default"
                    disabled={isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isPending ? "Completing..." : "Complete Deal"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent>Loading Deals...</DialogContent>
        </Dialog>
      )}

      <CompleteDialog />
    </>
  );
};
