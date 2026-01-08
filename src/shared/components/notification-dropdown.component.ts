
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Notification {
  id: string;
  type: 'document' | 'agent' | 'alert' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

@Component({
  selector: 'app-notification-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <button 
        (click)="isOpen.set(!isOpen())"
        class="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <span class="sr-only">View notifications</span>
        @if (unreadCount() > 0) {
          <div class="absolute top-2 right-2 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-card z-10"></div>
        }
        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </button>

      @if (isOpen()) {
        <div class="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden animate-fade-in origin-top-right">
          <div class="p-4 border-b border-border flex justify-between items-center bg-muted/30">
            <h3 class="font-semibold text-sm">Notifications</h3>
            @if (unreadCount() > 0) {
              <button (click)="markAllAsRead()" class="text-xs text-primary hover:underline">Mark all as read</button>
            }
          </div>
          
          <div class="max-h-[400px] overflow-y-auto custom-scrollbar">
            @for (notification of notifications(); track notification.id) {
              <div 
                (click)="markAsRead(notification.id)"
                class="p-4 border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors flex gap-3"
                [class.bg-blue-50_dark:bg-blue-900/10]="!notification.read"
              >
                <div [ngClass]="getIconBg(notification.type)" class="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                   @switch(notification.type) {
                      @case('document') { <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> }
                      @case('alert') { <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg> }
                      @case('success') { <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> }
                      @default { <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> }
                   }
                </div>
                <div class="flex-1 space-y-1">
                  <p class="text-sm font-medium leading-none">{{ notification.title }}</p>
                  <p class="text-xs text-muted-foreground line-clamp-2">{{ notification.message }}</p>
                  <p class="text-[10px] text-muted-foreground/80 pt-1">{{ notification.time }}</p>
                </div>
                @if (!notification.read) {
                   <div class="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5"></div>
                }
              </div>
            }
          </div>
          
          <div class="p-2 border-t border-border bg-muted/10">
            <button class="w-full py-1.5 text-xs text-center text-muted-foreground hover:text-foreground">View all notifications</button>
          </div>
        </div>
        
        <!-- Backdrop -->
        <div class="fixed inset-0 z-40" (click)="isOpen.set(false)"></div>
      }
    </div>
  `
})
export class NotificationDropdownComponent {
  isOpen = signal(false);
  
  notifications = signal<Notification[]>([
    {
      id: '1',
      type: 'document',
      title: 'Document Approved',
      message: 'Your E&O Insurance Policy has been verified successfully.',
      time: '5 min ago',
      read: false,
    },
    {
      id: '2',
      type: 'agent',
      title: 'New Agent Onboarded',
      message: 'Sarah Johnson completed onboarding',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      type: 'alert',
      title: 'License Expiring Soon',
      message: 'Agent Mike Davis license expires in 30 days',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '4',
      type: 'success',
      title: 'Compliance Check Passed',
      message: 'Quarterly compliance review completed',
      time: '1 day ago',
      read: true,
    }
  ]);

  get unreadCount() {
    return () => this.notifications().filter(n => !n.read).length;
  }

  markAsRead(id: string) {
    this.notifications.update(ns => 
      ns.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  markAllAsRead() {
    this.notifications.update(ns => 
      ns.map(n => ({ ...n, read: true }))
    );
  }

  getIconBg(type: string) {
    switch(type) {
      case 'document': return 'bg-blue-100 text-blue-600';
      case 'alert': return 'bg-red-100 text-red-600';
      case 'success': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  }
}
