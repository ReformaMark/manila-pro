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
        const currentUserId = await getAuthUserId(ctx)
        const properties = await ctx.db
            .query("property")
            .order("desc")
            .collect();
        const propertyWithUrls = await asyncMap(properties, async (property) => {
            let isSaved = false
            let displayImageUrl = null;
            let imageUrls = property.otherImage ? property.otherImage : [];
        
            if(!currentUserId) {
                isSaved = false
            }
            const saved = await ctx.db.query("saved_properties")
                .filter(q => q.eq(q.field('propertyId'), property._id))
                .filter(q => q.eq(q.field('userId'), currentUserId))
                .first()
            saved === null ? isSaved = false : isSaved = true

            const seller = await ctx.db.get(property.sellerId)
            const sellerRatingsandReviews = await ctx.db.query('ratings_reviews')
                .filter(q => q.eq(q.field('agentId'), property.sellerId))
                .order('desc')
                .collect()
            let userImageUrl = undefined
            if(seller?.image){
                userImageUrl = await ctx.storage.getUrl(seller.image as Id<'_storage'>)
            }
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
            }
            return {
                ...property,
                displayImageUrl: displayImageUrl,
                imageUrls: imageUrls,
                isSaved: isSaved,
                agent: {
                    ...seller,
                    userImageUrl: userImageUrl,
                    ratingsAndReviews: sellerRatingsandReviews
                }
            }
        })
        return propertyWithUrls;
    }
})

export const getFeaturedProperties = query({
    args: { paginationOpts: paginationOptsValidator },
    handler: async (ctx, args) => {
        const currentUserId = await getAuthUserId(ctx)
        const properties = await ctx.db
            .query("property")
            .order("desc")
            .filter(q => q.eq(q.field('featured'), true))
            .filter(q => q.eq(q.field('status'), "available"))
            .paginate(args.paginationOpts)

        const propertyWithUrls = await asyncMap(properties.page, async (property) => {
            let isSaved = false
            if(!currentUserId) {
                isSaved = false
            }
            const saved = await ctx.db.query("saved_properties")
                .filter(q => q.eq(q.field('propertyId'), property._id))
                .filter(q => q.eq(q.field('userId'), currentUserId))
                .first()
            const seller = await ctx.db.get(property.sellerId)
            const sellerRatingsandReviews = await ctx.db.query('ratings_reviews')
                .filter(q => q.eq(q.field('agentId'), property.sellerId))
                .order('desc')
                .collect()
            let displayImageUrl = null;
            let imageUrls = property.otherImage ? property.otherImage : [];
            let userImageUrl = undefined
            if(seller?.image) {
                userImageUrl = await ctx.storage.getUrl(seller.image as Id<"_storage">)
            }

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
               

            } 
            return {
                ...property,
                displayImageUrl: displayImageUrl,
                imageUrls: imageUrls,
                isSaved: isSaved,
                agent: seller ? {
                    ...seller,
                    userImageUrl: userImageUrl === null ? undefined : userImageUrl,
                    ratingsAndReviews: sellerRatingsandReviews
                } : undefined
            }


        })
        return {
            page: propertyWithUrls,       // The transformed list
            isDone: properties.isDone,    // Preserve pagination status
            continueCursor: properties.continueCursor // Preserve pagination cursor
        };
    }
})

export const getProperty = query({
    args: { id: v.id('property') },
    handler: async (ctx, args) => {
        let isSaved = false
        const currentUserId = await getAuthUserId(ctx)
        if(!currentUserId) {
            isSaved = false
        }
        const saved = await ctx.db.query("saved_properties")
            .filter(q => q.eq(q.field('propertyId'), args.id))
            .filter(q => q.eq(q.field('userId'), currentUserId))
            .first()

        saved === null ? isSaved = false : isSaved = true
        
        const property = await ctx.db.get(args.id)
        if (!property) return
        const seller = await ctx.db.get(property.sellerId)
        if(!seller) return
        let userImageUrl = undefined
        const sellerRatingsandReviews = await ctx.db.query('ratings_reviews')
            .filter(q => q.eq(q.field('agentId'), seller._id))
            .order('desc')
            .collect()
        if(seller.image) {
            userImageUrl = await ctx.storage.getUrl(seller.image as Id<'_storage'>)
        }

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
        }
        return {
            ...property,
            displayImageUrl: displayImageUrl,
            imageUrls: imageUrls,
            isSaved: isSaved,
            agent: {
                ...seller,
                userImageUrl: userImageUrl === null ? undefined : userImageUrl,
                ratingsAndReviews: sellerRatingsandReviews
            }
        }
    }
})

