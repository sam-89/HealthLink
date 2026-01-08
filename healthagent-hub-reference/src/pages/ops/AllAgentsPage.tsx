import { useState, useMemo } from 'react';
import { 
  Search, 
  MoreHorizontal, 
  Mail, 
  Phone,
  Building2,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState, TableEmptyState } from '@/components/shared/EmptyState';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { DataTable, Column } from '@/components/shared/DataTable';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  npn: string;
  agency: string;
  status: 'active' | 'pending' | 'inactive' | 'suspended';
  complianceStatus: 'compliant' | 'action-required' | 'non-compliant';
  onboardingProgress: number;
  licenses: { state: string; type: string; expiry: string }[];
  documents: { name: string; status: string; date: string }[];
  joinedDate: string;
}

const MOCK_AGENTS: Agent[] = [
  { 
    id: '1', 
    name: 'John Smith', 
    email: 'john.smith@email.com', 
    phone: '(555) 123-4567', 
    npn: '12345678', 
    agency: 'MetroHealth Agency',
    status: 'active', 
    complianceStatus: 'compliant',
    onboardingProgress: 100, 
    licenses: [
      { state: 'CA', type: 'Health & Life', expiry: '2026-03-15' },
      { state: 'NV', type: 'Health', expiry: '2025-08-20' }
    ],
    documents: [
      { name: 'Driver License', status: 'approved', date: '2024-01-15' },
      { name: 'E&O Certificate', status: 'approved', date: '2024-01-16' }
    ],
    joinedDate: '2024-01-15' 
  },
  { 
    id: '2', 
    name: 'Emily Davis', 
    email: 'emily.davis@email.com', 
    phone: '(555) 234-5678', 
    npn: '23456789', 
    agency: 'MetroHealth Agency',
    status: 'active', 
    complianceStatus: 'action-required',
    onboardingProgress: 75, 
    licenses: [
      { state: 'CA', type: 'Health', expiry: '2025-06-10' }
    ],
    documents: [
      { name: 'Driver License', status: 'approved', date: '2024-02-20' },
      { name: 'E&O Certificate', status: 'pending', date: '2024-02-21' }
    ],
    joinedDate: '2024-02-20' 
  },
  { 
    id: '3', 
    name: 'Michael Brown', 
    email: 'michael.b@email.com', 
    phone: '(555) 345-6789', 
    npn: '34567890', 
    agency: 'HealthFirst Insurance',
    status: 'active', 
    complianceStatus: 'action-required',
    onboardingProgress: 90, 
    licenses: [
      { state: 'TX', type: 'Health & Life', expiry: '2024-12-28' },
      { state: 'OK', type: 'Health', expiry: '2025-03-15' }
    ],
    documents: [
      { name: 'Driver License', status: 'expired', date: '2024-01-08' },
      { name: 'Background Check', status: 'pending', date: '2024-01-09' }
    ],
    joinedDate: '2024-01-08' 
  },
  { 
    id: '4', 
    name: 'Sarah Wilson', 
    email: 'sarah.w@email.com', 
    phone: '(555) 456-7890', 
    npn: '45678901', 
    agency: 'Pacific Health Group',
    status: 'active', 
    complianceStatus: 'compliant',
    onboardingProgress: 100, 
    licenses: [
      { state: 'WA', type: 'Health & Life', expiry: '2026-01-20' }
    ],
    documents: [
      { name: 'Driver License', status: 'approved', date: '2023-11-10' },
      { name: 'E&O Certificate', status: 'approved', date: '2023-11-12' }
    ],
    joinedDate: '2023-11-10' 
  },
  { 
    id: '5', 
    name: 'James Taylor', 
    email: 'james.t@email.com', 
    phone: '(555) 567-8901', 
    npn: '56789012', 
    agency: 'HealthFirst Insurance',
    status: 'pending', 
    complianceStatus: 'non-compliant',
    onboardingProgress: 50, 
    licenses: [],
    documents: [
      { name: 'Driver License', status: 'pending', date: '2024-03-01' }
    ],
    joinedDate: '2024-03-01' 
  },
  { 
    id: '6', 
    name: 'Lisa Anderson', 
    email: 'lisa.a@email.com', 
    phone: '(555) 678-9012', 
    npn: '67890123', 
    agency: 'Pacific Health Group',
    status: 'suspended', 
    complianceStatus: 'non-compliant',
    onboardingProgress: 100, 
    licenses: [
      { state: 'WA', type: 'Health', expiry: '2024-01-15' }
    ],
    documents: [
      { name: 'E&O Certificate', status: 'expired', date: '2023-06-22' }
    ],
    joinedDate: '2023-09-22' 
  },
];

