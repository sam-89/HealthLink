import { FileX, Users, FileSearch, ClipboardList, Inbox, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateType = "documents" | "agents" | "search" | "queue" | "licenses" | "generic";

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
}

const defaultContent: Record<EmptyStateType, { icon: LucideIcon; title: string; description: string }> = {
  documents: {
    icon: FileSearch,
    title: "No documents found",
    description: "Try adjusting your filters or upload a new document",
  },
  agents: {
    icon: Users,
    title: "No agents found",
    description: "Try adjusting your search criteria or add a new agent",
  },
  search: {
    icon: FileSearch,
    title: "No results found",
    description: "Try different keywords or clear your filters",
  },
  queue: {
    icon: ClipboardList,
    title: "Queue is empty",
    description: "No items pending verification at this time",
  },
  licenses: {
    icon: FileX,
    title: "No licenses on file",
    description: "License information will appear here once added",
  },
  generic: {
    icon: Inbox,
    title: "Nothing here yet",
    description: "Content will appear here when available",
  },
};

export function EmptyState({
  type = "generic",
  title,
  description,
  icon: CustomIcon,
  className,
}: EmptyStateProps) {
  const content = defaultContent[type];
  const Icon = CustomIcon || content.icon;
  const displayTitle = title || content.title;
  const displayDescription = description || content.description;

  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4", className)}>
      <div className="relative mb-4">
        {/* Decorative circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-muted/50 animate-pulse" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-muted" />
        </div>
        {/* Icon */}
        <div className="relative flex items-center justify-center w-24 h-24">
          <Icon className="w-10 h-10 text-muted-foreground/60" strokeWidth={1.5} />
        </div>
      </div>
      
      <h3 className="text-lg font-medium text-foreground mb-1">{displayTitle}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-[280px]">
        {displayDescription}
      </p>
    </div>
  );
}

export function TableEmptyState(props: EmptyStateProps) {
  return (
    <EmptyState {...props} className={cn("py-16", props.className)} />
  );
}
