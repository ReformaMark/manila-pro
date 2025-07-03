"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { DollarSign, Home, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "../../../convex/_generated/api";

const SellerPage = () => {
  const sellerMetrics = useQuery(api.seller.getSellerMetrics);
  const salesSummary = useQuery(api.seller.getSellerSalesSummary);
  const propertyStatus = useQuery(api.seller.getPropertyStatusDistribution);
  const dealStatusOverview = useQuery(api.seller.getDealStatusOverview);

  const dealData = [
    { status: "Negotiating", count: dealStatusOverview?.negotiating ?? 0 },
    { status: "Active", count: dealStatusOverview?.active ?? 0 },
    { status: "Completed", count: dealStatusOverview?.completed ?? 0 },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Seller Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your properties and track your sales performance
            </p>
          </div>
          <Link
            className={cn(
              "flex items-center gap-2",
              buttonVariants({
                variant: "default",
              })
            )}
            href="/seller/properties/new"
          >
            Add New Property
          </Link>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Properties
              </CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sellerMetrics ? sellerMetrics.totalProperties : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {sellerMetrics ? sellerMetrics.availableProperties : 0}{" "}
                available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sellerMetrics
                  ? formatPrice(sellerMetrics.totalValue)
                  : formatPrice(0)}
              </div>
              <p className="text-xs text-muted-foreground">Portfolio value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Deals
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sellerMetrics ? sellerMetrics.activeDeals : 0}
              </div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Price/sqm
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₱
                {sellerMetrics
                  ? sellerMetrics.avgPricePerSqm.toLocaleString()
                  : "0"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Summary</CardTitle>
              <CardDescription>Revenue and deal statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {salesSummary ? salesSummary.completedSales : 0}
                  </div>
                  <div className="text-sm text-green-600">Completed Sales</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {salesSummary
                      ? formatPrice(salesSummary.totalRevenue)
                      : formatPrice(0)}
                  </div>
                  <div className="text-sm text-blue-600">Total Revenue</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {salesSummary ? salesSummary.activeDeals : 0}
                  </div>
                  <div className="text-sm text-yellow-600">Active Deals</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {salesSummary ? salesSummary.avgDaysToSell : 0}
                  </div>
                  <div className="text-sm text-purple-600">
                    Avg. Days to Sell
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Property Status Distribution</CardTitle>
              <CardDescription>
                Breakdown of your property portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {propertyStatus ? propertyStatus.available : 0} propert
                      {propertyStatus && propertyStatus.available !== 1
                        ? "ies"
                        : "y"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      (
                      {propertyStatus && propertyStatus.total > 0
                        ? Math.round(
                            (propertyStatus.available / propertyStatus.total) *
                              100
                          )
                        : 0}
                      % )
                    </span>
                  </div>
                </div>
                <Progress
                  value={
                    propertyStatus && propertyStatus.total > 0
                      ? (propertyStatus.available / propertyStatus.total) * 100
                      : 0
                  }
                  className="h-2"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Reserved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {propertyStatus ? propertyStatus.reserved : 0} propert
                      {propertyStatus && propertyStatus.reserved !== 1
                        ? "ies"
                        : "y"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      (
                      {propertyStatus && propertyStatus.total > 0
                        ? Math.round(
                            (propertyStatus.reserved / propertyStatus.total) *
                              100
                          )
                        : 0}
                      % )
                    </span>
                  </div>
                </div>
                <Progress
                  value={
                    propertyStatus && propertyStatus.total > 0
                      ? (propertyStatus.reserved / propertyStatus.total) * 100
                      : 0
                  }
                  className="h-2"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Sold</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {propertyStatus ? propertyStatus.sold : 0} propert
                      {propertyStatus && propertyStatus.sold !== 1
                        ? "ies"
                        : "y"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      (
                      {propertyStatus && propertyStatus.total > 0
                        ? Math.round(
                            (propertyStatus.sold / propertyStatus.total) * 100
                          )
                        : 0}
                      % )
                    </span>
                  </div>
                </div>
                <Progress
                  value={
                    propertyStatus && propertyStatus.total > 0
                      ? (propertyStatus.sold / propertyStatus.total) * 100
                      : 0
                  }
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* <Card>
            <CardHeader>
              <CardTitle>Price Trends</CardTitle>
              <CardDescription>Average price per sqm over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  price: {
                    label: "Price per sqm",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="var(--color-price)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-price)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle>Deal Status Overview</CardTitle>
              <CardDescription>
                Current status of all your deals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  negotiating: {
                    label: "Negotiating",
                    color: "hsl(var(--chart-1))",
                  },
                  active: {
                    label: "Active",
                    color: "hsl(var(--chart-2))",
                  },
                  completed: {
                    label: "Completed",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dealData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-negotiating)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SellerPage;
