
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface VerificationItem {
  id: string;
  title: string;
  type: 'license' | 'document' | 'background' | 'onboarding';
  priority: 'High' | 'Medium' | 'Low';
  submittedBy: string;
  agency: string;
  submittedDate: string;
  status: 'pending' | 'in-review';
}

@Component({
  selector: 'app-ops-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Verification Queue</h1>
        <p class="text-gray-500 mt-1">Review and process pending verifications</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Pending -->
        <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div class="p-3 bg-amber-50 text-amber-600 rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900">4</div>
            <div class="text-sm text-gray-500">Pending</div>
          </div>
        </div>

        <!-- In Review -->
        <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div class="p-3 bg-blue-50 text-blue-600 rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
             </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900">2</div>
            <div class="text-sm text-gray-500">In Review</div>
          </div>
        </div>

        <!-- High Priority -->
        <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div class="p-3 bg-red-50 text-red-600 rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900">2</div>
            <div class="text-sm text-gray-500">High Priority</div>
          </div>
        </div>

        <!-- Approved Today -->
        <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div class="p-3 bg-green-50 text-green-600 rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900">0</div>
            <div class="text-sm text-gray-500">Approved Today</div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        
        <!-- Filters -->
        <div class="flex flex-col md:flex-row gap-4 mb-6">
          <div class="relative flex-1">
             <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                 <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
               </svg>
             </div>
             <input 
               type="text" 
               [(ngModel)]="searchQuery" 
               placeholder="Search by agent, agency, or description..." 
               class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
             >
          </div>
          
          <select [(ngModel)]="filterType" class="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700">
            <option value="All">All Types</option>
            <option value="license">Licenses</option>
            <option value="document">Documents</option>
            <option value="background">Background Checks</option>
            <option value="onboarding">Onboarding</option>
          </select>

          <select [(ngModel)]="filterStatus" class="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700">
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-review">In Review</option>
          </select>
        </div>

        <!-- List -->
        <div class="space-y-4">
          @for (item of filteredItems(); track item.id) {
            <div class="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center gap-4 hover:border-blue-300 transition-colors">
              
              <!-- Icon -->
              <div class="p-3 rounded-lg bg-gray-50 text-gray-500 shrink-0">
                 @if (item.type === 'license') {
                   <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                 } @else if (item.type === 'document') {
                   <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
                 } @else if (item.type === 'background') {
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                 } @else {
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                 }
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="text-base font-medium text-gray-900 truncate">{{ item.title }}</h3>
                  <span 
                    class="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                    [class.bg-red-100]="item.priority === 'High'"
                    [class.text-red-700]="item.priority === 'High'"
                    [class.bg-orange-100]="item.priority === 'Medium'"
                    [class.text-orange-700]="item.priority === 'Medium'"
                    [class.bg-gray-100]="item.priority === 'Low'"
                    [class.text-gray-700]="item.priority === 'Low'"
                  >
                    {{ item.priority }}
                  </span>
                </div>
                <p class="text-sm text-gray-500">
                  <span class="font-medium text-gray-700">{{ item.submittedBy }}</span> • {{ item.agency }} • Submitted {{ item.submittedDate }}
                </p>
              </div>

              <!-- Status & Action -->
              <div class="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  [class.bg-amber-100]="item.status === 'pending'"
                  [class.text-amber-800]="item.status === 'pending'"
                  [class.bg-blue-100]="item.status === 'in-review'"
                  [class.text-blue-800]="item.status === 'in-review'"
                >
                  {{ item.status === 'pending' ? 'pending' : 'in review' }}
                </span>

                @if (item.status === 'pending') {
                  <button class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1">
                    Review
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  </button>
                } @else {
                   <button class="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                    Continue
                  </button>
                }
              </div>

            </div>
          }
        </div>
      </div>
    </div>
  `,
   styles: [`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  `]
})
export class OpsVerificationComponent {
  searchQuery = signal('');
  filterType = signal('All');
  filterStatus = signal('All');

  items = signal<VerificationItem[]>([
    {
      id: '1',
      title: 'California Health License renewal',
      type: 'license',
      priority: 'High',
      submittedBy: 'John Smith',
      agency: 'MetroHealth Agency',
      submittedDate: '2024-12-20',
      status: 'pending'
    },
    {
      id: '2',
      title: 'E&O Certificate upload',
      type: 'document',
      priority: 'Medium',
      submittedBy: 'Emily Davis',
      agency: 'MetroHealth Agency',
      submittedDate: '2024-12-19',
      status: 'in-review'
    },
    {
      id: '3',
      title: 'Annual background check',
      type: 'background',
      priority: 'High',
      submittedBy: 'Michael Brown',
      agency: 'HealthFirst Insurance',
      submittedDate: '2024-12-18',
      status: 'pending'
    },
    {
      id: '4',
      title: 'New agent onboarding completion',
      type: 'onboarding',
      priority: 'Low',
      submittedBy: 'Sarah Wilson',
      agency: 'Pacific Health Group',
      submittedDate: '2024-12-17',
      status: 'pending'
    },
    {
      id: '5',
      title: 'Texas Life & Health License',
      type: 'license',
      priority: 'Medium',
      submittedBy: 'James Taylor',
      agency: 'HealthFirst Insurance',
      submittedDate: '2024-12-16',
      status: 'pending'
    },
    {
      id: '6',
      title: "Driver's License verification",
      type: 'document',
      priority: 'Low',
      submittedBy: 'Lisa Anderson',
      agency: 'Pacific Health Group',
      submittedDate: '2024-12-15',
      status: 'in-review'
    }
  ]);

  filteredItems = computed(() => {
    return this.items().filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
                            item.submittedBy.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
                            item.agency.toLowerCase().includes(this.searchQuery().toLowerCase());
      const matchesType = this.filterType() === 'All' || item.type === this.filterType();
      const matchesStatus = this.filterStatus() === 'All' || item.status === this.filterStatus();
      
      return matchesSearch && matchesType && matchesStatus;
    });
  });
}

@Component({
  selector: 'app-ops-agencies',
  standalone: true,
  imports: [CommonModule],
  template: `
     <div class="max-w-7xl mx-auto space-y-6 animate-fade-in">
       <div class="flex justify-between items-center">
        <div>
           <h1 class="text-2xl font-bold text-gray-900">Agencies</h1>
           <p class="text-gray-500 mt-1">Manage partner agencies</p>
        </div>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">Add Agency</button>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-12 text-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900">Agency Directory</h3>
        <p class="mt-2">This module would display the directory of all 156 active agencies.</p>
      </div>
    </div>
  `,
   styles: [`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  `]
})
export class OpsAgenciesComponent {}

@Component({
  selector: 'app-ops-agents',
  standalone: true,
  imports: [CommonModule],
  template: `
     <div class="max-w-7xl mx-auto space-y-6 animate-fade-in">
       <div class="flex justify-between items-center">
        <div>
           <h1 class="text-2xl font-bold text-gray-900">All Agents</h1>
           <p class="text-gray-500 mt-1">Master database of all licensed agents</p>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-12 text-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900">Agent Master List</h3>
        <p class="mt-2">This module would list all 2,847 agents with advanced search capabilities.</p>
      </div>
    </div>
  `,
   styles: [`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  `]
})
export class OpsAgentsComponent {}
