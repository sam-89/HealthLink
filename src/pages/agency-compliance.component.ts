
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  icon: 'check' | 'warning' | 'clock' | 'error';
  status: 'good' | 'warning' | 'pending' | 'error';
  meta?: string;
  expanded: boolean;
}

interface AgentCompliance {
  id: string;
  name: string;
  score: number;
  badges: { label: string; status: 'good' | 'warning' | 'error' }[];
}

@Component({
  selector: 'app-agency-compliance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 animate-fade-in max-w-7xl mx-auto">
      
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Compliance Dashboard</h1>
        <p class="text-gray-500 mt-1">Monitor and manage agency-wide compliance</p>
      </div>

      <!-- Top Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Score Card -->
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
           <div class="flex justify-between items-start">
             <div>
               <p class="text-sm font-medium text-gray-500">Compliance Score</p>
               <div class="text-3xl font-bold text-blue-600 mt-1">81%</div>
             </div>
             <div class="p-2 bg-blue-50 text-blue-600 rounded-lg">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
               </svg>
             </div>
           </div>
           <div class="w-full bg-gray-100 rounded-full h-1.5 mt-4">
              <div class="bg-blue-600 h-1.5 rounded-full" style="width: 81%"></div>
           </div>
        </div>

        <!-- Compliant Count -->
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
           <div class="w-12 h-12 rounded-full border border-green-100 bg-green-50 text-green-600 flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
             </svg>
           </div>
           <div>
             <div class="text-2xl font-bold text-gray-900">2</div>
             <div class="text-sm text-gray-500">Compliant</div>
           </div>
        </div>

        <!-- Pending Count -->
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
           <div class="w-12 h-12 rounded-full border border-amber-100 bg-amber-50 text-amber-600 flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
           </div>
           <div>
             <div class="text-2xl font-bold text-gray-900">3</div>
             <div class="text-sm text-gray-500">Pending</div>
           </div>
        </div>

        <!-- Non-Compliant Count -->
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
           <div class="w-12 h-12 rounded-full border border-red-100 bg-red-50 text-red-600 flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
             </svg>
           </div>
           <div>
             <div class="text-2xl font-bold text-gray-900">1</div>
             <div class="text-sm text-gray-500">Non-Compliant</div>
           </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Left Column: Requirements -->
        <div class="space-y-6">
           <div class="flex items-center gap-2 text-blue-600 mb-2">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
             </svg>
             <h2 class="text-lg font-bold text-gray-900">Compliance Requirements</h2>
           </div>

           <div class="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100 overflow-hidden">
             @for (req of requirements(); track req.id) {
               <div class="p-4 hover:bg-gray-50 transition-colors cursor-pointer group" (click)="toggleReq(req.id)">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <!-- Icon Status -->
                      <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border"
                        [class.bg-green-50]="req.status === 'good'"
                        [class.border-green-100]="req.status === 'good'"
                        [class.text-green-600]="req.status === 'good'"
                        [class.bg-amber-50]="req.status === 'warning'"
                        [class.border-amber-100]="req.status === 'warning'"
                        [class.text-amber-600]="req.status === 'warning'"
                        [class.bg-red-50]="req.status === 'error'"
                        [class.border-red-100]="req.status === 'error'"
                        [class.text-red-600]="req.status === 'error'"
                        [class.bg-yellow-50]="req.status === 'pending'"
                        [class.border-yellow-100]="req.status === 'pending'"
                        [class.text-yellow-600]="req.status === 'pending'"
                      >
                         @if (req.icon === 'check') {
                           <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                         } @else if (req.icon === 'warning') {
                           <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                         } @else if (req.icon === 'clock') {
                           <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                         } @else if (req.icon === 'error') {
                           <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                         }
                      </div>
                      
                      <div>
                        <h3 class="text-sm font-semibold text-gray-900">{{ req.title }}</h3>
                        <p class="text-xs text-gray-500">{{ req.description }}</p>
                      </div>
                    </div>

                    <div class="flex items-center gap-3">
                      @if (req.meta) {
                        <span class="text-xs font-medium text-gray-500">{{ req.meta }}</span>
                      }
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 transform transition-transform" [class.rotate-180]="req.expanded" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  <!-- Expandable Content (Placeholder) -->
                  @if (req.expanded) {
                    <div class="mt-4 pl-12 pr-4 pb-2 text-sm text-gray-600 animate-fade-in border-t border-gray-50 pt-3">
                       <p>Detailed breakdown for {{ req.title }} would appear here.</p>
                       <button class="mt-2 text-blue-600 hover:text-blue-800 text-xs font-semibold uppercase tracking-wide">View Details</button>
                    </div>
                  }
               </div>
             }
           </div>
        </div>

        <!-- Right Column: Agent Overview -->
        <div class="space-y-6">
           <div class="flex items-center gap-2 text-blue-600 mb-2">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
             </svg>
             <h2 class="text-lg font-bold text-gray-900">Agent Compliance Overview</h2>
           </div>

           <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
             @for (agent of agents(); track agent.id) {
               <div class="space-y-2">
                 <div class="flex justify-between items-end">
                   <span class="text-sm font-medium text-gray-900">{{ agent.name }}</span>
                   <span 
                     class="text-xs font-bold"
                     [class.text-green-600]="agent.score >= 90"
                     [class.text-green-500]="agent.score >= 70 && agent.score < 90"
                     [class.text-orange-500]="agent.score >= 50 && agent.score < 70"
                     [class.text-red-500]="agent.score < 50"
                   >
                     {{ agent.score }}%
                   </span>
                 </div>
                 
                 <!-- Progress Bar -->
                 <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                   <div 
                     class="h-2 rounded-full transition-all duration-500"
                     [style.width.%]="agent.score"
                     [class.bg-green-500]="agent.score >= 90"
                     [class.bg-green-400]="agent.score >= 70 && agent.score < 90"
                     [class.bg-orange-400]="agent.score >= 50 && agent.score < 70"
                     [class.bg-red-500]="agent.score < 50"
                   ></div>
                 </div>

                 <!-- Badges -->
                 <div class="flex gap-2 pt-1">
                   @for (badge of agent.badges; track badge.label) {
                     <span 
                       class="px-2 py-0.5 rounded text-[10px] font-medium border"
                       [class.bg-green-50]="badge.status === 'good'"
                       [class.text-green-700]="badge.status === 'good'"
                       [class.border-green-100]="badge.status === 'good'"
                       [class.bg-red-50]="badge.status === 'error'"
                       [class.text-red-700]="badge.status === 'error'"
                       [class.border-red-100]="badge.status === 'error'"
                       [class.bg-orange-50]="badge.status === 'warning'"
                       [class.text-orange-700]="badge.status === 'warning'"
                       [class.border-orange-100]="badge.status === 'warning'"
                     >
                       {{ badge.label }}
                     </span>
                   }
                 </div>
               </div>
             }
           </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  `]
})
export class AgencyComplianceComponent {
  requirements = signal<ComplianceRequirement[]>([
    { 
      id: '1', 
      title: 'Licensing', 
      description: 'All agents must have valid state licenses', 
      icon: 'check', 
      status: 'good', 
      expanded: true 
    },
    { 
      id: '2', 
      title: 'E&O Insurance', 
      description: 'E&O coverage minimum $1M per occurrence', 
      icon: 'warning', 
      status: 'warning', 
      meta: '3 agents', 
      expanded: false 
    },
    { 
      id: '3', 
      title: 'Background Checks', 
      description: 'Annual background verification required', 
      icon: 'clock', 
      status: 'pending', 
      meta: '5 agents', 
      expanded: false 
    },
    { 
      id: '4', 
      title: 'Training', 
      description: 'Annual compliance training completion', 
      icon: 'error', 
      status: 'error', 
      meta: '8 agents', 
      expanded: false 
    },
    { 
      id: '5', 
      title: 'Appointments', 
      description: 'Active carrier appointments on file', 
      icon: 'check', 
      status: 'good', 
      expanded: false 
    },
    { 
      id: '6', 
      title: 'Documentation', 
      description: 'All required documents uploaded', 
      icon: 'clock', 
      status: 'pending', 
      meta: '2 agents', 
      expanded: false 
    },
  ]);

  agents = signal<AgentCompliance[]>([
    {
      id: '1',
      name: 'John Smith',
      score: 100,
      badges: [
        { label: 'License', status: 'good' },
        { label: 'E&O', status: 'good' },
        { label: 'Training', status: 'good' }
      ]
    },
    {
      id: '2',
      name: 'Emily Davis',
      score: 75,
      badges: [
        { label: 'License', status: 'good' },
        { label: 'E&O', status: 'warning' },
        { label: 'Training', status: 'good' }
      ]
    },
    {
      id: '3',
      name: 'Michael Brown',
      score: 50,
      badges: [
        { label: 'License', status: 'good' },
        { label: 'E&O', status: 'error' },
        { label: 'Training', status: 'warning' }
      ]
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      score: 100,
      badges: [
        { label: 'License', status: 'good' },
        { label: 'E&O', status: 'good' },
        { label: 'Training', status: 'good' }
      ]
    },
    {
      id: '5',
      name: 'James Taylor',
      score: 25,
      badges: [
        { label: 'License', status: 'warning' },
        { label: 'E&O', status: 'error' },
        { label: 'Training', status: 'error' }
      ]
    },
  ]);

  toggleReq(id: string) {
    this.requirements.update(reqs => 
      reqs.map(r => r.id === id ? { ...r, expanded: !r.expanded } : r)
    );
  }
}
