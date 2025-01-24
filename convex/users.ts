import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { createAccount, getAuthUserId } from "@convex-dev/auth/server";
import { generateAdminId, generateSellerId } from "@/lib/utils";

export const createAdmin = mutation({
    args: {
        // accountId: v.string(),
        fname: v.string(),
        lname: v.string(),
        email: v.string(),
        contact: v.string(),
        houseNumber: v.string(),
        street: v.string(),
        barangay: v.string(),
        city: v.string(),
        realtyId: v.optional(v.id("realty"))
    },
    handler: async (ctx, args) => {
        try {
            const adminId = await getAuthUserId(ctx)

            if (!adminId) throw new ConvexError("Not authenticated");

            const admin = await ctx.db.get(adminId);

            if (!admin || admin.role !== "admin") {
                throw new ConvexError("Unauthorized - Only admins can create users");
            }

            const existingEmail = await ctx.db
                .query("users")
                .filter((q) => q.eq(q.field("email"), args.email))
                .first()

            if (existingEmail) throw new ConvexError("Email already exists")

            const role = "admin"
            const password = "123456" // generate random password and send it to email
            const accountId = generateAdminId();

            const { email, ...userData } = args;

            // @ts-expect-error - type error in convex auth
            const create = await createAccount(ctx, {
                provider: "password",
                account: {
                    id: email,
                    secret: password, // No need na to kasi ang password ata ay manggagaling sa email notification pero for the meantime lagay muna
                },
                profile: {
                    email,
                    role,
                    accountId,
                    ...userData,
                },
            })

            if (!create?.user._id) throw new ConvexError("Failed to create account")

            return create.user
        } catch (error) {
            console.error("Error in createAdmin:", error)
            throw error;
        }
    }
})

export const createSeller = mutation({
    args: {
        // accountId: v.string(),
        fname: v.string(),
        lname: v.string(),
        email: v.string(),
        contact: v.string(),
        houseNumber: v.string(),
        street: v.string(),
        barangay: v.string(),
        city: v.string(),
        realtyId: v.optional(v.id("realty"))
    },
    handler: async (ctx, args) => {
        try {
            const adminId = await getAuthUserId(ctx)
            if (!adminId) throw new ConvexError("Not authenticated");

            const admin = await ctx.db.get(adminId);
            if (!admin || admin.role !== "admin") {
                throw new ConvexError("Unauthorized - Only admins can create users");
            }

            const existingEmail = await ctx.db
                .query("users")
                .filter((q) => q.eq(q.field("email"), args.email))
                .first()

            if (existingEmail) throw new ConvexError("Email already exists")

            const role = "seller"
            const password = "123456" // TODO: generate random password and send it to email
            const accountId = generateSellerId();

            const { email, ...userData } = args;

            // @ts-expect-error - type error in convex auth
            const create = await createAccount(ctx, {
                provider: "password",
                account: {
                    id: email,
                    secret: password, // No need na to kasi ang password ata ay manggagaling sa email notification pero for the meantime lagay muna
                },
                profile: {
                    email,
                    role,
                    accountId,
                    ...userData,
                },
            })

            if (!create?.user._id) throw new ConvexError("Failed to create account")

            return create.user
        } catch (error) {
            console.error("Error in createAdmin:", error)
            throw error;
        }
    }
})

export const current = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;
        return await ctx.db.get(userId);
    },
});

export const role = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) return null

        const user = await ctx.db.get(userId)
        return user?.role
    }
})

export const get = query({
    args: {
        role: v.union(
            v.literal("admin"),
            v.literal("buyer"),
            v.literal("seller")
        )
    },
    handler: async (ctx, args) => {
        const adminId = await getAuthUserId(ctx)

        if (!adminId) throw new ConvexError("Not authenticated");

        const admin = await ctx.db.get(adminId);

        if (!admin || admin.role !== "admin") {
            throw new ConvexError("Unauthorized - Only admins can create users");
        }

        return await ctx.db
            .query("users")
            .filter((q) =>
                q.and(
                    q.eq(q.field("role"), args.role),
                    q.neq(q.field("_id"), adminId)
                )
            )
            .collect()
    }
})

export const updateAdmin = mutation({
    args: {
        id: v.id("users"),
        fname: v.string(),
        lname: v.string(),
        email: v.string(),
        contact: v.string(),
        houseNumber: v.string(),
        street: v.string(),
        barangay: v.string(),
        city: v.string(),
        realtyId: v.optional(v.id("realty")),
    },
    handler: async (ctx, args) => {
        const adminId = await getAuthUserId(ctx);
        if (!adminId) throw new ConvexError("Not authenticated");

        const admin = await ctx.db.get(adminId);
        if (!admin || admin.role !== "admin") {
            throw new ConvexError("Unauthorized - Only admins can update users");
        }

        const { id, ...updates } = args;
        const existingAdmin = await ctx.db.get(id);

        if (!existingAdmin) {
            throw new ConvexError("Admin not found");
        }

        if (existingAdmin.role !== "admin") {
            throw new ConvexError("Can only update admin users");
        }

        await ctx.db.patch(id, updates);
        return await ctx.db.get(id);
    },
});

export const updateSeller = mutation({
    args: {
        id: v.id("users"),
        fname: v.string(),
        lname: v.string(),
        email: v.string(),
        contact: v.string(),
        houseNumber: v.string(),
        street: v.string(),
        barangay: v.string(),
        city: v.string(),
        realtyId: v.optional(v.id("realty")),
    },
    handler: async (ctx, args) => {
        const adminId = await getAuthUserId(ctx);
        if (!adminId) throw new ConvexError("Not authenticated");

        const admin = await ctx.db.get(adminId);
        if (!admin || admin.role !== "admin") {
            throw new ConvexError("Unauthorized - Only admins can update users");
        }

        const { id, ...updates } = args;
        const existingSeller = await ctx.db.get(id);

        if (!existingSeller) {
            throw new ConvexError("Seller not found");
        }

        if (existingSeller.role !== "seller") {
            throw new ConvexError("Can only update admin users");
        }

        await ctx.db.patch(id, updates);
        return await ctx.db.get(id);
    },
});