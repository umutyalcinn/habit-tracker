"use client"

import { useQuery } from "convex/react";
import HabitCard from "./habit-card";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import HabitDialog from "./habit-dialog";

export default function Dashboard() {

    const user = useUser()

    console.log(user)

    const habits = useQuery(api.habits.getHabits, { userId: user.user?.id! })

    return (
        <div className="p-4">
            <h1 className="text-4xl mb-8">Dashboard</h1>

            {user.isLoaded && <HabitDialog habit={null}></HabitDialog>}
        
            <div className="mt-4 grid grid-cols-4 gap-4 auto-cols-auto">
                { user.isLoaded && habits && habits.map((v, _) => {
                    return <HabitCard habit={v}></HabitCard>
                }) }
            </div>
        </div>
    )
} 
