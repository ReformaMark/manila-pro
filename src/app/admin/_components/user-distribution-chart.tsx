"use client"

import { useQuery } from "convex/react"
import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { api } from "../../../../convex/_generated/api"

const chartConfig = {
    users: {
        label: "Users",
    },
    buyer: {
        label: "Buyers",
        color: "hsl(var(--chart-1))",
    },
    seller: {
        label: "Sellers",
        color: "hsl(var(--chart-2))",
    },
    admin: {
        label: "Admins",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig

export function UserDistributionChart() {
    const counts = useQuery(api.users.getCounts)

    const chartData = React.useMemo(() => {
        if (!counts) return []
        return [
            { type: "buyer", count: counts.buyers, fill: "hsl(var(--chart-1))" },
            { type: "seller", count: counts.sellers, fill: "hsl(var(--chart-2))" },
            { type: "admin", count: counts.admins, fill: "hsl(var(--chart-3))" },
        ]
    }, [counts])

    const totalUsers = React.useMemo(() => {
        return counts?.total || 0
    }, [counts])

    if (!counts) {
        return (
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <CardTitle>Loading...</CardTitle>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Total Registered Users</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="type"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalUsers.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Users
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-1))" }} />
                        <span>Buyers: {counts.buyers}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-2))" }} />
                        <span>Sellers: {counts.sellers}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-3))" }} />
                        <span>Admins: {counts.admins}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}