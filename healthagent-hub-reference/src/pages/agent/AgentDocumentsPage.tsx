import { useState, useEffect } from 'react';
import { FileText, Upload, Download, Eye, Trash2, Clock, CheckCircle, AlertTriangle, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { FileUploader } from '@/components/shared/FileUploader';
import { DocumentsPageSkeleton } from '@/components/shared/skeletons';
import { TableEmptyState } from '@/components/shared/EmptyState';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DocumentRequirement } from '@/types';

interface Document {
  id: string;
  name: string;
  category: string;
  uploadedAt: string;
  expiresAt?: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  fileSize: string;
  fileType: string;
}

const MOCK_DOCUMENTS: Document[] = [
  { id: '1', name: "Driver's License", category: 'Identity', uploadedAt: '2024-12-15', expiresAt: '2027-12-15', status: 'approved', fileSize: '1.2 MB', fileType: 'PDF' },
  { id: '2', name: 'E&O Certificate', category: 'Insurance', uploadedAt: '2024-12-18', expiresAt: '2025-12-18', status: 'pending', fileSize: '856 KB', fileType: 'PDF' },
  { id: '3', name: 'California State License', category: 'License', uploadedAt: '2024-11-20', expiresAt: '2025-11-20', status: 'approved', fileSize: '524 KB', fileType: 'PDF' },
  { id: '4', name: 'Texas State License', category: 'License', uploadedAt: '2024-10-10', expiresAt: '2024-12-31', status: 'expired', fileSize: '498 KB', fileType: 'PDF' },
  { id: '5', name: 'Background Check', category: 'Compliance', uploadedAt: '2024-12-01', status: 'approved', fileSize: '1.5 MB', fileType: 'PDF' },
  { id: '6', name: 'Training Certificate - AHIP', category: 'Training', uploadedAt: '2024-11-15', expiresAt: '2025-11-15', status: 'approved', fileSize: '320 KB', fileType: 'PDF' },
];

const UPLOAD_REQUIREMENTS: DocumentRequirement[] = [
  { id: 'license', name: 'State License', description: 'Upload a new state license', required: true, status: 'pending' },
  { id: 'eo', name: 'E&O Certificate', description: 'Updated E&O insurance certificate', required: true, status: 'pending' },
  { id: 'training', name: 'Training Certificate', description: 'Carrier or compliance training', required: false, status: 'pending' },
  { id: 'other', name: 'Other Document', description: 'Any additional documentation', required: false, status: 'pending' },
];

export function AgentDocumentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const categories = ['all', ...new Set(documents.map(d => d.category))];
  const statuses = ['all', 'pending', 'approved', 'rejected', 'expired'];

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const stats = {
    total: documents.length,
    approved: documents.filter(d => d.status === 'approved').length,
    pending: documents.filter(d => d.status === 'pending').length,
    expiringSoon: documents.filter(d => {
      if (!d.expiresAt) return false;
      const daysUntilExpiry = Math.ceil((new Date(d.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    }).length,
  };

  const handleDelete = (id: string) => {
    setDocuments(docs => docs.filter(d => d.id !== id));
  };

  if (isLoading) {
    return <DocumentsPageSkeleton />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">My Documents</h1>
          <p className="text-muted-foreground">Manage your licenses, certificates, and compliance documents</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {UPLOAD_REQUIREMENTS.map(req => (
                <FileUploader
                  key={req.id}
                  requirement={req}
                  onUpload={(file) => {
                    const newDoc: Document = {
                      id: Date.now().toString(),
                      name: file.name.replace(/\.[^/.]+$/, ''),
                      category: req.name.includes('License') ? 'License' : req.name.includes('E&O') ? 'Insurance' : 'Other',
                      uploadedAt: new Date().toISOString().split('T')[0],
                      status: 'pending',
                      fileSize: `${(file.size / 1024).toFixed(0)} KB`,
                      fileType: file.name.split('.').pop()?.toUpperCase() || 'FILE',
                    };
                    setDocuments(prev => [...prev, newDoc]);
                    setUploadDialogOpen(false);
                  }}
                  onRemove={() => {}}
                />
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Documents</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10 text-success">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.approved}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10 text-warning">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.expiringSoon}</p>
              <p className="text-sm text-muted-foreground">Expiring Soon</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle>All Documents</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48"
              />
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map(doc => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-muted">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.fileType} • {doc.fileSize}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 text-xs rounded-full bg-muted">{doc.category}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{doc.uploadedAt}</TableCell>
                  <TableCell className="text-muted-foreground">{doc.expiresAt || '—'}</TableCell>
                  <TableCell>
                    <StatusBadge variant={doc.status === 'expired' ? 'rejected' : doc.status}>
                      {doc.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setPreviewDoc(doc)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredDocuments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <TableEmptyState type="documents" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{previewDoc?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
              <FileText className="w-16 h-16 text-muted-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Category</p>
                <p className="font-medium">{previewDoc?.category}</p>
              </div>
              <div>
                <p className="text-muted-foreground">File Type</p>
                <p className="font-medium">{previewDoc?.fileType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Uploaded</p>
                <p className="font-medium">{previewDoc?.uploadedAt}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Expires</p>
                <p className="font-medium">{previewDoc?.expiresAt || 'No expiration'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Size</p>
                <p className="font-medium">{previewDoc?.fileSize}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <StatusBadge variant={previewDoc?.status === 'expired' ? 'rejected' : previewDoc?.status || 'pending'}>
                  {previewDoc?.status}
                </StatusBadge>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setPreviewDoc(null)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}