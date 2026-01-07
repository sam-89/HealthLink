
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

type TabType = 'info' | 'notifications' | 'team' | 'security';

@Component({
  selector: 'app-agency-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6 animate-fade-in max-w-5xl mx-auto pb-10">
      <!-- Page Header -->
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Settings</h2>
        <p class="text-gray-500 mt-1">Manage your agency settings and preferences</p>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button 
            (click)="activeTab.set('info')"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors"
            [class.border-blue-500]="activeTab() === 'info'"
            [class.text-blue-600]="activeTab() === 'info'"
            [class.border-transparent]="activeTab() !== 'info'"
            [class.text-gray-500]="activeTab() !== 'info'"
            [class.hover:text-gray-700]="activeTab() !== 'info'"
            [class.hover:border-gray-300]="activeTab() !== 'info'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Agency Info
          </button>

          <button 
            (click)="activeTab.set('notifications')"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors"
            [class.border-blue-500]="activeTab() === 'notifications'"
            [class.text-blue-600]="activeTab() === 'notifications'"
            [class.border-transparent]="activeTab() !== 'notifications'"
            [class.text-gray-500]="activeTab() !== 'notifications'"
            [class.hover:text-gray-700]="activeTab() !== 'notifications'"
            [class.hover:border-gray-300]="activeTab() !== 'notifications'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Notifications
          </button>

          <button 
            (click)="activeTab.set('team')"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors"
            [class.border-blue-500]="activeTab() === 'team'"
            [class.text-blue-600]="activeTab() === 'team'"
            [class.border-transparent]="activeTab() !== 'team'"
            [class.text-gray-500]="activeTab() !== 'team'"
            [class.hover:text-gray-700]="activeTab() !== 'team'"
            [class.hover:border-gray-300]="activeTab() !== 'team'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Team
          </button>

          <button 
            (click)="activeTab.set('security')"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors"
            [class.border-blue-500]="activeTab() === 'security'"
            [class.text-blue-600]="activeTab() === 'security'"
            [class.border-transparent]="activeTab() !== 'security'"
            [class.text-gray-500]="activeTab() !== 'security'"
            [class.hover:text-gray-700]="activeTab() !== 'security'"
            [class.hover:border-gray-300]="activeTab() !== 'security'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Security
          </button>
        </nav>
      </div>

      <!-- TAB CONTENT -->

      <!-- 1. Agency Info Tab -->
      @if (activeTab() === 'info') {
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm animate-fade-in">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Agency Information</h3>
            <p class="mt-1 text-sm text-gray-500">Update your agency's public profile and contact details</p>
          </div>

          <form [formGroup]="infoForm" (ngSubmit)="saveInfo()">
            <div class="p-8 space-y-8">
              
              <!-- Logo Upload -->
              <div class="flex items-center gap-6">
                <div class="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 text-gray-400">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                   </svg>
                </div>
                <div>
                   <button type="button" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                     Upload Logo
                   </button>
                   <p class="mt-2 text-xs text-gray-500">JPG, GIF or PNG. Max size 2MB.</p>
                </div>
              </div>

              <div class="border-t border-gray-100"></div>

              <!-- Fields -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Agency Name</label>
                  <input type="text" formControlName="name" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-gray-50">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Agency NPN</label>
                  <input type="text" formControlName="npn" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-gray-50">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input type="email" formControlName="email" class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-gray-50">
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div class="relative">
                     <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <input type="tel" formControlName="phone" class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-gray-50">
                  </div>
                </div>

                <div class="md:col-span-2">
                   <h4 class="text-sm font-medium text-gray-900 mt-2 mb-4 flex items-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                     Address
                   </h4>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" formControlName="address" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-gray-50">
                </div>

                <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                   <input type="text" formControlName="city" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-gray-50">
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input type="text" formControlName="state" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-gray-50">
                  </div>
                   <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                    <input type="text" formControlName="zip" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-gray-50">
                  </div>
                </div>

              </div>
            </div>
            
            <!-- Footer -->
            <div class="px-8 py-5 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end">
               <button 
                 type="submit" 
                 class="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors flex items-center gap-2 shadow-sm"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                 Save Changes
               </button>
            </div>
          </form>
        </div>
      }

      <!-- 2. Notifications Tab -->
      @if (activeTab() === 'notifications') {
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm animate-fade-in">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Notification Preferences</h3>
            <p class="mt-1 text-sm text-gray-500">Configure how and when you receive alerts</p>
          </div>
          
          <form [formGroup]="notificationForm" (ngSubmit)="saveNotifications()">
            <div class="divide-y divide-gray-100">
               <!-- Email Alerts -->
               <div class="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                     <h4 class="text-sm font-medium text-gray-900">Email Alerts</h4>
                     <p class="text-xs text-gray-500 mt-1">Receive important updates via email</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" formControlName="emailAlerts" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
               </div>

               <!-- License Expiry Warnings -->
               <div class="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                     <h4 class="text-sm font-medium text-gray-900">License Expiry Warnings</h4>
                     <p class="text-xs text-gray-500 mt-1">Get notified 30 days before agent licenses expire</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" formControlName="licenseExpiry" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
               </div>

               <!-- Compliance Updates -->
               <div class="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                     <h4 class="text-sm font-medium text-gray-900">Compliance Updates</h4>
                     <p class="text-xs text-gray-500 mt-1">Alerts when compliance status changes</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" formControlName="complianceUpdates" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
               </div>

               <!-- Weekly Digest -->
               <div class="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                     <h4 class="text-sm font-medium text-gray-900">Weekly Digest</h4>
                     <p class="text-xs text-gray-500 mt-1">Receive a weekly summary of agency activity</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" formControlName="weeklyDigest" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
               </div>

               <!-- New Agent Onboarding -->
               <div class="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                     <h4 class="text-sm font-medium text-gray-900">New Agent Onboarding</h4>
                     <p class="text-xs text-gray-500 mt-1">Notifications when agents complete onboarding steps</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" formControlName="newAgentOnboarding" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
               </div>

               <!-- Document Uploads -->
               <div class="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                     <h4 class="text-sm font-medium text-gray-900">Document Uploads</h4>
                     <p class="text-xs text-gray-500 mt-1">Alerts when new documents are uploaded for review</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" formControlName="documentUploads" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
               </div>
            </div>

            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end">
               <button 
                 type="submit" 
                 class="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors flex items-center gap-2 shadow-sm"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                 Save Preferences
               </button>
            </div>
          </form>
        </div>
      }

      <!-- 3. Team Tab -->
      @if (activeTab() === 'team') {
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm animate-fade-in">
           <div class="p-6 border-b border-gray-200 flex justify-between items-center">
             <div>
               <h3 class="text-lg font-medium leading-6 text-gray-900">Team Members</h3>
               <p class="mt-1 text-sm text-gray-500">Manage who has access to this agency dashboard.</p>
             </div>
             <button class="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
               Invite Member
             </button>
           </div>
           
           <div class="divide-y divide-gray-100">
             <!-- Member 1 -->
             <div class="p-4 flex items-center justify-between hover:bg-gray-50">
               <div class="flex items-center gap-3">
                 <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">JS</div>
                 <div>
                   <p class="text-sm font-medium text-gray-900">Jane Smith</p>
                   <p class="text-xs text-gray-500">jane.smith@metrohealth.com</p>
                 </div>
               </div>
               <div class="flex items-center gap-4">
                 <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                   Admin
                 </span>
                 <button class="text-gray-400 hover:text-red-500">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 </button>
               </div>
             </div>
             <!-- Member 2 -->
             <div class="p-4 flex items-center justify-between hover:bg-gray-50">
               <div class="flex items-center gap-3">
                 <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">MR</div>
                 <div>
                   <p class="text-sm font-medium text-gray-900">Mark Rogers</p>
                   <p class="text-xs text-gray-500">mark.rogers@metrohealth.com</p>
                 </div>
               </div>
               <div class="flex items-center gap-4">
                 <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                   Member
                 </span>
                 <button class="text-gray-400 hover:text-red-500">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 </button>
               </div>
             </div>
           </div>
        </div>
      }

      <!-- 4. Security Tab -->
      @if (activeTab() === 'security') {
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm animate-fade-in">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Security Settings</h3>
            <p class="mt-1 text-sm text-gray-500">Manage security and access controls</p>
          </div>
          
          <div class="divide-y divide-gray-100">
            <!-- Two-Factor Authentication -->
            <div class="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <h4 class="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                <p class="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</p>
              </div>
              <button (click)="enable2FA()" type="button" class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Enable
              </button>
            </div>

            <!-- Session Timeout -->
            <div class="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <h4 class="text-sm font-medium text-gray-900">Session Timeout</h4>
                <p class="text-sm text-gray-500 mt-1">Automatically log out after period of inactivity</p>
              </div>
              <select [formControl]="securityForm.controls.sessionTimeout" class="block pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg border bg-white shadow-sm">
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="240">4 hours</option>
              </select>
            </div>

            <!-- Password Requirements -->
            <div class="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <h4 class="text-sm font-medium text-gray-900">Password Requirements</h4>
                <p class="text-sm text-gray-500 mt-1">Enforce strong password policy for all team members</p>
              </div>
               <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" [formControl]="securityForm.controls.passwordRequirements" class="sr-only peer">
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>

            <!-- Login History -->
            <div class="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <h4 class="text-sm font-medium text-gray-900">Login History</h4>
                <p class="text-sm text-gray-500 mt-1">View recent login activity</p>
              </div>
              <button (click)="viewLoginLogs()" type="button" class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                View Logs
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  `]
})
export class AgencySettingsComponent {
  activeTab = signal<TabType>('info');
  private fb: FormBuilder = inject(FormBuilder);

  infoForm = this.fb.group({
    name: ['MetroHealth Agency', Validators.required],
    npn: ['98765432', Validators.required],
    email: ['contact@metrohealth.com', [Validators.required, Validators.email]],
    phone: ['(555) 123-4567', Validators.required],
    address: ['123 Healthcare Blvd, Suite 400', Validators.required],
    city: ['Los Angeles', Validators.required],
    state: ['CA', Validators.required],
    zip: ['90001', Validators.required]
  });

  notificationForm = this.fb.group({
    emailAlerts: [true],
    licenseExpiry: [true],
    complianceUpdates: [true],
    weeklyDigest: [false],
    newAgentOnboarding: [true],
    documentUploads: [true]
  });

  securityForm = this.fb.group({
    sessionTimeout: ['30'],
    passwordRequirements: [true]
  });

  saveInfo() {
    if (this.infoForm.valid) {
      alert('Settings saved successfully!');
    }
  }

  saveNotifications() {
    console.log(this.notificationForm.value);
    alert('Preferences saved successfully!');
  }

  enable2FA() {
    alert('Two-Factor Authentication setup wizard would open here.');
  }

  viewLoginLogs() {
    alert('Login history modal would open here.');
  }
}
