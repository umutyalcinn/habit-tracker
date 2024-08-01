import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";


// define the http router
const http = httpRouter()

// define the webhook route
http.route({
    path: '/clerk',
    method: 'POST',
    handler: httpAction(async (ctx, request) => {

        const payloadString = await request.text();
        const headerPayload = request.headers;

        try {
            const result = await ctx.runAction(internal.clerk.fullfill, {
                payload: payloadString,
                headers: {
                    "svix-id": headerPayload.get("svix-id")!,
                    "svix-timestamp": headerPayload.get("svix-timestamp")!,
                    "svix-signature": headerPayload.get("svix-signature")!,
                }
            })

            switch(result.type){
                case "user.created": {
                    await ctx.runMutation(internal.users.createUser, {
                        userId: result.data.id,
                        email: result.data.email_addresses[0]?.email_address
                    })
                    break
                }
                case "user.updated": {

                    const user = await ctx.runQuery(internal.users.getUserByUserId, {
                        userId: result.data.id,
                    })

                    if(!user) {
                        return new Response("User not found", {
                            status: 404,
                        })
                    }

                    ctx.runMutation(internal.users.updateUser, {
                        _id: user._id,
                        userId: result.data.id,
                        email: result.data.email_addresses[0]?.email_address,
                    })
                    break
                }
                case "user.deleted": {

                    const user = await ctx.runQuery(internal.users.getUserByUserId, {
                        userId: result.data.id!
                    })

                    if(!user) {
                        return new Response("User not found", {
                            status: 404,
                        })
                    }
                    await ctx.runMutation(internal.users.deleteUser, {
                        _id: user._id
                    })
                    break
                }
            }

            return new Response(null, {
                status: 200,
            });
        } catch(e) {
            return new Response("Webhook error!", {
            })
        }
    })
})

export default http;
