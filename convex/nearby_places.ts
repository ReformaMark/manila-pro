import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const nearbyPlaces = query({
  args: {
    propertyId: v.optional(v.id("property")),
  },
  handler: async (ctx, args) => {
    if (!args.propertyId) {
      return [];
    } else {
      const nearbyPlaces = await ctx.db
        .query("nearby_places")
        .withIndex("by_propertyId", (q) => q.eq("propertyId", args.propertyId as Id<'property'>))   
        .collect();
      return nearbyPlaces;
    }
  },
});
export const addNearbyPlace = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    coordinates: v.array(v.number()),
    distance: v.string(),
    travelTime: v.string(),
  },
  handler: async (ctx, args) => {
   
  },
});
