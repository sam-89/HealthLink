import { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock, AlertTriangle, FilePlus, RefreshCw, Printer, MapPin, ExternalLink, GraduationCap, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { AgentDashboardSkeleton } from '@/components/shared/skeletons';
import { useNavigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const quickServices = [
  { label: 'Apply for a License', icon: FilePlus, href: '/agent/services/licensing/apply' },
  { label: 'Renew a License', icon: RefreshCw, href: '/agent/services/licensing/renew' },
  { label: 'Print a License', icon: Printer, href: '/agent/services/licensing/print' },
  { label: 'Change Contact Info', icon: MapPin, href: '/agent/services/contact' },
];

const todos = [
  { id: 1, task: 'Complete California license renewal', dueDate: 'Jan 15, 2025', priority: 'high' },
  { id: 2, task: 'Upload updated E&O certificate', dueDate: 'Jan 20, 2025', priority: 'medium' },
  { id: 3, task: 'Complete CE requirements for Texas', dueDate: 'Feb 1, 2025', priority: 'low' },
];

const recentActivity = [
  { action: 'License renewed', state: 'California', date: 'Dec 20, 2024', status: 'approved' },
  { action: 'Document uploaded', state: 'E&O Certificate', date: 'Dec 18, 2024', status: 'pending' },
  { action: 'Background check', state: 'Completed', date: 'Dec 15, 2024', status: 'complete' },
];

export function AgentDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <AgentDashboardSkeleton />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold">Welcome back, Sarah</h1>
        <p className="text-muted-foreground">Here's your compliance status overview</p>
      </div>

      {/* State Services Quick Links */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-foreground mr-2">State Services</span>
              {quickServices.map((service) => (
                <Button
                  key={service.label}
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/80 gap-2"
                  onClick={() => navigate(service.href)}
                >
                  <service.icon className="w-4 h-4" />
                  {service.label}
                </Button>
              ))}
            </div>
            <Button size="sm" onClick={() => navigate('/agent/services')}>
              View All Services
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* To Dos and Recent Activity Tabs */}
      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="todos">To Dos</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="todos" className="mt-4">
          {todos.length === 0 ? (
            <div className="flex items-center gap-2 text-muted-foreground py-4">
              <Clock className="w-5 h-5" />
              <span>You currently have no tasks</span>
            </div>
          ) : (
            <div className="space-y-2">
              {todos.map((todo) => (
                <div key={todo.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      todo.priority === 'high' ? 'bg-destructive' :
                      todo.priority === 'medium' ? 'bg-warning' : 'bg-success'
                    }`} />
                    <span className="font-medium">{todo.task}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Due: {todo.dueDate}</span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <div className="space-y-2">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{item.action}</p>
                  <p className="text-sm text-muted-foreground">{item.state}</p>
                </div>
                <div className="text-right">
                  <StatusBadge variant={item.status as any}>{item.status}</StatusBadge>
                  <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Licenses Card */}
        <Card className="shadow-card border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Licenses</CardTitle>
            <Button variant="link" size="sm" className="text-primary gap-1" onClick={() => navigate('/agent/services/licensing/apply')}>
              <FilePlus className="w-4 h-4" />
              Apply for a License
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Looking for your licenses?</p>
                <p className="text-sm text-muted-foreground mt-1 mb-3">Sign up for a premium subscription</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    View your licenses and lines of authority for every state in which you are licensed.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    Automatically keep your licenses up to date with any changes from the state.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    Get renewal reminders when your licenses are about to expire.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    Free license printing.
                  </li>
                </ul>
              </div>
            </div>
            <Button variant="default" className="w-full sm:w-auto">
              Learn More About Premium
            </Button>
          </CardContent>
        </Card>

        {/* Continuing Education Card */}
        <Card className="shadow-card border-l-4 border-l-info">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              California Continuing Education
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-info/10 border border-info/20">
              <Info className="w-5 h-5 text-info shrink-0 mt-0.5" />
              <p className="text-sm">
                To view or print an education transcript in California, please use the state's{' '}
                <Link to="/agent/services" className="text-primary hover:underline">
                  Education Transcript Search
                </Link>
                .
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Requirements for: <span className="font-medium text-foreground">Sarah Johnson, California</span>{' '}
              <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                (Change)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Licenses', value: '3', icon: CheckCircle, color: 'text-success' },
          { label: 'Pending Docs', value: '2', icon: Clock, color: 'text-warning' },
          { label: 'Expiring Soon', value: '1', icon: AlertTriangle, color: 'text-destructive' },
          { label: 'Total Documents', value: '12', icon: FileText, color: 'text-primary' },
        ].map((stat) => (
          <Card key={stat.label} className="shadow-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-muted ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
              <div><p className="text-2xl font-bold">{stat.value}</p><p className="text-sm text-muted-foreground">{stat.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Onboarding Progress */}
      <Card className="shadow-card border-l-4 border-l-primary">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Complete Your Onboarding</h3>
              <p className="text-sm text-muted-foreground">2 of 4 steps completed</p>
            </div>
            <Button onClick={() => navigate('/agent/onboarding')}>Continue</Button>
          </div>
          <Progress value={50} className="h-2" />
        </CardContent>
      </Card>
    </div>
  );
}
