
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-apply-license',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in max-w-4xl mx-auto py-6">
      <!-- Exit Link -->
      <button (click)="goBack()" class="flex items-center gap-2 text-primary hover:underline font-medium text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Exit
      </button>

      <!-- Info Alert -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
         <p class="text-sm text-blue-900">
           If you have recently submitted an address change request to your resident state, please allow 5 to 7 business days for processing before submitting a new or updated license application.
         </p>
      </div>

      <div class="text-right">
        <button class="text-primary hover:underline text-sm font-medium">Renew an Existing License</button>
      </div>

      <div class="space-y-4">
        <!-- New Insurance Licenses -->
        <div class="border border-border rounded-lg overflow-hidden bg-card">
           <div class="bg-gray-900 text-white px-4 py-3 font-semibold text-sm uppercase">New Insurance Licenses</div>
           <div class="p-4">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
                 <p class="text-sm text-muted-foreground">
                   Start an application for a <span class="font-semibold text-foreground">new license</span> or <span class="font-semibold text-foreground">add new lines of authority</span> to an existing license.
                 </p>
                 <button 
                   (click)="insuranceExpanded = !insuranceExpanded"
                   class="px-4 py-2 border border-orange-500 text-orange-500 hover:bg-orange-50 rounded-md text-sm font-medium transition-colors shrink-0 w-48"
                 >
                   New Insurance License
                 </button>
              </div>

              @if (insuranceExpanded) {
                <div class="animate-fade-in border-t border-border pt-4 mt-2">
                   <div class="grid grid-cols-[1fr_120px_120px] gap-4 items-center py-2">
                      <label class="text-sm text-muted-foreground">Is this a Resident or Non-Resident license?</label>
                      <div class="flex items-center gap-2">
                         <input type="radio" name="residency" id="resident" value="resident" [(ngModel)]="residencyType" class="text-primary focus:ring-primary" />
                         <label for="resident" class="text-sm font-medium cursor-pointer">Resident</label>
                      </div>
                      <div class="flex items-center gap-2">
                         <input type="radio" name="residency" id="non-resident" value="non-resident" [(ngModel)]="residencyType" class="text-primary focus:ring-primary" />
                         <label for="non-resident" class="text-sm font-medium cursor-pointer">Non-Resident</label>
                      </div>
                   </div>

                   <div class="grid grid-cols-[1fr_120px_120px] gap-4 items-center py-2 border-t border-dashed border-border mt-2 pt-4">
                      <label class="text-sm text-muted-foreground">Are you an individual or a firm?</label>
                      <div class="flex items-center gap-2">
                         <input type="radio" name="entity" id="individual" value="individual" [(ngModel)]="entityType" class="text-primary focus:ring-primary" />
                         <label for="individual" class="text-sm font-medium cursor-pointer">Individual</label>
                      </div>
                      <div class="flex items-center gap-2">
                         <input type="radio" name="entity" id="firm" value="firm" [(ngModel)]="entityType" class="text-primary focus:ring-primary" />
                         <label for="firm" class="text-sm font-medium cursor-pointer">Firm</label>
                      </div>
                   </div>

                   <div class="flex justify-end gap-4 pt-6">
                      <button (click)="insuranceExpanded = false" class="text-orange-500 hover:underline text-sm font-medium">Cancel</button>
                      <button 
                        (click)="handleContinue()"
                        [disabled]="!residencyType || !entityType"
                        class="px-6 py-2 bg-gray-400 text-white rounded-md text-sm font-medium hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Continue
                      </button>
                   </div>
                </div>
              }
           </div>
        </div>

        <!-- Adjuster Licenses Placeholder -->
        <div class="border border-border rounded-lg overflow-hidden bg-card">
           <div class="bg-gray-900 text-white px-4 py-3 font-semibold text-sm uppercase">New Adjuster Licenses</div>
           <div class="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p class="text-sm text-muted-foreground">Start an application for a <span class="font-semibold text-foreground">new adjuster license</span> or <span class="font-semibold text-foreground">add new lines of authority</span> to an existing license.</p>
              <button class="px-4 py-2 border border-orange-500 text-orange-500 hover:bg-orange-50 rounded-md text-sm font-medium transition-colors shrink-0 w-48">
                 New Adjuster License
              </button>
           </div>
        </div>
        
         <!-- Other Licenses Placeholder -->
        <div class="border border-border rounded-lg overflow-hidden bg-card">
           <div class="bg-gray-900 text-white px-4 py-3 font-semibold text-sm uppercase">Other Insurance & Non-Insurance Licenses</div>
           <div class="p-4 space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p class="text-sm text-muted-foreground">Don't see your license type above? Start an application for other licenses not included above, such as certain insurance-related licenses or licenses for other industries <span class="font-semibold text-foreground">(e.g., Fire, Abstracters, Athlete Agents, etc.)</span></p>
                <button class="px-4 py-2 border border-orange-500 text-orange-500 hover:bg-orange-50 rounded-md text-sm font-medium transition-colors shrink-0 w-48">
                  Other Licenses
                </button>
              </div>
              <p class="text-xs text-muted-foreground italic text-right">You'll be able to select a license type on following screens</p>
           </div>
        </div>

      </div>
    </div>
  `
})
export class ApplyLicenseComponent {
  router = inject(Router);
  
  insuranceExpanded = false;
  residencyType = '';
  entityType = '';

  goBack() {
    this.router.navigate(['/app/agent-services']);
  }

  handleContinue() {
    if (this.residencyType && this.entityType) {
      this.router.navigate(['/app/agent-services/licensing/new-insurance'], {
        queryParams: { residency: this.residencyType, entity: this.entityType }
      });
    }
  }
}
