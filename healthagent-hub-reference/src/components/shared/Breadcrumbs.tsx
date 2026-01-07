import { useLocation, Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Route label mapping
const ROUTE_LABELS: Record<string, string> = {
  // Agent routes
  agent: 'Dashboard',
  onboarding: 'Onboarding',
  documents: 'Documents',
  profile: 'Profile',
  // Agency routes
  agency: 'Dashboard',
  agents: 'Agents',
  compliance: 'Compliance',
  settings: 'Settings',
  // Ops routes
  ops: 'Dashboard',
  queue: 'Verification Queue',
  agencies: 'Agencies',
  review: 'Document Review',
};

// Portal name mapping
const PORTAL_NAMES: Record<string, string> = {
  agent: 'Agent Portal',
  agency: 'Agency Portal',
  ops: 'Ops Portal',
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Don't show breadcrumbs on root portal pages (dashboards)
  if (pathSegments.length <= 1) {
    return null;
  }

  const portal = pathSegments[0];
  const portalName = PORTAL_NAMES[portal] || portal;

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {/* Home/Portal link */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={`/${portal}`} className="flex items-center gap-1.5 hover:text-foreground">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">{portalName}</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Build remaining breadcrumbs */}
        {pathSegments.slice(1).map((segment, index) => {
          const isLast = index === pathSegments.length - 2;
          const path = `/${pathSegments.slice(0, index + 2).join('/')}`;
          const label = ROUTE_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

          return (
            <BreadcrumbItem key={path}>
              <BreadcrumbSeparator />
              {isLast ? (
                <BreadcrumbPage>{label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={path} className="hover:text-foreground">
                    {label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
