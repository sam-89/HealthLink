
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ChatbotComponent } from '../shared/components/chatbot.component';
import { CommandPaletteComponent } from '../shared/components/command-palette.component';
import { NotificationDropdownComponent } from '../shared/components/notification-dropdown.component';
import { BreadcrumbsComponent } from '../shared/components/breadcrumbs.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    CommonModule, 
    ChatbotComponent,
    CommandPaletteComponent,
    NotificationDropdownComponent,
    BreadcrumbsComponent
  ],
  template: `
    <div class="flex h-screen bg-background overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-64 bg-sidebar border-r border-sidebar-border text-sidebar-foreground flex flex-col transition-all duration-300">
        <!-- Logo -->
        <div class="h-16 flex items-center gap-3 px-4 border-b border-sidebar-border">
          <div class="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 shadow-sm">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
             </svg>
          </div>
          <span class="text-xl font-display font-bold text-sidebar-foreground tracking-tight">HealthLink</span>
        </div>

        <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <!-- AGENT MENU -->
          @if (auth.currentUser()?.role === 'AGENT') {
            <a routerLink="/app/agent-dashboard" routerLinkActive="bg-sidebar-accent text-sidebar-primary" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:text-sidebar-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Dashboard</span>
            </a>

            <a routerLink="/app/agent-services" routerLinkActive="bg-sidebar-accent text-sidebar-primary" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:text-sidebar-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Services</span>
            </a>
            
            <a routerLink="/app/agent-onboarding" routerLinkActive="bg-sidebar-accent text-sidebar-primary" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:text-sidebar-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>Onboarding</span>
            </a>

            <a routerLink="/app/agent-documents" routerLinkActive="bg-sidebar-accent text-sidebar-primary" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:text-sidebar-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>My Documents</span>
            </a>

            <a routerLink="/app/agent-profile" routerLinkActive="bg-sidebar-accent text-sidebar-primary" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:text-sidebar-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile</span>
            </a>
          } 
          
          <!-- AGENCY ADMIN MENU -->
          @else if (auth.currentUser()?.role === 'AGENCY_ADMIN') {
             <a routerLink="/app/agency-dashboard" routerLinkActive="bg-sidebar-accent text-sidebar-primary" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors group">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:text-sidebar-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
               </svg>
               <span>Dashboard</span>
             </a>

             <a routerLink="/app/agency-agents" routerLinkActive="bg-sidebar-accent text-sidebar-primary" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors group">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:text-sidebar-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
               </svg>
               <span>Agents</span>
             </a>

             <a routerLink="/app/agency-documents" routerLinkActive="bg-sidebar-accent text-sidebar-primary" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors group">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:text-sidebar-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
               <span>Document Center</span>
             </a>

             <a routerLink="/app/agency-compliance" routerLinkActive="bg-sidebar-accent text-sidebar-primary" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors group">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:text-sidebar-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <span>Compliance</span>
             </a>

             <a routerLink="/app/agency-settings" routerLinkActive="bg-sidebar-accent text-sidebar-primary" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors group">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:text-sidebar-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
               <span>Settings</span>
             </a>

          } 
          
          <!-- OPS ADMIN MENU -->
          @else {
            
            <a routerLink="/app/ops-dashboard" routerLinkActive="bg-sidebar-accent text-sidebar-primary" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:text-sidebar-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Dashboard</span>
            </a>

            <a routerLink="/app/ops-verification" routerLinkActive="bg-sidebar-accent text-sidebar-primary" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:text-sidebar-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Verification Queue</span>
            </a>

            <a routerLink="/app/ops-documents" routerLinkActive="bg-sidebar-accent text-sidebar-primary" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:text-sidebar-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Document Review</span>
            </a>

            <a routerLink="/app/ops-agencies" routerLinkActive="bg-sidebar-accent text-sidebar-primary" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:text-sidebar-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Agencies</span>
            </a>

            <a routerLink="/app/ops-agents" routerLinkActive="bg-sidebar-accent text-sidebar-primary" class="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:text-sidebar-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>All Agents</span>
            </a>
          }
        </nav>

        <div class="p-4 border-t border-sidebar-border">
          <div class="flex items-center gap-3">
            <img [src]="auth.currentUser()?.avatar" class="w-9 h-9 rounded-full bg-sidebar-accent ring-2 ring-sidebar-border">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ auth.currentUser()?.name }}</p>
              <p class="text-xs text-sidebar-foreground/60 truncate capitalize">{{ auth.currentUser()?.role?.toLowerCase()?.replace('_', ' ') }}</p>
            </div>
            <button (click)="auth.logout()" class="text-sidebar-foreground/60 hover:text-sidebar-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto relative">
        <header class="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
          <div class="flex items-center gap-4">
            <button class="lg:hidden text-muted-foreground hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <!-- Command Palette Trigger -->
            <app-command-palette></app-command-palette>
          </div>

          <div class="flex items-center gap-2">
            <!-- Notification Bell -->
            <app-notification-dropdown></app-notification-dropdown>
            
            <div class="w-px h-6 bg-border mx-2"></div>

            <div class="flex items-center gap-2">
               <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {{ auth.currentUser()?.name?.charAt(0) }}{{ auth.currentUser()?.name?.split(' ')?.[1]?.charAt(0) }}
               </div>
               <span class="text-sm font-medium hidden sm:block">{{ auth.currentUser()?.name }}</span>
               <svg class="h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                 <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
               </svg>
            </div>
          </div>
        </header>
        
        <div class="p-4 md:p-6 w-full">
           <app-breadcrumbs></app-breadcrumbs>
           <router-outlet></router-outlet>
        </div>
        
        @if (auth.currentUser()?.role === 'AGENT') {
          <app-chatbot></app-chatbot>
        }
      </main>
    </div>
  `
})
export class MainLayoutComponent {
  auth = inject(AuthService);
}
