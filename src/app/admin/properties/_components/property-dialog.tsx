import { BadgeStatus } from "@/components/badge-status"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatPrice } from "@/lib/utils"
import { Doc } from "../../../../../convex/_generated/dataModel";

interface PropertyDialogProps {
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
    data: Doc<"property">;
}

export const PropertyDialog = ({
    showModal,
    setShowModal,
    data,
}: PropertyDialogProps) => {
    return (
        <Dialog
            open={showModal}
            onOpenChange={setShowModal}
        >
            <DialogContent
                className="p-0 border-none bg-[#F6F6F6]"
            >
                <DialogHeader
                    className="bg-bg1 p-4 rounded-tl-lg rounded-tr-lg"
                >
                    <DialogTitle
                        className="flex items-center gap-2 text-white justify-between px-8"
                    >
                        Block {data.block} Lot {data.lot}

                        <BadgeStatus status={data.status} />
                    </DialogTitle>
                    {/* <DialogDescription
                        className="text-white px-8"
                    >
                        Lot ID: {data.lotId}
                    </DialogDescription> */}
                </DialogHeader>

                <div className="px-4 pb-4">
                    <div className="grid grid-cols-2 gap-[1px] bg-gray-200 rounded-lg overflow-hidden font-semibold border border-lightGray">
                        <div className="bg-[#EDEDED] text-gray p-2">LOT AREA (SQM)</div>
                        <div className="bg-white p-2 text-center">{data.lotArea}</div>

                        <div className="bg-[#EDEDED] text-gray p-2">PRICE PER SQM</div>
                        <div className="bg-white p-2 text-center">{formatPrice(data.pricePerSqm)}</div>

                        <div className="bg-[#EDEDED] text-gray p-2">TOTAL CONTRACT PRICE</div>
                        <div className="bg-white p-2 text-center">
                            {formatPrice(data.totalContractPrice)}
                        </div>

                        {/* <div className="bg-[#EDEDED] text-gray p-2">MISCELLANEOUS FEE</div>
                        <div className="bg-white p-2 text-center">
                            {formatPrice(data.miscellaneousFee.toFixed(2))}
                            0.00
                        </div> */}

                        <div className="bg-[#EDEDED] text-gray p-2">NET CONTRACT PRICE</div>
                        <div className="bg-white p-2 text-center">
                            {formatPrice(data.netContractPrice)}
                        </div>

                        <div className="bg-[#EDEDED] text-gray p-2">TOTAL SELLING PRICE</div>
                        <div className="bg-white p-2 text-center">{formatPrice(data.totalSellingPrice)}</div>

                        <div className="bg-[#EDEDED] text-gray p-2">MONTHLY AMORT</div>
                        <div className="bg-white p-2 text-center">{formatPrice(data.suggestedMonthlyAmortization)}</div>

                        <div className="bg-[#EDEDED] text-gray p-2">TERM</div>
                        <div className="bg-white p-2 text-center">
                            {data.suggestedTermInMonths} months
                        </div>
                    </div>
                </div>

                {(data.status === "sold") && (
                    <div className="px-4 pb-4">
                        <div className="grid grid-cols-2 gap-[1px] bg-gray-200 rounded-lg overflow-hidden font-semibold border border-lightGray">
                            <div className="bg-[#EDEDED] text-gray p-2">BUYER&apos;S NAME</div>
                            <div className="bg-white p-2 text-center">Ria Francisco</div>

                            <div className="bg-[#EDEDED] text-gray p-2">SELLER&apos;S NAME</div>
                            <div className="bg-white p-2 text-center">Jinky Gonzaga</div>

                            <div className="bg-[#EDEDED] text-gray p-2">REALTY</div>
                            <div className="bg-white p-2 text-center">ZONAL</div>

                            <div className="bg-[#EDEDED] text-gray p-2">BROKER</div>
                            <div className="bg-white p-2 text-center">Jomar Aquino</div>

                            <div className="bg-[#EDEDED] text-gray p-2">DUE DATE</div>
                            <div className="bg-white p-2 text-center">Every 15th</div>

                            <div className="bg-[#EDEDED] text-gray p-2">FIRST DUE</div>
                            <div className="bg-white p-2 text-center">February 2022</div>

                            <div className="bg-[#EDEDED] text-gray p-2">2ND MA - 60TH MA</div>
                            {/* <div
                                className={`p-2 text-center ${data.status === "due" ? "bg-[#FCE6E8]" : "bg-white"}`}
                            >
                                4,500.00
                            </div> */}
                        </div>
                    </div>
                )}

                {data.status === "reserved" && (
                    <div className="px-4 pb-4">
                        <div className="grid grid-cols-2 gap-[1px] bg-gray-200 rounded-lg overflow-hidden font-semibold border border-lightGray">
                            <div className="bg-[#EDEDED] text-gray p-2">CLIENT</div>
                            <div className="bg-white p-2 text-center">Ria Francisco</div>

                            <div className="bg-[#EDEDED] text-gray p-2">SELLER&apos;S NAME</div>
                            <div className="bg-white p-2 text-center">Jinky Gonzaga</div>

                            <div className="bg-[#EDEDED] text-gray p-2">REALTY</div>
                            <div className="bg-white p-2 text-center">ZONAL</div>

                            <div className="bg-[#EDEDED] text-gray p-2">DATE RESERVED</div>
                            <div className="bg-white p-2 text-center">12/26/2025</div>

                            <div className="bg-[#EDEDED] text-gray p-2">RESERVATION EXPIRY</div>
                            <div className="bg-white p-2 text-center">12/28/2025</div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}