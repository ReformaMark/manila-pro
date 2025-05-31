import { v } from "convex/values";
import { query } from "./_generated/server";
import { asyncMap } from "convex-helpers";

export const getAgentRatingsAndReviews = query({
  args: {
    agentId: v.id("users"),
  },
  handler: async (ctx, args) => {
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
      rating: agentRatings,
      reviews: reviewsWithUser.filter((r) => r != null),
    };
  },
});
