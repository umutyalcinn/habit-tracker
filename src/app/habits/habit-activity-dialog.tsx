import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Doc, Id } from "../../../convex/_generated/dataModel";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

// TODO: maybe there is 
const formSchema = z.object({
    _id: z.string(),
    habitId: z.string(),
    userId: z.string(),
    activityMessage: z.string(),
})

export default function HabitActivityDialog({habitActivity, habit}: {
    habitActivity: Doc<"habitActivities"> | null, 
    habit: Doc<"habits"> | null}) {

    const user = useUser()

    const createHabitActivity = useMutation(api.habitActivities.createHabitActivity)

    const [isOpen, setIsOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            _id: habitActivity ? habitActivity._id : "",
            habitId: habit ? habit._id : "",
            userId: user.user?.id!,
            activityMessage: "",
        }
    })


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if(habitActivity){
            // TODO: update habit activity
        } else {
            await createHabitActivity({
                userId: values.userId,
                habitId: values.habitId as Id<"habits">,
                activityMessage: values.activityMessage
            })
        }

        form.reset()
        setIsOpen(false)
    }

    return (
        <Dialog
            open={ isOpen }
            onOpenChange={ setIsOpen }
        >
            <DialogTrigger asChild>
                <Button>{habitActivity ? "Edit" : "Check In"}</Button>
            </DialogTrigger>
            <DialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle className="mb-8">Check In Activity</DialogTitle>
                        </DialogHeader>
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
                                    <FormLabel>
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
            </DialogContent>
        </Dialog>
    )
}
