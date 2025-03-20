import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { asyncMap } from 'convex-helpers'
import { Id } from "./_generated/dataModel";

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
    args: { paginationOpts: paginationOptsValidator },
    handler: async (ctx, args) => {
        const properties = await ctx.db
            .query("property")
            .order("desc")
            .paginate(args.paginationOpts);

        return properties;
    }
})
export const getProperty = query({
    args: { id: v.id('property') },
    handler: async (ctx, args) => {
        const property = await ctx.db.get(args.id)
        if (!property) return

        if (property.otherImage) {
            property.displayImage ? property.otherImage.push(property.displayImage) : null
            const imageUrls = await asyncMap(property.otherImage, async (id) => {
                const url = await ctx.storage.getUrl(id as Id<"_storage">);
                return url;
            }).then((data) => data.filter(url => url !== null));

            return {
                ...property,
                imageUrls: imageUrls
            }
        }
    }
})

export const create = mutation({
    args: {
        propertyName: v.string(),
        unitType: v.string(),
        bedrooms: v.string(),
        lotArea: v.number(),
        maximumOccupants: v.string(),
        address: v.string(),
        city: v.union(
            v.literal("Makati"),
            v.literal("Pasay"),
            v.literal("Taguig")
        ),
        block: v.string(),
        lot: v.string(),
        pricePerSqm: v.number(),
        totalContractPrice: v.number(),
        netContractPrice: v.number(),
        totalSellingPrice: v.number(),
        suggestedMonthlyAmortization: v.number(),
        suggestedTermInMonths: v.number(),
        displayImage: v.string(),
        transactionType: v.optional(v.string()),
        otherImage: v.optional(v.array(v.string())),
        description: v.optional(v.string()),
        bathrooms: v.string(),
        featured: v.boolean(),
    },
    handler: async (ctx, args) => {
        const id = await getAuthUserId(ctx)
        if (!id) throw new ConvexError("Unauthorized")

        return await ctx.db.insert("property", {
            sellerId: id,
            lotId: "1",
            status: "available",
            createdAt: Math.floor(new Date(Date.now()).getTime() / 1000),
            updatedAt: 0,
            ...args,
        })
    }
})