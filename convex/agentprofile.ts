import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { ConvexError, convexToJson, v } from "convex/values";

export const handlePersonalInfo = mutation({
    args: {
        userId: v.id("users"),
        fname: v.string(),
        lname: v.string(),
        contact: v.string(),
        bio: v.string(),
        houseNumber: v.string(),
        street: v.string(),
        barangay: v.string(),
        city: v.string(),
        image: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new ConvexError("Unauthorized")
        }

        const user = await ctx.db.get(userId)
        if (!user) {
            throw new ConvexError("User not found")
        }

        await ctx.db.patch(userId, {
            fname: args.fname,
            lname: args.lname,
            contact: args.contact,
            bio: args.bio,
            houseNumber: args.houseNumber,
            street: args.street,
            barangay: args.barangay,
            city: args.city,
            image: args.image,
        })

        return {
            success: true,
            message: "Personal information updated successfully"
        }
    }
})

export const handleProfessionalInfo = mutation({
    args: {
        userId: v.id("users"),
        agency: v.string(),
        officeAddress: v.optional(v.string()),
        experience: v.number(),
        title: v.string(),
        workingHours: v.optional(
            v.object({
                days: v.string(), // "Mon-Fri"
                hours: v.string(), // "9am-5pm"
            })
        ),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new ConvexError("Unauthorized")
        }

        const user = await ctx.db.get(userId)
        if (!user) {
            throw new ConvexError("User not found")
        }

        await ctx.db.patch(userId, {
            agentInfo: {
                agency: args.agency,
                officeAddress: args.officeAddress,
                experience: args.experience,
                title: args.title,
                workingHours: {
                    days: args.workingHours?.days || "",
                    hours: args.workingHours?.hours || "",
                },
            }
        })

        return {
            success: true,
            message: "Professional information updated successfully"
        }
    }
})

export const addToAgentInfo = mutation({
    args: {
        field: v.union(v.literal("specializations"), v.literal("languages"), v.literal("areasServed")),
        value: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new ConvexError("Unauthorized")
        }

        const user = await ctx.db.get(userId)
        if (!user) {
            throw new ConvexError("User not found")
        }

        const currentAgentInfo = user.agentInfo || {};
        const currentArray = currentAgentInfo[args.field] || [];

        if (!currentArray.includes(args.value)) {
            await ctx.db.patch(userId, {
                agentInfo: {
                    ...currentAgentInfo,
                    [args.field]: [...currentArray, args.value],
                },
            });
        }

        return {
            success: true,
            message: `${args.field} updated successfully`,
        };
    }
})

export const removeFromAgentInfo = mutation({
    args: {
        field: v.string(),
        values: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new ConvexError("Unauthorized");
        }

        const user = await ctx.db.get(userId);
        if (!user) {
            throw new ConvexError("User not found");
        }

        const currentAgentInfo = user.agentInfo || {};

        await ctx.db.patch(userId, {
            agentInfo: {
                ...currentAgentInfo,
                [args.field]: args.values,
            },
        });

        return {
            success: true,
            message: `removed from ${args.field}`,
        };
    },
});