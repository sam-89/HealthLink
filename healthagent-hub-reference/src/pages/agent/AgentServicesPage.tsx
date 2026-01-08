import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  GraduationCap, 
  Contact, 
  MapPin, 
  Search,
  ChevronRight,
  CreditCard,
  RefreshCw,
  Printer,
  Award,
  UserPen,
  Mail,
  Phone,
  Home,
  BookOpen,
  Building,
  Calendar,
  Hash,
  Globe,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

interface ServiceCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  services: ServiceItem[];
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'licensing',
    title: 'Licensing',
    icon: <FileText className="w-5 h-5" />,
    services: [
      { 
        id: 'apply-license', 
        title: 'Apply for a License or Line of Authority', 
        description: 'Submit new license applications or add lines of authority',
        icon: <CreditCard className="w-4 h-4" />,
        path: '/agent/services/licensing/apply'
      },
      { 
        id: 'renew-license', 
        title: 'Renew or Reinstate a License', 
        description: 'Renew expiring licenses or reinstate lapsed ones',
        icon: <RefreshCw className="w-4 h-4" />,
        path: '/agent/services/licensing/renew'
      },
      { 
        id: 'print-license', 
        title: 'Print a License', 
        description: 'Download and print official license certificates',
        icon: <Printer className="w-4 h-4" />,
        path: '/agent/services/licensing/print'
      },
      { 
        id: 'certification-letter', 
        title: 'Request a Letter of Certification', 
        description: 'Get official certification letters for your licenses',
        icon: <Award className="w-4 h-4" />,
        path: '/agent/services/licensing/certification'
      },
    ]
  },
  {
    id: 'contact-info',
    title: 'Update Contact Information',
    icon: <Contact className="w-5 h-5" />,
    services: [
      { 
        id: 'change-name', 
        title: 'Change My Name with the State', 
        description: 'Update your legal name on state records',
        icon: <UserPen className="w-4 h-4" />,
        path: '/agent/services/contact/name'
      },
      { 
        id: 'change-contact', 
        title: 'Change My Contact Information with the State', 
        description: 'Update phone, fax, and other contact details',
        icon: <Phone className="w-4 h-4" />,
        path: '/agent/services/contact/info'
      },
      { 
        id: 'change-email', 
        title: 'Change My Email Address with the State', 
        description: 'Update your email address on file',
        icon: <Mail className="w-4 h-4" />,
        path: '/agent/services/contact/email'
      },
      { 
        id: 'change-address', 
        title: 'Change Non-Insurance Address with the State', 
        description: 'Update your residential or mailing address',
        icon: <Home className="w-4 h-4" />,
        path: '/agent/services/contact/address'
      },
    ]
  },
  {
    id: 'state-services',
    title: 'State Specific Services',
    icon: <MapPin className="w-5 h-5" />,
    services: [
      { 
        id: 'ca-business-entity', 
        title: 'California - Request a Business Entity Name', 
        description: 'Apply for a California business entity name',
        icon: <Building className="w-4 h-4" />,
        path: '/agent/services/state/ca-entity'
      },
      { 
        id: 'pay-invoice', 
        title: 'Pay State Invoice', 
        description: 'Pay outstanding state licensing fees and invoices',
        icon: <CreditCard className="w-4 h-4" />,
        path: '/agent/services/state/pay-invoice'
      },
    ]
  },
  {
    id: 'education',
    title: 'Education',
    icon: <GraduationCap className="w-5 h-5" />,
    services: [
      { 
        id: 'ce-transcript', 
        title: 'My Continuing Education (CE) Transcript', 
        description: 'View and download your CE credit history',
        icon: <BookOpen className="w-4 h-4" />,
        path: '/agent/services/education/ce-transcript'
      },
      { 
        id: 'pe-transcript', 
        title: 'My Pre-Licensing Education (PE) Transcript', 
        description: 'View and download your pre-licensing education records',
        icon: <BookOpen className="w-4 h-4" />,
        path: '/agent/services/education/pe-transcript'
      },
      { 
        id: 'search-courses', 
        title: 'Search Approved Courses', 
        description: 'Find state-approved continuing education courses',
        icon: <Search className="w-4 h-4" />,
        path: '/agent/services/education/courses'
      },
      { 
        id: 'search-providers', 
        title: 'Search Approved Education Providers', 
        description: 'Find approved CE/PE course providers',
        icon: <Building className="w-4 h-4" />,
        path: '/agent/services/education/providers'
      },
      { 
        id: 'course-offerings', 
        title: 'Search Course Offerings', 
        description: 'Browse upcoming courses and schedules',
        icon: <Calendar className="w-4 h-4" />,
        path: '/agent/services/education/offerings'
      },
    ]
  },
  {
    id: 'lookup',
    title: 'Look Up Other Information',
    icon: <Search className="w-5 h-5" />,
    services: [
      { 
        id: 'lookup-license', 
        title: 'Look up My License Number', 
        description: 'Find your license numbers across states',
        icon: <Hash className="w-4 h-4" />,
        path: '/agent/services/lookup/license'
      },
      { 
        id: 'lookup-npn', 
        title: 'Look up My NPN Number', 
        description: 'Find your National Producer Number',
        icon: <Hash className="w-4 h-4" />,
        path: '/agent/services/lookup/npn'
      },
      { 
        id: 'check-status', 
        title: 'Check My Status with a State', 
        description: 'View your licensing status in any state',
        icon: <CheckCircle className="w-4 h-4" />,
        path: '/agent/services/lookup/status'
      },
    ]
  },
];

function ServiceCategorySkeleton() {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-5 rounded" />
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}

export function AgentServicesPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <ServiceCategorySkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-primary/10 -mx-4 -mt-4 md:-mx-6 md:-mt-6 px-4 py-6 md:px-6 md:py-8 rounded-b-lg">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <Globe className="w-7 h-7 text-primary" />
          Our Services
        </h1>
        <p className="text-muted-foreground mt-1">
          Access licensing, education, and state services all in one place
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {SERVICE_CATEGORIES.map((category) => (
          <Card key={category.id} className="shadow-card">
            <CardHeader className="pb-3 bg-muted/30 rounded-t-lg border-b">
              <CardTitle className="flex items-center justify-between text-base font-semibold uppercase tracking-wide text-foreground">
                <span>{category.title}</span>
                <span className="text-muted-foreground">{category.icon}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {category.services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => navigate(service.path)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent/50 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-primary">{service.icon}</span>
                      <span className="text-sm font-medium text-primary group-hover:underline">
                        {service.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span className="hidden sm:inline">Learn More</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}