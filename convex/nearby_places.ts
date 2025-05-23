import { v } from "convex/values";
import { query } from "./_generated/server";

export const nearbyPlaces = query({
  args: {
    propertyId: v.id("property"),
  },
  handler: async (ctx, args) => {
    const nearbyPlaces = await ctx.db
      .query("nearby_places")
      .withIndex("by_propertyId", (q) => q.eq("propertyId", args.propertyId))
      .collect();

    return nearbyPlaces;
  },
});
