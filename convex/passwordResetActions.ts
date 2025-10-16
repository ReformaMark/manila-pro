"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import crypto from "crypto";
import { Doc, Id } from "./_generated/dataModel";

export const requestPasswordReset = action({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Find user by email
    const user: Doc<"users"> | null = await ctx.runQuery(
      api.passwordReset.getUserByEmail,
      {
        email: args.email,
      }
    );

    if (!user) {
      // Don't reveal if email exists or not for security
      return { success: true, result: null };
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour from now

    // Store reset token
    const tokenId: Id<"passwordResetTokens"> = await ctx.runMutation(
      api.passwordReset.createResetToken,
      {
        userId: user._id,
        token,
        expiresAt,
      }
    );

    const result: Doc<"passwordResetTokens"> = await ctx.runQuery(
      api.passwordReset.getToken,
      { tokenId: tokenId }
    );

    return { success: true, result: result };
  },
});

export const resetPassword = action({
  args: {
    token: v.string(),
    email: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify token
    const resetToken = await ctx.runQuery(
      api.passwordReset.checkTokenValidity,
      {
        token: args.token,
      }
    );

    if (!resetToken) {
      throw new Error("Invalid or expired reset token");
    }

    // Mark token as used
    await ctx.runMutation(api.passwordReset.markTokenAsUsed, {
      tokenId: resetToken._id,
    });

    await ctx.runMutation(api.passwordReset.updatePassword, {
      email: args.email,
      newPassword: args.newPassword,
    });

    return { success: true };
  },
});
