"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  MapPin,
  TrendingUp,
  Building2,
  DollarSign,
  Package,
  Activity,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function RegionalMarketAnalysis() {
  const data = useQuery(api.admin.getRegionalMarketAnalysis);

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          Regional Market Analysis
        </CardTitle>
        <CardDescription>
          Comprehensive comparative data across regions for strategic
          decision-making
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview" className="text-xs md:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs md:text-sm">
              Pricing
            </TabsTrigger>
            <TabsTrigger value="supply" className="text-xs md:text-sm">
              Supply
            </TabsTrigger>
            <TabsTrigger value="types" className="text-xs md:text-sm">
              Types
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {data.map((region: any) => (
                <Card
                  key={region.city}
                  className="bg-gradient-to-br from-primary/5 to-primary/10"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {region.city}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-white dark:bg-gray-900 p-3 rounded-lg">
                        <p className="text-muted-foreground text-xs">
                          Total Supply
                        </p>
                        <p className="text-xl font-bold">
                          {region.totalSupply}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-900 p-3 rounded-lg">
                        <p className="text-muted-foreground text-xs">
                          Available
                        </p>
                        <p className="text-xl font-bold text-green-600">
                          {region.availableSupply}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-900 p-3 rounded-lg">
                        <p className="text-muted-foreground text-xs">
                          Avg Price
                        </p>
                        <p className="text-sm font-bold">
                          ₱{(region.avgPrice / 1000000).toFixed(1)}M
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-900 p-3 rounded-lg">
                        <p className="text-muted-foreground text-xs">
                          Total Deals
                        </p>
                        <p className="text-xl font-bold text-blue-600">
                          {region.totalDeals}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-3 rounded-lg space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          Absorption Rate
                        </span>
                        <span className="font-semibold text-primary">
                          {region.absorptionRate}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          Active Deals
                        </span>
                        <span className="font-semibold">
                          {region.activeDeals}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Completed</span>
                        <span className="font-semibold text-green-600">
                          {region.completedDeals}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-3 md:space-y-4">
            <div className="w-full h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="city"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(value) =>
                      `₱${(value / 1000000).toFixed(1)}M`
                    }
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    width={50}
                  />
                  <Tooltip
                    formatter={(value: number) => `₱${value.toLocaleString()}`}
                    contentStyle={{ fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} iconSize={10} />
                  <Bar
                    dataKey="avgPrice"
                    fill="#8884d8"
                    name="Avg Price"
                    maxBarSize={50}
                  />
                  <Bar
                    dataKey="minPrice"
                    fill="#82ca9d"
                    name="Min Price"
                    maxBarSize={50}
                  />
                  <Bar
                    dataKey="maxPrice"
                    fill="#ffc658"
                    name="Max Price"
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {data.map((region: any) => (
                <Card key={region.city}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <h3 className="font-semibold">{region.city} Pricing</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Min Price</span>
                        <span className="font-medium">
                          ₱{(region.minPrice / 1000000).toFixed(2)}M
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Price</span>
                        <span className="font-medium">
                          ₱{(region.maxPrice / 1000000).toFixed(2)}M
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-muted-foreground">Avg Price</span>
                        <span className="font-bold text-primary">
                          ₱{(region.avgPrice / 1000000).toFixed(2)}M
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Avg Deal Value
                        </span>
                        <span className="font-medium">
                          {region.avgDealValue > 0
                            ? `₱${(region.avgDealValue / 1000000).toFixed(2)}M`
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Supply Tab */}
          <TabsContent value="supply" className="space-y-3 md:space-y-4">
            <div className="w-full h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="city"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} width={40} />
                  <Tooltip contentStyle={{ fontSize: "12px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} iconSize={10} />
                  <Bar
                    dataKey="totalSupply"
                    fill="#8884d8"
                    name="Total"
                    maxBarSize={50}
                  />
                  <Bar
                    dataKey="availableSupply"
                    fill="#82ca9d"
                    name="Available"
                    maxBarSize={50}
                  />
                  <Bar
                    dataKey="completedDeals"
                    fill="#ffc658"
                    name="Completed"
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {data.map((region: any) => (
                <Card key={region.city}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="h-4 w-4 text-blue-600" />
                      <h3 className="font-semibold">{region.city} Inventory</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Absorption Rate
                          </span>
                          <span className="text-lg font-bold text-primary">
                            {region.absorptionRate}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Properties sold vs total supply
                        </p>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Inventory Months
                          </span>
                          <span className="text-lg font-bold">
                            {region.inventoryMonths}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Estimated months to clear inventory
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Property Types Tab */}
          <TabsContent value="types" className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {data.map((region: any, idx: number) => (
                <Card key={region.city}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm md:text-base">
                      {region.city}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[180px] md:h-[200px] mb-3 md:mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={region.propertyTypesArray}
                            dataKey="count"
                            nameKey="type"
                            cx="50%"
                            cy="50%"
                            outerRadius={50}
                            label={(entry: any) => `${entry.percentage}%`}
                            labelLine={false}
                          >
                            {region.propertyTypesArray.map(
                              (_: any, index: number) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              )
                            )}
                          </Pie>
                          <Tooltip contentStyle={{ fontSize: "12px" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      {region.propertyTypesArray
                        .slice(0, 5)
                        .map((type: any, index: number) => (
                          <div
                            key={type.type}
                            className="flex justify-between items-center text-xs md:text-sm"
                          >
                            <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
                              <div
                                className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0"
                                style={{
                                  backgroundColor:
                                    COLORS[index % COLORS.length],
                                }}
                              />
                              <span className="text-muted-foreground truncate">
                                {type.type}
                              </span>
                            </div>
                            <span className="font-medium whitespace-nowrap ml-2">
                              {type.count} ({type.percentage}%)
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
