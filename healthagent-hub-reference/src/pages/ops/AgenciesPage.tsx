import { useState } from 'react';
import { 
  Building2, 
  Search, 
  MoreHorizontal, 
  Users, 
  FileText, 
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Progress } from '@/components/ui/progress';
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
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Agency {
  id: string;
  name: string;
  npn: string;
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'pending' | 'suspended';
  agentCount: number;
  complianceScore: number;
  documentsOnFile: number;
  joinedDate: string;
}

const MOCK_AGENCIES: Agency[] = [
  { id: '1', name: 'MetroHealth Agency', npn: '98765432', email: 'contact@metrohealth.com', phone: '(555) 123-4567', location: 'Los Angeles, CA', status: 'active', agentCount: 47, complianceScore: 92, documentsOnFile: 234, joinedDate: '2022-03-15' },
  { id: '2', name: 'HealthFirst Insurance', npn: '87654321', email: 'info@healthfirst.com', phone: '(555) 234-5678', location: 'New York, NY', status: 'active', agentCount: 32, complianceScore: 88, documentsOnFile: 156, joinedDate: '2022-06-20' },
  { id: '3', name: 'Pacific Health Group', npn: '76543210', email: 'contact@pacifichealth.com', phone: '(555) 345-6789', location: 'Seattle, WA', status: 'active', agentCount: 28, complianceScore: 95, documentsOnFile: 142, joinedDate: '2022-01-10' },
  { id: '4', name: 'Sunrise Benefits', npn: '65432109', email: 'hello@sunrisebenefits.com', phone: '(555) 456-7890', location: 'Miami, FL', status: 'pending', agentCount: 15, complianceScore: 75, documentsOnFile: 68, joinedDate: '2024-01-05' },
  { id: '5', name: 'Mountain State Insurance', npn: '54321098', email: 'info@mountainstate.com', phone: '(555) 567-8901', location: 'Denver, CO', status: 'suspended', agentCount: 8, complianceScore: 45, documentsOnFile: 32, joinedDate: '2023-08-12' },
];

export function AgenciesPage() {
  const [agencies] = useState<Agency[]>(MOCK_AGENCIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);

  const filteredAgencies = agencies.filter((agency) => {
    const matchesSearch =
      agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.npn.includes(searchTerm) ||
      agency.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agency.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAgents = agencies.reduce((acc, a) => acc + a.agentCount, 0);
  const avgCompliance = Math.round(agencies.reduce((acc, a) => acc + a.complianceScore, 0) / agencies.length);
  const pendingAgencies = agencies.filter(a => a.status === 'pending').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      <div>
        <h1 className="text-2xl font-display font-bold">Agencies</h1>
        <p className="text-muted-foreground">Manage and monitor all registered agencies</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{agencies.length}</p>
              <p className="text-sm text-muted-foreground">Total Agencies</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-info/10">
              <Users className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalAgents}</p>
              <p className="text-sm text-muted-foreground">Total Agents</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{avgCompliance}%</p>
              <p className="text-sm text-muted-foreground">Avg Compliance</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-warning/10">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingAgencies}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
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
                placeholder="Search by name, NPN, or location..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agency</TableHead>
                <TableHead>NPN</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Agents</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgencies.map((agency) => (
                <TableRow key={agency.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedAgency(agency)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{agency.name}</p>
                        <p className="text-sm text-muted-foreground">{agency.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{agency.npn}</TableCell>
                  <TableCell className="text-muted-foreground">{agency.location}</TableCell>
                  <TableCell>
                    <StatusBadge variant={
                      agency.status === 'active' ? 'approved' : 
                      agency.status === 'pending' ? 'pending' : 'rejected'
                    }>{agency.status}</StatusBadge>
                  </TableCell>
                  <TableCell>{agency.agentCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={agency.complianceScore} 
                        className="w-16 h-2"
                      />
                      <span className="text-sm">{agency.complianceScore}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedAgency(agency); }}>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Agency Detail Dialog */}
      <Dialog open={!!selectedAgency} onOpenChange={() => setSelectedAgency(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              {selectedAgency?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedAgency && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">NPN</p>
                  <p className="font-mono font-medium">{selectedAgency.npn}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <StatusBadge variant={
                    selectedAgency.status === 'active' ? 'approved' : 
                    selectedAgency.status === 'pending' ? 'pending' : 'rejected'
                  } className="mt-1">{selectedAgency.status}</StatusBadge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {selectedAgency.email}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {selectedAgency.phone}
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  {selectedAgency.location}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="w-6 h-6 mx-auto text-info mb-2" />
                    <p className="text-2xl font-bold">{selectedAgency.agentCount}</p>
                    <p className="text-sm text-muted-foreground">Agents</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-6 h-6 mx-auto text-success mb-2" />
                    <p className="text-2xl font-bold">{selectedAgency.complianceScore}%</p>
                    <p className="text-sm text-muted-foreground">Compliance</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <FileText className="w-6 h-6 mx-auto text-warning mb-2" />
                    <p className="text-2xl font-bold">{selectedAgency.documentsOnFile}</p>
                    <p className="text-sm text-muted-foreground">Documents</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">View Agents</Button>
                <Button variant="outline">View Documents</Button>
                <Button>Contact Agency</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
