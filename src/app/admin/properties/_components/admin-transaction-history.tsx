import { FunctionReturnType } from "convex/server";
import { api } from "../../../../../convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon } from "lucide-react";
import {
  formatCurrency,
  formatDate,
  formatDateListed,
  formatStatus,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { dealStatusColorMap } from "@/types/constants";

type PropertyTypeWithDeals = FunctionReturnType<
  typeof api.property.getPropertyByIdWithDeals
>;

interface AdminTransactionHistoryProps {
  property: PropertyTypeWithDeals;
}

export const AdminTransactionHistory = ({
  property,
}: AdminTransactionHistoryProps) => {
  const transactions = property?.transactionWithDetails;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          All deals and offers for this property
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions ? (
          <div>
            {transactions.length === 0 ? (
              <p>No transactions found.</p>
            ) : (
              <div className="space-y-4">
                {transactions.map((deal) => (
                  <div key={deal._id} className="rounded-lg border p-4">
                    <div className="flex justify-between">
                      {deal.buyer ? (
                        <div className="flex gap-2 items-center">
                          <Avatar>
                            <AvatarFallback className="bg-zinc-300/70">
                              {deal.buyer.fname.charAt(0)}
                            </AvatarFallback>
                            <AvatarImage src={deal.buyer.image} />
                          </Avatar>

                          <div>
                            <h1>
                              {deal.buyer.fname} {deal.buyer.lname}
                            </h1>
                            <div className="flex gap-1 items-center text-muted-foreground text-sm">
                              <CalendarIcon className="w-4 h-4" />
                              {formatDateListed(deal.requestDate)}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p>No Buyer found</p>
                      )}

                      <Badge className={dealStatusColorMap[deal.status]}>
                        {formatStatus(deal.status)}
                      </Badge>
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Initial Offer
                        </p>
                        <p className="font-medium">
                          {formatCurrency(deal.proposal.offer)}
                        </p>
                      </div>
                      {deal.dealPrice && (
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Final Price
                          </p>
                          <p className="font-medium">
                            {formatCurrency(deal.dealPrice)}
                          </p>
                        </div>
                      )}
                      {deal.proposal.message && (
                        <div className="sm:col-span-2">
                          <p className="text-sm text-muted-foreground">
                            Message
                          </p>
                          <p className="text-sm">{deal.proposal.message}</p>
                        </div>
                      )}
                      {deal.remarks && (
                        <div className="sm:col-span-2">
                          <p className="text-sm text-muted-foreground">
                            Remarks
                          </p>
                          <p className="text-sm">{deal.remarks}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p>There might be no transactions yet for this property.</p>
        )}
      </CardContent>
    </Card>
  );
};
