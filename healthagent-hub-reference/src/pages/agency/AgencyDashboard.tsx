import { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AgencyDashboardSkeleton } from '@/components/shared/skeletons';

export function AgencyDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <AgencyDashboardSkeleton />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold">Agency Dashboard</h1>
        <p className="text-muted-foreground">MetroHealth Agency compliance overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Agents', value: '47', icon: Users, color: 'text-primary' },
          { label: 'Fully Compliant', value: '38', icon: CheckCircle, color: 'text-success' },
          { label: 'Action Required', value: '6', icon: AlertTriangle, color: 'text-warning' },
          { label: 'Documents', value: '234', icon: FileText, color: 'text-info' },
        ].map((stat) => (
          <Card key={stat.label} className="shadow-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-muted ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
              <div><p className="text-2xl font-bold">{stat.value}</p><p className="text-sm text-muted-foreground">{stat.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card">
        <CardHeader><CardTitle>Agents Requiring Attention</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'John Smith', issue: 'License expiring in 5 days', status: 'action-required' },
              { name: 'Emily Davis', issue: 'Missing E&O certificate', status: 'pending' },
              { name: 'Michael Brown', issue: 'Background check pending', status: 'pending' },
            ].map((agent, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div><p className="font-medium">{agent.name}</p><p className="text-sm text-muted-foreground">{agent.issue}</p></div>
                <StatusBadge variant={agent.status as any}>{agent.status.replace('-', ' ')}</StatusBadge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
