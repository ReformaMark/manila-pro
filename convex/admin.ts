import { query } from "./_generated/server";

export const countProperties = query({
    handler: async (ctx) => {
        const property = await ctx.db
            .query("property")
            .collect()

        const availableProperty = property.filter(p => p.status === "available")
        const reservedProperty = property.filter(p => p.status === "reserved")
        const soldProperty = property.filter(p => p.status === "sold")

        return {
            property: property.length,
            available: availableProperty.length,
            reserved: reservedProperty.length,
            soldProperty: soldProperty.length,
        }
    }
})

export const countTransactions = query({
    handler: async (ctx) => {
        const transactions = await ctx.db
            .query("deal")
            .collect()

        const pendingTransactions = transactions.filter(t => t.status === "pending_approval")
        const negotiatingTransactions = transactions.filter(t => t.status === "negotiating")
        const activeTransactions = transactions.filter(t => t.status === "active")
        const approvedTransactions = transactions.filter(t => t.status === "approved")
        const cancelledTransactions = transactions.filter(t => t.status === "cancelled")
        const rejectedTransactions = transactions.filter(t => t.status === "rejected")
        const completedTransactions = transactions.filter(t => t.status === "completed")

        return {
            transactions: transactions.length,
            pending: pendingTransactions.length,
            negotiating: negotiatingTransactions.length,
            active: activeTransactions.length,
            approved: approvedTransactions.length,
            cancelled: cancelledTransactions.length,
            rejected: rejectedTransactions.length,
            completed: completedTransactions.length,
        }
    }
})

export const soldPropertiesByMonth = query({
    handler: async (ctx) => {
        const properties = await ctx.db
            .query("property")
            .filter(q => q.eq(q.field("status"), "sold"))
            .collect()

        const monthCounts: Record<string, number> = {};
        properties.forEach((p) => {
            const date = new Date(p.createdAt);
            const month = date.toLocaleString("default", { month: "long" });
            monthCounts[month] = (monthCounts[month] || 0) + 1;
        });

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return months.map(month => ({
            month,
            sold: monthCounts[month] || 0
        }));
    }
})