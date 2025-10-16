import { ConvexError, v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { modifyAccountCredentials } from "@convex-dev/auth/server";

export const checkTokenValidity = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const resetToken = await ctx.db
      .query("passwordResetTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!resetToken) {
      return null;
    }

    // Check if token is expired or used
    if (resetToken.expiresAt < Date.now() || resetToken.used) {
      return null;
    }

    return resetToken;
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const createResetToken = mutation({
  args: {
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    // Clean up old tokens for this user
    const oldTokens = await ctx.db
      .query("passwordResetTokens")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const oldToken of oldTokens) {
      await ctx.db.delete(oldToken._id);
    }

    // Create new token
    return await ctx.db.insert("passwordResetTokens", {
      userId: args.userId,
      token: args.token,
      expiresAt: args.expiresAt,
    });
  },
});

export const markTokenAsUsed = mutation({
  args: {
    tokenId: v.id("passwordResetTokens"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.tokenId, { used: true });
  },
});

export const getToken = query({
  args: {
    tokenId: v.id("passwordResetTokens"),
  },
  handler: async (ctx, args) => {
    const token = await ctx.db.get(args.tokenId);
    if (!token) throw new ConvexError("No password reset token found!.");

    return token;
  },
});

export const updatePassword = mutation({
  args: {
    email: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // You should add authentication and authorization checks here!
    // const user = await ctx.db
    //   .query("users")
    //   .withIndex("by_email", (q) => q.eq("email", args.email))
    //   .unique();

    // if (!user) throw new Error("User not found!");

    const providerId = "password";
    const account = {
      id: args.email,
      secret: args.newPassword,
    };
    // @ts-expect-error - type error in convex auth
    await modifyAccountCredentials(ctx, {
      provider: providerId,
      account,
    });
  },
});
