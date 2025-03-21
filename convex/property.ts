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
    args: { },
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
      
            if(property.otherImage){
               if(displayImageUrl) {
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
            }  else {
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
            return{
                ...property,
                displayImageUrl: displayImageUrl,
                imageUrls: imageUrls
            }
              
            } else {
                return{
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