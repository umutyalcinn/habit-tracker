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
import { api } from "../../../convex/_generated/api"
import { Doc } from "../../../convex/_generated/dataModel"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"

export function HabitDeleteAlertDialog({habit} : {habit: Doc<"habits">}) {

    const [isOpen, setIsOpen] = useState(false)

    const user = useUser()

    const deleteHabit = useMutation(api.habits.deleteHabit)

    const handleDelete = async () => {
        await deleteHabit({
            id: habit._id,
            userId: user.user?.id!
        })

        setIsOpen(false)
    }

    return user ? (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
       ) : <div>
            Loading...
       </div>
}

