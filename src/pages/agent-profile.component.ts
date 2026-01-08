
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { StatusBadgeComponent } from '../shared/components/status-badge.component';

type Tab = 'personal' | 'licenses' | 'notifications' | 'security';

@Component({
  selector: 'app-agent-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StatusBadgeComponent],
  template: `
    <div class="space-y-6 animate-fade-in pb-12">
      
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
           <h2 class="text-2xl font-bold text-foreground">My Profile</h2>
           <p class="text-muted-foreground mt-1">Manage your personal information and preferences</p>
        </div>
        <button class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm text-sm font-medium flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
           Edit Profile
        </button>
      </div>

      <!-- Profile Header Card -->
      <div class="bg-card rounded-xl shadow-card border border-border p-6 flex flex-col md:flex-row items-center gap-6">
        <div class="relative group cursor-pointer">
          <img [src]="auth.currentUser()?.avatar" class="w-24 h-24 rounded-full border-4 border-background shadow-sm object-cover">
          <div class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
        </div>
        <div class="flex-1 text-center md:text-left">
          <h1 class="text-2xl font-bold text-foreground">{{ auth.currentUser()?.name }}</h1>
          <p class="text-muted-foreground">Insurance Agent</p>
          <div class="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
             <app-status-badge variant="complete">Active</app-status-badge>
             <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
               MetroHealth Agency
             </span>
          </div>
        </div>
        <div class="text-center md:text-right border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
          <p class="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">National Producer Number</p>
          <p class="font-mono font-bold text-xl text-foreground">12345678</p>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="border-b border-border overflow-x-auto">
          <nav class="flex space-x-8" aria-label="Tabs">
            <button 
                (click)="activeTab.set('personal')"
                class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors"
                [class.border-primary]="activeTab() === 'personal'"
                [class.text-primary]="activeTab() === 'personal'"
                [class.border-transparent]="activeTab() !== 'personal'"
                [class.text-muted-foreground]="activeTab() !== 'personal'"
                [class.hover:text-foreground]="activeTab() !== 'personal'"
                [class.hover:border-border]="activeTab() !== 'personal'"
            >
                Personal Info
            </button>
            <button 
                (click)="activeTab.set('licenses')"
                class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors"
                [class.border-primary]="activeTab() === 'licenses'"
                [class.text-primary]="activeTab() === 'licenses'"
                [class.border-transparent]="activeTab() !== 'licenses'"
                [class.text-muted-foreground]="activeTab() !== 'licenses'"
                [class.hover:text-foreground]="activeTab() !== 'licenses'"
                [class.hover:border-border]="activeTab() !== 'licenses'"
            >
                Licenses
            </button>
            <button 
                (click)="activeTab.set('notifications')"
                class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors"
                [class.border-primary]="activeTab() === 'notifications'"
                [class.text-primary]="activeTab() === 'notifications'"
                [class.border-transparent]="activeTab() !== 'notifications'"
                [class.text-muted-foreground]="activeTab() !== 'notifications'"
                [class.hover:text-foreground]="activeTab() !== 'notifications'"
                [class.hover:border-border]="activeTab() !== 'notifications'"
            >
                Notifications
            </button>
             <button 
                (click)="activeTab.set('security')"
                class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors"
                [class.border-primary]="activeTab() === 'security'"
                [class.text-primary]="activeTab() === 'security'"
                [class.border-transparent]="activeTab() !== 'security'"
                [class.text-muted-foreground]="activeTab() !== 'security'"
                [class.hover:text-foreground]="activeTab() !== 'security'"
                [class.hover:border-border]="activeTab() !== 'security'"
            >
                Security
            </button>
          </nav>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- MAIN CONTENT AREA (Left Column) -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- TAB: PERSONAL INFO -->
          @if (activeTab() === 'personal') {
            <div class="bg-card rounded-xl shadow-card border border-border animate-fade-in">
              <div class="p-6 border-b border-border">
                  <h3 class="text-lg font-semibold text-foreground">Personal Information</h3>
                  <p class="text-sm text-muted-foreground">Your contact and identification details</p>
              </div>
              <div class="p-6">
                  <form [formGroup]="profileForm" class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="space-y-2">
                      <label class="block text-sm font-medium text-foreground">First Name</label>
                      <input type="text" formControlName="firstName" class="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-input bg-background text-sm">
                      </div>
                      <div class="space-y-2">
                      <label class="block text-sm font-medium text-foreground">Last Name</label>
                      <input type="text" formControlName="lastName" class="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-input bg-background text-sm">
                      </div>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="space-y-2">
                      <label class="block text-sm font-medium text-foreground">Email</label>
                      <input type="email" formControlName="email" class="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-input bg-background text-sm bg-muted/50" readonly>
                      </div>
                      <div class="space-y-2">
                      <label class="block text-sm font-medium text-foreground">Phone</label>
                      <input type="tel" formControlName="phone" class="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-input bg-background text-sm">
                      </div>
                  </div>

                  <div class="space-y-2">
                      <label class="block text-sm font-medium text-foreground">Bio</label>
                      <textarea formControlName="bio" rows="4" class="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-input bg-background text-sm resize-none"></textarea>
                      <p class="text-xs text-muted-foreground">Brief description for your agency profile.</p>
                  </div>
                  </form>
              </div>
            </div>
            
             <!-- Address Card -->
             <div class="bg-card rounded-xl shadow-card border border-border animate-fade-in">
              <div class="p-6 border-b border-border">
                  <h3 class="text-lg font-semibold text-foreground">Address</h3>
                  <p class="text-sm text-muted-foreground">Primary mailing address</p>
              </div>
              <div class="p-6 space-y-4">
                   <div class="space-y-2">
                      <label class="block text-sm font-medium text-foreground">Street Address</label>
                      <input type="text" value="123 Main St" class="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-input bg-background text-sm">
                   </div>
                   <div class="grid grid-cols-6 gap-4">
                      <div class="col-span-3 space-y-2">
                           <label class="block text-sm font-medium text-foreground">City</label>
                           <input type="text" value="Los Angeles" class="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-input bg-background text-sm">
                      </div>
                       <div class="col-span-2 space-y-2">
                           <label class="block text-sm font-medium text-foreground">State</label>
                           <select class="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-input bg-background text-sm">
                              <option>California</option>
                           </select>
                      </div>
                       <div class="col-span-1 space-y-2">
                           <label class="block text-sm font-medium text-foreground">Zip</label>
                           <input type="text" value="90001" class="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-input bg-background text-sm">
                      </div>
                   </div>
              </div>
             </div>
          }

          <!-- TAB: LICENSES -->
          @if (activeTab() === 'licenses') {
            <div class="bg-card rounded-xl shadow-card border border-border animate-fade-in">
              <div class="p-6 border-b border-border flex justify-between items-center">
                <div>
                   <h3 class="text-lg font-semibold text-foreground">Active Licenses</h3>
                   <p class="text-sm text-muted-foreground">Your state licenses and lines of authority</p>
                </div>
                <button class="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-md text-sm font-medium transition-colors">
                  + Add License
                </button>
              </div>
              <div class="divide-y divide-border">
                <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                   <div>
                      <div class="flex items-center gap-2">
                        <span class="font-semibold text-foreground">California</span>
                        <span class="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">Resident</span>
                      </div>
                      <p class="text-sm text-muted-foreground font-mono mt-1">License #: 0K12345</p>
                      <div class="flex gap-2 mt-2">
                        <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs border border-blue-100">Life</span>
                        <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs border border-blue-100">Accident & Health</span>
                      </div>
                   </div>
                   <div class="text-left sm:text-right">
                      <app-status-badge variant="complete">Active</app-status-badge>
                      <p class="text-xs text-muted-foreground mt-1">Expires: Dec 31, 2025</p>
                   </div>
                </div>

                <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                   <div>
                      <div class="flex items-center gap-2">
                        <span class="font-semibold text-foreground">Texas</span>
                        <span class="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">Non-Resident</span>
                      </div>
                      <p class="text-sm text-muted-foreground font-mono mt-1">License #: 2468135</p>
                      <div class="flex gap-2 mt-2">
                        <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs border border-blue-100">Life</span>
                      </div>
                   </div>
                   <div class="text-left sm:text-right">
                      <app-status-badge variant="action-required">Renewal Due</app-status-badge>
                      <p class="text-xs text-muted-foreground mt-1">Expires: Feb 01, 2025</p>
                   </div>
                </div>

                <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                   <div>
                      <div class="flex items-center gap-2">
                        <span class="font-semibold text-foreground">Florida</span>
                        <span class="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">Non-Resident</span>
                      </div>
                      <p class="text-sm text-muted-foreground font-mono mt-1">License #: W459922</p>
                      <div class="flex gap-2 mt-2">
                        <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs border border-blue-100">Life</span>
                        <span class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs border border-blue-100">Variable</span>
                      </div>
                   </div>
                   <div class="text-left sm:text-right">
                      <app-status-badge variant="complete">Active</app-status-badge>
                      <p class="text-xs text-muted-foreground mt-1">Expires: Jun 15, 2026</p>
                   </div>
                </div>
              </div>
            </div>
          }

          <!-- TAB: NOTIFICATIONS -->
          @if (activeTab() === 'notifications') {
            <div class="bg-card rounded-xl shadow-card border border-border animate-fade-in">
               <div class="p-6 border-b border-border">
                  <h3 class="text-lg font-semibold text-foreground">Notification Preferences</h3>
                  <p class="text-sm text-muted-foreground">Manage how you receive updates and alerts</p>
              </div>
              <div class="divide-y divide-border">
                 <div class="p-4 flex items-center justify-between">
                    <div>
                       <p class="font-medium text-foreground">License Expirations</p>
                       <p class="text-xs text-muted-foreground">Get notified 90, 60, and 30 days before expiration.</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked class="sr-only peer">
                      <div class="w-9 h-5 bg-input peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                 </div>

                 <div class="p-4 flex items-center justify-between">
                    <div>
                       <p class="font-medium text-foreground">Application Status Updates</p>
                       <p class="text-xs text-muted-foreground">Receive emails when your application status changes.</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked class="sr-only peer">
                      <div class="w-9 h-5 bg-input peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                 </div>

                 <div class="p-4 flex items-center justify-between">
                    <div>
                       <p class="font-medium text-foreground">Continuing Education Reminders</p>
                       <p class="text-xs text-muted-foreground">Reminders to complete CE credits before renewal.</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked class="sr-only peer">
                      <div class="w-9 h-5 bg-input peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                 </div>

                 <div class="p-4 flex items-center justify-between">
                    <div>
                       <p class="font-medium text-foreground">Marketing & News</p>
                       <p class="text-xs text-muted-foreground">Receive updates about new features and industry news.</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" class="sr-only peer">
                      <div class="w-9 h-5 bg-input peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                 </div>
              </div>
            </div>
          }

          <!-- TAB: SECURITY -->
          @if (activeTab() === 'security') {
            <div class="bg-card rounded-xl shadow-card border border-border animate-fade-in">
               <div class="p-6 border-b border-border">
                  <h3 class="text-lg font-semibold text-foreground">Security Settings</h3>
                  <p class="text-sm text-muted-foreground">Manage your account security and authentication</p>
              </div>
              <div class="p-6 space-y-6">
                 
                 <!-- Change Password -->
                 <div class="space-y-4">
                    <h4 class="text-sm font-medium text-foreground uppercase tracking-wider">Change Password</h4>
                    <div class="grid grid-cols-1 gap-4">
                       <div class="space-y-2">
                          <label class="text-sm text-muted-foreground">Current Password</label>
                          <input type="password" class="w-full px-3 py-2 border border-input rounded-md bg-background text-sm">
                       </div>
                       <div class="grid grid-cols-2 gap-4">
                          <div class="space-y-2">
                            <label class="text-sm text-muted-foreground">New Password</label>
                            <input type="password" class="w-full px-3 py-2 border border-input rounded-md bg-background text-sm">
                          </div>
                          <div class="space-y-2">
                            <label class="text-sm text-muted-foreground">Confirm New Password</label>
                            <input type="password" class="w-full px-3 py-2 border border-input rounded-md bg-background text-sm">
                          </div>
                       </div>
                    </div>
                    <div class="flex justify-end">
                       <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">Update Password</button>
                    </div>
                 </div>

                 <div class="border-t border-border my-6"></div>

                 <!-- 2FA -->
                 <div class="flex items-center justify-between">
                    <div>
                       <h4 class="text-sm font-medium text-foreground">Two-Factor Authentication (2FA)</h4>
                       <p class="text-xs text-muted-foreground mt-1">Add an extra layer of security to your account using an authenticator app.</p>
                    </div>
                    <button class="px-4 py-2 border border-input bg-background hover:bg-muted rounded-md text-sm font-medium transition-colors">
                       Enable 2FA
                    </button>
                 </div>

                 <div class="border-t border-border my-6"></div>

                 <!-- Sessions -->
                  <div>
                       <h4 class="text-sm font-medium text-foreground mb-3">Active Sessions</h4>
                       <div class="space-y-3">
                          <div class="flex items-center justify-between text-sm p-3 bg-muted/30 rounded-lg">
                             <div class="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <div>
                                   <p class="font-medium text-foreground">MacBook Pro - Chrome</p>
                                   <p class="text-xs text-muted-foreground">Los Angeles, CA • Current Session</p>
                                </div>
                             </div>
                             <span class="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">Active</span>
                          </div>
                          <div class="flex items-center justify-between text-sm p-3 bg-muted/30 rounded-lg">
                             <div class="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                <div>
                                   <p class="font-medium text-foreground">iPhone 13 - Safari</p>
                                   <p class="text-xs text-muted-foreground">Los Angeles, CA • 2 days ago</p>
                                </div>
                             </div>
                             <button class="text-xs text-destructive hover:underline">Revoke</button>
                          </div>
                       </div>
                  </div>

              </div>
            </div>
          }

        </div>

        <!-- Right Column: Settings & Stats -->
        <div class="space-y-6">
           
           <!-- Completion Status -->
           <div class="bg-card rounded-xl shadow-card border border-border p-6">
              <h3 class="font-bold text-foreground mb-4">Profile Completion</h3>
              <div class="space-y-2">
                 <div class="flex justify-between text-sm">
                   <span class="text-muted-foreground">Complete</span>
                   <span class="font-bold text-primary">85%</span>
                 </div>
                 <div class="w-full bg-secondary rounded-full h-2">
                   <div class="bg-primary h-2 rounded-full" style="width: 85%"></div>
                 </div>
                 <p class="text-xs text-muted-foreground mt-2">Finish adding your education history to reach 100%.</p>
              </div>
           </div>

           <!-- Quick Settings (Always visible) -->
           <div class="bg-card rounded-xl shadow-card border border-border overflow-hidden">
             <div class="p-4 border-b border-border bg-muted/30 font-semibold text-foreground">
               Quick Settings
             </div>
             <div class="divide-y divide-border">
                <div class="p-4 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    <span class="text-sm font-medium text-foreground">Global Alerts</span>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" class="sr-only peer" checked>
                    <div class="w-9 h-5 bg-input peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div class="p-4 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                    <span class="text-sm font-medium text-foreground">Dark Mode</span>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" class="sr-only peer">
                    <div class="w-9 h-5 bg-input peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
             </div>
             <div class="p-4 border-t border-border bg-muted/10">
               <button class="w-full py-2 text-sm text-destructive hover:text-destructive/80 font-medium">Delete Account</button>
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
  
  activeTab = signal<Tab>('personal');

  profileForm = this.fb.group({
    firstName: ['Sarah', Validators.required],
    lastName: ['Johnson', Validators.required],
    email: ['sarah@agent.com', [Validators.required, Validators.email]],
    phone: ['(555) 123-4567', Validators.required],
    bio: ['Experienced insurance professional with over 5 years in the healthcare sector. Dedicated to finding the best plans for families.']
  });
}
