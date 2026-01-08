import { useState } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  TrendingUp,
  Users,
  FileText,
  Shield,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { cn } from '@/lib/utils';

interface ComplianceItem {
  id: string;
  category: string;
  requirement: string;
  status: 'compliant' | 'non-compliant' | 'pending' | 'expiring-soon';
  dueDate?: string;
  affectedAgents: number;
  details: string;
}

interface AgentComplianceOverview {
  id: string;
  name: string;
  overallScore: number;
  items: {
    category: string;
    status: 'compliant' | 'non-compliant' | 'pending';
  }[];
}

const COMPLIANCE_ITEMS: ComplianceItem[] = [
  { id: '1', category: 'Licensing', requirement: 'All agents must have valid state licenses', status: 'compliant', affectedAgents: 0, details: 'All 47 agents have current state licenses on file.' },
  { id: '2', category: 'E&O Insurance', requirement: 'E&O coverage minimum $1M per occurrence', status: 'expiring-soon', dueDate: '2024-12-28', affectedAgents: 3, details: '3 agents have E&O certificates expiring within 30 days.' },
  { id: '3', category: 'Background Checks', requirement: 'Annual background verification required', status: 'pending', affectedAgents: 5, details: '5 agents pending annual background check renewal.' },
  { id: '4', category: 'Training', requirement: 'Annual compliance training completion', status: 'non-compliant', dueDate: '2024-12-15', affectedAgents: 8, details: '8 agents have not completed required annual training.' },
  { id: '5', category: 'Appointments', requirement: 'Active carrier appointments on file', status: 'compliant', affectedAgents: 0, details: 'All agent appointments are current and verified.' },
  { id: '6', category: 'Documentation', requirement: 'All required documents uploaded', status: 'pending', affectedAgents: 2, details: '2 agents missing required documentation uploads.' },
];

const AGENT_COMPLIANCE: AgentComplianceOverview[] = [
  { id: '1', name: 'John Smith', overallScore: 100, items: [{ category: 'License', status: 'compliant' }, { category: 'E&O', status: 'compliant' }, { category: 'Training', status: 'compliant' }] },
  { id: '2', name: 'Emily Davis', overallScore: 75, items: [{ category: 'License', status: 'compliant' }, { category: 'E&O', status: 'pending' }, { category: 'Training', status: 'compliant' }] },
  { id: '3', name: 'Michael Brown', overallScore: 50, items: [{ category: 'License', status: 'compliant' }, { category: 'E&O', status: 'non-compliant' }, { category: 'Training', status: 'pending' }] },
  { id: '4', name: 'Sarah Wilson', overallScore: 100, items: [{ category: 'License', status: 'compliant' }, { category: 'E&O', status: 'compliant' }, { category: 'Training', status: 'compliant' }] },
  { id: '5', name: 'James Taylor', overallScore: 25, items: [{ category: 'License', status: 'pending' }, { category: 'E&O', status: 'non-compliant' }, { category: 'Training', status: 'non-compliant' }] },
];

function getStatusIcon(status: string) {
  switch (status) {
    case 'compliant':
      return <CheckCircle className="w-5 h-5 text-success" />;
    case 'non-compliant':
      return <XCircle className="w-5 h-5 text-destructive" />;
    case 'pending':
      return <Clock className="w-5 h-5 text-warning" />;
    case 'expiring-soon':
      return <AlertTriangle className="w-5 h-5 text-warning" />;
    default:
      return null;
  }
}

export function CompliancePage() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const overallScore = 81; // calculated based on compliance items
  const compliantCount = COMPLIANCE_ITEMS.filter(i => i.status === 'compliant').length;
  const pendingCount = COMPLIANCE_ITEMS.filter(i => i.status === 'pending' || i.status === 'expiring-soon').length;
  const nonCompliantCount = COMPLIANCE_ITEMS.filter(i => i.status === 'non-compliant').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      <div>
        <h1 className="text-2xl font-display font-bold">Compliance Dashboard</h1>
        <p className="text-muted-foreground">Monitor and manage agency-wide compliance</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Score</p>
                <p className="text-3xl font-bold text-primary">{overallScore}%</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
            <Progress value={overallScore} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{compliantCount}</p>
              <p className="text-sm text-muted-foreground">Compliant</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-warning/10">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-destructive/10">
              <XCircle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{nonCompliantCount}</p>
              <p className="text-sm text-muted-foreground">Non-Compliant</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Requirements */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Compliance Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {COMPLIANCE_ITEMS.map((item) => (
              <div key={item.id} className="border rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                  onClick={() => toggleExpand(item.id)}
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <p className="font-medium">{item.category}</p>
                      <p className="text-sm text-muted-foreground">{item.requirement}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.affectedAgents > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {item.affectedAgents} agents
                      </span>
                    )}
                    {expandedItems.has(item.id) ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>
                {expandedItems.has(item.id) && (
                  <div className="px-4 pb-4 pt-2 bg-muted/30 border-t">
                    <p className="text-sm text-muted-foreground mb-3">{item.details}</p>
                    {item.dueDate && (
                      <p className="text-sm">
                        <strong>Due Date:</strong> {item.dueDate}
                      </p>
                    )}
                    <Button size="sm" className="mt-3">
                      Take Action
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Agent Compliance Overview */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Agent Compliance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {AGENT_COMPLIANCE.map((agent) => (
              <div key={agent.id} className="p-4 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium">{agent.name}</p>
                  <span className={cn(
                    'text-sm font-bold',
                    agent.overallScore >= 75 ? 'text-success' : agent.overallScore >= 50 ? 'text-warning' : 'text-destructive'
                  )}>
                    {agent.overallScore}%
                  </span>
                </div>
                <Progress 
                  value={agent.overallScore} 
                  className={cn(
                    'h-2 mb-3',
                    agent.overallScore >= 75 ? '[&>div]:bg-success' : agent.overallScore >= 50 ? '[&>div]:bg-warning' : '[&>div]:bg-destructive'
                  )} 
                />
                <div className="flex gap-2">
                  {agent.items.map((item, idx) => (
                    <StatusBadge 
                      key={idx} 
                      variant={item.status === 'compliant' ? 'approved' : item.status === 'pending' ? 'pending' : 'rejected'}
                      className="text-xs"
                    >
                      {item.category}
                    </StatusBadge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
