
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeComponent } from '../shared/components/status-badge.component';

@Component({
  selector: 'app-agency-dashboard',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-display font-bold text-foreground">Agency Dashboard</h1>
        <p class="text-muted-foreground">MetroHealth Agency compliance overview</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Agents -->
        <div class="bg-card p-6 rounded-xl border border-border flex items-center gap-4 shadow-card hover:shadow-lg transition-shadow duration-200">
          <div class="p-3 bg-primary/10 text-primary rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <div class="text-3xl font-bold text-foreground">47</div>
            <div class="text-sm text-muted-foreground font-medium">Total Agents</div>
          </div>
        </div>

        <!-- Fully Compliant -->
        <div class="bg-card p-6 rounded-xl border border-border flex items-center gap-4 shadow-card hover:shadow-lg transition-shadow duration-200">
          <div class="p-3 bg-success/10 text-success rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="text-3xl font-bold text-foreground">38</div>
            <div class="text-sm text-muted-foreground font-medium">Fully Compliant</div>
          </div>
        </div>

        <!-- Action Required -->
        <div class="bg-card p-6 rounded-xl border border-border flex items-center gap-4 shadow-card hover:shadow-lg transition-shadow duration-200">
          <div class="p-3 bg-warning/10 text-warning rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <div class="text-3xl font-bold text-foreground">6</div>
            <div class="text-sm text-muted-foreground font-medium">Action Required</div>
          </div>
        </div>

        <!-- Documents -->
        <div class="bg-card p-6 rounded-xl border border-border flex items-center gap-4 shadow-card hover:shadow-lg transition-shadow duration-200">
          <div class="p-3 bg-info/10 text-info rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <div class="text-3xl font-bold text-foreground">234</div>
            <div class="text-sm text-muted-foreground font-medium">Documents</div>
          </div>
        </div>
      </div>

      <!-- Attention List -->
      <div class="bg-card border border-border rounded-xl shadow-card overflow-hidden">
        <div class="p-6 border-b border-border bg-muted/30">
          <h2 class="text-lg font-bold text-foreground">Agents Requiring Attention</h2>
        </div>
        <div class="divide-y divide-border">
          <!-- Item 1 -->
          <div class="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
            <div>
              <p class="font-medium text-foreground">John Smith</p>
              <p class="text-sm text-muted-foreground">License expiring in 5 days</p>
            </div>
            <app-status-badge variant="action-required">Action Required</app-status-badge>
          </div>
          <!-- Item 2 -->
          <div class="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
            <div>
              <p class="font-medium text-foreground">Emily Davis</p>
              <p class="text-sm text-muted-foreground">Missing E&O certificate</p>
            </div>
            <app-status-badge variant="pending">Pending</app-status-badge>
          </div>
          <!-- Item 3 -->
          <div class="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
            <div>
              <p class="font-medium text-foreground">Michael Brown</p>
              <p class="text-sm text-muted-foreground">Background check pending</p>
            </div>
             <app-status-badge variant="pending">Pending</app-status-badge>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AgencyDashboardComponent {}
