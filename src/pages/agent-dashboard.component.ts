
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

interface ServiceCategory {
  title: string;
  icon: string;
  items: ServiceItem[];
}

interface ServiceItem {
  label: string;
  action: () => void;
  external?: boolean;
}

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-100 font-sans text-sm text-gray-700 pb-12">
      
      <!-- Sub Navigation Tabs (Sircon Style) -->
      <div class="bg-white border-b border-gray-300 px-4 md:px-8 py-0 mb-8 sticky top-0 z-10 shadow-sm">
        <nav class="flex space-x-8 overflow-x-auto" aria-label="Tabs">
          @for (tab of tabs(); track tab.id) {
            <button 
              (click)="activeTab.set(tab.id)"
              class="py-4 px-1 border-b-4 font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap"
              [class.border-blue-600]="activeTab() === tab.id"
              [class.text-gray-900]="activeTab() === tab.id"
              [class.border-transparent]="activeTab() !== tab.id"
              [class.text-gray-500]="activeTab() !== tab.id"
              [class.hover:text-gray-700]="activeTab() !== tab.id"
              [class.hover:border-gray-300]="activeTab() !== tab.id"
            >
              {{ tab.label }}
            </button>
          }
        </nav>
      </div>

      <div class="max-w-[1600px] mx-auto px-4 md:px-8">
        
        <!-- OVERVIEW TAB -->
        @if (activeTab() === 'overview') {
            <!-- State Services Bar -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 flex flex-col lg:flex-row items-center justify-between gap-4 animate-fade-in">
                <div class="flex items-center gap-4 lg:gap-6 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
                    <h3 class="font-bold text-gray-900 whitespace-nowrap text-base mr-2">State Services</h3>
                    
                    <button class="flex items-center gap-2 text-blue-600 hover:text-blue-800 whitespace-nowrap font-medium transition-colors" (click)="router.navigate(['/app/agent-onboarding'])">
                         <div class="bg-blue-50 p-1.5 rounded-full">
                           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                         </div>
                        Apply for a License
                    </button>
                    
                    <div class="h-6 w-px bg-gray-200 hidden lg:block"></div>

                    <button class="flex items-center gap-2 text-blue-600 hover:text-blue-800 whitespace-nowrap font-medium transition-colors" (click)="showNotification('Renewal module opening...')">
                        <div class="bg-blue-50 p-1.5 rounded-full">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        </div>
                        Renew a License
                    </button>

                    <div class="h-6 w-px bg-gray-200 hidden lg:block"></div>

                    <button class="flex items-center gap-2 text-blue-600 hover:text-blue-800 whitespace-nowrap font-medium transition-colors" (click)="router.navigate(['/app/agent-documents'])">
                        <div class="bg-blue-50 p-1.5 rounded-full">
                           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                        </div>
                        Print a License
                    </button>
                     <div class="h-6 w-px bg-gray-200 hidden lg:block"></div>

                    <button class="flex items-center gap-2 text-blue-600 hover:text-blue-800 whitespace-nowrap font-medium transition-colors" (click)="router.navigate(['/app/agent-profile'])">
                        <div class="bg-blue-50 p-1.5 rounded-full">
                           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .883-.393 1.622-1.015 2.128a4.965 4.965 0 01-1.485 1.485C7.393 8.622 8.395 8.16 9.397 8.16c.996 0 2.01.462 2.897 1.453.882-.99 1.896-1.453 2.897-1.453.997 0 1.999.462 2.897 1.453C17.393 8.622 17.015 7.883 17.015 7s-.393-1.622-1.015-2.128"></path></svg>
                        </div>
                        Change Contact Info
                    </button>
                </div>
                
                <button (click)="activeTab.set('services')" class="px-5 py-2 bg-[#007AC3] hover:bg-[#00629E] text-white font-bold rounded shadow text-xs uppercase tracking-wide transition-all transform active:scale-95">
                    View All Services
                </button>
            </div>

            <!-- To Dos / Activity Section -->
            <div class="bg-gray-200/50 rounded-t-xl border border-gray-200 mb-6 shadow-sm overflow-hidden">
                <!-- Tab Headers -->
                <div class="flex bg-white border-b border-gray-200">
                     <button 
                        (click)="overviewSubTab.set('todos')"
                        class="px-8 py-4 font-bold text-gray-700 border-b-2 transition-colors relative"
                        [class.border-gray-900]="overviewSubTab() === 'todos'"
                        [class.text-gray-900]="overviewSubTab() === 'todos'"
                        [class.border-transparent]="overviewSubTab() !== 'todos'"
                        [class.bg-gray-50]="overviewSubTab() !== 'todos'"
                     >
                        To Dos
                        @if (todosCount() > 0) {
                            <span class="absolute top-3 right-3 flex h-2 w-2">
                              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                        }
                     </button>
                     <button 
                        (click)="overviewSubTab.set('activity')"
                        class="px-8 py-4 font-bold text-gray-500 hover:text-gray-700 border-b-2 border-transparent transition-colors"
                        [class.border-gray-900]="overviewSubTab() === 'activity'"
                        [class.text-gray-900]="overviewSubTab() === 'activity'"
                        [class.bg-gray-50]="overviewSubTab() !== 'activity'"
                     >
                        Recent Activity
                     </button>
                </div>
                
                <!-- Tab Content -->
                <div class="p-8 min-h-[150px] bg-white rounded-b-xl border-x border-b border-gray-200">
                    @if (overviewSubTab() === 'todos') {
                        @if (todosCount() === 0) {
                             <div class="flex flex-col items-center justify-center text-gray-500 py-4 animate-fade-in">
                                <div class="w-12 h-12 mb-3 text-yellow-400">
                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                </div>
                                <p class="italic text-base">You currently have no tasks</p>
                             </div>
                        } @else {
                            <div class="space-y-3 animate-fade-in">
                                <div class="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded text-red-700">
                                    <span class="font-medium flex items-center gap-2">
                                       <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                       License Renewal Due: California (7 Days)
                                    </span>
                                    <button class="text-sm bg-white border border-red-200 px-4 py-1.5 rounded shadow-sm hover:bg-red-50 font-medium">Renew Now</button>
                                </div>
                            </div>
                        }
                    } @else {
                        <div class="space-y-6 animate-fade-in">
                            <div class="flex items-start gap-4">
                                <div class="mt-1 w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-200"></div>
                                <div>
                                    <p class="font-bold text-gray-900 text-base">License Approved</p>
                                    <p class="text-gray-500">Your Florida Non-Resident license was approved on 10/24/2024.</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-4">
                                <div class="mt-1 w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-200"></div>
                                <div>
                                    <p class="font-bold text-gray-900 text-base">Profile Updated</p>
                                    <p class="text-gray-500">You updated your mailing address on 10/20/2024.</p>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>

            <!-- Bottom Sections Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Licenses -->
                <div class="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col">
                    <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/30">
                        <h3 class="font-bold text-gray-900 text-lg">Licenses</h3>
                        <button class="text-blue-600 text-sm font-bold hover:underline flex items-center gap-1" (click)="router.navigate(['/app/agent-onboarding'])">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            Apply for a License
                        </button>
                    </div>
                    <div class="p-6 flex-1 flex flex-col">
                        <!-- If licenses exist (Mocked as existing for better UX than empty state) -->
                        <div class="space-y-4 flex-1">
                             <div class="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                <div class="flex items-center gap-4">
                                    <div class="bg-green-100 p-2.5 rounded text-green-700 font-bold w-12 text-center">CA</div>
                                    <div>
                                        <p class="font-bold text-gray-900">California</p>
                                        <p class="text-xs text-gray-500 font-medium">Resident • #0D12345</p>
                                    </div>
                                </div>
                                <span class="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">Active</span>
                             </div>

                             <div class="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                <div class="flex items-center gap-4">
                                    <div class="bg-blue-100 p-2.5 rounded text-blue-700 font-bold w-12 text-center">TX</div>
                                    <div>
                                        <p class="font-bold text-gray-900">Texas</p>
                                        <p class="text-xs text-gray-500 font-medium">Non-Resident • #2456789</p>
                                    </div>
                                </div>
                                <span class="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">Active</span>
                             </div>
                        </div>
                        
                        <div class="mt-6 p-5 bg-gray-50 rounded border border-gray-100">
                             <h4 class="font-bold text-gray-800 text-base mb-2 flex items-center gap-2">
                                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Looking for your licenses?
                             </h4>
                             <p class="text-sm text-gray-600 mb-4 leading-relaxed">Sign up for a premium subscription to automatically keep your licenses up to date with any changes from the state.</p>
                             <button class="w-full py-2.5 bg-[#E95E27] hover:bg-[#D14915] text-white font-bold text-sm rounded shadow-sm transition-colors">Learn More About Premium</button>
                        </div>
                    </div>
                </div>

                <!-- Education -->
                <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
                     <div class="p-4 border-b border-gray-200 bg-gray-50/30">
                        <h3 class="font-bold text-gray-900 text-lg">Continuing Education</h3>
                    </div>
                    <div class="p-6">
                        <div class="flex items-start gap-3 bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
                            <div class="text-blue-500 pt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="text-sm text-blue-900">
                                To view or print an education transcript in California, please use the state's <a href="#" class="font-bold underline hover:text-blue-700">Education Transcript Search</a>.
                            </div>
                        </div>
                        
                        <p class="text-xs text-gray-500 italic mb-4 font-medium">Requirements for: Johnson, California (Resident)</p>

                         <div class="space-y-6">
                            <div>
                                <div class="flex justify-between items-center text-sm mb-2">
                                    <span class="text-gray-700 font-medium">Ethics (3 hours required)</span>
                                    <span class="font-bold text-green-600">3/3 Completed</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2.5">
                                    <div class="bg-green-500 h-2.5 rounded-full" style="width: 100%"></div>
                                </div>
                            </div>

                            <div>
                                 <div class="flex justify-between items-center text-sm mb-2">
                                    <span class="text-gray-700 font-medium">General (21 hours required)</span>
                                    <span class="font-bold text-orange-500">12/21 Completed</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2.5">
                                    <div class="bg-orange-500 h-2.5 rounded-full" style="width: 57%"></div>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        } 
        
        <!-- SERVICES TAB -->
        @else if (activeTab() === 'services') {
            <div class="animate-fade-in pb-12">
                <div class="flex items-center gap-3 mb-8">
                  <div class="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-2xl font-bold text-gray-900">All Services</h2>
                    <p class="text-gray-500 text-sm">Access all available tools and resources</p>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                   @for (category of serviceCategories(); track category.title) {
                     <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
                        <div class="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                           <div class="flex items-center gap-3">
                              <div class="p-2 bg-white border border-gray-200 text-blue-600 rounded-lg shadow-sm">
                                 @if(category.icon === 'license') { <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg> }
                                 @if(category.icon === 'user') { <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> }
                                 @if(category.icon === 'edu') { <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg> }
                                 @if(category.icon === 'search') { <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> }
                              </div>
                              <h4 class="font-bold text-gray-900 uppercase tracking-wide text-sm">{{ category.title }}</h4>
                           </div>
                        </div>
                        <ul class="divide-y divide-gray-100">
                           @for (item of category.items; track item.label) {
                              <li>
                                <button (click)="item.action()" class="w-full text-left px-6 py-4 flex items-center justify-between group hover:bg-blue-50 transition-colors">
                                   <span class="text-sm font-medium text-gray-700 group-hover:text-blue-700">{{ item.label }}</span>
                                   <div class="flex items-center gap-2">
                                     @if (item.external) {
                                       <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-300 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                     }
                                     <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                                   </div>
                                </button>
                              </li>
                           }
                        </ul>
                     </div>
                   }
                </div>
            </div>
        } 
        
        <!-- PLACEHOLDERS FOR OTHER TABS -->
        @else {
             <div class="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-gray-200 shadow-sm animate-fade-in">
                 <div class="p-6 bg-gray-50 rounded-full mb-6 border border-gray-100">
                     <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                 </div>
                 <h3 class="text-xl font-bold text-gray-900">Coming Soon</h3>
                 <p class="text-gray-500 mt-2">The {{ activeTab().replace('-', ' ') }} section is under development.</p>
             </div>
        }
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class AgentDashboardComponent {
  router = inject(Router);
  
  activeTab = signal<'overview' | 'services' | 'personal-summary' | 'activities'>('overview');
  overviewSubTab = signal<'todos' | 'activity'>('todos');
  
  todosCount = signal(0); // 0 to show empty state as per requirement

  tabs = signal([
    { id: 'overview', label: 'Overview' },
    { id: 'personal-summary', label: 'Personal Summary' },
    { id: 'services', label: 'Services' },
    { id: 'activities', label: 'Activities' }
  ]);

  serviceCategories = signal<ServiceCategory[]>([
    {
      title: 'Licensing',
      icon: 'license',
      items: [
        { label: 'Apply for a License or Line of Authority', action: () => this.router.navigate(['/app/agent-onboarding']) },
        { label: 'Renew or Reinstate a License', action: () => this.showNotification('Renewals for CA active next month') },
        { label: 'Print a License', action: () => this.router.navigate(['/app/agent-documents']) },
        { label: 'Request a Letter of Certification', action: () => this.showNotification('Certification request submitted') }
      ]
    },
    {
      title: 'Update Contact Information',
      icon: 'user',
      items: [
        { label: 'Change My Name with the State', action: () => this.router.navigate(['/app/agent-profile']) },
        { label: 'Change My Contact Information', action: () => this.router.navigate(['/app/agent-profile']) },
        { label: 'Change My Email Address', action: () => this.router.navigate(['/app/agent-profile']) },
        { label: 'Change Non-Insurance Address', action: () => this.router.navigate(['/app/agent-profile']) }
      ]
    },
    {
      title: 'Education',
      icon: 'edu',
      items: [
        { label: 'My Continuing Education (CE) Transcript', action: () => this.showNotification('Fetching latest transcripts...') },
        { label: 'My Pre-Licensing Education (PE) Transcript', action: () => this.showNotification('No PE Transcripts found') },
        { label: 'Search Approved Courses', action: () => this.showNotification('Redirecting to Course Catalog...'), external: true },
        { label: 'Search Approved Education Providers', action: () => this.showNotification('Provider search opened'), external: true }
      ]
    },
    {
      title: 'Look Up Other Information',
      icon: 'search',
      items: [
        { label: 'Look up my License Number', action: () => this.router.navigate(['/app/agent-profile']) },
        { label: 'Look up my NPN Number', action: () => this.router.navigate(['/app/agent-profile']) },
        { label: 'Check My Status with a State', action: () => this.showNotification('Status: Active in CA, TX, FL') }
      ]
    }
  ]);

  showNotification(message: string) {
    alert(message);
  }
}
