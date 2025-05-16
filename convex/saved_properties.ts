import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const getSavedProperties = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const savedProp = await ctx.db
      .query("saved_properties")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return savedProp;
  },
});
