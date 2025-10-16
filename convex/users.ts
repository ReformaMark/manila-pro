import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { createAccount, getAuthUserId } from "@convex-dev/auth/server";
import {
  generateAdminId,
  generateBuyerId,
  generateSellerId,
} from "@/lib/utils";
import { paginationOptsValidator } from "convex/server";
import { asyncMap } from "convex-helpers";
import { Id } from "./_generated/dataModel";

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
    realtyId: v.optional(v.id("realty")),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const adminId = await getAuthUserId(ctx);

      if (!adminId) throw new ConvexError("Not authenticated");

      const admin = await ctx.db.get(adminId);

      if (!admin || admin.role !== "admin") {
        throw new ConvexError("Unauthorized - Only admins can create users");
      }

      const existingEmail = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), args.email))
        .first();

      if (existingEmail) throw new ConvexError("Email already exists");

      const role = "admin";
      const accountId = generateAdminId();

      const { email, password, ...userData } = args;

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
      });

      if (!create?.user._id) throw new ConvexError("Failed to create account");

      // Log the activity
      await ctx.db.insert("admin_activity_logs", {
        adminId: adminId,
        action: "created_admin",
        actionType: "create",
        description: `Created new admin account: ${args.fname} ${args.lname}`,
        targetType: "user",
        targetId: create.user._id,
        metadata: {
          userName: `${args.fname} ${args.lname}`,
        },
        timestamp: Date.now(),
      });

      return create.user;
    } catch (error) {
      console.error("Error in createAdmin:", error);
      throw error;
    }
  },
});

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
    password: v.string(),
    // realtyId: v.optional(v.id("realty"))
  },
  handler: async (ctx, args) => {
    try {
      const adminId = await getAuthUserId(ctx);
      if (!adminId) throw new ConvexError("Not authenticated");

      const admin = await ctx.db.get(adminId);
      if (!admin || admin.role !== "admin") {
        throw new ConvexError("Unauthorized - Only admins can create users");
      }

      const existingEmail = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), args.email))
        .first();

      if (existingEmail) throw new ConvexError("Email already exists");

      const role = "seller";
      const accountId = generateSellerId();

      const { email, password, ...userData } = args;

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
      });

      if (!create?.user._id) throw new ConvexError("Failed to create account");

      // Log the activity
      await ctx.db.insert("admin_activity_logs", {
        adminId: adminId,
        action: "created_seller",
        actionType: "create",
        description: `Created new seller account: ${args.fname} ${args.lname}`,
        targetType: "user",
        targetId: create.user._id,
        metadata: {
          userName: `${args.fname} ${args.lname}`,
        },
        timestamp: Date.now(),
      });

      return create.user;
    } catch (error) {
      console.error("Error in createAdmin:", error);
      throw error;
    }
  },
});

export const createBuyer = mutation({
  args: {
    fname: v.string(),
    lname: v.string(),
    email: v.string(),
    password: v.string(),
    contact: v.string(),
    houseNumber: v.string(),
    street: v.string(),
    barangay: v.string(),
    city: v.string(),
    phoneVerified: v.boolean(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    const existingEmail = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingEmail) {
      throw new ConvexError({
        code: "EMAIL_EXISTS",
        message: "Email already exists",
      });
    }

    const existingPhone = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("phone"), args.phone))
      .first();
    if (existingPhone) {
      throw new ConvexError({
        code: "PHONE_EXIST",
        message: "Phone number already exists",
      });
    }
    const role = "buyer";
    const accountId = generateBuyerId();
    const { email, password, ...userData } = args;

    // @ts-expect-error - type error in convex auth
    const create = await createAccount(ctx, {
      provider: "password",
      account: {
        id: email,
        secret: password,
      },
      profile: {
        email,
        role,
        accountId,
        ...userData,
      },
    });

    if (!create?.user._id) throw new ConvexError("Failed to create account");

    return { success: true };
  },
});

export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db.get(userId);
  },
});

export const currentWithDisplayImage = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);

    const userDisplayImage = user?.image
      ? await ctx.storage.getUrl(user.image as Id<"_storage">)
      : undefined;

    return {
      user,
      displayImage: userDisplayImage,
    };
  },
});

export const role = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    return user?.role;
  },
});

export const get = query({
  args: {
    role: v.union(v.literal("admin"), v.literal("buyer"), v.literal("seller")),
  },
  handler: async (ctx, args) => {
    const adminId = await getAuthUserId(ctx);

    if (!adminId) throw new ConvexError("Not authenticated");

    const admin = await ctx.db.get(adminId);

    if (!admin || admin.role !== "admin") {
      throw new ConvexError("Unauthorized - Only admins can create users");
    }

    return await ctx.db
      .query("users")
      .filter((q) =>
        q.and(q.eq(q.field("role"), args.role), q.neq(q.field("_id"), adminId))
      )
      .collect();
  },
});

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

export const getCounts = query({
  args: {},
  handler: async (ctx) => {
    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new ConvexError("Not authenticated");

    const admin = await ctx.db.get(adminId);
    if (!admin || admin.role !== "admin") {
      throw new ConvexError("Unauthorized");
    }

    const buyers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "buyer"))
      .collect();

    const sellers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "seller"))
      .collect();

    const admins = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "admin"))
      .collect();

    return {
      total: buyers.length + sellers.length + admins.length,
      buyers: buyers.length,
      sellers: sellers.length,
      admins: admins.length,
    };
  },
});

