
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Agent {
  id: string;
  name: string;
  email: string;
  npn: string;
  status: 'active' | 'pending' | 'action required' | 'inactive';
  onboardingProgress: number;
  licenses: number;
  joinedDate: string;
  initials: string;
  avatarColor: string;
}

@Component({
  selector: 'app-agency-agents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in max-w-7xl mx-auto">
      
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
           <h1 class="text-2xl font-bold text-gray-900">Agents</h1>
           <p class="text-gray-500 mt-1">Manage your agency's agents</p>
        </div>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 font-medium">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
             <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
           </svg>
           Add Agent
        </button>
      </div>

      <!-- Filters -->
      <div class="flex gap-4">
        <div class="relative flex-1">
           <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
               <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
             </svg>
           </div>
           <input type="text" placeholder="Search by name, email, or NPN..." class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm">
        </div>
        
        <div class="relative">
          <button class="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            All Statuses
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
         <table class="min-w-full divide-y divide-gray-200">
           <thead class="bg-white">
             <tr>
               <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
               <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NPN</th>
               <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
               <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Onboarding</th>
               <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Licenses</th>
               <th scope="col" class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
               <th scope="col" class="relative px-6 py-4">
                 <span class="sr-only">Actions</span>
               </th>
             </tr>
           </thead>
           <tbody class="bg-white divide-y divide-gray-100">
             @for (agent of agents(); track agent.id) {
               <tr class="hover:bg-gray-50 transition-colors">
                 <!-- Agent Column -->
                 <td class="px-6 py-4 whitespace-nowrap">
                   <div class="flex items-center">
                     <div class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium" 
                          [ngClass]="agent.avatarColor">
                       {{ agent.initials }}
                     </div>
                     <div class="ml-4">
                       <div class="text-sm font-medium text-gray-900">{{ agent.name }}</div>
                       <div class="text-sm text-gray-500">{{ agent.email }}</div>
                     </div>
                   </div>
                 </td>
                 
                 <!-- NPN -->
                 <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                   {{ agent.npn }}
                 </td>

                 <!-- Status -->
                 <td class="px-6 py-4 whitespace-nowrap">
                   <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                    [class.bg-green-50]="agent.status === 'active'"
                    [class.text-green-700]="agent.status === 'active'"
                    [class.border-green-200]="agent.status === 'active'"
                    
                    [class.bg-orange-50]="agent.status === 'pending'"
                    [class.text-orange-700]="agent.status === 'pending'"
                    [class.border-orange-200]="agent.status === 'pending'"

                    [class.bg-amber-50]="agent.status === 'action required'"
                    [class.text-amber-700]="agent.status === 'action required'"
                    [class.border-amber-200]="agent.status === 'action required'"

                    [class.bg-red-50]="agent.status === 'inactive'"
                    [class.text-red-700]="agent.status === 'inactive'"
                    [class.border-red-200]="agent.status === 'inactive'"
                   >
                     {{ agent.status }}
                   </span>
                 </td>

                 <!-- Onboarding Progress -->
                 <td class="px-6 py-4 whitespace-nowrap align-middle">
                   <div class="flex items-center gap-3">
                     <div class="flex-1 w-24 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                       <div class="bg-blue-600 h-1.5 rounded-full" [style.width.%]="agent.onboardingProgress"></div>
                     </div>
                     <span class="text-xs text-gray-500 font-medium">{{ agent.onboardingProgress }}%</span>
                   </div>
                 </td>

                 <!-- Licenses -->
                 <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                   {{ agent.licenses }}
                 </td>

                 <!-- Joined Date -->
                 <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   {{ agent.joinedDate }}
                 </td>

                 <!-- Actions -->
                 <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                   <button class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                       <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                     </svg>
                   </button>
                 </td>
               </tr>
             }
           </tbody>
         </table>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  `]
})
export class AgencyAgentsComponent {
  agents = signal<Agent[]>([
    { 
      id: '1', 
      name: 'John Smith', 
      email: 'john.smith@email.com', 
      npn: '12345678', 
      status: 'active', 
      onboardingProgress: 100, 
      licenses: 3, 
      joinedDate: '2024-01-15',
      initials: 'JS',
      avatarColor: 'bg-blue-100 text-blue-600'
    },
    { 
      id: '2', 
      name: 'Emily Davis', 
      email: 'emily.davis@email.com', 
      npn: '23456789', 
      status: 'pending', 
      onboardingProgress: 75, 
      licenses: 2, 
      joinedDate: '2024-02-20',
      initials: 'ED',
      avatarColor: 'bg-indigo-100 text-indigo-600'
    },
    { 
      id: '3', 
      name: 'Michael Brown', 
      email: 'michael.b@email.com', 
      npn: '34567890', 
      status: 'action required', 
      onboardingProgress: 90, 
      licenses: 4, 
      joinedDate: '2024-01-08',
      initials: 'MB',
      avatarColor: 'bg-blue-100 text-blue-600'
    },
    { 
      id: '4', 
      name: 'Sarah Wilson', 
      email: 'sarah.w@email.com', 
      npn: '45678901', 
      status: 'active', 
      onboardingProgress: 100, 
      licenses: 2, 
      joinedDate: '2023-11-10',
      initials: 'SW',
      avatarColor: 'bg-blue-100 text-blue-600'
    },
    { 
      id: '5', 
      name: 'James Taylor', 
      email: 'james.t@email.com', 
      npn: '56789012', 
      status: 'inactive', 
      onboardingProgress: 50, 
      licenses: 1, 
      joinedDate: '2024-03-01',
      initials: 'JT',
      avatarColor: 'bg-gray-100 text-gray-600'
    },
    { 
      id: '6', 
      name: 'Lisa Anderson', 
      email: 'lisa.a@email.com', 
      npn: '67890123', 
      status: 'active', 
      onboardingProgress: 100, 
      licenses: 5, 
      joinedDate: '2023-09-22',
      initials: 'LA',
      avatarColor: 'bg-blue-100 text-blue-600'
    }
  ]);
}
