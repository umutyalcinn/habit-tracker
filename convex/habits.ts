import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser } from "./users";

export const getHabits = query({
    args: {
        userId: v.string()
    },
    handler: async (ctx, args) => {
        const user = await getUser(ctx, args.userId);

        if(!user) {
            throw new ConvexError("User not found!")
        }

        return ctx.db.query("habits").withIndex("userId", (q) => q.eq("userId", user._id)).collect()
    }
})

export const getHabitByIdUserId = query({
    args: {
        userId: v.string(),
        habitId: v.id("habits"),
    },
    handler: async (ctx, args) => {
        const user = await getUser(ctx, args.userId);

        if(!user) {
            throw new ConvexError("User not found!")
        }

        const habit = await ctx.db.get(args.habitId);

        if (!habit) {
            throw new ConvexError("Habit not found!")
        }

        if (habit.userId != user._id) {
            throw new ConvexError("Habit does not belong to specified user!")
        }

        return habit
    }
})

export const createHabit = mutation({
    args: {
        userId: v.string(),
        categoryId: v.id("habitCategories"),
        title: v.string(),
        description: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await getUser(ctx, args.userId);

        if(!user) {
            throw new ConvexError("User not found!")
        }

        ctx.db.insert("habits", {
            userId: user._id,
            category: args.categoryId,
            title: args.title,
            description: args.description,
        })
    }
})

export const updateHabit = mutation({
    args: {
        id: v.id("habits"),
        userId: v.string(),
        categoryId: v.id("habitCategories"),
        title: v.string(),
        description: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await getUser(ctx, args.userId);

        if(!user) {
            throw new ConvexError("User not found!")
        }

        ctx.db.replace(args.id, {
            userId: user._id,
            category: args.categoryId,
            title: args.title,
            description: args.description,
        })
    }
})

export const deleteHabit = mutation({
    args: {
        id: v.id("habits"),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await getUser(ctx, args.userId);

        if(!user) {
            throw new ConvexError("User not found!")
        }

        // TODO: Check if the user has the habit.

        ctx.db.delete(args.id)
    }
})