export const getAgents = query({
  args: {
    searchTerm: v.string(), //name
    location: v.string(),
    specialization: v.string(),
    yearsOfExperience: v.number(),
    language: v.array(v.string()),
    sort: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    let agents = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "seller"));

    if (args.location !== "All Locations") {
      agents = agents.filter((q) => q.eq(q.field("city"), args.location));
    }
    if (args.yearsOfExperience !== 0) {
      agents = agents.filter((q) =>
        q.gte(q.field("agentInfo.experience"), args.yearsOfExperience)
      );
    }

    // if(args.specialization !== "All Specializations") {
    //     agents = agents.filter(q => q.eq(q.field("role"), "seller"))
    // }
    const transactions = await ctx.db
      .query("deal")
      .filter((q) => q.eq(q.field("status"), "completed"))
      .collect();

    const ratingsReviews = await ctx.db.query("ratings_reviews").collect();

    const a = await agents.paginate(args.paginationOpts);
    const agentsWithDetails = await asyncMap(a.page, async (agent) => {
      const imageUrl = agent.image
        ? await ctx.storage.getUrl(agent.image as Id<"_storage">)
        : undefined;
      const filteredTransactions = transactions.filter(
        (t) => t.sellerId === agent._id
      );
      const agentRatingsAndReviews = ratingsReviews.filter(
        (r) => r.agentId === agent._id
      );
      const totalRatings = agentRatingsAndReviews.reduce(
        (sum, review) => sum + (review.ratings || 0),
        0
      );
      const agentRatings =
        agentRatingsAndReviews.length > 0
          ? totalRatings / agentRatingsAndReviews.length
          : 0;

      return {
        ...agent,
        transactions: filteredTransactions.length,
        rating: agentRatings,
        reviews: agentRatingsAndReviews.length,
        imageUrl: imageUrl === null ? undefined : imageUrl,
      };
    });

    let temp = agentsWithDetails;
    if (args.specialization !== "All Specializations") {
      temp = agentsWithDetails.filter((a) => {
        const isSpecialized =
          a.agentInfo?.specializations?.includes(args.specialization) ?? false;
        return isSpecialized;
      });
    }

    if (args.language.length >= 1) {
      temp = agentsWithDetails.filter((a) => {
        args.language.some((language) =>
          a.agentInfo?.languages?.includes(language)
        );
      });
    }

    if (args.sort === "Highest Rating") {
      temp.sort((a, b) => b.rating - a.rating);
    }

    if (args.sort === "Most Transactions") {
      temp = temp.sort((a, b) => b.transactions - a.transactions);
    }
    if (args.sort === "Name (A-Z)") {
      temp = temp.sort((a, b) => a.fname.localeCompare(b.fname));
    }
    if (args.sort === "Most Experience") {
      temp.sort(
        (a, b) =>
          (b.agentInfo?.experience || 0) - (a.agentInfo?.experience || 0)
      );
    }
    return {
      page: temp,
      isDone: a.isDone,
      continueCursor: a.continueCursor,
    };
  },
});

export const featuredAgents = query({
  args: {},
  handler: async (ctx) => {
    const agents = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "seller"))
      .collect();
    const transactions = await ctx.db
      .query("deal")
      .filter((q) => q.eq(q.field("status"), "completed"))
      .collect();

    const ratingsReviews = await ctx.db.query("ratings_reviews").collect();

    const agentsWithDetails = await asyncMap(agents, async (agent) => {
      const imageUrl = agent.image
        ? await ctx.storage.getUrl(agent.image as Id<"_storage">)
        : undefined;
      const filteredTransactions = transactions.filter(
        (t) => t.sellerId === agent._id
      );
      const agentRatingsAndReviews = ratingsReviews.filter(
        (r) => r.agentId === agent._id
      );
      const totalRatings = agentRatingsAndReviews.reduce(
        (sum, review) => sum + (review.ratings || 0),
        0
      );
      const agentRatings =
        agentRatingsAndReviews.length > 0
          ? totalRatings / agentRatingsAndReviews.length
          : 0;

      return {
        ...agent,
        transactions: filteredTransactions.length,
        rating: agentRatings,
        reviews: agentRatingsAndReviews.length,
        imageUrl: imageUrl === null ? undefined : imageUrl,
      };
    });

    const filteredAgents = agentsWithDetails
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 2);

    return filteredAgents;
  },
});

export const getAgentById = query({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const agent = await ctx.db.get(args.id);
    if (!agent) return null;
    const imageUrl = agent.image
      ? await ctx.storage.getUrl(agent.image as Id<"_storage">)
      : undefined;

    return {
      ...agent,
      imageUrl: imageUrl === null ? undefined : imageUrl,
    };
  },
});

export const updateProfile = mutation({
  args: {
    image: v.string(),
    fname: v.string(),
    lname: v.string(),
    email: v.string(),
    contact: v.string(),
    city: v.string(),
    bio: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("NO user found!");

    await ctx.db.patch(userId, {
      ...args,
    });
  },
});

export const getImageUrl = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const user = await ctx.db.get(userId);
    if (!user) return null;
    if (user.image) {
      return await ctx.storage.getUrl(user.image);
    }
  },
});
export const saveImage = mutation({
  args: {
    imageStorageId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("NO user found!");

    await ctx.db.patch(userId, {
      image: args.imageStorageId,
    });
  },
});

export const agentCount = query({
  args: {},
  handler: async (ctx) => {
    const agent = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "seller"))
      .collect();

    return agent.length;
  },
});

export const verifyPhone = mutation({
  handler: async (ctx) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      return { success: false, message: "Not authenticated" };
    }

    // ✅ mark user as verified
    const user = await ctx.db.get(currentUserId);
    if (user && user.phoneVerified) {
      return { success: false, message: "Phone number already verified" };
    }
    if (user && user.phoneVerified === false) {
      await ctx.db.patch(user._id, { phoneVerified: true });
    }

    if (user && user.phoneVerified === undefined) {
      await ctx.db.patch(user._id, { phoneVerified: true });
    }

    return { success: true };
  },
});
