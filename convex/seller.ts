import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getSellerMetrics = query({
    args: {},
    handler: async (ctx) => {
        const sellerId = await getAuthUserId(ctx);
        if (!sellerId) throw new ConvexError("Not authenticated");

        // Fetch all properties for this seller
        const properties = await ctx.db
            .query("property")
            .filter((q) => q.eq(q.field("sellerId"), sellerId))
            .collect();

        const totalProperties = properties.length;
        const availableProperties = properties.filter(
            (p) => p.status === "available"
        ).length;
        const totalValue = properties.reduce(
            (sum, p) => sum + (p.totalSellingPrice || 0),
            0
        );

        // Fetch all deals for this seller
        const deals = await ctx.db
            .query("deal")
            .filter((q) => q.eq(q.field("sellerId"), sellerId))
            .collect();

        const activeDeals = deals.filter(
            (d) => d.status === "active" || d.status === "negotiating"
        ).length;

        // Calculate average price per sqm (for all properties)
        const totalSqm = properties.reduce(
            (sum, p) => sum + (p.lotArea || 0),
            0
        );
        const avgPricePerSqm =
            totalSqm > 0
                ? Math.round(
                    properties.reduce(
                        (sum, p) => sum + (p.pricePerSqm || 0),
                        0
                    ) / totalProperties
                )
                : 0;

        return {
            totalProperties,
            availableProperties,
            totalValue,
            activeDeals,
            avgPricePerSqm,
        };
    },
});

export const getSellerSalesSummary = query({
    args: {},
    handler: async (ctx) => {
        const sellerId = await getAuthUserId(ctx);
        if (!sellerId) throw new ConvexError("Not authenticated");

        // Fetch all deals for this seller
        const deals = await ctx.db
            .query("deal")
            .filter((q) => q.eq(q.field("sellerId"), sellerId))
            .collect();

        // Fetch all properties for this seller (for avgDaysToSell)
        const properties = await ctx.db
            .query("property")
            .filter((q) => q.eq(q.field("sellerId"), sellerId))
            .collect();

        // Completed sales
        const completedDeals = deals.filter((d) => d.status === "completed");
        const completedSales = completedDeals.length;

        // Total revenue from completed deals
        const totalRevenue = completedDeals.reduce(
            (sum, d) => sum + (d.finalDealPrice || 0),
            0
        );

        // Active deals (active or negotiating)
        const activeDeals = deals.filter(
            (d) => d.status === "active" || d.status === "negotiating"
        ).length;

        // Avg. days to sell (for completed deals)
        let totalDays = 0;
        let count = 0;
        for (const deal of completedDeals) {
            const property = properties.find((p) => p._id === deal.propertyId);
            if (property && deal.approvalDate && property.createdAt) {
                const days =
                    Math.round(
                        (deal.approvalDate - property.createdAt) / (1000 * 60 * 60 * 24)
                    );
                totalDays += days;
                count++;
            }
        }
        const avgDaysToSell = count > 0 ? Math.round(totalDays / count) : 0;

        return {
            completedSales,
            totalRevenue,
            activeDeals,
            avgDaysToSell,
        };
    },
});

export const getPropertyStatusDistribution = query({
    args: {},
    handler: async (ctx) => {
        const sellerId = await getAuthUserId(ctx);
        if (!sellerId) throw new ConvexError("Not Authenticated");

        const properties = await ctx.db
            .query("property")
            .filter((q) => q.eq(q.field("sellerId"), sellerId))
            .collect()

        const statusCounts: Record<string, number> = {};
        let total = 0;

        for (const property of properties) {
            const status = property.status || "unknown"
            statusCounts[status] = (statusCounts[status] || 0) + 1;
            total++;
        }

        return {
            total,
            available: statusCounts["available"] || 0,
            reserved: statusCounts["reserved"] || 0,
            sold: statusCounts["sold"] || 0,
            statusCounts,
        };
    }
})

export const getDealStatusOverview = query({
    args: {},
    handler: async (ctx) => {
        const sellerId = await getAuthUserId(ctx);
        if (!sellerId) throw new ConvexError("Not authenticated");

        const deals = await ctx.db
            .query("deal")
            .filter((q) => q.eq(q.field("sellerId"), sellerId))
            .collect();

        const statusCounts: Record<string, number> = {};
        for (const deal of deals) {
            const status = deal.status || "unknown";
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        }

        return {
            negotiating: statusCounts["negotiating"] || 0,
            active: statusCounts["active"] || 0,
            completed: statusCounts["completed"] || 0,
            statusCounts,
        };
    },
});