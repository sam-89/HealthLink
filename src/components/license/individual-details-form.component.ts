
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface AliasEntry {
  id: string;
  type: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
}

export interface AddressData {
  lineOne: string;
  lineTwo: string;
  lineThree: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IndividualDetailsData {
  ssn: string;
  npn: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  birthDate: string;
  gender: string;
  citizenCountryCode: string;
  businessEmail: string;
  applicantEmail: string;
  businessWebsite: string;
  finraCrdIdentifier: string;
  aliases: AliasEntry[];
  residenceAddress: AddressData;
  businessAddress: AddressData;
  mailingAddress: AddressData;
  residencePhone: string;
  businessPhone: string;
  businessPhoneExt: string;
  faxNumber: string;
}

@Component({
  selector: 'app-individual-details-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4 p-4">
      <!-- Individual Information -->
      <div class="border border-border rounded-lg overflow-hidden">
        <div class="bg-orange-500 text-white px-4 py-2 text-center font-semibold">
          Individual Information
        </div>
        <p class="text-xs text-muted-foreground text-center italic px-4 py-2 bg-orange-50/50">
          If applying for variable line of authority, the FINRA CRD number is required. The e-mail address entered is where the license application confirmation will be sent.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3 p-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium">SSN <span class="text-destructive">*</span></label>
            <input type="text" [value]="data().ssn" disabled class="h-8 text-sm px-2 border border-input rounded bg-muted text-muted-foreground" />
          </div>
          <div class="flex flex-col gap-1">
             <label class="text-xs font-medium">National Producer Number</label>
             <input type="text" [(ngModel)]="data().npn" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium">First Name <span class="text-destructive">*</span></label>
            <input type="text" [(ngModel)]="data().firstName" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium">Middle Name</label>
            <input type="text" [(ngModel)]="data().middleName" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium">Last Name <span class="text-destructive">*</span></label>
            <input type="text" [(ngModel)]="data().lastName" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium">Suffix</label>
            <select [(ngModel)]="data().suffix" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background">
               <option value="">Select</option>
               @for(s of suffixes; track s) { <option [value]="s">{{s}}</option> }
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium">Birth Date <span class="text-destructive">*</span></label>
            <input type="date" [(ngModel)]="data().birthDate" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium">Gender <span class="text-destructive">*</span></label>
             <select [(ngModel)]="data().gender" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background">
               <option value="">Select</option>
               <option value="male">Male</option>
               <option value="female">Female</option>
               <option value="other">Other</option>
            </select>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-medium">Citizen Country <span class="text-destructive">*</span></label>
            <select [(ngModel)]="data().citizenCountryCode" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background">
               @for(c of countries; track c) { <option [value]="c">{{c}}</option> }
            </select>
          </div>
           <div class="flex flex-col gap-1">
            <label class="text-xs font-medium">Business Email <span class="text-destructive">*</span></label>
            <input type="email" [(ngModel)]="data().businessEmail" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background" />
          </div>
           <div class="flex flex-col gap-1">
            <label class="text-xs font-medium">Applicant Email <span class="text-destructive">*</span></label>
            <input type="email" [(ngModel)]="data().applicantEmail" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background" />
          </div>
           <div class="flex flex-col gap-1">
            <label class="text-xs font-medium">Business Website</label>
            <input type="url" [(ngModel)]="data().businessWebsite" (ngModelChange)="emitChange()" placeholder="https://" class="h-8 text-sm px-2 border border-input rounded bg-background" />
          </div>
          <div class="flex flex-col gap-1">
             <label class="text-xs font-medium">FINRA CRD Identifier</label>
             <input type="text" [(ngModel)]="data().finraCrdIdentifier" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background" />
          </div>
        </div>
      </div>

      <!-- Aliases -->
      <div class="border border-border rounded-lg overflow-hidden">
         <div class="bg-orange-500 text-white px-4 py-2 text-center font-semibold">
          Individual Alias Information (Optional)
        </div>
         <div class="p-4 space-y-4">
            @for(alias of data().aliases; track alias.id; let i = $index) {
               <div class="border border-border rounded-lg p-4 relative bg-muted/20">
                 <button (click)="removeAlias(alias.id)" class="absolute top-2 right-2 text-destructive hover:text-destructive/80">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                 </button>
                 <div class="grid grid-cols-2 gap-4 text-sm">
                   <div class="flex flex-col gap-1">
                     <label class="text-xs">Type</label>
                      <select [(ngModel)]="alias.type" (ngModelChange)="emitChange()" class="h-8 border border-input rounded bg-background">
                         <option value="">Select</option>
                         <option value="alias">Alias</option>
                         <option value="dba">Doing Business As</option>
                         <option value="previously">Previously/Formerly Known As</option>
                      </select>
                   </div>
                    <div class="flex flex-col gap-1">
                     <label class="text-xs">First Name</label>
                     <input type="text" [(ngModel)]="alias.firstName" (ngModelChange)="emitChange()" class="h-8 border border-input rounded bg-background px-2" />
                   </div>
                    <div class="flex flex-col gap-1">
                     <label class="text-xs">Last Name</label>
                     <input type="text" [(ngModel)]="alias.lastName" (ngModelChange)="emitChange()" class="h-8 border border-input rounded bg-background px-2" />
                   </div>
                 </div>
               </div>
            }
            <button (click)="addAlias()" class="w-full py-2 border border-dashed border-border rounded text-sm text-muted-foreground hover:bg-muted/50 flex items-center justify-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
               Add Alias
            </button>
         </div>
      </div>

      <!-- Addresses -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
         <ng-container *ngTemplateOutlet="addressForm; context: { title: 'Residence Address', type: 'residenceAddress', notice: 'Must not contain a PO box.' }"></ng-container>
         <ng-container *ngTemplateOutlet="addressForm; context: { title: 'Business Address', type: 'businessAddress' }"></ng-container>
         <ng-container *ngTemplateOutlet="addressForm; context: { title: 'Mailing Address', type: 'mailingAddress' }"></ng-container>
      </div>

       <!-- Phones -->
       <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div class="border border-border rounded-lg overflow-hidden">
            <div class="bg-orange-500 text-white px-3 py-1.5 text-center font-semibold text-sm">Residence Phone</div>
            <div class="p-3">
               <label class="text-xs font-medium block mb-1">Phone Number <span class="text-destructive">*</span></label>
               <input type="tel" [(ngModel)]="data().residencePhone" (ngModelChange)="emitChange()" class="w-full h-8 text-sm px-2 border border-input rounded bg-background" />
            </div>
         </div>
         <div class="border border-border rounded-lg overflow-hidden">
            <div class="bg-orange-500 text-white px-3 py-1.5 text-center font-semibold text-sm">Business Phone</div>
            <div class="p-3 grid grid-cols-3 gap-2">
               <div class="col-span-2">
                  <label class="text-xs font-medium block mb-1">Phone <span class="text-destructive">*</span></label>
                  <input type="tel" [(ngModel)]="data().businessPhone" (ngModelChange)="emitChange()" class="w-full h-8 text-sm px-2 border border-input rounded bg-background" />
               </div>
               <div>
                  <label class="text-xs font-medium block mb-1">Ext</label>
                  <input type="text" [(ngModel)]="data().businessPhoneExt" (ngModelChange)="emitChange()" class="w-full h-8 text-sm px-2 border border-input rounded bg-background" />
               </div>
            </div>
         </div>
         <div class="border border-border rounded-lg overflow-hidden">
            <div class="bg-orange-500 text-white px-3 py-1.5 text-center font-semibold text-sm">Business Fax</div>
            <div class="p-3">
               <label class="text-xs font-medium block mb-1">Fax Number</label>
               <input type="tel" [(ngModel)]="data().faxNumber" (ngModelChange)="emitChange()" class="w-full h-8 text-sm px-2 border border-input rounded bg-background" />
            </div>
         </div>
       </div>

    </div>

    <!-- Address Template -->
    <ng-template #addressForm let-title="title" let-type="type" let-notice="notice">
      <div class="border border-border rounded-lg overflow-hidden h-full">
         <div class="bg-orange-500 text-white px-3 py-1.5 text-center font-semibold text-sm">{{title}}</div>
         @if(notice) { <p class="text-xs text-muted-foreground text-center italic px-2 py-1 bg-orange-50/50">{{notice}}</p> }
         <div class="p-3 space-y-3">
            <div class="flex flex-col gap-1">
               <label class="text-xs font-medium">Line One <span class="text-destructive">*</span></label>
               <input type="text" [(ngModel)]="data()[type].lineOne" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background" />
            </div>
            <div class="flex flex-col gap-1">
               <label class="text-xs font-medium">Line Two</label>
               <input type="text" [(ngModel)]="data()[type].lineTwo" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background" />
            </div>
            <div class="flex flex-col gap-1">
               <label class="text-xs font-medium">City <span class="text-destructive">*</span></label>
               <input type="text" [(ngModel)]="data()[type].city" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background" />
            </div>
            <div class="grid grid-cols-2 gap-2">
               <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium">State</label>
                  <select [(ngModel)]="data()[type].state" (ngModelChange)="emitChange()" class="h-8 text-sm px-1 border border-input rounded bg-background">
                     <option value="">Select</option>
                     @for(s of usStates; track s) { <option [value]="s">{{s}}</option> }
                  </select>
               </div>
               <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium">Zip <span class="text-destructive">*</span></label>
                  <input type="text" [(ngModel)]="data()[type].postalCode" (ngModelChange)="emitChange()" class="h-8 text-sm px-2 border border-input rounded bg-background" />
               </div>
            </div>
             <div class="flex flex-col gap-1">
                  <label class="text-xs font-medium">Country <span class="text-destructive">*</span></label>
                  <select [(ngModel)]="data()[type].country" (ngModelChange)="emitChange()" class="h-8 text-sm px-1 border border-input rounded bg-background">
                     @for(c of countries; track c) { <option [value]="c">{{c}}</option> }
                  </select>
            </div>
         </div>
      </div>
    </ng-template>
  `
})
export class IndividualDetailsFormComponent {
  data = input.required<IndividualDetailsData>();
  dataChange = output<IndividualDetailsData>();
  selectedState = input<string>('');

  countries = ["United States", "Canada", "Mexico", "United Kingdom", "Germany", "France", "Other"];
  usStates = ["Alabama", "Alaska", "Arizona", "California", "Colorado", "Florida", "Georgia", "New York", "Texas", "Washington"];
  suffixes = ["Jr", "Sr", "I", "II", "III"];

  emitChange() {
    this.dataChange.emit(this.data());
  }

  addAlias() {
     const newAlias: AliasEntry = {
      id: `alias-${Date.now()}`,
      type: "",
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: ""
    };
    const current = this.data();
    current.aliases.push(newAlias);
    this.emitChange();
  }

  removeAlias(id: string) {
    const current = this.data();
    current.aliases = current.aliases.filter(a => a.id !== id);
    this.emitChange();
  }
}
