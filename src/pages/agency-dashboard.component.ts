
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agency-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in max-w-7xl mx-auto">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Agency Dashboard</h1>
        <p class="text-gray-500">MetroHealth Agency compliance overview</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Agents -->
        <div class="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-4 shadow-sm">
          <div class="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900">47</div>
            <div class="text-sm text-gray-500">Total Agents</div>
          </div>
        </div>

        <!-- Fully Compliant -->
        <div class="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-4 shadow-sm">
          <div class="p-3 bg-green-50 text-green-600 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900">38</div>
            <div class="text-sm text-gray-500">Fully Compliant</div>
          </div>
        </div>

        <!-- Action Required -->
        <div class="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-4 shadow-sm">
          <div class="p-3 bg-orange-50 text-orange-600 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900">6</div>
            <div class="text-sm text-gray-500">Action Required</div>
          </div>
        </div>

        <!-- Documents -->
        <div class="bg-white p-6 rounded-xl border border-gray-200 flex items-center gap-4 shadow-sm">
          <div class="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-gray-900">234</div>
            <div class="text-sm text-gray-500">Documents</div>
          </div>
        </div>
      </div>

      <!-- Attention List -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-bold text-gray-900">Agents Requiring Attention</h2>
        </div>
        <div class="divide-y divide-gray-100">
          <!-- Item 1 -->
          <div class="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div>
              <p class="font-medium text-gray-900">John Smith</p>
              <p class="text-sm text-gray-500">License expiring in 5 days</p>
            </div>
            <span class="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">action required</span>
          </div>
          <!-- Item 2 -->
          <div class="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div>
              <p class="font-medium text-gray-900">Emily Davis</p>
              <p class="text-sm text-gray-500">Missing E&O certificate</p>
            </div>
            <span class="bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">pending</span>
          </div>
          <!-- Item 3 -->
          <div class="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div>
              <p class="font-medium text-gray-900">Michael Brown</p>
              <p class="text-sm text-gray-500">Background check pending</p>
            </div>
            <span class="bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">pending</span>
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
export class AgencyDashboardComponent {}
