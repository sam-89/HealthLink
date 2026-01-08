import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  ClipboardCheck,
  Building2,
  UserCircle,
  Search,
  Shield,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface SearchItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  path: string;
  keywords?: string[];
}

const NAVIGATION_ITEMS: Record<UserRole, SearchItem[]> = {
  agent: [
    { id: 'agent-dashboard', label: 'Dashboard', description: 'Agent overview', icon: <LayoutDashboard className="w-4 h-4" />, path: '/agent', keywords: ['home', 'overview'] },
    { id: 'agent-onboarding', label: 'Onboarding', description: 'Complete your onboarding', icon: <ClipboardCheck className="w-4 h-4" />, path: '/agent/onboarding', keywords: ['setup', 'wizard'] },
    { id: 'agent-documents', label: 'My Documents', description: 'View your documents', icon: <FileText className="w-4 h-4" />, path: '/agent/documents', keywords: ['files', 'uploads'] },
    { id: 'agent-profile', label: 'Profile', description: 'Your profile settings', icon: <UserCircle className="w-4 h-4" />, path: '/agent/profile', keywords: ['account', 'settings'] },
  ],
  agency: [
    { id: 'agency-dashboard', label: 'Dashboard', description: 'Agency overview', icon: <LayoutDashboard className="w-4 h-4" />, path: '/agency', keywords: ['home', 'overview'] },
    { id: 'agency-agents', label: 'Agents', description: 'Manage your agents', icon: <Users className="w-4 h-4" />, path: '/agency/agents', keywords: ['team', 'members'] },
    { id: 'agency-documents', label: 'Document Center', description: 'Agency documents', icon: <FileText className="w-4 h-4" />, path: '/agency/documents', keywords: ['files', 'uploads'] },
    { id: 'agency-compliance', label: 'Compliance', description: 'Compliance tracking', icon: <ClipboardCheck className="w-4 h-4" />, path: '/agency/compliance', keywords: ['regulations', 'status'] },
    { id: 'agency-settings', label: 'Settings', description: 'Agency settings', icon: <Settings className="w-4 h-4" />, path: '/agency/settings', keywords: ['preferences', 'config'] },
  ],
  ops: [
    { id: 'ops-dashboard', label: 'Dashboard', description: 'Operations overview', icon: <LayoutDashboard className="w-4 h-4" />, path: '/ops', keywords: ['home', 'overview'] },
    { id: 'ops-queue', label: 'Verification Queue', description: 'Pending verifications', icon: <ClipboardCheck className="w-4 h-4" />, path: '/ops/queue', keywords: ['pending', 'review'] },
    { id: 'ops-documents', label: 'Document Review', description: 'Review documents', icon: <FileText className="w-4 h-4" />, path: '/ops/documents', keywords: ['files', 'approve'] },
    { id: 'ops-agencies', label: 'Agencies', description: 'Manage agencies', icon: <Building2 className="w-4 h-4" />, path: '/ops/agencies', keywords: ['organizations'] },
    { id: 'ops-agents', label: 'All Agents', description: 'View all agents', icon: <Users className="w-4 h-4" />, path: '/ops/agents', keywords: ['team', 'members'] },
  ],
};

// Mock data for quick search results
const MOCK_AGENTS = [
  { id: 'agent-1', name: 'John Smith', email: 'john@example.com' },
  { id: 'agent-2', name: 'Sarah Johnson', email: 'sarah@example.com' },
  { id: 'agent-3', name: 'Michael Brown', email: 'michael@example.com' },
];

const MOCK_DOCUMENTS = [
  { id: 'doc-1', name: 'E&O Insurance Policy', type: 'PDF' },
  { id: 'doc-2', name: 'State License - California', type: 'PDF' },
  { id: 'doc-3', name: 'Background Check Authorization', type: 'PDF' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = useCallback((path: string) => {
    setOpen(false);
    navigate(path);
  }, [navigate]);

  const navItems = user ? NAVIGATION_ITEMS[user.role] : [];

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="relative flex items-center gap-2 w-40 md:w-64 px-3 py-2 text-sm text-muted-foreground bg-muted/50 rounded-md hover:bg-muted transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="absolute right-2 hidden md:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type to search pages, agents, documents..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          {/* Navigation */}
          <CommandGroup heading="Pages">
            {navItems.map((item) => (
              <CommandItem
                key={item.id}
                value={`${item.label} ${item.description} ${item.keywords?.join(' ')}`}
                onSelect={() => handleSelect(item.path)}
                className="flex items-center gap-3 cursor-pointer"
              >
                {item.icon}
                <div className="flex flex-col">
                  <span>{item.label}</span>
                  {item.description && (
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          {/* Agents (for agency/ops roles) */}
          {user?.role !== 'agent' && (
            <>
              <CommandGroup heading="Agents">
                {MOCK_AGENTS.map((agent) => (
                  <CommandItem
                    key={agent.id}
                    value={`${agent.name} ${agent.email}`}
                    onSelect={() => handleSelect(`/${user?.role}/agents?search=${encodeURIComponent(agent.name)}`)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Users className="w-4 h-4" />
                    <div className="flex flex-col">
                      <span>{agent.name}</span>
                      <span className="text-xs text-muted-foreground">{agent.email}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* Documents */}
          <CommandGroup heading="Documents">
            {MOCK_DOCUMENTS.map((doc) => (
              <CommandItem
                key={doc.id}
                value={`${doc.name} ${doc.type}`}
                onSelect={() => handleSelect(`/${user?.role}/documents?doc=${encodeURIComponent(doc.name)}`)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <div className="flex flex-col">
                  <span>{doc.name}</span>
                  <span className="text-xs text-muted-foreground">{doc.type}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}