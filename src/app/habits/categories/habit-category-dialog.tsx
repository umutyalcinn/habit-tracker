import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Doc, Id } from "../../../../convex/_generated/dataModel";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

// TODO: maybe there is 
const formSchema = z.object({
    _id: z.string(),
    userId: z.string(),
    name: z.string(),
})

export default function HabitCategoryDialog({habitCategory}: {habitCategory: Doc<"habitCategories"> | null}) {

    const user = useUser()

    const createHabitCategory = useMutation(api.habitCategories.createHabitCategory)

    const [isOpen, setIsOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            _id: habitCategory ? habitCategory._id : "",
            userId: user.user?.id!,
            name: "",
        }
    })


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if(habitCategory){
            // TODO: update habitCategory
        } else {
            await createHabitCategory({
                userId: values.userId,
                name: values.name,
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
                <Button>{habitCategory ? "Edit" : "New Category"}</Button>
            </DialogTrigger>
            <DialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle className="mb-8">Add new Habit Category</DialogTitle>
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
                            name="name"
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
