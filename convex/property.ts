import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const adminId = await getAuthUserId(ctx)
        if (!adminId) throw new ConvexError("Not authenticated");

        const admin = await ctx.db.get(adminId)
        if (!admin || admin.role !== "admin") throw new ConvexError("Unauthorized");

        const properties = await ctx.db
            .query("property")
            .order("desc")
            .collect();

        return properties;
    }
})

export const remove = mutation({
    args: {
        propertyId: v.id("property")
    },
    handler: async (ctx, args) => {
        const adminId = await getAuthUserId(ctx)
        if (!adminId) throw new ConvexError("Not authenticated");

        const admin = await ctx.db.get(adminId)
        if (!admin || admin.role !== "admin") throw new ConvexError("Unauthorized");

        return args.propertyId;
    }
})

export const getProperties = query({
    args: {},
    handler: async (ctx) => {
        const properties = await ctx.db
            .query("property")
            .order("desc")
            .collect();

        return properties;
    }
})