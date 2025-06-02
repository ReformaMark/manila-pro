import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";

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