"use client"

import {
    AlertDialog,
        AlertDialogAction,
        AlertDialogCancel,
        AlertDialogContent,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogHeader,
        AlertDialogTitle,
        AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"

export function HabitCategoryDeleteAlertDialog({habitCategory} : {habitCategory: Doc<"habitCategories">}) {

    const [isOpen, setIsOpen] = useState(false)

    const user = useUser()

    const deleteHabitCategory = useMutation(api.habitCategories.deleteHabitCategory)

    const handleDeleteHabitCategory = (id: string) => {
        deleteHabitCategory({
            id: id as Id<"habitCategories">,
            userId: user.user?.id!,
        })
    }

    return user ? (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Habit Category will be permanently deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteHabitCategory(habitCategory._id)}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
       ) : <div>
            Loading...
       </div>
}

