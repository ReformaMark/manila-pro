import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getSavedSearches = query({
  handler: async (ctx) => {
    const currentUserId = await getAuthUserId(ctx);

    if (!currentUserId) throw new Error("No userid found!");

    const searches = await ctx.db
      .query("saved_searches")
      .withIndex("by_userId", (q) => q.eq("userId", currentUserId))
      .order("desc")
      .collect();

    const result = searches.map((item) => {
      return {
        _id: item._id,
        userId: item.userId,
        name: item.name,
        query: item.query,
        filters: {
          transactionType: item.transactionType,
          unitType: item.unitType,
          location: item.location,
          bedrooms: item.bedrooms,
          bathrooms: item.bathrooms,
          priceRange: item.priceRange,
          amenities: item.amenities,
          facilities: item.facilities,
        },
      };
    });

    return result;
  },
});

export const addSavedSearch = mutation({
  args: {
    query: v.string(),
    name: v.string(),
    transactionType: v.string(),
    unitType: v.string(),
    location: v.string(),
    bedrooms: v.number(),
    bathrooms: v.number(),
    priceRange: v.array(v.number()),
    amenities: v.array(v.string()),
    facilities: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);

    if (!currentUserId) throw new Error("No userid found!");
    const savedSearchesCount = await ctx.db
      .query("saved_searches")
      .withIndex("by_userId", (q) => q.eq("userId", currentUserId))
      .collect();

    if (savedSearchesCount.length >= 10)
      throw new Error("Maximum of 10 saved search filters allowed.");

    await ctx.db.insert("saved_searches", {
      userId: currentUserId,
      ...args,
    });

    return { success: true };
  },
});

export const deleteSavedSearch = mutation({
  args: {
    savedSearchId: v.id("saved_searches"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);

    if (!currentUserId) throw new Error("No userid found!");

    await ctx.db.delete(args.savedSearchId);

    return { success: true };
  },
});

export const deleteAllSavedSearch = mutation({
  handler: async (ctx) => {
    const currentUserId = await getAuthUserId(ctx);

    if (!currentUserId) throw new Error("No userid found!");
    const savedSearches = await ctx.db
      .query("saved_searches")
      .withIndex("by_userId", (q) => q.eq("userId", currentUserId))
      .collect();

    savedSearches.forEach(async (savedSearch) => {
      await ctx.db.delete(savedSearch._id);
    });

    return { success: true };
  },
});
