import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import TimeAgo from "javascript-time-ago";

export default function ActivityLogsTable({activityLogs}: {activityLogs: Doc<"habitActivities">[]}) {

    const user = useUser()

    const timeAgo = new TimeAgo("en-US")

    return (
        <Table className="w-full">
            <TableCaption>List of your habit categories</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Log Message</TableHead>
                    <TableHead>Time</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {activityLogs.map((activityLog) => (
                    <TableRow key={activityLog._id}>
                        <TableCell className="font-medium">{activityLog.activityMessage}</TableCell>
                        <TableCell className="font-medium">{ timeAgo.format(activityLog._creationTime) }</TableCell>
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
