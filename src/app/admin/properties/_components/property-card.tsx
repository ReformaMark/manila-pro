import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
    title: string;
    count: number;
    difference?: number;
}

export const PropertyCard = ({
    count,
    title,
    difference
}: PropertyCardProps) => {
    const diffTemporary = 5

    return (
        <Card className="w-full h-full py-3 pt-0">
            <CardHeader className="bg-bg1 rounded-t-md p-4 mb-3">
                <CardTitle className="text-white text-sm">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-[43px] font-bold text-dark">
                        {count}
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        <span className={cn("text-dark", {
                            "text-green-500": diffTemporary > 0,
                            "text-red-500": diffTemporary < 0
                        })}>
                            {diffTemporary > 0 ? "+" : ""}{diffTemporary}
                        </span>
                        {" "}last month
                    </p>

                    {/* <p className="text-sm text-muted-foreground">
                        <span className={cn("text-dark", {
                            "text-green-500": difference > 0,
                            "text-red-500": difference < 0
                        })}>
                            {difference > 0 ? "+" : ""}{difference}
                        </span>
                        {" "}last month
                    </p> */}
                </div>
            </CardContent>
        </Card>
    )
}