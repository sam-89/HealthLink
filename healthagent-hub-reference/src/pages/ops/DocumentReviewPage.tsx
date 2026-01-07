import { useState } from 'react';
import { 
  FileText, 
  Folder, 
  ChevronRight, 
  ChevronDown, 
  Download, 
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  Building2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface DocumentNode {
  id: string;
  name: string;
  type: 'folder' | 'document';
  children?: DocumentNode[];
  metadata?: {
    uploadedBy: string;
    agency: string;
    uploadDate: string;
    expiryDate?: string;
    status: 'pending-review' | 'approved' | 'rejected';
    fileSize: string;
    notes?: string;
  };
}

const DOCUMENT_TREE: DocumentNode[] = [
  {
    id: '1',
    name: 'Pending Review',
    type: 'folder',
    children: [
      { id: '1-1', name: 'E&O Certificate - Emily Davis.pdf', type: 'document', metadata: { uploadedBy: 'Emily Davis', agency: 'MetroHealth Agency', uploadDate: '2024-12-19', expiryDate: '2025-12-19', status: 'pending-review', fileSize: '856 KB' } },
      { id: '1-2', name: 'License Renewal - Michael Brown.pdf', type: 'document', metadata: { uploadedBy: 'Michael Brown', agency: 'HealthFirst Insurance', uploadDate: '2024-12-18', status: 'pending-review', fileSize: '1.2 MB' } },
      { id: '1-3', name: 'Background Check - James Taylor.pdf', type: 'document', metadata: { uploadedBy: 'System', agency: 'HealthFirst Insurance', uploadDate: '2024-12-17', status: 'pending-review', fileSize: '450 KB' } },
    ],
  },
  {
    id: '2',
    name: 'Recently Approved',
    type: 'folder',
    children: [
      { id: '2-1', name: 'Driver License - John Smith.pdf', type: 'document', metadata: { uploadedBy: 'John Smith', agency: 'MetroHealth Agency', uploadDate: '2024-12-15', expiryDate: '2028-01-15', status: 'approved', fileSize: '1.2 MB', notes: 'Verified against DMV records.' } },
      { id: '2-2', name: 'State License - Sarah Wilson.pdf', type: 'document', metadata: { uploadedBy: 'Sarah Wilson', agency: 'Pacific Health Group', uploadDate: '2024-12-14', expiryDate: '2026-03-01', status: 'approved', fileSize: '2.1 MB', notes: 'All information matches NIPR database.' } },
    ],
  },
  {
    id: '3',
    name: 'Rejected',
    type: 'folder',
    children: [
      { id: '3-1', name: 'E&O Certificate - Failed.pdf', type: 'document', metadata: { uploadedBy: 'Test Agent', agency: 'Test Agency', uploadDate: '2024-12-10', status: 'rejected', fileSize: '500 KB', notes: 'Document is expired. Please upload current certificate.' } },
    ],
  },
];

function TreeNode({ 
  node, 
  depth = 0, 
  selectedId, 
  onSelect,
  expandedIds,
  onToggle 
}: { 
  node: DocumentNode; 
  depth?: number; 
  selectedId: string | null;
  onSelect: (node: DocumentNode) => void;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;
  const hasChildren = node.children && node.children.length > 0;

  const getPendingCount = (n: DocumentNode): number => {
    if (n.type === 'document') {
      return n.metadata?.status === 'pending-review' ? 1 : 0;
    }
    return n.children?.reduce((acc, child) => acc + getPendingCount(child), 0) || 0;
  };

  const pendingCount = getPendingCount(node);

  return (
    <div>
      <button
        className={cn(
          'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-sm transition-colors',
          isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => {
          if (node.type === 'folder' && hasChildren) {
            onToggle(node.id);
          }
          onSelect(node);
        }}
      >
        {node.type === 'folder' ? (
          <>
            {hasChildren && (
              isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />
            )}
            <Folder className="w-4 h-4 text-warning" />
          </>
        ) : (
          <FileText className="w-4 h-4 text-info ml-4" />
        )}
        <span className="truncate flex-1">{node.name}</span>
        {node.type === 'folder' && pendingCount > 0 && (
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-warning/20 text-warning">
            {pendingCount}
          </span>
        )}
      </button>
      
      {isExpanded && node.children?.map((child) => (
        <TreeNode
          key={child.id}
          node={child}
          depth={depth + 1}
          selectedId={selectedId}
          onSelect={onSelect}
          expandedIds={expandedIds}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

export function DocumentReviewPage() {
  const [documents, setDocuments] = useState<DocumentNode[]>(DOCUMENT_TREE);
  const [selectedDocument, setSelectedDocument] = useState<DocumentNode | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['1']));
  const [reviewNotes, setReviewNotes] = useState('');

  const handleToggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelect = (node: DocumentNode) => {
    if (node.type === 'document') {
      setSelectedDocument(node);
      setReviewNotes(node.metadata?.notes || '');
    }
  };

  const updateDocumentStatus = (docId: string, newStatus: 'approved' | 'rejected', notes: string) => {
    const updateNode = (nodes: DocumentNode[]): DocumentNode[] => {
      return nodes.map(node => {
        if (node.id === docId && node.metadata) {
          return { ...node, metadata: { ...node.metadata, status: newStatus, notes } };
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    };
    setDocuments(updateNode(documents));
  };

  const handleApprove = () => {
    if (!selectedDocument) return;
    updateDocumentStatus(selectedDocument.id, 'approved', reviewNotes);
    toast({ title: 'Document Approved', description: 'The document has been approved successfully.' });
    setSelectedDocument(null);
    setReviewNotes('');
  };

  const handleReject = () => {
    if (!selectedDocument) return;
    if (!reviewNotes.trim()) {
      toast({ title: 'Notes required', description: 'Please provide rejection reason.', variant: 'destructive' });
      return;
    }
    updateDocumentStatus(selectedDocument.id, 'rejected', reviewNotes);
    toast({ title: 'Document Rejected', description: 'The document has been rejected.' });
    setSelectedDocument(null);
    setReviewNotes('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      <div>
        <h1 className="text-2xl font-display font-bold">Document Review</h1>
        <p className="text-muted-foreground">Review and approve agent documents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        {/* Left Pane - Document Tree */}
        <Card className="shadow-card lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Documents</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-320px)]">
              <div className="p-4 space-y-1">
                {documents.map((node) => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    selectedId={selectedDocument?.id || null}
                    onSelect={handleSelect}
                    expandedIds={expandedIds}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right Pane - Document Preview & Review */}
        <Card className="shadow-card lg:col-span-2">
          {selectedDocument?.metadata ? (
            <>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-info" />
                      {selectedDocument.name}
                    </CardTitle>
                  </div>
                  <StatusBadge variant={
                    selectedDocument.metadata.status === 'approved' ? 'approved' : 
                    selectedDocument.metadata.status === 'rejected' ? 'rejected' : 'pending'
                  }>
                    {selectedDocument.metadata.status.replace('-', ' ')}
                  </StatusBadge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Uploaded By</p>
                      <p className="text-sm font-medium">{selectedDocument.metadata.uploadedBy}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Agency</p>
                      <p className="text-sm font-medium">{selectedDocument.metadata.agency}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Upload Date</p>
                      <p className="text-sm font-medium">{selectedDocument.metadata.uploadDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Expiry Date</p>
                      <p className="text-sm font-medium">{selectedDocument.metadata.expiryDate || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="p-4 space-y-4">
                {/* Document Preview Placeholder */}
                <div className="h-48 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed">
                  <div className="text-center space-y-2">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">Document Preview</p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Download ({selectedDocument.metadata.fileSize})
                    </Button>
                  </div>
                </div>

                {/* Review Notes */}
                <div className="space-y-2">
                  <Label>Review Notes</Label>
                  <Textarea
                    placeholder="Add notes about this document..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Action Buttons */}
                {selectedDocument.metadata.status === 'pending-review' && (
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="destructive" onClick={handleReject} className="gap-2">
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                    <Button onClick={handleApprove} className="gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </Button>
                  </div>
                )}
              </CardContent>
            </>
          ) : (
            <CardContent className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Select a document to review</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
