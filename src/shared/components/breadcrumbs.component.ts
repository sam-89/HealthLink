
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="flex text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <a [routerLink]="'/' + rootSegment" class="inline-flex items-center hover:text-foreground transition-colors capitalize">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
            {{ rootName }}
          </a>
        </li>
        @for (crumb of breadcrumbs; track crumb.path) {
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
              <a [routerLink]="crumb.path" class="ml-1 font-medium hover:text-foreground transition-colors md:ml-2 capitalize">
                {{ crumb.label }}
              </a>
            </div>
          </li>
        }
      </ol>
    </nav>
  `
})
export class BreadcrumbsComponent {
  breadcrumbs: { label: string; path: string }[] = [];
  rootSegment: string = 'app';
  rootName: string = 'Home';

  private router = inject(Router);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.generateBreadcrumbs();
    });
    // Initial generation
    this.generateBreadcrumbs();
  }

  private generateBreadcrumbs() {
    const url = this.router.url.split('?')[0]; // Remove query params
    const segments = url.split('/').filter(Boolean);
    
    // Assumption: /app/{role}-dashboard is the root usually
    // We will parse standard structure: /app/segment1/segment2
    
    if (segments.length > 1 && segments[0] === 'app') {
      // Determine root based on role/section if possible, roughly
      const mainSection = segments[1];
      if (mainSection.includes('agent')) {
        this.rootSegment = 'app/agent-dashboard';
        this.rootName = 'Agent Portal';
      } else if (mainSection.includes('agency')) {
        this.rootSegment = 'app/agency-dashboard';
        this.rootName = 'Agency Portal';
      } else if (mainSection.includes('ops')) {
        this.rootSegment = 'app/ops-dashboard';
        this.rootName = 'Ops Portal';
      }

      // Build crumbs for segments after 'app'
      let currentPath = '/app';
      this.breadcrumbs = segments.slice(1).map(segment => {
        currentPath += `/${segment}`;
        return {
          label: segment.replace(/-/g, ' '),
          path: currentPath
        };
      });
    }
  }
}
