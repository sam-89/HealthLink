
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatusBadgeComponent } from '../shared/components/status-badge.component';

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

@Component({
  selector: 'app-ops-document-review',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent],
  template: `
    <div class="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-foreground">Document Review</h1>
        <p class="text-muted-foreground">Review and approve agent documents</p>
      </div>

      <div class="flex-1 flex gap-6 overflow-hidden">
        <!-- Left Pane - Document Tree -->
        <div class="w-1/3 bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div class="p-4 border-b border-border bg-muted/10">
            <h2 class="font-semibold">Documents</h2>
          </div>
          <div class="flex-1 overflow-y-auto p-4 space-y-1">
             <ng-container *ngTemplateOutlet="nodeTemplate; context: { $implicit: documents() }"></ng-container>
          </div>
        </div>

        <!-- Right Pane - Preview & Action -->
        <div class="flex-1 bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
           @if (selectedDocument(); as doc) {
              <!-- Header -->
              <div class="p-6 border-b border-border">
                 <div class="flex items-start justify-between">
                    <div class="flex items-center gap-3">
                       <div class="p-2 rounded bg-blue-50 text-blue-600">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                       </div>
                       <div>
                          <h2 class="text-lg font-bold text-foreground">{{ doc.name }}</h2>
                          <div class="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                             <span>{{ doc.metadata?.uploadedBy }}</span>
                             <span>•</span>
                             <span>{{ doc.metadata?.agency }}</span>
                          </div>
                       </div>
                    </div>
                    
                    <span 
                      class="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide border"
                      [class.bg-yellow-50]="doc.metadata?.status === 'pending-review'"
                      [class.text-yellow-700]="doc.metadata?.status === 'pending-review'"
                      [class.border-yellow-200]="doc.metadata?.status === 'pending-review'"
                      [class.bg-green-50]="doc.metadata?.status === 'approved'"
                      [class.text-green-700]="doc.metadata?.status === 'approved'"
                      [class.border-green-200]="doc.metadata?.status === 'approved'"
                      [class.bg-red-50]="doc.metadata?.status === 'rejected'"
                      [class.text-red-700]="doc.metadata?.status === 'rejected'"
                      [class.border-red-200]="doc.metadata?.status === 'rejected'"
                    >
                      {{ doc.metadata?.status?.replace('-', ' ') }}
                    </span>
                 </div>

                 <!-- Meta Grid -->
                 <div class="grid grid-cols-4 gap-4 mt-6 p-4 bg-muted/30 rounded-lg text-sm border border-border/50">
                    <div>
                       <p class="text-muted-foreground text-xs uppercase tracking-wider mb-1">Upload Date</p>
                       <p class="font-medium">{{ doc.metadata?.uploadDate }}</p>
                    </div>
                     <div>
                       <p class="text-muted-foreground text-xs uppercase tracking-wider mb-1">Expiry Date</p>
                       <p class="font-medium">{{ doc.metadata?.expiryDate || 'N/A' }}</p>
                    </div>
                     <div>
                       <p class="text-muted-foreground text-xs uppercase tracking-wider mb-1">File Size</p>
                       <p class="font-medium">{{ doc.metadata?.fileSize }}</p>
                    </div>
                     <div>
                       <p class="text-muted-foreground text-xs uppercase tracking-wider mb-1">Type</p>
                       <p class="font-medium">PDF</p>
                    </div>
                 </div>
              </div>

              <!-- Preview & Actions -->
              <div class="flex-1 p-6 overflow-y-auto">
                 <!-- Mock Preview -->
                 <div class="w-full h-64 bg-muted/20 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <p class="text-muted-foreground font-medium">PDF Preview Placeholder</p>
                    <button class="px-4 py-2 bg-background border border-input rounded shadow-sm text-sm hover:bg-muted transition-colors">Download Document</button>
                 </div>

                 <!-- Review Form -->
                 @if (doc.metadata?.status === 'pending-review') {
                    <div class="space-y-4">
                       <label class="block text-sm font-medium text-foreground">Review Notes</label>
                       <textarea 
                          [(ngModel)]="reviewNotes"
                          class="w-full h-24 px-3 py-2 text-sm border border-input rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                          placeholder="Add notes about your decision..."
                       ></textarea>
                       
                       <div class="flex justify-end gap-3 pt-2">
                          <button 
                            (click)="handleReject()"
                            class="px-4 py-2 bg-white border border-destructive text-destructive rounded-lg hover:bg-destructive/5 font-medium transition-colors flex items-center gap-2"
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             Reject
                          </button>
                          <button 
                            (click)="handleApprove()"
                            class="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 font-medium transition-colors shadow-sm flex items-center gap-2"
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                             Approve
                          </button>
                       </div>
                    </div>
                 } @else {
                    <div class="p-4 rounded-lg bg-muted/50 border border-border">
                       <p class="text-sm font-medium mb-1">Review Decision</p>
                       <p class="text-sm text-muted-foreground">{{ doc.metadata?.notes || 'No notes provided.' }}</p>
                    </div>
                 }
              </div>

           } @else {
              <div class="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                 <p>Select a document to review</p>
              </div>
           }
        </div>
      </div>
    </div>

    <!-- Tree Node Template -->
    <ng-template #nodeTemplate let-nodes>
      @for (node of nodes; track node.id) {
        <div>
          <button 
            (click)="handleNodeClick(node)"
            class="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm transition-colors hover:bg-muted/50"
            [class.bg-primary/10]="selectedDocument()?.id === node.id"
            [class.text-primary]="selectedDocument()?.id === node.id"
            [style.paddingLeft.rem]="node.type === 'document' ? 1.5 : 0.75"
          >
             @if (node.type === 'folder') {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-warning shrink-0" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
                <span class="font-medium truncate flex-1">{{ node.name }}</span>
                @if (getPendingCount(node) > 0) {
                   <span class="px-1.5 py-0.5 rounded-full bg-warning/20 text-warning text-[10px] font-bold">{{ getPendingCount(node) }}</span>
                }
             } @else {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-info shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <span class="truncate">{{ node.name }}</span>
             }
          </button>
          
          @if (node.children) {
             <div class="ml-2 border-l border-border pl-1">
                <ng-container *ngTemplateOutlet="nodeTemplate; context: { $implicit: node.children }"></ng-container>
             </div>
          }
        </div>
      }
    </ng-template>
  `
})
export class OpsDocumentReviewComponent {
  documents = signal<DocumentNode[]>([
    {
      id: '1',
      name: 'Pending Review',
      type: 'folder',
      children: [
        { id: '1-1', name: 'E&O Certificate - Emily Davis', type: 'document', metadata: { uploadedBy: 'Emily Davis', agency: 'MetroHealth Agency', uploadDate: '2024-12-19', expiryDate: '2025-12-19', status: 'pending-review', fileSize: '856 KB' } },
        { id: '1-2', name: 'License Renewal - Michael Brown', type: 'document', metadata: { uploadedBy: 'Michael Brown', agency: 'HealthFirst Insurance', uploadDate: '2024-12-18', status: 'pending-review', fileSize: '1.2 MB' } },
        { id: '1-3', name: 'Background Check - James Taylor', type: 'document', metadata: { uploadedBy: 'System', agency: 'HealthFirst Insurance', uploadDate: '2024-12-17', status: 'pending-review', fileSize: '450 KB' } },
      ],
    },
    {
      id: '2',
      name: 'Recently Approved',
      type: 'folder',
      children: [
        { id: '2-1', name: 'Driver License - John Smith', type: 'document', metadata: { uploadedBy: 'John Smith', agency: 'MetroHealth Agency', uploadDate: '2024-12-15', expiryDate: '2028-01-15', status: 'approved', fileSize: '1.2 MB', notes: 'Verified against DMV records.' } },
        { id: '2-2', name: 'State License - Sarah Wilson', type: 'document', metadata: { uploadedBy: 'Sarah Wilson', agency: 'Pacific Health Group', uploadDate: '2024-12-14', expiryDate: '2026-03-01', status: 'approved', fileSize: '2.1 MB', notes: 'All information matches NIPR database.' } },
      ],
    },
    {
      id: '3',
      name: 'Rejected',
      type: 'folder',
      children: [
        { id: '3-1', name: 'E&O Certificate - Failed', type: 'document', metadata: { uploadedBy: 'Test Agent', agency: 'Test Agency', uploadDate: '2024-12-10', status: 'rejected', fileSize: '500 KB', notes: 'Document is expired. Please upload current certificate.' } },
      ],
    },
  ]);

