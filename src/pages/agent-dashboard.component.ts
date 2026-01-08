
import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { StatusBadgeComponent } from '../shared/components/status-badge.component';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent],
  template: `
    <div class="min-h-screen font-sans text-sm text-foreground pb-12 animate-fade-in">
      
      <!-- Welcome Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-display font-bold text-foreground">Welcome back, {{ firstName() }}</h1>
        <p class="text-muted-foreground">Here's your compliance status overview</p>
      </div>

      <!-- State Services Bar -->
      <div class="bg-card rounded-lg shadow-card border border-border p-4 mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div class="flex flex-wrap items-center gap-2">
              <h3 class="font-semibold text-foreground mr-2">State Services</h3>
              
              <button class="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-primary/80 hover:bg-muted/50 transition-colors font-medium text-sm" (click)="router.navigate(['/app/agent-services/licensing/apply'])">
                 <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                 Apply for a License
              </button>
              
              <button class="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-primary/80 hover:bg-muted/50 transition-colors font-medium text-sm" (click)="showNotification('Renewal module opening...')">
                 <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                 Renew a License
              </button>

              <button class="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-primary/80 hover:bg-muted/50 transition-colors font-medium text-sm" (click)="router.navigate(['/app/agent-documents'])">
                 <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                 Print a License
              </button>

              <button class="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-primary/80 hover:bg-muted/50 transition-colors font-medium text-sm" (click)="router.navigate(['/app/agent-profile'])">
                 <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 Change Contact Info
              </button>
          </div>
          
          <button (click)="router.navigate(['/app/agent-services'])" class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md shadow-sm text-sm transition-colors">
              View All Services
          </button>
      </div>

      <!-- To Dos / Activity Section -->
      <div class="bg-muted/30 rounded-lg border border-border mb-6 shadow-card overflow-hidden">
          <!-- Tab Headers -->
          <div class="flex bg-muted/50 border-b border-border">
               <button 
                  (click)="overviewSubTab.set('todos')"
                  class="px-6 py-3 font-medium text-sm transition-colors border-b-2"
                  [class.border-primary]="overviewSubTab() === 'todos'"
                  [class.text-foreground]="overviewSubTab() === 'todos'"
                  [class.bg-card]="overviewSubTab() === 'todos'"
                  [class.border-transparent]="overviewSubTab() !== 'todos'"
                  [class.text-muted-foreground]="overviewSubTab() !== 'todos'"
                  [class.hover:text-foreground]="overviewSubTab() !== 'todos'"
               >
                  To Dos
               </button>
               <button 
                  (click)="overviewSubTab.set('activity')"
                  class="px-6 py-3 font-medium text-sm transition-colors border-b-2"
                  [class.border-primary]="overviewSubTab() === 'activity'"
                  [class.text-foreground]="overviewSubTab() === 'activity'"
                  [class.bg-card]="overviewSubTab() === 'activity'"
                  [class.border-transparent]="overviewSubTab() !== 'activity'"
                  [class.text-muted-foreground]="overviewSubTab() !== 'activity'"
                  [class.hover:text-foreground]="overviewSubTab() !== 'activity'"
               >
                  Recent Activity
               </button>
          </div>
          
          <!-- Tab Content -->
          <div class="p-0 bg-card min-h-[150px]">
              @if (overviewSubTab() === 'todos') {
                  <div class="divide-y divide-border">
                      <div class="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                          <div class="flex items-center gap-3">
                              <div class="w-2 h-2 rounded-full bg-destructive"></div>
                              <span class="font-medium text-foreground">Complete California license renewal</span>
                          </div>
                          <span class="text-sm text-muted-foreground">Due: Jan 15, 2025</span>
                      </div>
                      <div class="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                          <div class="flex items-center gap-3">
                              <div class="w-2 h-2 rounded-full bg-warning"></div>
                              <span class="font-medium text-foreground">Upload updated E&O certificate</span>
                          </div>
                          <span class="text-sm text-muted-foreground">Due: Jan 20, 2025</span>
                      </div>
                      <div class="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                          <div class="flex items-center gap-3">
                              <div class="w-2 h-2 rounded-full bg-success"></div>
                              <span class="font-medium text-foreground">Complete CE requirements for Texas</span>
                          </div>
                          <span class="text-sm text-muted-foreground">Due: Feb 1, 2025</span>
                      </div>
                  </div>
              } @else {
                  <div class="divide-y divide-border">
                      <div class="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                          <div>
                              <p class="font-medium text-foreground">License renewed</p>
                              <p class="text-sm text-muted-foreground">California</p>
                          </div>
                          <div class="text-right">
                              <app-status-badge variant="approved">approved</app-status-badge>
                              <p class="text-xs text-muted-foreground mt-1">Dec 20, 2024</p>
                          </div>
                      </div>
                      <div class="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                           <div>
                              <p class="font-medium text-foreground">Document uploaded</p>
                              <p class="text-sm text-muted-foreground">E&O Certificate</p>
                          </div>
                          <div class="text-right">
                              <app-status-badge variant="pending">pending</app-status-badge>
                              <p class="text-xs text-muted-foreground mt-1">Dec 18, 2024</p>
                          </div>
                      </div>
                       <div class="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                           <div>
                              <p class="font-medium text-foreground">Background check</p>
                              <p class="text-sm text-muted-foreground">Completed</p>
                          </div>
                          <div class="text-right">
                              <app-status-badge variant="complete">complete</app-status-badge>
                              <p class="text-xs text-muted-foreground mt-1">Dec 15, 2024</p>
                          </div>
                      </div>
                  </div>
              }
          </div>
      </div>

      <!-- Main Cards Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Licenses Card -->
          <div class="bg-card border-l-4 border-l-warning border border-border rounded-lg shadow-card">
              <div class="p-6">
                  <div class="flex flex-row items-center justify-between mb-4">
                      <h3 class="text-lg font-semibold">Licenses</h3>
                      <button class="text-primary text-sm font-medium hover:underline flex items-center gap-1" (click)="router.navigate(['/app/agent-services/licensing/apply'])">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                          Apply for a License
                      </button>
                  </div>
                  
                  <div class="flex items-start gap-4">
                      <div class="p-2 rounded-lg bg-muted shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <div>
                          <p class="font-medium text-foreground">Looking for your licenses?</p>
                          <p class="text-sm text-muted-foreground mt-1 mb-3">Sign up for a premium subscription</p>
                          <ul class="space-y-1 text-sm text-muted-foreground">
                              <li class="flex items-start gap-2"><span class="text-primary mt-0.5">•</span> View your licenses and lines of authority for every state in which you are licensed.</li>
                              <li class="flex items-start gap-2"><span class="text-primary mt-0.5">•</span> Automatically keep your licenses up to date with any changes from the state.</li>
                              <li class="flex items-start gap-2"><span class="text-primary mt-0.5">•</span> Get renewal reminders when your licenses are about to expire.</li>
                              <li class="flex items-start gap-2"><span class="text-primary mt-0.5">•</span> Free license printing.</li>
                          </ul>
                      </div>
                  </div>
                  
                  <button class="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md text-sm transition-colors w-full sm:w-auto">
                      Learn More About Premium
                  </button>
              </div>
          </div>

          <!-- Continuing Education Card -->
          <div class="bg-card border-l-4 border-l-info border border-border rounded-lg shadow-card">
               <div class="p-6">
                  <div class="flex flex-row items-center gap-2 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-foreground" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                      <h3 class="text-lg font-semibold">California Continuing Education</h3>
                  </div>

                  <div class="flex items-start gap-3 p-3 rounded-lg bg-info/10 border border-info/20 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-info shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <p class="text-sm text-foreground">
                          To view or print an education transcript in California, please use the state's <a href="#" class="text-primary hover:underline font-medium">Education Transcript Search</a>.
                      </p>
                  </div>
                  
                  <div class="text-sm text-muted-foreground">
                      Requirements for: <span class="font-medium text-foreground">Sarah Johnson, California</span>
                      <button class="text-primary hover:underline ml-1">(Change)</button>
                  </div>
              </div>
          </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-card p-4 rounded-lg shadow-card border border-border flex items-center gap-4">
              <div class="p-3 rounded-lg bg-muted text-success">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                  <p class="text-2xl font-bold text-foreground">3</p>
                  <p class="text-sm text-muted-foreground">Active Licenses</p>
              </div>
          </div>
          
          <div class="bg-card p-4 rounded-lg shadow-card border border-border flex items-center gap-4">
              <div class="p-3 rounded-lg bg-muted text-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                  <p class="text-2xl font-bold text-foreground">2</p>
                  <p class="text-sm text-muted-foreground">Pending Docs</p>
              </div>
          </div>

          <div class="bg-card p-4 rounded-lg shadow-card border border-border flex items-center gap-4">
              <div class="p-3 rounded-lg bg-muted text-destructive">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                  <p class="text-2xl font-bold text-foreground">1</p>
                  <p class="text-sm text-muted-foreground">Expiring Soon</p>
              </div>
          </div>

          <div class="bg-card p-4 rounded-lg shadow-card border border-border flex items-center gap-4">
              <div class="p-3 rounded-lg bg-muted text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div>
                  <p class="text-2xl font-bold text-foreground">12</p>
                  <p class="text-sm text-muted-foreground">Total Documents</p>
              </div>
          </div>
      </div>

      <!-- Onboarding Progress -->
      <div class="bg-card border-l-4 border-l-primary border border-border rounded-lg shadow-card">
          <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                  <div>
                      <h3 class="font-semibold text-foreground">Complete Your Onboarding</h3>
                      <p class="text-sm text-muted-foreground">2 of 4 steps completed</p>
                  </div>
                  <button (click)="router.navigate(['/app/agent-onboarding'])" class="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md shadow-sm text-sm transition-colors">
                      Continue
                  </button>
              </div>
              <div class="w-full bg-secondary rounded-full h-2">
                  <div class="bg-primary h-2 rounded-full transition-all duration-500" style="width: 50%"></div>
              </div>
          </div>
      </div>

    </div>
  `
})
export class AgentDashboardComponent {
  auth = inject(AuthService);
  router = inject(Router);
  
  overviewSubTab = signal<'todos' | 'activity'>('todos');
  
  firstName = computed(() => {
    return this.auth.currentUser()?.name?.split(' ')[0] || 'Agent';
  });

  showNotification(message: string) {
    alert(message);
  }
}
