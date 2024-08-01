import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { HabitCategoryDeleteAlertDialog } from "./habit-category-delete-alert-dialog";

export default function CategoriesTable({habitCategories}: {habitCategories: Doc<"habitCategories">[]}) {

    const user = useUser()


    return (
        <Table className="w-full">
            <TableCaption>List of your habit categories</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Category Name</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {habitCategories.map((category) => (
                    <TableRow key={category._id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="flex gap-2">
                            <Button>Edit</Button>
                            <HabitCategoryDeleteAlertDialog habitCategory={category}/>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
