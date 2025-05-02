"use client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "convex/react";
import {
  ArrowDown,
  ArrowUp,
  Building,
  FileText,
  TrendingUp,
  UserCog,
} from "lucide-react";
import { api } from "../../../../convex/_generated/api";

export const AdminCards = () => {
  const counts = useQuery(api.users.getCounts);
  const cntProperties = useQuery(api.admin.countProperties);
  const cntTransactions = useQuery(api.admin.countTransactions);

  if (!counts || !cntProperties || !cntTransactions) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-20 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <UserCog className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold">{counts.total}</p>
            <div className="flex gap-2 text-xs text-muted-foreground mt-1">
              <span>Buyers: {counts.buyers}</span>
              <span>•</span>
              <span>Sellers: {counts.sellers}</span>
              <span>•</span>
              <span>Admins: {counts.admins}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Building className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-sm text-gray-500">Properties Listed</p>
            <p className="text-2xl font-bold">{cntProperties.property}</p>
            <div className="flex items-center gap-1 text-xs mt-1">
              <span className="text-muted-foreground">
                Available: {cntProperties.available}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                Reserved: {cntProperties.reserved}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                Sold: {cntProperties.soldProperty}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <FileText className="h-8 w-8 text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">Transactions</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">
                {cntTransactions.transactions}
              </p>
              {/* <span
                className={`text-xs flex items-center ${transactionChange >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {transactionChange >= 0 ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {Math.abs(transactionChange)}%
              </span> */}
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground mt-1">
              <span className="">Pending: {cntTransactions.pending}</span>
              <span>•</span>
              <span className="">Active: {cntTransactions.active}</span>
              <span>•</span>
              <span className="">Completed: {cntTransactions.completed}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
