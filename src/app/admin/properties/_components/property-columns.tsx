"use client"

import { BadgeStatus } from "@/components/badge-status";
import { formatPrice } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Doc } from "../../../../../convex/_generated/dataModel";

export const PropertyColumns: ColumnDef<Doc<"property">>[] = [
    // {
    //     id: "select",
    //     header: ({ table }) => (
    //         <Checkbox
    //             checked={table.getIsAllPageRowsSelected()}
    //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //             aria-label="Select all"
    //         />
    //     ),
    //     cell: ({ row }) => (
    //         <Checkbox
    //             checked={row.getIsSelected()}
    //             onCheckedChange={(value) => row.toggleSelected(!!value)}
    //             aria-label="Select row"
    //         />
    //     ),
    //     enableSorting: false,
    //     enableHiding: false,
    // },
    {
        accessorKey: "lotId",
        header: () => <div className="text-center">LOT ID NO.</div>,
        cell: ({ row }) => {
            return (
                <p>
                    {row.original.lotId}
                </p>
            )
        }
    },
    {
        accessorKey: "block",
        header: () => <div className="text-center">BLOCK</div>,
        cell: ({ row }) => {
            return (
                <p>
                    {row.original.block}
                </p>
            )
        }
    },
    {
        accessorKey: "lot",
        header: () => <div className="text-center">LOT</div>,
        cell: ({ row }) => {
            return (
                <p>
                    {row.original.lot}
                </p>
            )
        }
    },
    {
        accessorKey: "lotArea",
        header: () => <div className="text-center">LOT AREA</div>,
        cell: ({ row }) => {
            return (
                <p>
                    {row.original.lotArea.toFixed(2)}
                </p>
            )
        }
    },
    {
        accessorKey: "pricePerSqm",
        header: () => <div className="text-center">PRICE PER SQM</div>,
        cell: ({ row }) => {
            return (
                <p>
                    {formatPrice(row.original.pricePerSqm.toFixed(2))}
                </p>
            )
        }
    },
    {
        accessorKey: "totalSellingPrice",
        header: () => <div className="text-center">TOTAL SELLING PRICE</div>,
        cell: ({ row }) => {
            return (
                <p>
                    {formatPrice(row.original.totalSellingPrice.toFixed(2))}
                </p>
            )
        }
    },
    {
        accessorKey: "monthlyAmortization",
        header: () => <div className="text-center">MONTHLY AMORT</div>,
        cell: ({ row }) => {
            return (
                <p>
                    {formatPrice(row.original.monthlyAmortization.toFixed(2))}
                </p>
            )
        }
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">STATUS</div>,
        cell: ({ row }) => {
            const status = row.original.status

            return (
                <BadgeStatus status={status} />
            )
        }
    },
    // {
    //     accessorKey: "actions",
    //     header: () => <div className="text-center">ACTION</div>,
    //     cell: function Cell({ row }) {
    //         const [showModal, setShowModal] = useState(false)
    //         const [showEditModal, setShowEditModal] = useState(false)

    //         const [DeleteConfirmDialog, confirmDelete] = useConfirm(
    //             "Delete property",
    //             "Are you sure you want to delete this property? This action cannot be undone."
    //         )


    //         const data = row.original
    //         const project = useQuery(api.projects.getById,
    //             data.projectId ? { id: data.projectId } : "skip"
    //         );

    //         const remove = useMutation(api.property.remove)

    //         const handleDelete = async () => {
    //             const confirmed = await confirmDelete()

    //             if (confirmed) {
    //                 try {
    //                     await remove({
    //                         id: data._id
    //                     })
    //                     toast.success("Project deleted successfully")
    //                 } catch (error) {
    //                     toast.error("Failed to delete property")
    //                     console.error(error)
    //                 }
    //             }
    //         }

    //         return (
    //             <>
    //                 <div className="flex items-center justify-center gap-2">
    //                     <Button
    //                         variant="ghost"
    //                         size="icon"
    //                         className="h-8 w-8 p-0"
    //                         onClick={() => setShowModal(true)}
    //                     >
    //                         <Eye className="h-8 w-8" />
    //                     </Button>

    //                     <Button
    //                         variant="ghost"
    //                         size="icon"
    //                         className="h-8 w-8 p-0"
    //                         onClick={() => setShowEditModal(true)}
    //                     >
    //                         <Pencil className="h-8 w-8" />
    //                     </Button>

    //                     <Button
    //                         variant="ghost"
    //                         size="icon"
    //                         className="h-8 w-8 p-0 text-red-600"
    //                         onClick={handleDelete}
    //                     >
    //                         <Trash2 className="h-8 w-8" />
    //                     </Button>
    //                 </div>

    //                 <Dialog
    //                     open={showModal}
    //                     onOpenChange={setShowModal}
    //                 >
    //                     <DialogContent
    //                         className="p-0 border-none bg-[#F6F6F6]"
    //                     >
    //                         <DialogHeader
    //                             className="bg-dark p-4 rounded-tl-lg rounded-tr-lg"
    //                         >
    //                             <DialogTitle
    //                                 className="flex items-center gap-2 text-white justify-between px-8"
    //                             >
    //                                 Block {data.block} Lot {data.lot}

    //                                 <BadgeStatus status={data.status} />
    //                             </DialogTitle>
    //                             <DialogDescription
    //                                 className="text-lightGray px-8"
    //                             >
    //                                 Lot ID: {data.lotId}
    //                             </DialogDescription>
    //                         </DialogHeader>

    //                         <div className="px-4 pb-4">
    //                             <div className="grid grid-cols-2 gap-[1px] bg-gray-200 rounded-lg overflow-hidden font-semibold border border-lightGray">
    //                                 <div className="bg-[#EDEDED] text-gray p-2">LOT AREA (SQM)</div>
    //                                 <div className="bg-white p-2 text-center">{data.lotArea}</div>

    //                                 <div className="bg-[#EDEDED] text-gray p-2">PRICE PER SQM</div>
    //                                 <div className="bg-white p-2 text-center">{formatPrice(data.pricePerSqm.toFixed(2))}</div>

    //                                 <div className="bg-[#EDEDED] text-gray p-2">TOTAL CONTRACT PRICE</div>
    //                                 <div className="bg-white p-2 text-center">
    //                                     {formatPrice(data.totalContractPrice.toFixed(2))}
    //                                 </div>

    //                                 <div className="bg-[#EDEDED] text-gray p-2">MISCELLANEOUS FEE</div>
    //                                 <div className="bg-white p-2 text-center">
    //                                     {/* {formatPrice(data.miscellaneousFee.toFixed(2))} */}
    //                                     0.00
    //                                 </div>

    //                                 <div className="bg-[#EDEDED] text-gray p-2">NET CONTRACT PRICE</div>
    //                                 <div className="bg-white p-2 text-center">
    //                                     {formatPrice(data.netContractPrice.toFixed(2))}
    //                                 </div>

    //                                 <div className="bg-[#EDEDED] text-gray p-2">TOTAL SELLING PRICE</div>
    //                                 <div className="bg-white p-2 text-center">{formatPrice(data.totalSellingPrice.toFixed(2))}</div>

    //                                 <div className="bg-[#EDEDED] text-gray p-2">MONTHLY AMORT</div>
    //                                 <div className="bg-white p-2 text-center">{formatPrice(data.monthlyAmortization.toFixed(2))}</div>

    //                                 <div className="bg-[#EDEDED] text-gray p-2">TERM</div>
    //                                 <div className="bg-white p-2 text-center">
    //                                     {data.term} months
    //                                 </div>
    //                             </div>
    //                         </div>

    //                         {(data.status === "sold" || data.status === "due") && (
    //                             <div className="px-4 pb-4">
    //                                 <div className="grid grid-cols-2 gap-[1px] bg-gray-200 rounded-lg overflow-hidden font-semibold border border-lightGray">
    //                                     <div className="bg-[#EDEDED] text-gray p-2">BUYER&apos;S NAME</div>
    //                                     <div className="bg-white p-2 text-center">Ria Francisco</div>

    //                                     <div className="bg-[#EDEDED] text-gray p-2">SELLER&apos;S NAME</div>
    //                                     <div className="bg-white p-2 text-center">Jinky Gonzaga</div>

    //                                     <div className="bg-[#EDEDED] text-gray p-2">REALTY</div>
    //                                     <div className="bg-white p-2 text-center">ZONAL</div>

    //                                     <div className="bg-[#EDEDED] text-gray p-2">BROKER</div>
    //                                     <div className="bg-white p-2 text-center">Jomar Aquino</div>

    //                                     <div className="bg-[#EDEDED] text-gray p-2">DUE DATE</div>
    //                                     <div className="bg-white p-2 text-center">Every 15th</div>

    //                                     <div className="bg-[#EDEDED] text-gray p-2">FIRST DUE</div>
    //                                     <div className="bg-white p-2 text-center">February 2022</div>

    //                                     <div className="bg-[#EDEDED] text-gray p-2">2ND MA - 60TH MA</div>
    //                                     <div
    //                                         className={`p-2 text-center ${data.status === "due" ? "bg-[#FCE6E8]" : "bg-white"}`}
    //                                     >
    //                                         4,500.00
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         )}

    //                         {data.status === "reserved" && (
    //                             <div className="px-4 pb-4">
    //                                 <div className="grid grid-cols-2 gap-[1px] bg-gray-200 rounded-lg overflow-hidden font-semibold border border-lightGray">
    //                                     <div className="bg-[#EDEDED] text-gray p-2">CLIENT</div>
    //                                     <div className="bg-white p-2 text-center">Ria Francisco</div>

    //                                     <div className="bg-[#EDEDED] text-gray p-2">SELLER&apos;S NAME</div>
    //                                     <div className="bg-white p-2 text-center">Jinky Gonzaga</div>

    //                                     <div className="bg-[#EDEDED] text-gray p-2">REALTY</div>
    //                                     <div className="bg-white p-2 text-center">ZONAL</div>

    //                                     <div className="bg-[#EDEDED] text-gray p-2">DATE RESERVED</div>
    //                                     <div className="bg-white p-2 text-center">12/26/2025</div>

    //                                     <div className="bg-[#EDEDED] text-gray p-2">RESERVATION EXPIRY</div>
    //                                     <div className="bg-white p-2 text-center">12/28/2025</div>
    //                                 </div>
    //                             </div>
    //                         )}
    //                     </DialogContent>
    //                 </Dialog>

    //                 <InventoryEditModal
    //                     data={data}
    //                     onClose={() => setShowEditModal(false)}
    //                     open={showEditModal}
    //                     projectName={project?.projectName}
    //                 />

    //                 <DeleteConfirmDialog />
    //             </>
    //         )
    //     }
    // },
]