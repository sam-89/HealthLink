import { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  AlertTriangle,
  Filter,
  Search,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TableEmptyState } from '@/components/shared/EmptyState';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface QueueItem {
  id: string;
  type: 'license' | 'document' | 'background' | 'onboarding';
  agentName: string;
  agencyName: string;
  description: string;
  submittedDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-review' | 'approved' | 'rejected';
}

const MOCK_QUEUE: QueueItem[] = [
  { id: '1', type: 'license', agentName: 'John Smith', agencyName: 'MetroHealth Agency', description: 'California Health License renewal', submittedDate: '2024-12-20', priority: 'high', status: 'pending' },
  { id: '2', type: 'document', agentName: 'Emily Davis', agencyName: 'MetroHealth Agency', description: 'E&O Certificate upload', submittedDate: '2024-12-19', priority: 'medium', status: 'in-review' },
  { id: '3', type: 'background', agentName: 'Michael Brown', agencyName: 'HealthFirst Insurance', description: 'Annual background check', submittedDate: '2024-12-18', priority: 'high', status: 'pending' },
  { id: '4', type: 'onboarding', agentName: 'Sarah Wilson', agencyName: 'Pacific Health Group', description: 'New agent onboarding completion', submittedDate: '2024-12-17', priority: 'low', status: 'pending' },
  { id: '5', type: 'license', agentName: 'James Taylor', agencyName: 'HealthFirst Insurance', description: 'Texas Life & Health License', submittedDate: '2024-12-16', priority: 'medium', status: 'pending' },
  { id: '6', type: 'document', agentName: 'Lisa Anderson', agencyName: 'Pacific Health Group', description: "Driver's License verification", submittedDate: '2024-12-15', priority: 'low', status: 'in-review' },
];

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high': return 'text-destructive bg-destructive/10';
    case 'medium': return 'text-warning bg-warning/10';
    case 'low': return 'text-muted-foreground bg-muted';
    default: return 'text-muted-foreground bg-muted';
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'license': return '📄';
    case 'document': return '📁';
    case 'background': return '🔍';
    case 'onboarding': return '👤';
    default: return '📋';
  }
}

export function VerificationQueuePage() {
  const [queue, setQueue] = useState<QueueItem[]>(MOCK_QUEUE);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const filteredQueue = queue.filter((item) => {
    const matchesSearch =
      item.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setQueue(queue.map(item => 
      item.id === id ? { ...item, status: 'approved' as const } : item
    ));
    setSelectedItem(null);
    setReviewNotes('');
    toast({ title: 'Approved', description: 'The item has been approved successfully.' });
  };

  const handleReject = (id: string) => {
    if (!reviewNotes.trim()) {
      toast({ title: 'Notes required', description: 'Please provide rejection notes.', variant: 'destructive' });
      return;
    }
    setQueue(queue.map(item => 
      item.id === id ? { ...item, status: 'rejected' as const } : item
    ));
    setSelectedItem(null);
    setReviewNotes('');
    toast({ title: 'Rejected', description: 'The item has been rejected.' });
  };

  const handleStartReview = (item: QueueItem) => {
    setQueue(queue.map(q => 
      q.id === item.id ? { ...q, status: 'in-review' as const } : q
    ));
    setSelectedItem(item);
  };

  const pendingCount = queue.filter(i => i.status === 'pending').length;
  const inReviewCount = queue.filter(i => i.status === 'in-review').length;
  const highPriorityCount = queue.filter(i => i.priority === 'high' && i.status === 'pending').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      <div>
        <h1 className="text-2xl font-display font-bold">Verification Queue</h1>
        <p className="text-muted-foreground">Review and process pending verifications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div className="p-3 rounded-lg bg-info/10">
              <Eye className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inReviewCount}</p>
              <p className="text-sm text-muted-foreground">In Review</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-destructive/10">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{highPriorityCount}</p>
              <p className="text-sm text-muted-foreground">High Priority</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{queue.filter(i => i.status === 'approved').length}</p>
              <p className="text-sm text-muted-foreground">Approved Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by agent, agency, or description..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="license">License</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="background">Background</SelectItem>
                <SelectItem value="onboarding">Onboarding</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredQueue.map((item) => (
              <div 
                key={item.id} 
                className={cn(
                  'flex items-center justify-between p-4 rounded-lg border transition-colors',
                  item.status === 'in-review' && 'bg-info/5 border-info/20'
                )}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{getTypeIcon(item.type)}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{item.description}</p>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full capitalize', getPriorityColor(item.priority))}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.agentName} • {item.agencyName} • Submitted {item.submittedDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge variant={
                    item.status === 'approved' ? 'approved' : 
                    item.status === 'rejected' ? 'rejected' : 
                    item.status === 'in-review' ? 'info' : 'pending'
                  }>
                    {item.status.replace('-', ' ')}
                  </StatusBadge>
                  {item.status === 'pending' && (
                    <Button size="sm" onClick={() => handleStartReview(item)}>
                      Review
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                  {item.status === 'in-review' && (
                    <Button size="sm" variant="outline" onClick={() => setSelectedItem(item)}>
                      Continue
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {filteredQueue.length === 0 && (
              <TableEmptyState type="queue" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review: {selectedItem?.description}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Agent</p>
                  <p className="font-medium">{selectedItem.agentName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Agency</p>
                  <p className="font-medium">{selectedItem.agencyName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{selectedItem.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium">{selectedItem.submittedDate}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Review Notes</Label>
                <Textarea
                  placeholder="Add notes about your review decision..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedItem(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedItem && handleReject(selectedItem.id)}
              className="gap-2"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </Button>
            <Button 
              onClick={() => selectedItem && handleApprove(selectedItem.id)}
              className="gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
