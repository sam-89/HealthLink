import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        pending: 'bg-warning/15 text-warning border border-warning/20',
        approved: 'bg-success/15 text-success border border-success/20',
        complete: 'bg-success/15 text-success border border-success/20',
        rejected: 'bg-destructive/15 text-destructive border border-destructive/20',
        expired: 'bg-destructive/15 text-destructive border border-destructive/20',
        'action-required': 'bg-warning/15 text-warning border border-warning/20',
        uploaded: 'bg-info/15 text-info border border-info/20',
        info: 'bg-info/15 text-info border border-info/20',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        default: 'text-xs px-2.5 py-1',
        lg: 'text-sm px-3 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'pending',
      size: 'default',
    },
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  variant?: VariantProps<typeof statusBadgeVariants>['variant'];
  size?: VariantProps<typeof statusBadgeVariants>['size'];
}

export function StatusBadge({ children, variant, size, className, icon }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ variant, size }), className)}>
      {icon}
      {children}
    </span>
  );
}