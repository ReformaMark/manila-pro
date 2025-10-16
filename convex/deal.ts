import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { asyncMap } from "convex-helpers";
import { Id } from "./_generated/dataModel";
import { ConvexError, v } from "convex/values";

export const proposals = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const proposals = await ctx.db
      .query("deal")
      .filter((q) => q.eq(q.field("buyerId"), userId))
      .order("desc")
      .collect();

    const proposalWithProperty = await asyncMap(proposals, async (proposal) => {
      const property = await ctx.db.get(proposal.propertyId);
      if (!property) return null;
      const agent = await ctx.db.get(property.sellerId);
      if (!agent) return null;
      return {
        ...proposal,
        property: property,
        agent: agent,
      };
    });

    return proposalWithProperty.filter((proposal) => proposal !== null);
  },
});

export const getProposalById = query({
  args: {
    id: v.id("deal"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const proposal = await ctx.db.get(args.id);
    if (!proposal) {
      throw new Error("Proposal not found");
    }
    if (proposal.buyerId !== userId) {
      throw new Error("User not authorized to view this proposal");
    }
    const property = await ctx.db.get(proposal.propertyId);
    if (!property) {
      throw new Error("Property not found");
    }
    const agent = await ctx.db.get(property.sellerId);
    if (!agent) return null;
    const agentImageUrl = agent.image
      ? await ctx.storage.getUrl(agent.image as Id<"_storage">)
      : undefined;
    return {
      ...proposal,
      property: property,
      agent: {
        ...agent,
        imageUrl: agentImageUrl,
      },
    };
  },
});

export const createProposal = mutation({
  args: {
    propertyId: v.id("property"),
    agentId: v.id("users"),
    price: v.number(),
    message: v.optional(v.string()),
    duration: v.optional(v.number()),
    moveInDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const proposal = await ctx.db.insert("deal", {
      propertyId: args.propertyId,
      buyerId: userId,
      sellerId: args.agentId,
      status: "pending_approval",
      requestDate: Date.now(),
      proposal: {
        offer: args.price,
        message: args.message,
        moveInDate: args.moveInDate,
        duration: args.duration,
      },
    });
  },
});

export const acceptCounterOffer = mutation({
  args: {
    id: v.id("deal"),
    isAccepted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const proposal = await ctx.db.get(args.id);
    if (!proposal) {
      throw new Error("Proposal not found");
    }
    if (proposal.sellerId !== userId) {
      throw new Error("User not authorized to accept this proposal");
    }
    if (args.isAccepted) {
      await ctx.db.patch(args.id, {
        status: "approved",
        finalDealPrice: proposal.proposal.counterOffer?.price,
      });
    } else {
      await ctx.db.patch(args.id, {
        status: "rejected",
      });
    }
  },
});

export const handleDealStatus = mutation({
  args: {
    dealId: v.id("deal"),
    propertyId: v.id("property"),
    status: v.union(
      v.literal("pending_approval"), // Initial state when buyer makes an offer
      v.literal("negotiating"), // When seller is sending counter offers
      v.literal("approved"), // Seller approved the deal
      v.literal("rejected"), // Seller rejected the deal
      v.literal("active"), // Deal is active, payments ongoing
      v.literal("completed"), // All payments made, deal fulfilled
      v.literal("cancelled") // Deal cancelled after approval or cinancel ni buyer
    ),

    // ! When approving a request.
    finalDealPrice: v.optional(v.number()),
    agreedTermInMonths: v.optional(v.number()),
    downPayment: v.optional(v.number()),
  },
  handler: async (
    ctx,
    {
      dealId,
      propertyId,
      status,
      agreedTermInMonths,
      downPayment,
      finalDealPrice,
    }
  ) => {
    // * 1.) Authorization Check
    const sellerId = await getAuthUserId(ctx);
    if (!sellerId)
      throw new ConvexError("Unauthorized to handle a deal status.");

    const seller = await ctx.db.get(sellerId);
    if (!seller || seller.role !== "seller")
      throw new ConvexError(
        "Unauthorized: Only sellers can handle a deal status"
      );

    // * 2.) Handle Rejected Transactions.
    if (status === "rejected") {
      return await ctx.db.patch(dealId, {
        status,
      });
    }

    // * 3.) Handle Accepted Transactions.
    // * FLOW: when args status is active, patch it and also patch the property to be reserved or sold. Reasoning: Para hindi na makikita sa frontend yung property na iyon. Magssold lang to if one time payment. Also, finalDealPrice, downPayment, agreedTermInMonths ilagay sa deal.
    // TODO: Determine kung pano siya malalaman if one time payment (as in babayaran agad) para sold na yung status at hindi reserved
    // TODO: finalDealPrice - Down Payment) / Term. Determine first san kukunin down payment.

    if (status === "active") {
      const dateTodayInUnix = Math.floor(Date.now() / 1000);

      if (
        finalDealPrice === undefined ||
        downPayment === undefined ||
        agreedTermInMonths === undefined
      ) {
        throw new ConvexError(
          "Missing required fields (finalDealPrice, downPayment, agreedTermInMonths) for approving the deal."
        );
      }

      if (agreedTermInMonths <= 0) {
        throw new ConvexError(
          "Agreed term in months must be greater than zero."
        );
      }

      const agreedMonthlyAmortization =
        (finalDealPrice - downPayment) / agreedTermInMonths;

      await ctx.db.patch(dealId, {
        status,
        approvalDate: dateTodayInUnix,
        finalDealPrice,
        downPayment,
        agreedTermInMonths,
        agreedMonthlyAmortization,
      });

      await ctx.db.patch(propertyId, {
        status: "reserved",
      });

      return "Success";
    }

    throw new ConvexError(`Unhandled deal status: ${status}`);
  },
});

export const getTransactions = query({
  args: {
    agentId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const transactions = await ctx.db
      .query("deal")
      .filter((q) => q.eq(q.field("sellerId"), args.agentId))
      .collect();
    return transactions;
  },
});

// Contract/Document Management
export const uploadContract = mutation({
  args: {
    dealId: v.id("deal"),
    storageId: v.id("_storage"),
    documentType: v.string(), // "contract", "payment_record", "agreement", etc.
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "seller") {
      throw new ConvexError("Only sellers can upload contracts");
    }

    // Verify the deal exists and belongs to the seller
    const deal = await ctx.db.get(args.dealId);
    if (!deal) throw new ConvexError("Deal not found");

    if (deal.sellerId !== userId) {
      throw new ConvexError("You can only upload contracts for your own deals");
    }

    // Insert the document record
    const documentId = await ctx.db.insert("document", {
      dealId: args.dealId,
      documentType: args.documentType,
      file: args.storageId,
    });

    return documentId;
  },
});

