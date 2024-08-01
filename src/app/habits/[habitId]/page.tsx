"use client"

import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"
import { useUser } from "@clerk/nextjs"
import ActivityLogsTable from "./activity-logs-table"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import LogActivityCard from "./log-activity-card"
import { useMemo } from "react"


export default function HabitDetails({params}: {params: {habitId: string}}) {

    const user = useUser()

    const habit = useQuery(api.habits.getHabitByIdUserId, {
        userId: user.user?.id!,
        habitId: params.habitId as Id<"habits">,
    })

    const habitActivities = useQuery(api.habitActivities.getHabitActivitiesByHabitId, {
        userId: user.user?.id!,
        habitId: params.habitId as Id<"habits">,
    })

    const lastThirtyDaysActivities = useQuery(api.habitActivities.getLastThirtyDaysActivityByHabitId, {
        userId: user.user?.id!,
        habitId: params.habitId as Id<"habits">,
    })
    
    const habitCategory = useQuery(api.habitCategories.getHabitCategoryById, {
        userId: user.user?.id!,
        habitCategoryId: habit?.category!,
    })

    const createHabitActivity = useMutation(api.habitActivities.createHabitActivity)

    const [lastThirtyDays, ratio] = useMemo(() => {

        const result = Array(30).fill(false)

        if(!lastThirtyDaysActivities) {
            return result
        }

        for(let i = 0; i < 30; ++i){

            const before = Date.now() - (i + 1) * 24 * 60 * 60 * 1000
            const after = Date.now() - (i) * 24 * 60 * 60 * 1000

            lastThirtyDaysActivities.forEach((value) => {
                if(value._creationTime < after && value._creationTime > before) {
                    result[i] = true
                }
            })
        }
        
        let acc = 0;

        for(let i = 0; i < 30; ++i) {
            if (result[i]){
                acc++;
            }
        }

        const ratio = acc / 30;

        return [result, ratio * 100] 

    }, [lastThirtyDaysActivities])


    if (!user.isLoaded || !habit || !habitActivities || !habitCategory || !lastThirtyDaysActivities) {
        return (
            <div>
                Loading...
            </div>
        )
    }


    return (
        <div className="grid grid-cols-3 col-auto gap-4 w-full mr-4">
            <Card>
                <CardHeader>
                    <CardTitle>Habit Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Title { habit.title }</p>
                    <p>Category: { habitCategory.name }</p>
                    <p> Ratio: { ratio.toFixed(2) }%</p>
                </CardContent>
                <CardFooter>
                    <p>{ habit.description }</p>
                </CardFooter>
            </Card>
            <LogActivityCard habit={ habit }>
            </LogActivityCard>
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Last 30 Days</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 flex-wrap">
                        { lastThirtyDays.map((val) => {
                            return <div className={`w-[30px] h-[30px] ${val ? "bg-green-700" : "bg-red-700"}`}></div>
                        })}
                    </div>
                </CardContent>
                <CardFooter>
                </CardFooter>
            </Card>
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Activity Log</CardTitle>
                </CardHeader>
                <CardContent>
                    <ActivityLogsTable activityLogs={ habitActivities }></ActivityLogsTable>
                </CardContent>
                <CardFooter>
                </CardFooter>
            </Card>
        </div>
    )
}
