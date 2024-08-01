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
    categoryId: z.string(),
    title: z.string(),
    userId: z.string(),
    description: z.string(),
})

export default function HabitDialog({habit}: {habit: Doc<"habits"> | null}) {

    const user = useUser()

    const createHabit = useMutation(api.habits.createHabit)
    const updateHabit = useMutation(api.habits.updateHabit)

    const [isOpen, setIsOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            _id: habit ? habit._id : "",
            categoryId: "",
            title: "",
            userId: user.user?.id!,
            description: "",
        }
    })


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if(habit){
            await updateHabit({
                id: values._id as Id<"habits">, 
                userId: values.userId,
                categoryId: values.categoryId as Id<"habitCategories">,
                title: values.title,
                description: values.description,
            })
        } else {
            await createHabit({
                userId: values.userId,
                categoryId: values.categoryId as Id<"habitCategories">,
                title: values.title,
                description: values.description,
            })
        }

        form.reset()
        setIsOpen(false)
    }

    const habitCategories = useQuery(api.habitCategories.getHabitCategories, { userId: user.user?.id!})

    return (
        <Dialog
            open={ isOpen }
            onOpenChange={ setIsOpen }
        >
            <DialogTrigger asChild>
                <Button>{habit ? "Edit" : "New Habit"}</Button>
            </DialogTrigger>
            <DialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle className="mb-8">Add new Habit</DialogTitle>
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
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel>
                                        Category
                                    </FormLabel>
                                    <div className="flex gap-2">
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a Category" defaultValue={field.value}/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                { 
                                                    habitCategories && habitCategories.map((v, _) => {
                                                        return <SelectItem key={v._id} value={v._id}> {v.name}</SelectItem>
                                                    })
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel>
                                        Title
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field}></Input>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="my-2">
                                    <FormLabel>
                                        Description
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
