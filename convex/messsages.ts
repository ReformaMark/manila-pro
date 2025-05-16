import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const sendMessage = mutation({
  args: {
    receiverId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    let conversationId: Id<"conversations">;
    try {
      const data = await ctx.runMutation(internal.conversations.create, {
        receiverId: args.receiverId,
      });

      conversationId = data.conversationId;
    } catch (error) {
      console.error("Failed to create conversation:", error);
      return;
    }

    const userId = await getAuthUserId(ctx);

    if (!userId) return;

    const message = {
      conversationId: conversationId,
      senderId: userId,
      receiverId: args.receiverId,
      content: args.content,
      isRead: false,
    };
    const id = await ctx.db.insert("messages", message);

    return { id };
  },
});
