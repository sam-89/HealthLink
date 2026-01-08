
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-agent-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Header -->
      <div class="bg-primary/10 -mx-4 -mt-4 md:-mx-6 md:-mt-6 px-4 py-6 md:px-6 md:py-8 rounded-b-lg">
        <h1 class="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
           <span [innerHTML]="getIcon(icons.globe, 'w-7 h-7 text-primary')"></span>
           Our Services
        </h1>
        <p class="text-muted-foreground mt-1">
          Access licensing, education, and state services all in one place
        </p>
      </div>

      <!-- Services Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        @for (category of serviceCategories; track category.id) {
          <div class="bg-card rounded-lg shadow-card border border-border overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div class="pb-3 bg-muted/30 border-b border-border p-4">
              <h3 class="flex items-center justify-between text-base font-semibold uppercase tracking-wide text-foreground">
                <span>{{ category.title }}</span>
                <span class="text-muted-foreground" [innerHTML]="getIcon(category.icon, 'w-5 h-5')"></span>
              </h3>
            </div>
            <div class="p-0">
              <div class="divide-y divide-border">
                @for (service of category.services; track service.id) {
                  <button
                    (click)="navigateTo(service.path)"
                    class="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left group"
                  >
                    <div class="flex items-center gap-3">
                      <span class="text-primary" [innerHTML]="getIcon(service.icon, 'w-4 h-4')"></span>
                      <span class="text-sm font-medium text-primary group-hover:underline">
                        {{ service.title }}
                      </span>
                    </div>
                    <div class="flex items-center gap-1 text-xs text-muted-foreground">
                      <span class="hidden sm:inline">Learn More</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class AgentServicesComponent {
  router = inject(Router);
  sanitizer = inject(DomSanitizer);

  getIcon(svgContent: string, classes: string): SafeHtml {
    // Inject class into SVG string for basic styling
    const styledSvg = svgContent.replace('<svg', `<svg class="${classes}"`);
    return this.sanitizer.bypassSecurityTrustHtml(styledSvg);
  }

  navigateTo(path: string) {
    // Navigate if route exists, otherwise log (since some sub-routes might be placeholders in this demo)
    this.router.navigate([path]).catch(err => console.log('Route not found yet:', path));
  }

  // Icons library (SVG strings)
  icons = {
    globe: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
    fileText: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>',
    creditCard: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>',
    refreshCw: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>',
    printer: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>',
    award: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>', 
    contact: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>',
    userPen: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>',
    phone: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>',
    mail: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>',
    home: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>',
    mapPin: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
    building: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>',
    graduationCap: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" /></svg>',
    bookOpen: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>',
    search: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>',
    calendar: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>',
    hash: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>',
    checkCircle: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
  };

  serviceCategories = [
    {
      id: 'licensing',
      title: 'Licensing',
      icon: this.icons.fileText,
      services: [
        { 
          id: 'apply-license', 
          title: 'Apply for a License or Line of Authority', 
          icon: this.icons.creditCard,
          path: '/app/agent-services/licensing/apply'
        },
        { 
          id: 'renew-license', 
          title: 'Renew or Reinstate a License', 
          icon: this.icons.refreshCw,
          path: '/app/agent-services/licensing/renew'
        },
        { 
          id: 'print-license', 
          title: 'Print a License', 
          icon: this.icons.printer,
          path: '/app/agent-documents'
        },
        { 
          id: 'certification-letter', 
          title: 'Request a Letter of Certification', 
          icon: this.icons.award,
          path: '/app/agent-services/licensing/certification'
        },
      ]
    },
    {
      id: 'contact-info',
      title: 'Update Contact Information',
      icon: this.icons.contact,
      services: [
        { 
          id: 'change-name', 
          title: 'Change My Name with the State', 
          icon: this.icons.userPen,
          path: '/app/agent-profile'
        },
        { 
          id: 'change-contact', 
          title: 'Change My Contact Information with the State', 
          icon: this.icons.phone,
          path: '/app/agent-profile'
        },
        { 
          id: 'change-email', 
          title: 'Change My Email Address with the State', 
          icon: this.icons.mail,
          path: '/app/agent-profile'
        },
        { 
          id: 'change-address', 
          title: 'Change Non-Insurance Address with the State', 
          icon: this.icons.home,
          path: '/app/agent-profile'
        },
      ]
    },
    {
      id: 'state-services',
      title: 'State Specific Services',
      icon: this.icons.mapPin,
      services: [
        { 
          id: 'ca-business-entity', 
          title: 'California - Request a Business Entity Name', 
          icon: this.icons.building,
          path: '/app/agent-services/state/ca-entity'
        },
        { 
          id: 'pay-invoice', 
          title: 'Pay State Invoice', 
          icon: this.icons.creditCard,
          path: '/app/agent-services/state/pay-invoice'
        },
      ]
    },
    {
      id: 'education',
      title: 'Education',
      icon: this.icons.graduationCap,
      services: [
        { 
          id: 'ce-transcript', 
          title: 'My Continuing Education (CE) Transcript', 
          icon: this.icons.bookOpen,
          path: '/app/agent-services/education/ce-transcript'
        },
        { 
          id: 'pe-transcript', 
          title: 'My Pre-Licensing Education (PE) Transcript', 
          icon: this.icons.bookOpen,
          path: '/app/agent-services/education/pe-transcript'
        },
        { 
          id: 'search-courses', 
          title: 'Search Approved Courses', 
          icon: this.icons.search,
          path: '/app/agent-services/education/courses'
        },
        { 
          id: 'search-providers', 
          title: 'Search Approved Education Providers', 
          icon: this.icons.building,
          path: '/app/agent-services/education/providers'
        },
        { 
          id: 'course-offerings', 
          title: 'Search Course Offerings', 
          icon: this.icons.calendar,
          path: '/app/agent-services/education/offerings'
        },
      ]
    },
    {
      id: 'lookup',
      title: 'Look Up Other Information',
      icon: this.icons.search,
      services: [
        { 
          id: 'lookup-license', 
          title: 'Look up My License Number', 
          icon: this.icons.hash,
          path: '/app/agent-services/lookup/license'
        },
        { 
          id: 'lookup-npn', 
          title: 'Look up My NPN Number', 
          icon: this.icons.hash,
          path: '/app/agent-services/lookup/npn'
        },
        { 
          id: 'check-status', 
          title: 'Check My Status with a State', 
          icon: this.icons.checkCircle,
          path: '/app/agent-services/lookup/status'
        },
      ]
    },
  ];
}
