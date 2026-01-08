
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'pending' | 'approved' | 'complete' | 'rejected' | 'expired' | 'action-required' | 'uploaded' | 'info';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span 
      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors"
      [ngClass]="getClasses()"
    >
      <ng-content></ng-content>
    </span>
  `
})
export class StatusBadgeComponent {
  variant = input<BadgeVariant>('pending');

  getClasses() {
    const v = this.variant();
    switch (v) {
      case 'pending': return 'bg-warning/15 text-warning border border-warning/20';
      case 'approved': 
      case 'complete': return 'bg-success/15 text-success border border-success/20';
      case 'rejected':
      case 'expired': return 'bg-destructive/15 text-destructive border border-destructive/20';
      case 'action-required': return 'bg-warning/15 text-warning border border-warning/20';
      case 'uploaded':
      case 'info': return 'bg-info/15 text-info border border-info/20';
      default: return 'bg-muted text-muted-foreground';
    }
  }
}
