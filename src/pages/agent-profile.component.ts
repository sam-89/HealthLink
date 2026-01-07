
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-agent-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      <!-- Profile Header -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div class="relative">
          <img [src]="auth.currentUser()?.avatar" class="w-32 h-32 rounded-full border-4 border-gray-50 shadow-md">
          <button class="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 shadow-sm transition-colors" title="Change Avatar">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
        <div class="flex-1 text-center md:text-left">
          <h1 class="text-3xl font-bold text-gray-900">{{ auth.currentUser()?.name }}</h1>
          <p class="text-gray-500 font-medium">{{ auth.currentUser()?.email }}</p>
          <div class="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
             <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
               {{ auth.currentUser()?.role }}
             </span>
             <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
               Active Status
             </span>
          </div>
        </div>
        <div class="flex gap-3">
          <button class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            Share Profile
          </button>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
            Edit Profile
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left Column: Settings -->
        <div class="space-y-6">
           <!-- Account Settings -->
           <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div class="p-4 border-b border-gray-100 bg-gray-50 font-semibold text-gray-900">
               Settings
             </div>
             <div class="p-4 space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-gray-100 rounded-lg text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    </div>
                    <span class="text-sm font-medium text-gray-700">Notifications</span>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" class="sr-only peer" checked>
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-gray-100 rounded-lg text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <span class="text-sm font-medium text-gray-700">2FA Security</span>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
             </div>
             <div class="p-4 border-t border-gray-100 bg-gray-50/50">
               <button class="w-full py-2 text-sm text-red-600 hover:text-red-700 font-medium">Delete Account</button>
             </div>
           </div>

           <!-- Statistics Placeholder -->
           <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 class="font-bold text-gray-900 mb-4">Your Impact</h3>
              <div class="space-y-4">
                 <div class="flex justify-between text-sm">
                   <span class="text-gray-500">Policies Sold</span>
                   <span class="font-medium text-gray-900">1,245</span>
                 </div>
                 <div class="w-full bg-gray-100 rounded-full h-2">
                   <div class="bg-blue-600 h-2 rounded-full" style="width: 75%"></div>
                 </div>
                 
                 <div class="flex justify-between text-sm">
                   <span class="text-gray-500">Compliance Score</span>
                   <span class="font-medium text-gray-900">98%</span>
                 </div>
                 <div class="w-full bg-gray-100 rounded-full h-2">
                   <div class="bg-green-500 h-2 rounded-full" style="width: 98%"></div>
                 </div>
              </div>
           </div>
        </div>

        <!-- Right Column: Forms -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- Personal Info Form -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
            <form [formGroup]="profileForm" class="space-y-6">
               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                   <input type="text" formControlName="firstName" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50">
                 </div>
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                   <input type="text" formControlName="lastName" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50">
                 </div>
               </div>
               
               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                   <input type="email" formControlName="email" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50">
                 </div>
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                   <input type="tel" formControlName="phone" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50">
                 </div>
               </div>

               <div>
                 <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                 <textarea formControlName="bio" rows="4" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 resize-none"></textarea>
                 <p class="text-xs text-gray-500 mt-1">Brief description for your agency profile.</p>
               </div>
            </form>
          </div>

          <!-- Professional Details -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Professional Details</h2>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">National Producer Number (NPN)</label>
                   <div class="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-between">
                     <span>12345678</span>
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                   </div>
                 </div>
                 <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">Primary State</label>
                    <div class="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-100 text-gray-600">
                     California
                   </div>
                 </div>
               </div>
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
export class AgentProfileComponent {
  auth = inject(AuthService);
  private fb: FormBuilder = inject(FormBuilder);

  profileForm = this.fb.group({
    firstName: ['Sarah', Validators.required],
    lastName: ['Johnson', Validators.required],
    email: ['sarah@agent.com', [Validators.required, Validators.email]],
    phone: ['(555) 123-4567', Validators.required],
    bio: ['Experienced insurance professional with over 5 years in the healthcare sector. Dedicated to finding the best plans for families.']
  });
}
