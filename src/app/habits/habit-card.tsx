"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";

import { Doc, Id } from "../../../convex/_generated/dataModel";
import { HabitDeleteAlertDialog } from "./habit-delete-alert-dialog";
import HabitActivityDialog from "./habit-activity-dialog";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import TimeAgo from "javascript-time-ago";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HabitCard({habit}: {habit: Doc<"habits">}) {

    const user = useUser()

    const lastActivity = useQuery(api.habitActivities.getLastActivityByHabitId, {
        habitId: habit._id,
        userId: user.user?.id!,
    })

    const timeAgo = new TimeAgo('en-US')

    return(
        <Card className="">
            <CardHeader>
                <CardTitle>{habit.title}</CardTitle>
                <CardDescription>{habit.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
            <div className="flex flex-col gap-4">
                <p className="text-sm">
                    { "Last Activity: " + (lastActivity ? timeAgo.format(lastActivity._creationTime) : "never")}
                </p>
                <div className="flex gap-2">
                    <HabitActivityDialog habit={habit} habitActivity={null}/>
                    <HabitDeleteAlertDialog habit={habit}/>
                </div>
                <div>
                    <Button asChild><Link href={`/habits/${habit._id}`}>Details</Link></Button>
                </div>
            </div>
            </CardFooter>
        </Card>
    )
}
