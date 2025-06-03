import { v } from "convex/values";
import { query } from "./_generated/server";
import { asyncMap } from "convex-helpers";
import { Id } from "./_generated/dataModel";

export const getAgentRatingsAndReviews = query({
  args: {
    agentId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const agent = await ctx.db.get(args.agentId)
    if(!agent) return undefined

    const agentImage = agent.image ? await ctx.storage.getUrl(agent.image as Id<'_storage'>) : null
    const ratingsReviews = await ctx.db
      .query("ratings_reviews")
      .filter((q) => q.eq(q.field("agentId"), args.agentId))
      .collect();

    const reviewsWithUser = await asyncMap(ratingsReviews, async (reviews) => {
      const user = await ctx.db.get(reviews.userId);
      if (!user) return null;
      const userImageUrl = user.image
        ? await ctx.storage.getUrl(user.image)
        : undefined;

      return {
        ...reviews,
        user: {
          ...user,
          imageUrl: userImageUrl,
        },
      };
    });

    const totalRatings = ratingsReviews.reduce(
      (sum, review) => sum + (review.ratings || 0),
      0
    );
    const agentRatings =
      ratingsReviews.length > 0 ? totalRatings / ratingsReviews.length : 0;

     
    return {
      agent: {
        ...agent,
        imageUrl: agentImage
      },
      rating: agentRatings,
      reviews: reviewsWithUser.filter((r) => r != null),
    };
  },
});
