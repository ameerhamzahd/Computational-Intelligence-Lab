import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "./Skeleton";

function SummaryStatSkeleton() {
    return (
        <Card className="rounded-lg border border-white/60 bg-[#F4F3EE]/95">
            <CardContent className="flex h-full flex-col p-5">
                <Skeleton className="h-3 w-28 rounded" />

                <Skeleton className="mt-3 h-8 w-12 rounded-lg" />

                <div className="mt-auto pt-6">
                    <Skeleton className="h-0.75 w-full rounded-lg" />
                </div>
            </CardContent>
        </Card>
    );
}

function RequestCardSkeleton() {
    return (
        <Card className="overflow-hidden rounded-lg border border-[#D8D5C9] bg-[#F4F3EE]">
            <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <Skeleton className="size-12 shrink-0 rounded-lg" />

                    <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Skeleton className="h-5 w-36 rounded" />
                            <Skeleton className="h-4 w-48 rounded" />
                            <Skeleton className="h-5 w-20 rounded-lg" />
                        </div>

                        <Skeleton className="mb-2 h-3 w-56 max-w-full rounded" />

                        <Skeleton className="mb-3 h-11 w-full rounded-lg" />

                        <div className="flex flex-wrap items-center gap-4">
                            <Skeleton className="h-4 w-20 rounded" />
                            <Skeleton className="size-7 rounded-lg" />
                            <Skeleton className="h-4 w-36 rounded" />
                            <Skeleton className="h-4 w-40 rounded" />
                        </div>

                        <div className="mt-4 flex flex-col gap-2 rounded-lg border border-[#DEDCD3] bg-[#FBFAF7] p-3 sm:flex-row sm:items-center sm:justify-between">
                            <Skeleton className="h-4 w-44 rounded" />
                            <Skeleton className="h-9 w-28 rounded-lg" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function ReceivedRequestsSkeleton({ showStats = true }: { showStats?: boolean }) {
    return (
        <div
            className="w-full"
            aria-busy="true"
            aria-live="polite"
        >
            {showStats && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <SummaryStatSkeleton key={index} />
                    ))}
                </div>
            )}

            <div className={cn("space-y-4", showStats && "mt-7")}>
                {Array.from({ length: 3 }).map((_, index) => (
                    <RequestCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
}

export { ReceivedRequestsSkeleton };
