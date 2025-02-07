"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Doc } from "../../../../../../convex/_generated/dataModel"

export const AdminColumns: ColumnDef<Doc<"users">>[] = [
    {
        accessorKey: "accountId",
        header: () => <div className="text-center">Account ID</div>,
        cell: ({ row }) => {
            return (
                <p>
                    {row.original.accountId}
                </p>
            )
        }
    },
    {
        accessorKey: "fname",
        header: () => <div className="text-center">FIRST NAME</div>,
        cell: ({ row }) => {
            return (
                <p>
                    {row.original.fname}
                </p>
            )
        }
    },
    {
        accessorKey: "lname",
        header: () => <div className="text-center">SURNAME</div>,
        cell: ({ row }) => {
            return (
                <p>
                    {row.original.lname}
                </p>
            )
        }
    },
    {
        accessorKey: "email",
        header: () => <div className="text-center">EMAIL ADDRESS</div>,
        cell: ({ row }) => {
            return (
                <p>
                    {row.original.email}
                </p>
            )
        }
    },
    {
        accessorKey: "contact",
        header: () => <div className="text-center">CONTACT NUMBER</div>,
        cell: ({ row }) => {
            return (
                <p>
                    {row.original.contact}
                </p>
            )
        }
    },
    {
        accessorKey: "barangay",
        header: () => <div className="text-center">BARANGAY</div>,
        cell: ({ row }) => {
            return (
                <p>
                    {row.original.barangay}
                </p>
            )
        }
    },
    {
        accessorKey: "city",
        header: () => <div className="text-center">CITY</div>,
        cell: ({ row }) => {
            return (
                <p>
                    {row.original.city}
                </p>
            )
        }
    },
    // {
    //     accessorKey: "actions",
    //     header: () => <div className="text-center">ACTIONS</div>,
    //     cell: function Cell({ row }) {
    //         const [showEditModal, setShowEditModal] = useState(false)

    //         const data = row.original

    //         return (
    //             <>
    //                 <div className="flex items-center justify-center gap-2">
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
    //                         className="h-8 w-8 p-0"
    //                         onClick={() => { }}
    //                     >
    //                         <Eye className="h-8 w-8" />
    //                     </Button>

    //                     <Button
    //                         variant="ghost"
    //                         size="icon"
    //                         className="h-8 w-8 p-0"
    //                         onClick={() => { }}
    //                     >
    //                         <Mail className="h-8 w-8" />
    //                     </Button>

    //                     <Button
    //                         variant="ghost"
    //                         size="icon"
    //                         className="h-8 w-8 p-0 text-red-600"
    //                         onClick={() => { }}
    //                     >
    //                         <Trash2 className="h-8 w-8" />
    //                     </Button>
    //                 </div>

    //                 <EditSellerModal
    //                     data={data}
    //                     onClose={() => setShowEditModal(false)}
    //                     open={showEditModal}
    //                 />
    //             </>
    //         )
    //     }
    // },
]