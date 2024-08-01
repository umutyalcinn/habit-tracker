import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery, MutationCtx, QueryCtx } from "./_generated/server";

export async function getUser(ctx: QueryCtx | MutationCtx, userId: string) {
    return ctx.db.query("users").withIndex("userId", (q) => q.eq("userId", userId)).first()
}

export const getUserByUserId = internalQuery({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        return ctx.db.query("users").withIndex("userId", (q) => q.eq("userId", args.userId)).first()
    }
})

export const createUser = internalMutation({
    args: {
        userId: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        ctx.db.insert("users", {
            userId: args.userId,
            email: args.email,
        })
    }
})

export const updateUser = internalMutation({
    args: {
        _id: v.id("users"),
        userId: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        ctx.db.replace(args._id, {
            userId: args.userId,
            email: args.email,
        })
    }
})

export const deleteUser = internalMutation({
    args: {
        _id: v.id("users"),
    },
    handler: async (ctx, args) => {
        // TODO: Check if the user has the user. (sounds weird)
        ctx.db.delete(args._id)
    }
})
