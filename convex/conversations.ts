import { getAuthUserId } from "@convex-dev/auth/server";
import {
  internalMutation,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { asyncMap } from "convex-helpers";

export const create = internalMutation({
  args: {
    receiverId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const conversationId = await createConversation(ctx, args.receiverId);

    return { conversationId };
  },
});

const createConversation = async (
  ctx: MutationCtx,
  receiverId: Id<"users">
) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new ConvexError("No user Found!");
  const conversations = await ctx.db.query("conversations").collect();

  const userConvo = conversations.find(
    (convo) =>
      convo.participantsId.includes(userId) &&
      convo.participantsId.includes(receiverId)
  );

  if (!userConvo) {
    const id = await ctx.db.insert("conversations", {
      participantsId: [userId, receiverId],
    });
    return id;
  } else {
    return userConvo._id;
  }
};

export const getUnreadMessagesNumber = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const conversations = await getConverstions(ctx);
    let unreadMesCount: number = 0;
    await asyncMap(conversations, async (conversation) => {
      const count = conversation.messages.filter(
        (mes) => mes.receiverId === userId && !mes.isRead
      ).length;
      unreadMesCount = unreadMesCount + count;
    });

    return unreadMesCount;
  },
});

const getConverstions = async (ctx: QueryCtx) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new ConvexError("No user Found!");
  const conversations = await ctx.db
    .query("conversations")
    .order("desc")
    .collect();
  const userConvos = conversations.filter((convo) =>
    convo.participantsId.includes(userId)
  );

  const convoWithMessages = await asyncMap(userConvos, async (conversation) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", conversation._id)
      )
      .order("desc")
      .collect();

    return {
      ...conversation,
      messages: messages,
    };
  });
  return convoWithMessages;
};
