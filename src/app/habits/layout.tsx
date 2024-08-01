import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";

export default function DashboardLayout({children}: {children: ReactNode}) {
    return (
        <div className="flex">
            <div className="max-w-[400px] flex flex-col py-4 px-16 gap-4">
                <Button variant="link" asChild><Link href="/habits">Dashboard</Link></Button>
                <Button variant="link" asChild><Link href="/habits/categories">Categories</Link></Button>
            </div>
            { children }
        </div>
    )
}
