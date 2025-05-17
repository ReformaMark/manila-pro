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
    if (!userId) return null;
    const conversations = await getConversations(ctx);
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

export const conversations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const initConversations = await getConversations(ctx);

    const conversations = await asyncMap(
      initConversations,
      async (conversation) => {
        let unreadMesCount: number = 0;

        const count = conversation.messages.filter(
          (mes) => mes.receiverId === userId && !mes.isRead
        ).length;
        unreadMesCount = unreadMesCount + count;
        const otherParticipantId = conversation.participantsId.find(
          (id) => id !== userId
        );
        const receiver = otherParticipantId
          ? await ctx.db.get(otherParticipantId)
          : null;

        if (receiver === null) return null;

        const imageUrl = receiver?.image
          ? receiver?.image.startsWith("https://")
            ? receiver?.image
            : await ctx.storage.getUrl(receiver.image as Id<"_storage">)
          : null;
        return {
          ...conversation,
          receiver: {
            ...receiver,
            imageUrl: imageUrl,
          },
          unreadMessages: count,
        };
      }
    );

    return conversations.filter((c) => c != null);
  },
});

const getConversations = async (ctx: QueryCtx) => {
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

export const markAsRead = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();
    const filteredMessages = messages.filter(
      (mes) => mes.receiverId === userId
    );

    if (filteredMessages.length > 0) {
      await asyncMap(filteredMessages, async (message) => {
        await ctx.db.patch(message._id, {
          isRead: true,
        });
      });
    }
  },
});
