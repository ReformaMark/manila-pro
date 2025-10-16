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
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp, MapPin, Building2, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function HotspotAnalysis() {
  const data = useQuery(api.admin.getHotspotAnalysis);

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartConfig = {
    popularity: {
      label: "Popularity",
      color: "hsl(var(--chart-1))",
    },
    availableListings: {
      label: "Available",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-orange-500" />
          Housing Supply Hotspot Analysis
        </CardTitle>
        <CardDescription>
          Market trends, property popularity, and supply distribution across
          regions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chart */}
        <div className="w-full h-[250px] md:h-[280px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="city"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  width={40}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend wrapperStyle={{ fontSize: "12px" }} iconSize={10} />
                <Bar
                  dataKey="popularity"
                  fill="var(--color-popularity)"
                  radius={[4, 4, 0, 0]}
                  name="Popularity"
                  maxBarSize={60}
                />
                <Bar
                  dataKey="availableListings"
                  fill="var(--color-availableListings)"
                  radius={[4, 4, 0, 0]}
                  name="Available"
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {data.map((cityData: any) => (
            <Card key={cityData.city} className="bg-muted/5">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">{cityData.city}</h3>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    Popularity: {cityData.popularity}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Total Listings
                    </span>
                    <span className="font-medium">
                      {cityData.totalListings}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available</span>
                    <span className="font-medium text-green-600">
                      {cityData.availableListings}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sold</span>
                    <span className="font-medium text-blue-600">
                      {cityData.soldListings}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reserved</span>
                    <span className="font-medium text-orange-600">
                      {cityData.reservedListings}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Avg Price</span>
                    <span className="font-medium">
                      ₱{cityData.avgPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Supply/Demand</span>
                    <span className="font-medium">
                      {cityData.supplyDemandRatio}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Key Insights */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 md:p-4 rounded-lg">
          <div className="flex items-start gap-2 md:gap-3">
            <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-sm md:text-base text-blue-900 dark:text-blue-100 mb-1">
                Market Insights
              </h4>
              <p className="text-xs md:text-sm text-blue-800 dark:text-blue-200">
                {data[0] &&
                  `${data[0].city} shows the highest market activity with ${data[0].popularity} interested buyers. `}
                Supply/demand ratio indicates market competitiveness in each
                region.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
