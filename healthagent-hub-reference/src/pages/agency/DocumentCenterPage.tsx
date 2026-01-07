import { useState } from 'react';
import { 
  Folder, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  Download, 
  Eye, 
  Upload,
  Calendar,
  User,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface DocumentNode {
  id: string;
  name: string;
  type: 'folder' | 'document';
  children?: DocumentNode[];
  metadata?: {
    uploadedBy: string;
    uploadDate: string;
    expiryDate?: string;
    status: 'approved' | 'pending' | 'expired' | 'rejected';
    fileSize: string;
  };
}

const DOCUMENT_TREE: DocumentNode[] = [
  {
    id: '1',
    name: 'Agents',
    type: 'folder',
    children: [
      {
        id: '1-1',
        name: 'John Smith',
        type: 'folder',
        children: [
          { id: '1-1-1', name: 'Driver License.pdf', type: 'document', metadata: { uploadedBy: 'John Smith', uploadDate: '2024-01-15', expiryDate: '2028-01-15', status: 'approved', fileSize: '1.2 MB' } },
          { id: '1-1-2', name: 'E&O Certificate.pdf', type: 'document', metadata: { uploadedBy: 'John Smith', uploadDate: '2024-01-16', expiryDate: '2025-01-16', status: 'approved', fileSize: '856 KB' } },
          { id: '1-1-3', name: 'State License - CA.pdf', type: 'document', metadata: { uploadedBy: 'John Smith', uploadDate: '2024-01-17', expiryDate: '2026-03-01', status: 'approved', fileSize: '2.1 MB' } },
        ],
      },
      {
        id: '1-2',
        name: 'Emily Davis',
        type: 'folder',
        children: [
          { id: '1-2-1', name: 'Driver License.pdf', type: 'document', metadata: { uploadedBy: 'Emily Davis', uploadDate: '2024-02-20', expiryDate: '2027-02-20', status: 'approved', fileSize: '1.1 MB' } },
          { id: '1-2-2', name: 'E&O Certificate.pdf', type: 'document', metadata: { uploadedBy: 'Emily Davis', uploadDate: '2024-02-21', status: 'pending', fileSize: '920 KB' } },
        ],
      },
      {
        id: '1-3',
        name: 'Michael Brown',
        type: 'folder',
        children: [
          { id: '1-3-1', name: 'Driver License.pdf', type: 'document', metadata: { uploadedBy: 'Michael Brown', uploadDate: '2024-01-08', expiryDate: '2024-12-28', status: 'expired', fileSize: '1.3 MB' } },
          { id: '1-3-2', name: 'Background Check.pdf', type: 'document', metadata: { uploadedBy: 'System', uploadDate: '2024-01-09', status: 'pending', fileSize: '450 KB' } },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Agency Documents',
    type: 'folder',
    children: [
      { id: '2-1', name: 'Agency License.pdf', type: 'document', metadata: { uploadedBy: 'Admin', uploadDate: '2023-06-01', expiryDate: '2025-06-01', status: 'approved', fileSize: '3.2 MB' } },
      { id: '2-2', name: 'E&O Policy.pdf', type: 'document', metadata: { uploadedBy: 'Admin', uploadDate: '2023-06-02', expiryDate: '2024-06-02', status: 'approved', fileSize: '5.8 MB' } },
      { id: '2-3', name: 'Carrier Appointments.pdf', type: 'document', metadata: { uploadedBy: 'Admin', uploadDate: '2024-01-10', status: 'approved', fileSize: '1.8 MB' } },
    ],
  },
  {
    id: '3',
    name: 'Compliance Reports',
    type: 'folder',
    children: [
      { id: '3-1', name: 'Q1 2024 Report.pdf', type: 'document', metadata: { uploadedBy: 'System', uploadDate: '2024-04-01', status: 'approved', fileSize: '2.4 MB' } },
      { id: '3-2', name: 'Q4 2023 Report.pdf', type: 'document', metadata: { uploadedBy: 'System', uploadDate: '2024-01-02', status: 'approved', fileSize: '2.1 MB' } },
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

  return (
    <div>
      <button
        className={cn(
          'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-sm transition-colors',
          isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted',
          depth > 0 && 'ml-4'
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
        <span className="truncate">{node.name}</span>
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

export function DocumentCenterPage() {
  const [selectedDocument, setSelectedDocument] = useState<DocumentNode | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['1', '1-1']));

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
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Breadcrumbs />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Document Center</h1>
          <p className="text-muted-foreground">Manage and review all agency documents</p>
        </div>
        <Button className="gap-2">
          <Upload className="w-4 h-4" />
          Upload Document
        </Button>
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
                {DOCUMENT_TREE.map((node) => (
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

        {/* Right Pane - Document Preview */}
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
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {selectedDocument.metadata.uploadedBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {selectedDocument.metadata.uploadDate}
                      </span>
                      <span>{selectedDocument.metadata.fileSize}</span>
                    </div>
                  </div>
                  <StatusBadge variant={selectedDocument.metadata.status}>
                    {selectedDocument.metadata.status}
                  </StatusBadge>
                </div>

                {selectedDocument.metadata.expiryDate && (
                  <div className="flex items-center gap-2 mt-3 p-3 rounded-lg bg-muted/50">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Expires: <strong>{selectedDocument.metadata.expiryDate}</strong>
                    </span>
                  </div>
                )}
              </CardHeader>

              <Separator />

              <CardContent className="p-0">
                <div className="h-[calc(100vh-480px)] bg-muted/30 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-32 mx-auto bg-card border-2 border-dashed rounded-lg flex items-center justify-center">
                      <FileText className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">PDF Preview</p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="w-4 h-4" />
                        View Full
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Select a document to preview</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
