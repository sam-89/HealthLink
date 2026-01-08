import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  ClipboardCheck,
  Building2,
  UserCircle,
  LogOut,
  ChevronDown,
  Shield,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { UserRole } from '@/types';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { CommandPalette } from '@/components/shared/CommandPalette';
import { NotificationDropdown } from '@/components/shared/NotificationDropdown';
import { PageTransition } from '@/components/shared/PageTransition';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  agent: [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/agent' },
    { label: 'Services', icon: <Building2 className="w-5 h-5" />, path: '/agent/services' },
    { label: 'Onboarding', icon: <ClipboardCheck className="w-5 h-5" />, path: '/agent/onboarding' },
    { label: 'My Documents', icon: <FileText className="w-5 h-5" />, path: '/agent/documents' },
    { label: 'Profile', icon: <UserCircle className="w-5 h-5" />, path: '/agent/profile' },
  ],
  agency: [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/agency' },
    { label: 'Agents', icon: <Users className="w-5 h-5" />, path: '/agency/agents' },
    { label: 'Document Center', icon: <FileText className="w-5 h-5" />, path: '/agency/documents' },
    { label: 'Compliance', icon: <ClipboardCheck className="w-5 h-5" />, path: '/agency/compliance' },
    { label: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/agency/settings' },
  ],
  ops: [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/ops' },
    { label: 'Verification Queue', icon: <ClipboardCheck className="w-5 h-5" />, path: '/ops/queue' },
    { label: 'Document Review', icon: <FileText className="w-5 h-5" />, path: '/ops/documents' },
    { label: 'Agencies', icon: <Building2 className="w-5 h-5" />, path: '/ops/agencies' },
    { label: 'All Agents', icon: <Users className="w-5 h-5" />, path: '/ops/agents' },
  ],
};

export function MainLayout() {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = user ? NAV_ITEMS[user.role] : [];
  const initials = user?.name.split(' ').map(n => n[0]).join('') || 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = ({ showLabels = true }: { showLabels?: boolean }) => (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
          <Shield className="w-6 h-6 text-white" />
        </div>
        {showLabels && (
          <span className="text-xl font-display font-bold text-sidebar-foreground">
            HealthLink
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              {item.icon}
              {showLabels && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Role Switcher (Demo) */}
      {showLabels && (
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/60 mb-2">Demo: Switch Role</p>
          <div className="flex gap-1">
            {(['agent', 'agency', 'ops'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => {
                  switchRole(role);
                  navigate(`/${role}`);
                }}
                className={cn(
                  'flex-1 px-2 py-1.5 text-xs rounded font-medium transition-colors capitalize',
                  user?.role === role
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80'
                )}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-sidebar border-sidebar-border">
          <div className="flex flex-col h-full">
            <SidebarContent showLabels={true} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 hidden md:flex flex-col bg-sidebar transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        <SidebarContent showLabels={sidebarOpen} />
      </aside>

      {/* Main Content */}
      <div className={cn(
        'flex-1 transition-all duration-300',
        isMobile ? 'ml-0' : (sidebarOpen ? 'md:ml-64' : 'md:ml-20')
      )}>
        {/* Header */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => isMobile ? setMobileMenuOpen(true) : setSidebarOpen(!sidebarOpen)}
              className="text-muted-foreground"
            >
              <Menu className="w-5 h-5" />
            </Button>

            <CommandPalette />
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationDropdown />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate(`/${user?.role}/profile`)}>
                  <UserCircle className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/${user?.role}/settings`)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}