import { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { TableEmptyState } from '@/components/shared/EmptyState';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  npn: string;
  status: 'active' | 'pending' | 'inactive' | 'action-required';
  onboardingProgress: number;
  licenses: number;
  joinedDate: string;
}

const MOCK_AGENTS: Agent[] = [
  { id: '1', name: 'John Smith', email: 'john.smith@email.com', phone: '(555) 123-4567', npn: '12345678', status: 'active', onboardingProgress: 100, licenses: 3, joinedDate: '2024-01-15' },
  { id: '2', name: 'Emily Davis', email: 'emily.davis@email.com', phone: '(555) 234-5678', npn: '23456789', status: 'pending', onboardingProgress: 75, licenses: 2, joinedDate: '2024-02-20' },
  { id: '3', name: 'Michael Brown', email: 'michael.b@email.com', phone: '(555) 345-6789', npn: '34567890', status: 'action-required', onboardingProgress: 90, licenses: 4, joinedDate: '2024-01-08' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah.w@email.com', phone: '(555) 456-7890', npn: '45678901', status: 'active', onboardingProgress: 100, licenses: 2, joinedDate: '2023-11-10' },
  { id: '5', name: 'James Taylor', email: 'james.t@email.com', phone: '(555) 567-8901', npn: '56789012', status: 'inactive', onboardingProgress: 50, licenses: 1, joinedDate: '2024-03-01' },
  { id: '6', name: 'Lisa Anderson', email: 'lisa.a@email.com', phone: '(555) 678-9012', npn: '67890123', status: 'active', onboardingProgress: 100, licenses: 5, joinedDate: '2023-09-22' },
];

export function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: '', email: '', phone: '', npn: '' });

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.npn.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddAgent = () => {
    if (!newAgent.name || !newAgent.email || !newAgent.npn) {
      toast({ title: 'Missing fields', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    
    const agent: Agent = {
      id: Date.now().toString(),
      ...newAgent,
      status: 'pending',
      onboardingProgress: 0,
      licenses: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    
    setAgents([agent, ...agents]);
    setNewAgent({ name: '', email: '', phone: '', npn: '' });
    setIsAddDialogOpen(false);
    toast({ title: 'Agent added', description: `${agent.name} has been invited to onboard.` });
  };

  const handleRemoveAgent = (id: string) => {
    setAgents(agents.filter(a => a.id !== id));
    toast({ title: 'Agent removed', description: 'The agent has been removed from your agency.' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Agents</h1>
          <p className="text-muted-foreground">Manage your agency's agents</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Agent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Agent</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  placeholder="Enter agent's full name"
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={newAgent.email}
                  onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                  placeholder="agent@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={newAgent.phone}
                  onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
                  placeholder="(555) 000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label>NPN (National Producer Number) *</Label>
                <Input
                  value={newAgent.npn}
                  onChange={(e) => setNewAgent({ ...newAgent, npn: e.target.value })}
                  placeholder="8-digit NPN"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddAgent}>Add Agent</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="action-required">Action Required</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>NPN</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Onboarding</TableHead>
                <TableHead>Licenses</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
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
                  </TableCell>
                  <TableCell className="font-mono text-sm">{agent.npn}</TableCell>
                  <TableCell>
                    <StatusBadge variant={
                      agent.status === 'active' ? 'approved' : 
                      agent.status === 'inactive' ? 'expired' : 
                      agent.status
                    }>{agent.status.replace('-', ' ')}</StatusBadge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${agent.onboardingProgress}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{agent.onboardingProgress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{agent.licenses}</TableCell>
                  <TableCell className="text-muted-foreground">{agent.joinedDate}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="w-4 h-4 mr-2" />
                          Call Agent
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleRemoveAgent(agent.id)}
                        >
                          Remove Agent
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredAgents.length === 0 && (
            <TableEmptyState type="agents" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