  selectedDocument = signal<DocumentNode | null>(null);
  reviewNotes = '';

  handleNodeClick(node: DocumentNode) {
    if (node.type === 'document') {
      this.selectedDocument.set(node);
      this.reviewNotes = node.metadata?.notes || '';
    }
  }

  handleApprove() {
    this.updateStatus('approved');
  }

  handleReject() {
    this.updateStatus('rejected');
  }

  updateStatus(status: 'approved' | 'rejected') {
    const current = this.selectedDocument();
    if (!current || !current.metadata) return;

    // In a real app, this would be an API call and immutable state update
    // For demo, we are mutating the signal's value indirectly or need to deep clone
    // Simulating deep update:
    const newDocs = JSON.parse(JSON.stringify(this.documents()));
    
    const findAndUpdate = (nodes: DocumentNode[]) => {
      for (const node of nodes) {
        if (node.id === current.id) {
          node.metadata!.status = status;
          node.metadata!.notes = this.reviewNotes;
          
          // Also update selected doc to reflect change in UI immediately
          this.selectedDocument.set(node);
          return true;
        }
        if (node.children) {
          if (findAndUpdate(node.children)) return true;
        }
      }
      return false;
    };

    findAndUpdate(newDocs);
    this.documents.set(newDocs);
    
    if (status === 'approved') alert('Document Approved');
    else alert('Document Rejected');
  }

  getPendingCount(node: DocumentNode): number {
     if (node.type === 'document') {
       return node.metadata?.status === 'pending-review' ? 1 : 0;
     }
     return node.children?.reduce((acc, child) => acc + this.getPendingCount(child), 0) || 0;
  }
}