export function AllAgentsPage() {
  const [agents] = useState<Agent[]>(MOCK_AGENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [agencyFilter, setAgencyFilter] = useState<string>('all');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const agencies = [...new Set(agents.map(a => a.agency))];

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.npn.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    const matchesAgency = agencyFilter === 'all' || agent.agency === agencyFilter;
    return matchesSearch && matchesStatus && matchesAgency;
  });

  const activeCount = agents.filter(a => a.status === 'active').length;
  const pendingCount = agents.filter(a => a.status === 'pending').length;
  const actionRequiredCount = agents.filter(a => a.complianceStatus === 'action-required').length;

  // Define columns for DataTable
  const columns: Column<Agent>[] = useMemo(() => [
    {
      id: 'name',
      header: 'Agent',
      accessorKey: 'name',
      sortable: true,
      resizable: true,
      minWidth: 180,
      width: 220,
      cell: (agent) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {agent.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{agent.name}</p>
            <p className="text-sm text-muted-foreground">{agent.email}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'agency',
      header: 'Agency',
      accessorKey: 'agency',
      sortable: true,
      resizable: true,
      minWidth: 120,
      width: 160,
      cell: (agent) => <span className="text-muted-foreground">{agent.agency}</span>,
    },
    {
      id: 'npn',
      header: 'NPN',
      accessorKey: 'npn',
      sortable: true,
      resizable: true,
      minWidth: 100,
      width: 120,
      cell: (agent) => <span className="font-mono text-sm">{agent.npn}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      resizable: true,
      minWidth: 100,
      width: 120,
      cell: (agent) => (
        <StatusBadge variant={
          agent.status === 'active' ? 'approved' : 
          agent.status === 'pending' ? 'pending' : 
          agent.status === 'suspended' ? 'rejected' : 'expired'
        }>{agent.status}</StatusBadge>
      ),
    },
    {
      id: 'complianceStatus',
      header: 'Compliance',
      accessorKey: 'complianceStatus',
      sortable: true,
      resizable: true,
      minWidth: 120,
      width: 140,
      cell: (agent) => (
        <StatusBadge variant={
          agent.complianceStatus === 'compliant' ? 'approved' : 
          agent.complianceStatus === 'action-required' ? 'action-required' : 'rejected'
        }>{agent.complianceStatus.replace('-', ' ')}</StatusBadge>
      ),
    },
    {
      id: 'onboardingProgress',
      header: 'Onboarding',
      accessorKey: 'onboardingProgress',
      sortable: true,
      resizable: true,
      minWidth: 120,
      width: 140,
      cell: (agent) => (
        <div className="flex items-center gap-2">
          <Progress value={agent.onboardingProgress} className="w-16 h-2" />
          <span className="text-sm text-muted-foreground">{agent.onboardingProgress}%</span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: '',
      sortable: false,
      resizable: false,
      minWidth: 48,
      width: 48,
      cell: (agent) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedAgent(agent); }}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="w-4 h-4 mr-2" />
              View Documents
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], []);

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">All Agents</h1>
          <p className="text-muted-foreground">View and manage all agents across agencies</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{agents.length}</p>
              <p className="text-sm text-muted-foreground">Total Agents</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeCount}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-warning/10">
              <Clock className="w-5 h-5 text-warning" />
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
              <XCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{actionRequiredCount}</p>
              <p className="text-sm text-muted-foreground">Action Required</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or NPN..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={agencyFilter} onValueChange={setAgencyFilter}>
              <SelectTrigger className="w-[200px]">
                <Building2 className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Agency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agencies</SelectItem>
                {agencies.map(agency => (
                  <SelectItem key={agency} value={agency}>{agency}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredAgents}
            columns={columns}
            pageSize={5}
            pageSizeOptions={[5, 10, 20]}
            onRowClick={(agent) => setSelectedAgent(agent)}
            emptyState={<TableEmptyState type="agents" />}
          />
        </CardContent>
      </Card>

      {/* Agent Detail Dialog */}
      <Dialog open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {selectedAgent?.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <span>{selectedAgent?.name}</span>
                <p className="text-sm font-normal text-muted-foreground">{selectedAgent?.agency}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedAgent && (
            <Tabs defaultValue="overview" className="mt-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="licenses">Licenses</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">NPN</p>
                    <p className="font-mono font-medium">{selectedAgent.npn}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <StatusBadge variant={
                      selectedAgent.status === 'active' ? 'approved' : 
                      selectedAgent.status === 'pending' ? 'pending' : 'rejected'
                    } className="mt-1">{selectedAgent.status}</StatusBadge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {selectedAgent.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    {selectedAgent.phone}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    {selectedAgent.agency}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="licenses" className="mt-4">
                {selectedAgent.licenses.length > 0 ? (
                  <div className="space-y-3">
                    {selectedAgent.licenses.map((license, idx) => (
                      <div key={idx} className="p-4 bg-muted/30 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-medium">{license.state} - {license.type}</p>
                          <p className="text-sm text-muted-foreground">Expires: {license.expiry}</p>
                        </div>
                        <StatusBadge variant={new Date(license.expiry) > new Date() ? 'approved' : 'expired'}>
                          {new Date(license.expiry) > new Date() ? 'Active' : 'Expired'}
                        </StatusBadge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState type="licenses" className="py-8" />
                )}
              </TabsContent>

              <TabsContent value="documents" className="mt-4">
                <div className="space-y-3">
                  {selectedAgent.documents.map((doc, idx) => (
                    <div key={idx} className="p-4 bg-muted/30 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-info" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">Uploaded: {doc.date}</p>
                        </div>
                      </div>
                      <StatusBadge variant={
                        doc.status === 'approved' ? 'approved' : 
                        doc.status === 'pending' ? 'pending' : 'expired'
                      }>{doc.status}</StatusBadge>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
