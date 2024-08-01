import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        userId: v.string(),
        email: v.string(),
    }).index("userId", ["userId"]),

    habitCategories: defineTable({
        userId: v.id("users"),
        name: v.string(),
    }).index("userId", ["userId"]),

    habits: defineTable({
        userId: v.id("users"),
        category: v.id("habitCategories"),
        title: v.string(),
        description: v.string(),
    }).index("userId", ["userId"]),

    habitActivities: defineTable({
        userId: v.id("users"),
        habitId: v.id("habits"),
        activityMessage: v.string(),
    }).index("userId", ["userId"])
    .index("userId_habitId", ["userId", "habitId"]),
})
