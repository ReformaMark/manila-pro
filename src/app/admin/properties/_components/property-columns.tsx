"use client";

import { BadgeStatus } from "@/components/badge-status";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { FunctionReturnType } from "convex/server";
import { Eye } from "lucide-react";
import { useState } from "react";
import { api } from "../../../../../convex/_generated/api";
import { PropertyDialog } from "./property-dialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type GetPropertiesReturnType = FunctionReturnType<
  typeof api.property.getProperties
>;

type PropertyType = GetPropertiesReturnType[number];

export const PropertyColumns: ColumnDef<PropertyType>[] = [
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
  // {
  //     accessorKey: "lotId",
  //     header: () => <div className="text-center">LOT ID NO.</div>,
  //     cell: ({ row }) => {
  //         return (
  //             <p>
  //                 {row.original.lotId}
  //             </p>
  //         )
  //     }
  // },
  {
    accessorKey: "propertyName",
    header: () => <div>Property</div>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-gray-100 overflow-hidden">
            <img
              src={row.original.displayImageUrl!}
              alt={row.original.propertyName}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="font-normal">
            <div className="font-medium">{row.original.propertyName}</div>
            <div className="text-xs text-muted-foreground truncate max-w-[200px] text-start">
              {row.original.address}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "city",
    header: () => <div className="text-center">City</div>,
    cell: ({ row }) => {
      return <div className="font-normal text-center">{row.original.city}</div>;
    },
  },
  {
    accessorKey: "totalSellingPrice",
    header: () => <div className="text-center">Price</div>,
    cell: ({ row }) => {
      return (
        <p className="font-normal">
          {formatPrice(row.original.totalSellingPrice)}
        </p>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      return <BadgeStatus status={row.original.status} />;
    },
  },
  {
    accessorKey: "actions",
    header: () => <div className="text-center">ACTION</div>,
    cell: function Cell({ row }) {
      const propertyId = row.original._id;
      return (
        <Link
          href={`/admin/properties/${propertyId}`}
          target="_blank"
          rel="noopener noreferrer" // Recommended for security when using target="_blank"
          className={cn(
            buttonVariants({
              variant: "outline",
              className: "hover:bg-zinc-100 hover:text-black",
            })
          )}
        >
          View Details
        </Link>
      );
    },
  },
];
