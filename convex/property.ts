import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { ConvexError, convexToJson, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { asyncMap } from 'convex-helpers'
import { Id } from "./_generated/dataModel";
import { ArrowRightSquare } from "lucide-react";


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

        const propertyWithUrls = await asyncMap(properties, async (property) => {
            let displayImageUrl = null;
            let imageUrls = property.otherImage ? property.otherImage : [];

            if (typeof property.displayImage === "string" && property.displayImage.startsWith("https://")) {
                displayImageUrl = property.displayImage; // Direct link
            } else {
                displayImageUrl = await ctx.storage.getUrl(property.displayImage as Id<"_storage">); // Storage ID
            }

            if (property.otherImage) {
                if (displayImageUrl) {
                    imageUrls.unshift(displayImageUrl)
                    imageUrls = await asyncMap(property.otherImage, async (id) => {

                        let url = null;
                        if (typeof id === "string" && id.startsWith("https://")) {
                            url = id;
                        } else {
                            url = await ctx.storage.getUrl(id as Id<"_storage">);
                        }
                        return url;
                    }).then((data) => data.filter(url => url !== null));
                } else {
                    imageUrls = await asyncMap(property.otherImage, async (id) => {

                        let url = null;
                        if (typeof id === "string" && id.startsWith("https://")) {
                            url = id;
                        } else {
                            url = await ctx.storage.getUrl(id as Id<"_storage">);
                        }
                        return url;
                    }).then((data) => data.filter(url => url !== null));
                }
                return {
                    ...property,
                    displayImageUrl: displayImageUrl,
                    imageUrls: imageUrls
                }

            } else {
                return {
                    ...property,
                    displayImageUrl: displayImageUrl,
                    imageUrls: imageUrls
                }
            }


        })



        return propertyWithUrls;
    }
})
export const getProperty = query({
    args: { id: v.id('property') },
    handler: async (ctx, args) => {
        const property = await ctx.db.get(args.id)
        if (!property) return
        let displayImageUrl = null;
        if (property.otherImage) {
            if (typeof property.displayImage === "string" && property.displayImage.startsWith("https://")) {
                displayImageUrl = property.displayImage; // Direct link
            } else {
                displayImageUrl = await ctx.storage.getUrl(property.displayImage as Id<"_storage">); // Storage ID
            }

            displayImageUrl ? property.otherImage.push(displayImageUrl) : null
            const imageUrls = await asyncMap(property.otherImage, async (id) => {
                let url = null;
                if (typeof id === "string" && id.startsWith("https://")) {
                    url = id; // Direct link
                } else {
                    url = await ctx.storage.getUrl(id as Id<"_storage">); // Storage ID
                }
                return url;
            }).then((data) => data.filter(url => url !== null));

            return {
                ...property,
                imageUrls: imageUrls
            }
        }
    }
})

export const getPropertyBySeller = query({
    args: {},
    handler: async (ctx) => {
        const id = await getAuthUserId(ctx)
        if (!id) throw new ConvexError("Unauthorized")

        const properties = await ctx.db
            .query("property")
            .filter((q) => q.eq(q.field("sellerId"), id))
            .collect()

        return await asyncMap(properties, async (property) => {
            const displayImageUrl = property.displayImage
                ? await ctx.storage.getUrl(property.displayImage)
                : null;

            const otherImageUrls = property.otherImage
                ? await asyncMap(property.otherImage, async (image) => {
                    return await ctx.storage.getUrl(image)
                }) : []

            const cleanOtherImageUrls = otherImageUrls.filter((url): url is string => url !== null && url !== undefined);

            return {
                ...property,
                displayImage: displayImageUrl as string,
                otherImage: cleanOtherImageUrls,
            }
        })
    }
})

export const getPropertyByIdSeller = query({
    args: { id: v.id('property') },
    handler: async (ctx, args) => {
        const id = await getAuthUserId(ctx)
        if (!id) throw new ConvexError("Unauthorized")

        const property = await ctx.db.get(args.id)
        if (!property) throw new ConvexError("Property not found")

        let previewImage = undefined;
        if (property.displayImage) {
            if (typeof property.displayImage === "string" && property.displayImage.startsWith("https://")) {
                previewImage = property.displayImage;
            } else {
                previewImage = await ctx.storage.getUrl(property.displayImage as Id<"_storage">);
            }
        }

        const otherPreviewImages = await asyncMap(property.otherImage ?? [], async (image) => {
            if (typeof image === "string" && image.startsWith("https://")) {
                return image;
            }
            return await ctx.storage.getUrl(image as Id<"_storage">);
        });

        return {
            ...property,
            previewImage,
            otherPreviewImages: otherPreviewImages.filter(Boolean),
        }
    }
})

export const create = mutation({
    args: {
        propertyName: v.string(),
        unitType: v.string(),
        bedrooms: v.number(),
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
        bathrooms: v.number(),
        featured: v.boolean(),
    },
    handler: async (ctx, args) => {
        const id = await getAuthUserId(ctx)
        if (!id) throw new ConvexError("Unauthorized")

        return await ctx.db.insert("property", {
            sellerId: id,
            status: "available",
            createdAt: Math.floor(new Date(Date.now()).getTime() / 1000),
            updatedAt: 0,
            ...args,
        })
    }
})

export const update = mutation({
    args: {
        id: v.id("property"),
        propertyName: v.string(),
        unitType: v.string(),
        bedrooms: v.number(),
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
        bathrooms: v.number(),
        featured: v.boolean(),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args

        const userId = await getAuthUserId(ctx)
        const property = await ctx.db.get(id)

        if (!property || property.sellerId !== userId) {
            throw new ConvexError("Not authorized to edit this property")
        }

        return await ctx.db.patch(id, {
            ...updates,
            updatedAt: Math.floor(new Date(Date.now()).getTime() / 1000),
        })
    }
})