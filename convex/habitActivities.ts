import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser } from "./users";

export const getHabitActivitesByUserId = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await getUser(ctx, args.userId);

        if(!user) {
            throw new ConvexError("User not found!")
        }

        return ctx.db.query("habitActivities").withIndex("userId", (q) => q.eq("userId", user._id)).collect()
    },
})

export const getHabitActivitiesByHabitId = query({
    args: {
        userId: v.string(),
        habitId: v.id("habits")
    },
    handler: async (ctx, args) => {
        const user = await getUser(ctx, args.userId);

        if(!user) {
            throw new ConvexError("User not found!")
        }

        return ctx.db.query("habitActivities").withIndex("userId_habitId", (q) => q
                                                         .eq("userId", user._id)
                                                         .eq("habitId", args.habitId))
                                                         .collect()
    },
})

export const createHabitActivity = mutation({
    args: {
        userId: v.string(),
        habitId: v.id("habits"),
        activityMessage: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await getUser(ctx, args.userId);

        if(!user) {
            throw new ConvexError("User not found!")
        }

        ctx.db.insert("habitActivities", {
            userId: user._id,
            habitId: args.habitId,
            activityMessage: args.activityMessage,
        })
    }
})

export const deleteHabitActivity = mutation({
    args: {
        id: v.id("habitActivities"),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await getUser(ctx, args.userId);

        if(!user) {
            throw new ConvexError("User not found!")
        }

        ctx.db.delete(args.id)
    }
})

export const getLastActivityByHabitId = query({
    args: {
        userId: v.string(),
        habitId: v.id("habits"),
    },
    handler: async (ctx, args) => {
        const user = await getUser(ctx, args.userId);

        if(!user) {
            throw new ConvexError("User not found!")
        }

        return ctx.db.query("habitActivities").withIndex("userId_habitId", (q) => q
                                                         .eq("userId", user._id)
                                                         .eq("habitId", args.habitId))
                                                         .order("desc")
                                                         .first()
    }
})

export const getLastThirtyDaysActivityByHabitId = query({
    args: {
        userId: v.string(),
        habitId: v.id("habits"),
    },
    handler: async (ctx, args) => {
        const user = await getUser(ctx, args.userId);

        if(!user) {
            throw new ConvexError("User not found!")
        }

        return ctx.db.query("habitActivities").withIndex("userId_habitId", (q) => q
                                                         .eq("userId", user._id)
                                                         .eq("habitId", args.habitId)
                                                         .gt("_creationTime", Date.now() - 30 * 24 * 60 * 60 * 1000))
                                                         .order("desc")
                                                         .collect()
    }
})
