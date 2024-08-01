"use client"

import { useUser } from "@clerk/nextjs"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import CategoriesTable from "./categories-table"
import HabitCategoryDialog from "./habit-category-dialog"

export default function Categories() {

    const user = useUser()

    const habitCategories = useQuery(api.habitCategories.getHabitCategories, {
        userId: user.user?.id!
    })

    return (
        <div className="p-4 w-full">
            <h1 className="text-4xl mb-8">Categories</h1>

            <HabitCategoryDialog habitCategory={null}/>

            {user.isLoaded ? <CategoriesTable habitCategories={habitCategories}></CategoriesTable> : <div>loading...</div>}
        </div>
    )
}
