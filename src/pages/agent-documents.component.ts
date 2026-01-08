
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeComponent, BadgeVariant } from '../shared/components/status-badge.component';

interface MyDocument {
  id: string;
  name: string;
  type: string;
  date: string;
  status: BadgeVariant;
  url: string;
}

@Component({
  selector: 'app-agent-documents',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex justify-between items-end">
        <div>
           <h2 class="text-2xl font-bold text-foreground">My Documents</h2>
           <p class="text-muted-foreground mt-1">Manage your uploaded certificates and licenses</p>
        </div>
        <button class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm font-medium text-sm">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
             <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
           </svg>
           Upload Document
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-card p-4 rounded-xl border border-border shadow-card flex items-center gap-3">
            <div class="p-2 rounded-lg bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" /></svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-foreground">12</p>
              <p class="text-xs text-muted-foreground font-medium">Total Documents</p>
            </div>
        </div>
        <div class="bg-card p-4 rounded-xl border border-border shadow-card flex items-center gap-3">
             <div class="p-2 rounded-lg bg-success/10 text-success">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-foreground">3</p>
              <p class="text-xs text-muted-foreground font-medium">Approved</p>
            </div>
        </div>
         <div class="bg-card p-4 rounded-xl border border-border shadow-card flex items-center gap-3">
             <div class="p-2 rounded-lg bg-warning/10 text-warning">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" /></svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-foreground">2</p>
              <p class="text-xs text-muted-foreground font-medium">Pending Review</p>
            </div>
        </div>
         <div class="bg-card p-4 rounded-xl border border-border shadow-card flex items-center gap-3">
             <div class="p-2 rounded-lg bg-destructive/10 text-destructive">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
            </div>
            <div>
              <p class="text-2xl font-bold text-foreground">1</p>
              <p class="text-xs text-muted-foreground font-medium">Expiring Soon</p>
            </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-card border border-border rounded-xl shadow-card p-4">
        <div class="flex flex-col sm:flex-row gap-4 justify-between items-center">
             <h3 class="text-base font-semibold text-foreground">All Documents</h3>
             <div class="flex gap-2 w-full sm:w-auto">
                 <div class="relative flex-1 sm:w-64">
                   <input type="text" placeholder="Search documents..." class="w-full pl-9 pr-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none bg-background text-sm">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-muted-foreground absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                   </svg>
                </div>
                <select class="px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:outline-none text-sm w-32">
                  <option value="ALL">Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                </select>
             </div>
        </div>
      
        <!-- Table -->
        <div class="mt-4 overflow-hidden rounded-md border border-border">
          <table class="min-w-full divide-y divide-border">
            <thead class="bg-muted/50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Document Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Upload Date</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th scope="col" class="relative px-6 py-3 text-right">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-card divide-y divide-border">
              @for (doc of documents(); track doc.id) {
                <tr class="hover:bg-muted/30 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-8 w-8 bg-muted rounded flex items-center justify-center text-muted-foreground">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                         </svg>
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-foreground">{{ doc.name }}</div>
                        <div class="text-xs text-muted-foreground">PDF • 2MB</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                      {{ doc.type }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {{ doc.date }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <app-status-badge [variant]="doc.status">
                        {{ doc.status }}
                    </app-status-badge>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end gap-2">
                        <button class="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button class="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        </button>
                         <button class="text-destructive/70 hover:text-destructive p-1 rounded hover:bg-destructive/10">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
   styles: [`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  `]
})
export class AgentDocumentsComponent {
  documents = signal<MyDocument[]>([
    { id: '1', name: 'California Insurance License', type: 'License', date: 'Oct 24, 2024', status: 'approved', url: '#' },
    { id: '2', name: 'E&O Liability Certificate', type: 'Insurance', date: 'Oct 15, 2024', status: 'pending', url: '#' },
    { id: '3', name: 'Anti-Money Laundering Cert', type: 'Compliance', date: 'Sep 30, 2024', status: 'approved', url: '#' },
    { id: '4', name: 'Background Check Report', type: 'Legal', date: 'Aug 12, 2023', status: 'expired', url: '#' },
  ]);
}
