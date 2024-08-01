import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser } from "./users";

export const getHabitCategories = query({
    args: {
        userId: v.string()
    },
    handler: async (ctx, args) => {
        const user = await getUser(ctx, args.userId);

        if(!user) {
            throw new ConvexError("User not found!")
        }

        return ctx.db.query("habitCategories").withIndex("userId", (q) => q.eq("userId", user._id)).collect()
    }
})

export const getHabitCategoryById = query({
    args: {
        userId: v.string(),
        habitCategoryId: v.id("habitCategories"),
    },
    handler: async (ctx, args) => {
        const user = await getUser(ctx, args.userId);

        if(!user) {
            throw new ConvexError("User not found!")
        }

        const habitCategory = await ctx.db.get(args.habitCategoryId)

        if (!habitCategory) {
            throw new ConvexError("Habit category not found!")
        }

        if (habitCategory.userId != user._id) {
            throw new ConvexError("This habit category does not belong to specified user!")
        }

        return habitCategory
    }
})

export const createHabitCategory = mutation({
    args: {
        name: v.string(),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await getUser(ctx, args.userId);

        if(!user) {
            throw new ConvexError("User not found!")
        }

        ctx.db.insert("habitCategories", {
            name: args.name,
            userId: user._id,
        })
    }
})

export const deleteHabitCategory = mutation({
    args: {
        id: v.id("habitCategories"),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await getUser(ctx, args.userId);

        if(!user) {
            throw new ConvexError("User not found!")
        }

        // TODO: Check if the user has the habit category

        ctx.db.delete(args.id)
    }
})
