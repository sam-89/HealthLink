import { ClipboardCheck, Users, Building2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';

export function OpsDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold">Operations Dashboard</h1>
        <p className="text-muted-foreground">Verification and compliance management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending Reviews', value: '24', icon: Clock, color: 'text-warning' },
          { label: 'Verified Today', value: '18', icon: ClipboardCheck, color: 'text-success' },
          { label: 'Active Agencies', value: '156', icon: Building2, color: 'text-primary' },
          { label: 'Total Agents', value: '2,847', icon: Users, color: 'text-info' },
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Verification Queue</CardTitle>
          <Button variant="outline" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { agent: 'Sarah Johnson', doc: "Driver's License", agency: 'MetroHealth', time: '5 min ago' },
              { agent: 'James Wilson', doc: 'E&O Certificate', agency: 'PremierCare', time: '12 min ago' },
              { agent: 'Lisa Chen', doc: 'State License - CA', agency: 'HealthFirst', time: '18 min ago' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{item.agent}</p>
                  <p className="text-sm text-muted-foreground">{item.doc} • {item.agency}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                  <Button size="sm">Review</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
