import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function StatCardSkeleton() {
  return (
    <Card className="shadow-card">
      <CardContent className="p-4 flex items-center gap-4">
        <Skeleton className="w-11 h-11 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-12" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ActivityItemSkeleton() {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="h-5 w-20 ml-auto" />
        <Skeleton className="h-3 w-16 ml-auto" />
      </div>
    </div>
  );
}

export function ActivityCardSkeleton({ itemCount = 3 }: { itemCount?: number }) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: itemCount }).map((_, i) => (
            <ActivityItemSkeleton key={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProgressCardSkeleton() {
  return (
    <Card className="shadow-card border-l-4 border-l-primary">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-2 w-full" />
      </CardContent>
    </Card>
  );
}

export function AgentDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-80" />
      </div>
      <ProgressCardSkeleton />
      <StatsGridSkeleton count={4} />
      <ActivityCardSkeleton itemCount={3} />
    </div>
  );
}

export function AgencyDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-72" />
      </div>
      <StatsGridSkeleton count={4} />
      <ActivityCardSkeleton itemCount={3} />
    </div>
  );
}
