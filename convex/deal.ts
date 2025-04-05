import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { asyncMap } from "convex-helpers";
import { Id } from "./_generated/dataModel";
import { v } from "convex/values";

export const proposals = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("User not authenticated");
        }
        const proposals = await ctx.db.query("deal")
            .filter(q => q.eq(q.field("buyerId"), userId))
            .collect();

        const proposalWithProperty = await asyncMap(proposals, async (proposal) => {
            const property = await ctx.db.get(proposal.propertyId);
            if(!property) return null;
            const agent = await ctx.db.get(property.sellerId); 
            if(!agent) return null;
            return {
                ...proposal,
                property: property,
                agent: agent,
            };
        }
        );

        return proposalWithProperty.filter((proposal) => proposal !== null);
    }
});

export const getProposalById = query({
    args:{
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
        if(!agent) return null;
        const agentImageUrl = agent.image ? await ctx.storage.getUrl(agent.image as Id<'_storage'>) : undefined;
        return {
            ...proposal,
            property: property,
            agent: {
                ...agent,
                imageUrl: agentImageUrl,
            },
        };
    }
});

export const createProposal = mutation({
    args:{
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
            }
        });

    }
});

export const acceptCounterOffer = mutation({
    args:{
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
        if(args.isAccepted){
            await ctx.db.patch(args.id, {
                status: "approved",
                dealPrice: proposal.proposal.counterOffer?.price,
            });
        } else {
            await ctx.db.patch(args.id, {
                status: "rejected",
            });
        }
    }
});