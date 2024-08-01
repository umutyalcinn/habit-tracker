"use node"

import type { WebhookEvent } from "@clerk/clerk-sdk-node"
import { internalAction } from "./_generated/server"
import { Webhook } from "svix"
import { v } from "convex/values"

export const fullfill = internalAction({
    args: {
        headers: v.any(),
        payload: v.string()
    },
    handler: async (ctx, args) => {
        console.log("anan")
        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET as string);
        const payload = wh.verify(args.payload, args.headers) as WebhookEvent;
        return payload;
    }
})