export const getContractsByDeal = query({
  args: {
    dealId: v.id("deal"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const deal = await ctx.db.get(args.dealId);
    if (!deal) throw new ConvexError("Deal not found");

    // Allow both buyer and seller to view contracts
    if (deal.buyerId !== userId && deal.sellerId !== userId) {
      throw new ConvexError("You can only view contracts for your own deals");
    }

    const documents = await ctx.db
      .query("document")
      .filter((q) => q.eq(q.field("dealId"), args.dealId))
      .collect();

    // Get URLs for all documents
    const documentsWithUrls = await asyncMap(documents, async (doc) => {
      const url = await ctx.storage.getUrl(doc.file as Id<"_storage">);
      return {
        ...doc,
        fileUrl: url,
      };
    });

    return documentsWithUrls;
  },
});

export const deleteContract = mutation({
  args: {
    documentId: v.id("document"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const document = await ctx.db.get(args.documentId);
    if (!document) throw new ConvexError("Document not found");

    const deal = await ctx.db.get(document.dealId);
    if (!deal) throw new ConvexError("Deal not found");

    // Only seller can delete contracts
    if (deal.sellerId !== userId) {
      throw new ConvexError("Only the seller can delete contracts");
    }

    // Delete the file from storage
    await ctx.storage.delete(document.file as Id<"_storage">);

    // Delete the document record
    await ctx.db.delete(args.documentId);

    return { success: true };
  },
});

// Mark deal as completed
export const markDealAsCompleted = mutation({
  args: {
    dealId: v.id("deal"),
    propertyId: v.id("property"),
    remarks: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user || user.role !== "seller") {
      throw new ConvexError("Only sellers can mark deals as completed");
    }

    const deal = await ctx.db.get(args.dealId);
    if (!deal) throw new ConvexError("Deal not found");

    if (deal.sellerId !== userId) {
      throw new ConvexError("You can only complete your own deals");
    }

    if (deal.status !== "active") {
      throw new ConvexError("Only active deals can be marked as completed");
    }

    // Update deal status to completed
    await ctx.db.patch(args.dealId, {
      status: "completed",
      remarks: args.remarks,
    });

    // Update property status to sold
    await ctx.db.patch(args.propertyId, {
      status: "sold",
    });

    return { success: true, message: "Deal marked as completed successfully" };
  },
});
