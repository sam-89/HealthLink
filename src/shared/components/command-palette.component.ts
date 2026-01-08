
import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { FormsModule } from '@angular/forms';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  path: string;
  type: 'page' | 'agent' | 'document';
}

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Trigger Button -->
    <button 
      (click)="isOpen.set(true)"
      class="relative flex items-center gap-2 w-48 md:w-64 px-3 py-2 text-sm text-muted-foreground bg-muted/50 rounded-md hover:bg-muted transition-colors border border-transparent hover:border-border"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span class="hidden md:inline">Search...</span>
      <span class="md:hidden">Search</span>
      <kbd class="absolute right-2 hidden md:inline-flex h-5 items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
        <span class="text-xs">⌘</span>K
      </kbd>
    </button>

    <!-- Modal -->
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" (click)="isOpen.set(false)"></div>
        
        <!-- Dialog -->
        <div class="relative w-full max-w-lg bg-popover rounded-xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <!-- Search Input -->
          <div class="flex items-center border-b border-border px-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-muted-foreground mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              #searchInput
              type="text" 
              [(ngModel)]="query"
              (ngModelChange)="filterResults()"
              placeholder="Type a command or search..."
              class="flex-1 h-14 bg-transparent outline-none text-base placeholder:text-muted-foreground"
              autoFocus
            />
            <button (click)="isOpen.set(false)" class="text-xs px-2 py-1 bg-muted rounded text-muted-foreground hover:text-foreground">ESC</button>
          </div>

          <!-- Results -->
          <div class="max-h-[300px] overflow-y-auto p-2">
            @if (filteredResults().length === 0) {
               <div class="py-12 text-center text-sm text-muted-foreground">
                  No results found.
               </div>
            }
            
            @for (group of groupedResults(); track group.type) {
               <div class="mb-2">
                 <div class="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                   {{ group.type }}s
                 </div>
                 @for (item of group.items; track item.id) {
                   <button 
                      (click)="selectItem(item)"
                      class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left group"
                   >
                      <div class="w-8 h-8 rounded flex items-center justify-center bg-muted group-hover:bg-background transition-colors">
                        <!-- Icon Switch -->
                         @switch(item.type) {
                           @case('page') { <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> }
                           @case('agent') { <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> }
                           @case('document') { <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> }
                         }
                      </div>
                      <div>
                        <div class="text-sm font-medium">{{ item.title }}</div>
                        <div class="text-xs text-muted-foreground">{{ item.subtitle }}</div>
                      </div>
                      <svg class="w-4 h-4 ml-auto opacity-0 group-hover:opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                   </button>
                 }
               </div>
            }
          </div>
          
          <div class="px-4 py-2 border-t border-border bg-muted/30 text-xs text-muted-foreground flex justify-between">
             <span><strong>↑↓</strong> to navigate</span>
             <span><strong>↵</strong> to select</span>
          </div>
        </div>
      </div>
    }
  `
})
export class CommandPaletteComponent {
  isOpen = signal(false);
  query = '';
  
  auth = inject(AuthService);
  router = inject(Router);

  // Mock Data Source
  allResults: SearchResult[] = [
    // Navigation
    { id: 'nav-dash', title: 'Dashboard', subtitle: 'Go to main dashboard', icon: 'layout', type: 'page', path: '/app/agent-dashboard' },
    { id: 'nav-serv', title: 'Services', subtitle: 'View all services', icon: 'grid', type: 'page', path: '/app/agent-services' },
    { id: 'nav-prof', title: 'Profile', subtitle: 'Manage your account', icon: 'user', type: 'page', path: '/app/agent-profile' },
    { id: 'nav-docs', title: 'My Documents', subtitle: 'View uploaded files', icon: 'file', type: 'page', path: '/app/agent-documents' },
    { id: 'nav-onboard', title: 'Onboarding', subtitle: 'Continue setup', icon: 'check', type: 'page', path: '/app/agent-onboarding' },
    
    // Mock Agents (for Agency/Ops)
    { id: 'agt-1', title: 'John Smith', subtitle: 'Agent - MetroHealth', icon: 'user', type: 'agent', path: '/app/agency-agents' },
    { id: 'agt-2', title: 'Emily Davis', subtitle: 'Agent - Pending Review', icon: 'user', type: 'agent', path: '/app/agency-agents' },
    
    // Mock Docs
    { id: 'doc-1', title: 'E&O Certificate', subtitle: 'PDF - Uploaded today', icon: 'file', type: 'document', path: '/app/agent-documents' },
    { id: 'doc-2', title: 'State License CA', subtitle: 'PDF - Expires 2025', icon: 'file', type: 'document', path: '/app/agent-documents' },
  ];

  filteredResults = signal<SearchResult[]>(this.allResults);
  
  groupedResults = signal<{type: string, items: SearchResult[]}[]>([]);

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.isOpen.update(v => !v);
      if (this.isOpen()) {
        setTimeout(() => document.querySelector<HTMLInputElement>('input[type="text"]')?.focus(), 10);
      }
    }
    if (event.key === 'Escape' && this.isOpen()) {
      this.isOpen.set(false);
    }
  }

  filterResults() {
    const q = this.query.toLowerCase();
    const results = this.allResults.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.subtitle.toLowerCase().includes(q)
    );
    this.filteredResults.set(results);
    this.groupResults(results);
  }

  groupResults(results: SearchResult[]) {
    const groups: {[key: string]: SearchResult[]} = {};
    results.forEach(r => {
      if (!groups[r.type]) groups[r.type] = [];
      groups[r.type].push(r);
    });
    
    const grouped = Object.keys(groups).map(type => ({
      type,
      items: groups[type]
    }));
    
    this.groupedResults.set(grouped);
  }

  selectItem(item: SearchResult) {
    this.router.navigate([item.path]);
    this.isOpen.set(false);
    this.query = '';
  }

  constructor() {
    this.groupResults(this.allResults);
  }
}
