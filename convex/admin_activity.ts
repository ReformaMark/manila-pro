import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Log admin activity
export const logActivity = mutation({
    args: {
        action: v.string(),
        actionType: v.union(
            v.literal("export"),
            v.literal("create"),
            v.literal("update"),
            v.literal("delete"),
            v.literal("approve"),
            v.literal("reject"),
            v.literal("login"),
            v.literal("other")
        ),
        description: v.string(),
        targetType: v.optional(v.string()),
        targetId: v.optional(v.string()),
        metadata: v.optional(v.object({
            reportType: v.optional(v.string()),
            propertyName: v.optional(v.string()),
            userName: v.optional(v.string()),
            changes: v.optional(v.string()),
        })),
        ipAddress: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        // Get current user
        const user = await ctx.db.get(userId);

        if (!user || user.role !== "admin") {
            throw new Error("Not authorized - Admin only");
        }

        // Create activity log
        const activityId = await ctx.db.insert("admin_activity_logs", {
            adminId: user._id,
            action: args.action,
            actionType: args.actionType,
            description: args.description,
            targetType: args.targetType,
            targetId: args.targetId,
            metadata: args.metadata,
            timestamp: Date.now(),
            ipAddress: args.ipAddress,
        });

        return activityId;
    },
});

// Get recent admin activities
export const getRecentActivities = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return [];
        }

        // Get current user
        const user = await ctx.db.get(userId);

        if (!user || user.role !== "admin") {
            return [];
        }

        const limit = args.limit || 50;

        // Get recent activities
        const activities = await ctx.db
            .query("admin_activity_logs")
            .order("desc")
            .take(limit);

        // Get admin details for each activity
        const admins = await ctx.db.query("users").collect();
        const adminMap = new Map(admins.map(a => [a._id, a]));

        return activities.map(activity => {
            const admin = adminMap.get(activity.adminId);
            return {
                ...activity,
                adminName: admin ? `${admin.fname} ${admin.lname}` : "Unknown Admin",
                adminEmail: admin?.email || "N/A",
            };
        });
    },
});

// Get activity count for notification badge
export const getUnreadActivityCount = query({
    args: {
        since: v.optional(v.number()), // Timestamp of last check
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return 0;
        }

        // Get current user
        const user = await ctx.db.get(userId);

        if (!user || user.role !== "admin") {
            return 0;
        }

        const since = args.since || Date.now() - (24 * 60 * 60 * 1000); // Last 24 hours by default

        const activities = await ctx.db
            .query("admin_activity_logs")
            .filter((q) => q.gt(q.field("timestamp"), since))
            .collect();

        return activities.length;
    },
});

// Get activities by type
export const getActivitiesByType = query({
    args: {
        actionType: v.union(
            v.literal("export"),
            v.literal("create"),
            v.literal("update"),
            v.literal("delete"),
            v.literal("approve"),
            v.literal("reject"),
            v.literal("login"),
            v.literal("other")
        ),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return [];
        }

        const user = await ctx.db.get(userId);

        if (!user || user.role !== "admin") {
            return [];
        }

        const limit = args.limit || 20;

        const activities = await ctx.db
            .query("admin_activity_logs")
            .withIndex("by_actionType", (q) => q.eq("actionType", args.actionType))
            .order("desc")
            .take(limit);

        const admins = await ctx.db.query("users").collect();
        const adminMap = new Map(admins.map(a => [a._id, a]));

        return activities.map(activity => {
            const admin = adminMap.get(activity.adminId);
            return {
                ...activity,
                adminName: admin ? `${admin.fname} ${admin.lname}` : "Unknown Admin",
                adminEmail: admin?.email || "N/A",
            };
        });
    },
});

// Get activity statistics
export const getActivityStats = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return null;
        }

        const user = await ctx.db.get(userId);

        if (!user || user.role !== "admin") {
            return null;
        }

        const allActivities = await ctx.db.query("admin_activity_logs").collect();

        const stats = {
            total: allActivities.length,
            today: 0,
            thisWeek: 0,
            byType: {
                export: 0,
                create: 0,
                update: 0,
                delete: 0,
                approve: 0,
                reject: 0,
                login: 0,
                other: 0,
            },
        };

        const now = Date.now();
        const oneDayAgo = now - (24 * 60 * 60 * 1000);
        const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);

        allActivities.forEach(activity => {
            // Count by time
            if (activity.timestamp > oneDayAgo) stats.today++;
            if (activity.timestamp > oneWeekAgo) stats.thisWeek++;

            // Count by type
            stats.byType[activity.actionType]++;
        });

        return stats;
    },
});
