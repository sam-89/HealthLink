
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeminiService } from '../core/gemini.service';

type NodeType = 'folder' | 'file';

interface FileNode {
  id: string;
  name: string;
  type: NodeType;
  expanded?: boolean; // for folders
  children?: FileNode[]; // for folders
  // File specific metadata
  fileType?: 'pdf' | 'img';
  size?: string;
  uploadDate?: string;
  owner?: string;
  status?: 'approved' | 'pending' | 'rejected' | 'expired';
  expires?: string;
  url?: string;
}

@Component({
  selector: 'app-document-center',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-[calc(100vh-6rem)] flex flex-col animate-fade-in max-w-[1600px] mx-auto">
      <!-- Top Header -->
      <div class="flex justify-between items-center mb-6 px-1">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Document Center</h1>
          <p class="text-gray-500 mt-1">Manage and review all agency documents</p>
        </div>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 font-medium">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
             <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
           </svg>
           Upload Document
        </button>
      </div>

      <!-- Main Split Layout -->
      <div class="flex-1 flex bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        
        <!-- LEFT PANE: Tree View -->
        <div class="w-80 border-r border-gray-200 flex flex-col bg-white">
          <div class="p-4 border-b border-gray-100 flex items-center gap-2 text-gray-600">
             <h2 class="font-semibold text-gray-900">Documents</h2>
          </div>
          <div class="flex-1 overflow-y-auto p-2 custom-scrollbar">
             <!-- Tree Rendering -->
             <ng-container *ngTemplateOutlet="nodeTemplate; context: { $implicit: nodes() }"></ng-container>
          </div>
        </div>

        <!-- RIGHT PANE: Preview -->
        <div class="flex-1 flex flex-col bg-gray-50">
           @if (selectedNode(); as node) {
             <!-- File Header -->
             <div class="bg-white border-b border-gray-200 p-6">
                <div class="flex items-start justify-between">
                   <div class="flex items-start gap-4">
                      <!-- File Icon -->
                      <div class="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h2 class="text-xl font-bold text-gray-900">{{ node.name }}</h2>
                        <div class="flex items-center gap-4 mt-1 text-sm text-gray-500">
                           <div class="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                              {{ node.owner }}
                           </div>
                           <div class="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              {{ node.uploadDate }}
                           </div>
                           <span>{{ node.size }}</span>
                        </div>
                      </div>
                   </div>
                   
                   <!-- Status Badge -->
                   <div class="flex flex-col items-end gap-2">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide"
                        [class.bg-green-100]="node.status === 'approved'"
                        [class.text-green-800]="node.status === 'approved'"
                        [class.bg-yellow-100]="node.status === 'pending'"
                        [class.text-yellow-800]="node.status === 'pending'"
                        [class.bg-red-100]="node.status === 'rejected'"
                        [class.text-red-800]="node.status === 'rejected'"
                      >
                        {{ node.status }}
                      </span>
                   </div>
                </div>

                <!-- Expiry Warning -->
                @if (node.expires) {
                  <div class="mt-4 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-fit">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                     <span>Expires: <span class="font-medium text-gray-900">{{ node.expires }}</span></span>
                  </div>
                }

                <!-- Actions & AI -->
                <div class="mt-6 flex items-center justify-between">
                   <div class="flex gap-3">
                      <button class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        View Full
                      </button>
                      <button class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        Download
                      </button>
                   </div>

                   <button 
                     (click)="analyzeWithAI(node)"
                     class="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:opacity-90 shadow-sm flex items-center gap-2 transition-all"
                     [disabled]="isAnalyzing()"
                   >
                     @if (isAnalyzing()) {
                       <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                         <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                         <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                       Analyzing...
                     } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        AI Compliance Check
                     }
                   </button>
                </div>
                
                <!-- AI Result Box -->
                 @if (aiAnalysis()) {
                  <div class="mt-4 bg-indigo-50 border border-indigo-100 rounded-lg p-4 animate-fade-in flex items-start gap-3">
                    <div class="text-indigo-600 mt-0.5">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                         <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                       </svg>
                    </div>
                    <div class="flex-1">
                      <h4 class="text-sm font-bold text-indigo-900">AI Assessment</h4>
                      <p class="text-sm text-indigo-800 mt-1">{{ aiAnalysis() }}</p>
                    </div>
                    <button (click)="aiAnalysis.set('')" class="text-indigo-400 hover:text-indigo-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                }

             </div>

             <!-- Preview Area -->
             <div class="flex-1 p-6 overflow-hidden flex flex-col items-center justify-center">
                <div class="w-full h-full max-w-3xl bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden relative group">
                   <!-- Placeholder for PDF Content -->
                   <div class="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
                      <div class="p-6 border-2 border-dashed border-gray-300 rounded-xl">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                      </div>
                      <p class="mt-4 text-gray-500 font-medium">PDF Preview</p>
                      <button class="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50 transition-colors">Open in Viewer</button>
                   </div>
                </div>
             </div>
           } @else {
             <div class="flex-1 flex flex-col items-center justify-center text-gray-400">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
               <p class="text-lg font-medium">Select a document to view</p>
             </div>
           }
        </div>
      </div>
    </div>

    <!-- Tree Node Template -->
    <ng-template #nodeTemplate let-nodes>
      @for (node of nodes; track node.id) {
        <div class="select-none">
          
          <!-- Node Row -->
          <div 
            class="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors"
            [class.bg-blue-50]="selectedNode()?.id === node.id"
            [class.text-blue-700]="selectedNode()?.id === node.id"
            [class.text-gray-700]="selectedNode()?.id !== node.id"
            [class.hover:bg-gray-50]="selectedNode()?.id !== node.id"
            (click)="handleNodeClick(node)"
          >
            <!-- Toggle Icon (Folders only) -->
            <div class="w-4 h-4 flex items-center justify-center">
              @if (node.type === 'folder') {
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-3 w-3 text-gray-400 transition-transform duration-200"
                  [class.rotate-90]="node.expanded"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  (click)="$event.stopPropagation(); toggleFolder(node)"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" />
                </svg>
              }
            </div>

            <!-- Icon Type -->
            @if (node.type === 'folder') {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                 <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
            } @else {
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
               </svg>
            }

            <span class="text-sm font-medium truncate">{{ node.name }}</span>
          </div>

          <!-- Children -->
          @if (node.type === 'folder' && node.expanded && node.children) {
            <div class="pl-4 border-l border-gray-100 ml-3">
              <ng-container *ngTemplateOutlet="nodeTemplate; context: { $implicit: node.children }"></ng-container>
            </div>
          }
        </div>
      }
    </ng-template>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  `]
})
export class DocumentCenterComponent {
  gemini = inject(GeminiService);
  
  nodes = signal<FileNode[]>([
    {
      id: 'folder-agents',
      name: 'Agents',
      type: 'folder',
      expanded: true,
      children: [
        {
          id: 'folder-john',
          name: 'John Smith',
          type: 'folder',
          expanded: true,
          children: [
            {
              id: 'file-1',
              name: 'Driver License.pdf',
              type: 'file',
              fileType: 'pdf',
              size: '1.2 MB',
              uploadDate: '2024-01-15',
              owner: 'John Smith',
              status: 'approved',
              expires: '2028-01-15'
            },
            {
              id: 'file-2',
              name: 'E&O Certificate.pdf',
              type: 'file',
              fileType: 'pdf',
              size: '840 KB',
              uploadDate: '2024-01-12',
              owner: 'John Smith',
              status: 'pending'
            },
            {
              id: 'file-3',
              name: 'State License - CA.pdf',
              type: 'file',
              fileType: 'pdf',
              size: '1.5 MB',
              uploadDate: '2024-01-10',
              owner: 'John Smith',
              status: 'approved'
            }
          ]
        },
        {
          id: 'folder-emily',
          name: 'Emily Davis',
          type: 'folder',
          expanded: false,
          children: [
             { id: 'file-4', name: 'Resume.pdf', type: 'file', owner: 'Emily Davis', status: 'pending', size: '2MB', uploadDate: '2024-02-01' }
          ]
        },
        {
          id: 'folder-michael',
          name: 'Michael Brown',
          type: 'folder',
          expanded: false,
          children: []
        }
      ]
    },
    {
      id: 'folder-agency',
      name: 'Agency Documents',
      type: 'folder',
      expanded: false,
      children: []
    },
    {
      id: 'folder-compliance',
      name: 'Compliance Reports',
      type: 'folder',
      expanded: false,
      children: []
    }
  ]);

  selectedNode = signal<FileNode | null>(null);
  aiAnalysis = signal<string>('');
  isAnalyzing = signal(false);

  constructor() {
    // Select the first file by default for the demo
    const firstFile = this.nodes()[0].children?.[0].children?.[0];
    if (firstFile) {
      this.selectedNode.set(firstFile);
    }
  }

  toggleFolder(node: FileNode) {
    node.expanded = !node.expanded;
    // Force signal update implicitly by reference if we needed strict immutability, 
    // but here we just mutate state for simplicity in this demo. 
    // In a real app with OnPush and signals, we might want to clone the tree.
    this.nodes.update(n => [...n]);
  }

  handleNodeClick(node: FileNode) {
    if (node.type === 'folder') {
      this.toggleFolder(node);
    } else {
      this.selectedNode.set(node);
      this.aiAnalysis.set('');
    }
  }

  async analyzeWithAI(node: FileNode) {
    this.isAnalyzing.set(true);
    const result = await this.gemini.checkCompliance(node.name, 'Document', node.status || 'Unknown');
    this.aiAnalysis.set(result);
    this.isAnalyzing.set(false);
  }
}
