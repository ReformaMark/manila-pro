import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl();
    },
});

export const saveImageUrl = mutation({
    args: {
        propertyId: v.id("property"),
        imageUrl: v.string(),
    },
    handler: async (ctx, { propertyId, imageUrl }) => {
        await ctx.db.patch(propertyId, { displayImage: imageUrl });
    },
});

export const getStorageUrl = query({
    args: { storageId: v.string() },
    handler: async (ctx, args) => {
        if (!args.storageId) return null;
        try {
            return await ctx.storage.getUrl(args.storageId);
        } catch (error) {
            console.error("Error getting storage URL:", error);
            return null;
        }
    },
}); 