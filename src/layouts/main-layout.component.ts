
import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ChatbotComponent } from '../shared/components/chatbot.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ChatbotComponent],
  template: `
    <div class="flex h-screen bg-gray-50 overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-64 bg-slate-900 text-white flex flex-col shadow-lg">
        <div class="p-6 border-b border-slate-800 flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-lg">H</div>
          <span class="text-xl font-bold tracking-tight">HealthLink</span>
        </div>

        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          
          <!-- AGENT MENU -->
          @if (auth.currentUser()?.role === 'AGENT') {
            <a routerLink="/app/agent-dashboard" routerLinkActive="bg-blue-600 text-white" class="flex items-center gap-3 px-4 py-3 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Dashboard</span>
            </a>
            
            <a routerLink="/app/agent-onboarding" routerLinkActive="bg-blue-600 text-white" class="flex items-center gap-3 px-4 py-3 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>Onboarding</span>
            </a>

            <a routerLink="/app/agent-documents" routerLinkActive="bg-blue-600 text-white" class="flex items-center gap-3 px-4 py-3 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>My Documents</span>
            </a>

            <a routerLink="/app/agent-profile" routerLinkActive="bg-blue-600 text-white" class="flex items-center gap-3 px-4 py-3 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Profile</span>
            </a>
          } 
          
          <!-- AGENCY ADMIN MENU -->
          @else if (auth.currentUser()?.role === 'AGENCY_ADMIN') {
             <a routerLink="/app/agency-dashboard" routerLinkActive="bg-blue-600 text-white" class="flex items-center gap-3 px-4 py-3 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
               </svg>
               <span>Dashboard</span>
             </a>

             <a routerLink="/app/agency-agents" routerLinkActive="bg-blue-600 text-white" class="flex items-center gap-3 px-4 py-3 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
               </svg>
               <span>Agents</span>
             </a>

             <a routerLink="/app/agency-documents" routerLinkActive="bg-blue-600 text-white" class="flex items-center gap-3 px-4 py-3 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
               <span>Document Center</span>
             </a>

             <a routerLink="/app/agency-compliance" routerLinkActive="bg-blue-600 text-white" class="flex items-center gap-3 px-4 py-3 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <span>Compliance</span>
             </a>

             <a routerLink="/app/agency-settings" routerLinkActive="bg-blue-600 text-white" class="flex items-center gap-3 px-4 py-3 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
               <span>Settings</span>
             </a>

          } 
          
          <!-- OPS ADMIN MENU -->
          @else {
            
            <a routerLink="/app/ops-dashboard" routerLinkActive="bg-blue-600 text-white" class="flex items-center gap-3 px-4 py-3 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>Dashboard</span>
            </a>

            <a routerLink="/app/ops-verification" routerLinkActive="bg-blue-600 text-white" class="flex items-center gap-3 px-4 py-3 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Verification Queue</span>
            </a>

            <a routerLink="/app/ops-documents" routerLinkActive="bg-blue-600 text-white" class="flex items-center gap-3 px-4 py-3 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Document Review</span>
            </a>

            <a routerLink="/app/ops-agencies" routerLinkActive="bg-blue-600 text-white" class="flex items-center gap-3 px-4 py-3 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Agencies</span>
            </a>

            <a routerLink="/app/ops-agents" routerLinkActive="bg-blue-600 text-white" class="flex items-center gap-3 px-4 py-3 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>All Agents</span>
            </a>
          }
        </nav>

        <div class="p-4 border-t border-slate-800">
          <div class="flex items-center gap-3">
            <img [src]="auth.currentUser()?.avatar" class="w-10 h-10 rounded-full border border-slate-600">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">{{ auth.currentUser()?.name }}</p>
              <p class="text-xs text-slate-400 truncate">{{ auth.currentUser()?.role }}</p>
            </div>
            <button (click)="auth.logout()" class="text-slate-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto relative">
        <header class="bg-white border-b border-gray-200 px-8 py-3 sticky top-0 z-10">
          <div class="flex items-center justify-between">
            <!-- Breadcrumbs or Mobile Menu Toggle could go here -->
            <div class="flex items-center gap-4">
              <button class="lg:hidden text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <!-- Search Bar -->
              <div class="relative hidden md:block w-96">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input type="text" class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out" placeholder="Search...">
              </div>
            </div>

            <div class="flex items-center gap-4">
              <!-- Notification Bell -->
              <button class="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative">
                <span class="sr-only">View notifications</span>
                <div class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              
              <!-- User Dropdown (Simplified) -->
              <div class="flex items-center gap-3 ml-2">
                 <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                    {{ auth.currentUser()?.name?.charAt(0) }}{{ auth.currentUser()?.name?.split(' ')?.[1]?.charAt(0) }}
                 </div>
                 <div class="hidden md:block">
                   <p class="text-sm font-medium text-gray-700 leading-none">{{ auth.currentUser()?.name }}</p>
                   <p class="text-xs text-gray-500 mt-1 leading-none">{{ auth.currentUser()?.role === 'AGENT' ? 'Agent' : (auth.currentUser()?.role === 'AGENCY_ADMIN' ? 'Agency' : 'Ops') }}</p>
                 </div>
                 <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                   <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                 </svg>
              </div>
            </div>
          </div>
        </header>
        
        <div class="p-8">
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
        