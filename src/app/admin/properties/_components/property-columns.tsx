"use client"

import { BadgeStatus } from "@/components/badge-status";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { useState } from "react";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { PropertyDialog } from "./property-dialog";

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
                    {row.original.lotArea ? row.original.lotArea.toFixed(2) : "N/A"}
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
                    {formatPrice(row.original.suggestedMonthlyAmortization.toFixed(2))}
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
    {
        accessorKey: "actions",
        header: () => <div className="text-center">ACTION</div>,
        cell: function Cell({ row }) {
            const [showModal, setShowModal] = useState(false)
            const data = row.original

            // const [showEditModal, setShowEditModal] = useState(false)

            // const remove = useMutation(api.property.remove)

            // const [DeleteConfirmDialog, confirmDelete] = useConfirm(
            //     "Delete property",
            //     "Are you sure you want to delete this property? This action cannot be undone."
            // )

            // const handleDelete = async () => {
            //     const confirmed = await confirmDelete()

            //     if (confirmed) {
            //         try {
            //             await remove({
            //                 propertyId: data._id
            //             })
            //             toast.success("Project deleted successfully")
            //         } catch (error) {
            //             toast.error("Failed to delete property")
            //             console.error(error)
            //         }
            //     }
            // }

            return (
                <>
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                            onClick={() => setShowModal(true)}
                        >
                            <Eye className="h-8 w-8" />
                        </Button>

                        {/* <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                            onClick={() => setShowEditModal(true)}
                        >
                            <Pencil className="h-8 w-8" />
                        </Button> */}

                        {/* <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0 text-red-600"
                            onClick={handleDelete}
                        >
                            <Trash2 className="h-8 w-8" />
                        </Button> */}
                    </div>

                    <PropertyDialog
                        data={data}
                        setShowModal={setShowModal}
                        showModal={showModal}
                    />

                    {/* <InventoryEditModal
                        data={data}
                        onClose={() => setShowEditModal(false)}
                        open={showEditModal}
                        projectName={project?.projectName}
                    /> */}

                    {/* <DeleteConfirmDialog /> */}
                </>
            )
        }
    },
]