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
    propertyId: v.id("property"),
    name: v.string(), // name of the place
    type: v.string(),
    coordinates: v.array(v.number()), // coordinates
    distance: v.number(), // in km
    travelTime: v.string(), // in minutes
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      await ctx.db.insert('nearby_places', {
        ...args
      });
    } catch (error) {
      throw new Error(`Failed to add nearby place: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

export const getByPropertyId = query({
  args: {
    propertyId: v.id("property"),
  },
  handler: async (ctx, args) => {
    try {
      return await ctx.db.query('nearby_places').withIndex('by_propertyId', q => q.eq('propertyId', args.propertyId)).collect();
    } catch (error) {
      throw new Error(`Failed to add nearby place: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});
export const removeNearbyPlace = mutation({
  args: {
    id: v.id("nearby_places"),
  },
  handler: async (ctx, args) => {
    try {
      await ctx.db.delete(args.id)
    } catch (error) {
      throw new Error(`Failed to add nearby place: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});
