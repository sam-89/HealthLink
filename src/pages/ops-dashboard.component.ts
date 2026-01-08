
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ops-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div>
        <h1 class="text-2xl font-display font-bold text-foreground">Operations Dashboard</h1>
        <p class="text-muted-foreground">Verification and compliance management</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Pending Reviews -->
        <div class="bg-card p-6 rounded-xl border border-border shadow-card flex items-center gap-4 hover:shadow-lg transition-shadow duration-200">
          <div class="p-3 bg-warning/10 text-warning rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <div>
            <div class="text-3xl font-bold text-foreground">24</div>
            <div class="text-sm text-muted-foreground font-medium">Pending Reviews</div>
          </div>
        </div>
        
        <!-- Verified Today -->
        <div class="bg-card p-6 rounded-xl border border-border shadow-card flex items-center gap-4 hover:shadow-lg transition-shadow duration-200">
          <div class="p-3 bg-success/10 text-success rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <div>
            <div class="text-3xl font-bold text-foreground">18</div>
            <div class="text-sm text-muted-foreground font-medium">Verified Today</div>
          </div>
        </div>

        <!-- Active Agencies -->
        <div class="bg-card p-6 rounded-xl border border-border shadow-card flex items-center gap-4 hover:shadow-lg transition-shadow duration-200">
          <div class="p-3 bg-primary/10 text-primary rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
             </svg>
          </div>
          <div>
            <div class="text-3xl font-bold text-foreground">156</div>
            <div class="text-sm text-muted-foreground font-medium">Active Agencies</div>
          </div>
        </div>

        <!-- Total Agents -->
        <div class="bg-card p-6 rounded-xl border border-border shadow-card flex items-center gap-4 hover:shadow-lg transition-shadow duration-200">
          <div class="p-3 bg-info/10 text-info rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
             </svg>
          </div>
          <div>
            <div class="text-3xl font-bold text-foreground">2,847</div>
            <div class="text-sm text-muted-foreground font-medium">Total Agents</div>
          </div>
        </div>
      </div>

      <!-- Verification Queue -->
      <div class="bg-card border border-border rounded-xl shadow-card overflow-hidden">
        <div class="p-6 border-b border-border flex justify-between items-center bg-muted/30">
          <h2 class="text-lg font-bold text-foreground">Verification Queue</h2>
          <button class="text-sm text-muted-foreground hover:text-foreground border border-input rounded-md px-3 py-1 bg-background hover:bg-muted transition-colors font-medium shadow-sm">View All</button>
        </div>
        <div class="divide-y divide-border">
          <div class="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
            <div>
              <p class="font-medium text-foreground">Sarah Johnson</p>
              <p class="text-sm text-muted-foreground">Driver's License • MetroHealth</p>
            </div>
            <div class="flex items-center gap-4">
               <span class="text-xs text-muted-foreground font-medium">5 min ago</span>
               <button class="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm">Review</button>
            </div>
          </div>

          <div class="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
            <div>
              <p class="font-medium text-foreground">James Wilson</p>
              <p class="text-sm text-muted-foreground">E&O Certificate • PremierCare</p>
            </div>
             <div class="flex items-center gap-4">
               <span class="text-xs text-muted-foreground font-medium">12 min ago</span>
               <button class="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm">Review</button>
            </div>
          </div>

          <div class="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
            <div>
              <p class="font-medium text-foreground">Lisa Chen</p>
              <p class="text-sm text-muted-foreground">State License - CA • HealthFirst</p>
            </div>
             <div class="flex items-center gap-4">
               <span class="text-xs text-muted-foreground font-medium">18 min ago</span>
               <button class="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm">Review</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OpsDashboardComponent {}
