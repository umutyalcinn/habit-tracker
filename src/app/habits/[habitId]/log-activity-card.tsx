"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const formSchema = z.object({
    _id: z.string(),
    habitId: z.string(),
    userId: z.string(),
    activityMessage: z.string(),
})

export default function LogActivityCard({habit}: {habit: Doc<"habits"> | null}) {

    const user = useUser()

    const createHabitActivity = useMutation(api.habitActivities.createHabitActivity)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            _id: "",
            habitId: habit ? habit._id : "",
            userId: user.user?.id!,
            activityMessage: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await createHabitActivity({
            userId: values.userId,
            habitId: values.habitId as Id<"habits">,
            activityMessage: values.activityMessage
        })
        form.reset()
    }

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Log an Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="_id"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} type="hidden"></Input>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="userId"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} type="hidden"></Input>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="habitId"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} type="hidden"></Input>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="activityMessage"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel className="text-xl">
                                        Log Message
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field}></Input>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormControl>
                            <Button className="mt-2" type="submit">Submit</Button>
                        </FormControl>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
            </CardFooter>
        </Card>
    )
}