export const similarProp = query({
    args: {
        sellerId: v.id('users'),
        propertyId: v.id('property')
    },
    handler: async(ctx, args) =>{
        const currentUserId = await getAuthUserId(ctx)
        const similar = await ctx.db.query('property')
            .filter(q => q.eq(q.field('sellerId'), args.sellerId))
            .filter(q => q.eq(q.field('status'), "available"))
            .filter(q => q.neq(q.field('_id'), args.propertyId))
            .order('desc')
            .take(5)

            const propertyWithUrls = await asyncMap(similar, async (property) => {
                let isSaved = false
                if(!currentUserId) {
                    isSaved = false
                }
                const saved = await ctx.db.query("saved_properties")
                    .filter(q => q.eq(q.field('propertyId'), args.propertyId))
                    .filter(q => q.eq(q.field('userId'), currentUserId))
                    .first()
        
                saved === null ? isSaved = false : isSaved = true
                const seller = await ctx.db.get(property.sellerId)
                const sellerRatingsandReviews = await ctx.db.query('ratings_reviews')
                    .filter(q => q.eq(q.field('agentId'), property.sellerId))
                    .order('desc')
                    .collect()
                let displayImageUrl = null;
                let imageUrls = property.otherImage ? property.otherImage : [];
                let userImageUrl = undefined
                if(seller?.image) {
                    userImageUrl = await ctx.storage.getUrl(seller.image as Id<"_storage">)
                }
    
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
                }
                    return {
                        ...property,
                        displayImageUrl: displayImageUrl,
                        imageUrls: imageUrls,
                        isSaved: isSaved,
                        agent: seller ? {
                            ...seller,
                            userImageUrl: userImageUrl === null ? undefined : userImageUrl,
                            ratingsAndReviews: sellerRatingsandReviews
                        } : undefined
                    }
            })

        return propertyWithUrls
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
        facilities: v.optional(v.array(v.object({
            name: v.string(),
            description: v.string()
        }))),
        amenities: v.optional(v.array(v.object({
            name: v.string(),
            description: v.string()
        }))),
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
        facilities: v.optional(v.array(v.object({
            name: v.string(),
            description: v.string()
        }))),
        amenities: v.optional(v.array(v.object({
            name: v.string(),
            description: v.string()
        }))),
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

export const unitType = query({
    args: {

    },
    handler: async (ctx, args) => {
        const properties = await ctx.db.query('property').collect()

        const unitTypes = Array.from(new Set(properties.map(property => property.unitType)));
        return unitTypes;
    }
})

export const saveProperty = mutation({
    args:{
        id: v.id('property')
    },
    handler: async(ctx, args) =>{
        const currentUserId = await getAuthUserId(ctx)
        if(!currentUserId) throw new ConvexError('No user found!')
        
        const existing = await ctx.db.query('saved_properties')
            .filter(q => q.eq(q.field('propertyId'), args.id))
            .filter(q => q.eq(q.field('userId'), currentUserId))
            .first()

        if(existing) {
            await ctx.db.delete(existing._id)

            return {
                process: "unsave"
            }
        } else {
            await ctx.db.insert('saved_properties', {
                userId: currentUserId,
                propertyId: args.id
            })
            return {
                process: "save"
            }
        }
    }
})

export const isSaved = query({
    args:{
        id: v.id('property')
    },
    handler: async(ctx, args) =>{
        const currentUserId = await getAuthUserId(ctx)

        if(!currentUserId) throw new ConvexError('NO user Found!')

        const saved = await ctx.db.get(args.id)

        if(saved !== null) {
            return true
        } else {
            return false
        }
    }
})

export const getSavedProperties = query({
    args:{

    },
    handler: async(ctx, args) =>{
        const currentUserId = await getAuthUserId(ctx)
        if(!currentUserId) throw new ConvexError('No user Found!')

        const savedProperties = await ctx.db.query('saved_properties')
            .filter(q => q.eq(q.field('userId'), currentUserId))
            .collect()

            const propertyWithUrls = await asyncMap(savedProperties, async (property) => {
                const prop = await ctx.db.get(property.propertyId)
                if(!prop) return null
          
                let displayImageUrl = null;
                let imageUrls = prop.otherImage ? prop.otherImage : [];
    
                const seller = await ctx.db.get(prop.sellerId)
                const sellerRatingsandReviews = await ctx.db.query('ratings_reviews')
                    .filter(q => q.eq(q.field('agentId'), prop.sellerId))
                    .order('desc')
                    .collect()
                let userImageUrl = undefined
                if(seller?.image){
                    userImageUrl = await ctx.storage.getUrl(seller.image as Id<'_storage'>)
                }
                if (typeof prop.displayImage === "string" && prop.displayImage.startsWith("https://")) {
                    displayImageUrl = prop.displayImage; // Direct link
                } else {
                    displayImageUrl = await ctx.storage.getUrl(prop.displayImage as Id<"_storage">); // Storage ID
                }
                if (prop.otherImage) {
                    if (displayImageUrl) {
                        imageUrls.unshift(displayImageUrl)
                        imageUrls = await asyncMap(prop.otherImage, async (id) => {
                            let url = null;
                            if (typeof id === "string" && id.startsWith("https://")) {
                                url = id;
                            } else {
                                url = await ctx.storage.getUrl(id as Id<"_storage">);
                            }
                            return url;
                        }).then((data) => data.filter(url => url !== null));
                    } else {
                        imageUrls = await asyncMap(prop.otherImage, async (id) => {
    
                            let url = null;
                            if (typeof id === "string" && id.startsWith("https://")) {
                                url = id;
                            } else {
                                url = await ctx.storage.getUrl(id as Id<"_storage">);
                            }
                            return url;
                        }).then((data) => data.filter(url => url !== null));
                    }
                }

            
                return {
                    ...prop,
                    displayImageUrl: displayImageUrl,
                    imageUrls: imageUrls,
                    isSaved: true,
                    agent: {
                        ...seller,
                        userImageUrl: userImageUrl,
                        ratingsAndReviews: sellerRatingsandReviews
                    }
                }
            })
            const filteredProp = propertyWithUrls.filter(p => p !== null)

            console.log(filteredProp)
        return filteredProp
    }
})

export const clearSavedProperties = mutation({
    handler: async(ctx) =>{
        const currentUserId = await getAuthUserId(ctx)
        if(!currentUserId) throw new ConvexError('NO user Found!')
        
        const savedProp = await ctx.db.query('saved_properties').filter(q => q.eq(q.field('userId'), currentUserId)).collect()

        await asyncMap(savedProp, async(prop)=>{
            await ctx.db.delete(prop._id)
        })
    }
})

export const filteredByTransaction = query({
    args:{
        transaction: v.string(),
        paginationOpts: paginationOptsValidator
    },
    handler: async (ctx, args) => {
        const currentUserId = await getAuthUserId(ctx)
        const properties = await ctx.db
            .query("property")
            .order("desc")
            .filter(q => q.eq(q.field('transactionType'), args.transaction))
            .paginate(args.paginationOpts)

        const propertyWithUrls = await asyncMap(properties.page, async (property) => {
            let isSaved = false
            if(!currentUserId) {
                isSaved = false
            }
            const saved = await ctx.db.query("saved_properties")
                .filter(q => q.eq(q.field('propertyId'), property._id))
                .filter(q => q.eq(q.field('userId'), currentUserId))
                .first()
            if(saved !== null){
                isSaved = true
            } 
            const seller = await ctx.db.get(property.sellerId)
            const sellerRatingsandReviews = await ctx.db.query('ratings_reviews')
                .filter(q => q.eq(q.field('agentId'), property.sellerId))
                .order('desc')
                .collect()
            let displayImageUrl = null;
            let imageUrls = property.otherImage ? property.otherImage : [];
            let userImageUrl = undefined
            if(seller?.image) {
                userImageUrl = await ctx.storage.getUrl(seller.image as Id<"_storage">)
            }

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
            } 
            return {
                ...property,
                displayImageUrl: displayImageUrl,
                imageUrls: imageUrls,
                isSaved: isSaved,
                agent: seller ? {
                    ...seller,
                    userImageUrl: userImageUrl === null ? undefined : userImageUrl,
                    ratingsAndReviews: sellerRatingsandReviews
                } : undefined
            }


        })
        return {
            page: propertyWithUrls,       // The transformed list
            isDone: properties.isDone,    // Preserve pagination status
            continueCursor: properties.continueCursor // Preserve pagination cursor
        };
    }
})