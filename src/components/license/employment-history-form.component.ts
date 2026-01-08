
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface EmploymentEntry {
  id: string;
  currentEmployment: boolean;
  employmentType: string;
  beginningDate: string;
  endingDate: string;
  employerName: string;
  city: string;
  state: string;
  province: string;
  country: string;
  positionDescription: string;
}

export interface AffiliationEntry {
  id: string;
  agencyName: string;
  agencyEin: string;
}

export interface EmploymentHistoryData {
  employmentEntries: EmploymentEntry[];
  affiliationEntries: AffiliationEntry[];
}

@Component({
  selector: 'app-employment-history-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
       <!-- Employment History -->
       <div class="border border-border rounded-lg overflow-hidden">
          <div class="bg-gray-900 text-white px-4 py-2 text-center font-semibold">
            Employment History Information
          </div>
          <div class="p-4 space-y-6">
             <div class="text-center text-sm text-muted-foreground space-y-1 bg-muted/20 p-2 rounded">
                <p class="font-medium">Please enter information into the sections below (at least one is required).</p>
                <p>Account for all time for the past five years. Give all employment experience starting with your current employer working back five years.</p>
             </div>

             @for (entry of data().employmentEntries; track entry.id; let i = $index) {
                <div class="space-y-4 pb-6 border-b border-border last:border-0">
                   <div class="flex items-center justify-between">
                      <h4 class="text-sm font-semibold text-foreground">Entry {{i + 1}}</h4>
                      <div class="flex items-center gap-2">
                        <label class="text-sm font-medium">Current Employment</label>
                        <input type="checkbox" [(ngModel)]="entry.currentEmployment" (ngModelChange)="emitChange()" class="h-4 w-4 rounded border-input" />
                      </div>
                   </div>

                   <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div class="flex flex-col gap-1">
                         <label class="text-xs font-medium">Employment Type</label>
                         <select [(ngModel)]="entry.employmentType" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background">
                            <option value="">Select</option>
                            <option value="full-time">Full-Time</option>
                            <option value="part-time">Part-Time</option>
                            <option value="unemployed">Unemployed</option>
                            <option value="student">Student</option>
                         </select>
                      </div>
                      <div class="flex flex-col gap-1">
                         <label class="text-xs font-medium">Begin Date <span class="text-destructive">*</span></label>
                         <input type="month" [(ngModel)]="entry.beginningDate" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background" />
                      </div>
                      <div class="flex flex-col gap-1">
                         <label class="text-xs font-medium">End Date <span class="text-destructive">*</span></label>
                         <input type="month" [(ngModel)]="entry.endingDate" [disabled]="entry.currentEmployment" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background disabled:opacity-50" />
                      </div>
                      <div class="flex flex-col gap-1 md:col-span-2">
                         <label class="text-xs font-medium">Employer Name <span class="text-destructive">*</span></label>
                         <input type="text" [(ngModel)]="entry.employerName" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background" />
                      </div>
                       <div class="flex flex-col gap-1">
                         <label class="text-xs font-medium">City <span class="text-destructive">*</span></label>
                         <input type="text" [(ngModel)]="entry.city" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background" />
                      </div>
                       <div class="flex flex-col gap-1">
                         <label class="text-xs font-medium">Country <span class="text-destructive">*</span></label>
                         <select [(ngModel)]="entry.country" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background">
                            <option value="United States">United States</option>
                            <option value="Other">Other</option>
                         </select>
                      </div>
                       <div class="flex flex-col gap-1 md:col-span-2">
                         <label class="text-xs font-medium">Position Description <span class="text-destructive">*</span></label>
                         <input type="text" [(ngModel)]="entry.positionDescription" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background" />
                      </div>
                   </div>
                </div>
             }
             
             <div class="flex justify-center pt-2">
                <button (click)="addEmployment()" class="px-4 py-2 border border-dashed border-input rounded-md text-sm text-muted-foreground hover:bg-muted transition-colors flex items-center gap-2">
                   <span>+</span> Add Employment History
                </button>
             </div>
          </div>
       </div>

       <!-- Affiliation -->
       <div class="border border-border rounded-lg overflow-hidden">
          <div class="bg-gray-900 text-white px-4 py-2 text-center font-semibold">
            Affiliation Information (Optional)
          </div>
          <div class="p-4 space-y-4">
             @for (entry of data().affiliationEntries; track entry.id) {
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-border last:border-0">
                    <div class="flex flex-col gap-1">
                       <label class="text-xs font-medium">Agency Name</label>
                       <input type="text" [(ngModel)]="entry.agencyName" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background" />
                    </div>
                     <div class="flex flex-col gap-1">
                       <label class="text-xs font-medium">Agency EIN</label>
                       <input type="text" [(ngModel)]="entry.agencyEin" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background" />
                    </div>
                </div>
             }
          </div>
       </div>
    </div>
  `
})
export class EmploymentHistoryFormComponent {
  data = input.required<EmploymentHistoryData>();
  dataChange = output<EmploymentHistoryData>();

  emitChange() {
    this.dataChange.emit(this.data());
  }

  addEmployment() {
    const newEntry: EmploymentEntry = {
      id: crypto.randomUUID(),
      currentEmployment: false,
      employmentType: "",
      beginningDate: "",
      endingDate: "",
      employerName: "",
      city: "",
      state: "",
      province: "",
      country: "United States",
      positionDescription: ""
    };
    const current = this.data();
    current.employmentEntries.push(newEntry);
    this.emitChange();
  }
}
