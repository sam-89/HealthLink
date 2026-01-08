
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IndividualDetailsFormComponent, IndividualDetailsData } from '../components/license/individual-details-form.component';
import { EmploymentHistoryFormComponent, EmploymentHistoryData } from '../components/license/employment-history-form.component';
import { BackgroundQuestionsFormComponent, BackgroundQuestionsData } from '../components/license/background-questions-form.component';

@Component({
  selector: 'app-new-insurance-license',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IndividualDetailsFormComponent,
    EmploymentHistoryFormComponent,
    BackgroundQuestionsFormComponent
  ],
  template: `
    <div class="max-w-5xl mx-auto py-6 animate-fade-in space-y-6 pb-20 px-4 sm:px-6">
       
       <!-- Navigation Header -->
       <div class="flex items-center justify-between mb-6">
          <button (click)="prevStep()" class="flex items-center gap-2 text-primary hover:underline font-medium text-sm">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             {{ getBackButtonLabel() }}
          </button>
          <div class="flex items-center gap-2">
             <span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">
               {{ residency | titlecase }} • {{ entity | titlecase }} Application
             </span>
          </div>
       </div>

       <!-- Progress Bar -->
       @if(currentStep() > 0) {
         <div class="flex justify-center items-center gap-2 mb-8">
            @for (step of [1, 2, 3]; track step) {
               <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300"
                     [class.bg-primary]="getDisplayStep() === step"
                     [class.text-primary-foreground]="getDisplayStep() === step"
                     [class.bg-green-500]="getDisplayStep() > step"
                     [class.text-white]="getDisplayStep() > step"
                     [class.bg-muted]="getDisplayStep() < step"
                     [class.text-muted-foreground]="getDisplayStep() < step"
                  >
                     @if(getDisplayStep() > step) {
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                     } @else {
                        {{ step }}
                     }
                  </div>
                  @if (step < 3) {
                     <div class="w-12 h-1 mx-2 rounded bg-muted">
                        <div class="h-full bg-green-500 rounded transition-all duration-300" [style.width.%]="getDisplayStep() > step ? 100 : 0"></div>
                     </div>
                  }
               </div>
            }
         </div>
       }

       <!-- STEP 0: Non-Resident State Selection -->
       @if (currentStep() === 0 && residency === 'non-resident') {
          <div class="bg-card border border-border rounded-lg shadow-sm p-6 space-y-6 animate-fade-in">
             <div class="grid grid-cols-1 sm:grid-cols-[140px_1fr_auto_auto] gap-4 items-center">
                <label class="text-right font-medium text-sm">Resident State</label>
                <select [(ngModel)]="basicInfo.residentState" (change)="nextStep()" class="w-full h-10 px-3 border border-input rounded-md bg-background">
                  <option value="">Select a state</option>
                  @for(state of states; track state) { <option [value]="state">{{state}}</option> }
                </select>
                <span class="text-sm text-destructive font-medium">* Required</span>
                <button class="text-primary hover:underline text-sm whitespace-nowrap">I do not have a resident license</button>
             </div>
          </div>
       }

       <!-- STEP 1: Basic Info & State Selection -->
       @if (currentStep() === 1) {
          <div class="bg-white border border-border rounded-lg shadow-sm p-8 space-y-8 animate-fade-in">
             
             <!-- Resident Individual Fields -->
             @if (entity === 'individual' && residency === 'resident') {
               <div class="max-w-3xl mx-auto space-y-5">
                 <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr_100px] gap-4 items-center">
                    <label class="text-right font-medium text-sm text-gray-700">Last Name</label>
                    <input type="text" [(ngModel)]="basicInfo.lastName" class="w-full h-10 px-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                    <span class="text-sm text-destructive font-medium">* Required</span>
                 </div>

                 <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr_100px] gap-4 items-center">
                    <label class="text-right font-medium text-sm text-gray-700">SSN</label>
                    <div class="relative">
                       <input [type]="showSsn ? 'text' : 'password'" [(ngModel)]="basicInfo.ssn" class="w-full h-10 px-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="XXX-XX-XXXX" />
                       <button (click)="showSsn = !showSsn" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             @if(showSsn) {
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                             } @else {
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                             }
                          </svg>
                       </button>
                    </div>
                    <span class="text-sm text-destructive font-medium">* Required</span>
                 </div>

                 <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr_100px] gap-4 items-center">
                    <label class="text-right font-medium text-sm text-gray-700">Confirm SSN</label>
                    <div class="relative">
                       <input [type]="showConfirmSsn ? 'text' : 'password'" [(ngModel)]="basicInfo.confirmSsn" class="w-full h-10 px-3 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="XXX-XX-XXXX" />
                       <button (click)="showConfirmSsn = !showConfirmSsn" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                           <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             @if(showConfirmSsn) {
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                             } @else {
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                             }
                          </svg>
                       </button>
                    </div>
                    <span class="text-sm text-destructive font-medium">* Required</span>
                 </div>

                 <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr_100px] gap-4 items-center">
                    <label class="text-right font-medium text-sm text-gray-700">Preparer</label>
                    <div class="flex items-center gap-6">
                       <label class="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="preparer" value="applicant" [(ngModel)]="preparer" class="text-primary focus:ring-primary border-gray-300" />
                          <span class="text-sm text-gray-700">Applicant</span>
                       </label>
                       <label class="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="preparer" value="authorized" [(ngModel)]="preparer" class="text-primary focus:ring-primary border-gray-300" />
                          <span class="text-sm text-gray-700">Authorized Submitter</span>
                       </label>
                    </div>
                    <span class="text-sm text-destructive font-medium">* Required</span>
                 </div>
               </div>

               <div class="text-center text-orange-600 italic text-sm font-medium py-2">
                 A paper copy of each requested license application will be generated at the end of the process regardless of submission method(s).
               </div>
             } 
             
             <!-- States Selection (Electronic) -->
             <div class="border rounded-lg overflow-hidden border-gray-900">
                <div class="bg-gray-900 text-white px-4 py-3 text-center font-semibold text-sm">
                   States Accepting Electronic License Applications
                </div>
                <div class="p-6 bg-white">
                   <p class="text-center text-sm text-muted-foreground mb-6">
                     Click on a state name to view the license types available for each submission method.
                   </p>
                   
                   @if (residency === 'resident') {
                     <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        @for(state of STATES_ELECTRONIC; track state) {
                          <div class="flex items-center space-x-2">
                             <input type="radio" name="selectedState" [value]="state" [(ngModel)]="basicInfo.selectedState" class="text-orange-600 focus:ring-orange-500 border-gray-300 shrink-0" />
                             <span 
                               class="text-sm truncate cursor-pointer hover:text-primary hover:underline"
                               [class.text-primary]="basicInfo.selectedState === state"
                               [class.font-medium]="basicInfo.selectedState === state"
                               (click)="openStatePopup(state)"
                             >
                               {{state}}
                             </span>
                          </div>
                        }
                     </div>
                   } @else {
                      <!-- Non-Resident Multi-Select Logic Here if needed, referencing provided code for structure -->
                   }
                </div>
             </div>

             <!-- States Selection (Paper) -->
             <div class="border rounded-lg overflow-hidden border-gray-900">
                <div class="bg-gray-900 text-white px-4 py-3 text-center font-semibold text-sm">
                   States Accepting Paper License Applications
                </div>
                <div class="p-6 bg-white">
                   <p class="text-center text-sm text-muted-foreground italic">
                     There are currently no states accepting paper license applications.
                   </p>
                </div>
             </div>
             
             <!-- Payment Method -->
             <div class="border rounded-lg overflow-hidden border-gray-900">
                <div class="bg-gray-900 text-white px-4 py-3 text-center font-semibold text-sm">Payment Method</div>
                <div class="p-6 bg-white space-y-4">
                   <label class="flex items-start gap-3 cursor-pointer">
                      <input type="radio" name="payment" value="credit-card" [(ngModel)]="paymentMethod" class="mt-1 text-primary focus:ring-primary border-gray-300" />
                      <div>
                         <span class="block font-medium text-sm text-gray-900">Credit Card / Electronic Check Submission</span>
                         <span class="block text-xs text-muted-foreground italic mt-0.5">** We accept VISA, MASTERCARD, AMERICAN EXPRESS, DISCOVER and electronic checks. **</span>
                      </div>
                   </label>
                   
                   <label class="flex items-start gap-3 cursor-pointer">
                      <input type="radio" name="payment" value="sircon-carrier" [(ngModel)]="paymentMethod" class="mt-1 text-primary focus:ring-primary border-gray-300" />
                      <div>
                         <span class="block font-medium text-sm text-gray-900">For insurance licensees only: I am actively working with a Sircon insurance carrier, agency or partner who is responsible for all or part of the transaction fee.</span>
                         <span class="block text-xs text-muted-foreground italic mt-0.5">** We accept VISA, MASTERCARD, AMERICAN EXPRESS, DISCOVER and electronic checks. **</span>
                      </div>
                   </label>

                   <label class="flex items-start gap-3 cursor-pointer">
                      <input type="radio" name="payment" value="sircon-partner" [(ngModel)]="paymentMethod" class="mt-1 text-primary focus:ring-primary border-gray-300" />
                      <div>
                         <span class="block font-medium text-sm text-gray-900">For insurance licensees only: I am actively working with a Sircon insurance carrier, agency or partner to obtain licensure.</span>
                      </div>
                   </label>
                </div>
             </div>
             
             <!-- Footer Notice -->
             <div class="bg-gray-100 border border-gray-200 p-4 rounded-md flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-xs text-gray-600 italic">
                  If you are an insurance licensee, the information on the following pages may include information provided from the National Insurance Producer Registry's Producer Database and may contain information subject to the Fair Credit Reporting Act.
                </p>
             </div>

             <div class="flex justify-center gap-4 pt-4 border-t border-border">
                <button (click)="goBack()" class="px-6 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button (click)="nextStep()" [disabled]="!isStep1Valid()" class="px-8 py-2 bg-orange-300 text-white rounded-md text-sm font-medium hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Continue</button>
             </div>
          </div>
       }
       
       <!-- Popup Modal for State License Types -->
       @if (viewingState()) {
         <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" (click)="viewingState.set(null)"></div>
            <div class="relative w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
               <div class="bg-[#111827] text-white p-6 text-center">
                  <h3 class="text-lg font-medium leading-relaxed">
                     {{ viewingState() }}: License Types accepted through<br/>Electronic submission
                  </h3>
               </div>
               <div class="p-8 flex flex-col items-center">
                  <div class="w-full max-w-[320px] border border-black">
                     <div class="border-b border-black px-4 py-2 bg-white text-black font-bold text-sm text-center">
                        License Type
                     </div>
                     <div class="divide-y divide-black/20">
                        @for (type of getLicenseTypesForState(viewingState()!); track type) {
                           <div class="px-4 py-1.5 text-center text-sm text-black hover:bg-gray-50 border-b border-black last:border-0">
                              {{ type }}
                           </div>
                        }
                     </div>
                  </div>
                  
                  <div class="flex flex-col sm:flex-row gap-4 mt-8 w-full justify-center">
                      <button 
                         (click)="selectStateFromPopup()"
                         class="px-6 py-2 border-2 border-orange-500 text-black hover:bg-orange-50 rounded-lg text-sm font-medium transition-colors"
                      >
                         Select This State
                      </button>
                      <button 
                         (click)="viewingState.set(null)"
                         class="px-6 py-2 border border-gray-300 text-black hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                      >
                         Close This Window
                      </button>
                  </div>
               </div>
            </div>
         </div>
       }

       <!-- STEP 1.5: License Info (Resident Individual Only) -->
       @if (currentStep() === 1.5) {
          <div class="bg-card border border-border rounded-lg shadow-sm p-0 space-y-0 animate-fade-in overflow-hidden">
             <!-- Notice -->
             <div class="border-b p-4 bg-white">
                <p class="text-sm">
                   Not all license types are available in all states. If the license type that you seek is not listed, please contact the state directly and do not apply at this time. State contact information can be found here: 
                   <button class="text-primary hover:underline">State Information Center</button>
                </p>
             </div>

             <div class="bg-orange-500 text-white px-4 py-2 font-semibold text-center">License Information</div>
             
             <div class="p-6 space-y-6 bg-white">
                <div class="flex gap-4 items-center">
                   <label class="w-40 text-right font-semibold text-sm">State</label>
                   <span class="text-sm">{{ basicInfo.selectedState }}</span>
                </div>
                
                <div class="flex gap-4 items-start">
                   <label class="w-40 text-right font-semibold text-sm pt-1">License Type</label>
                   <div class="space-y-2">
                      @for(type of licenseTypes; track type) {
                         <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="licenseType" [value]="type" [(ngModel)]="selectedLicenseType" class="text-primary focus:ring-primary border-gray-300" />
                            <span class="text-sm">{{type}}</span>
                         </label>
                      }
                   </div>
                </div>

                <div class="flex gap-4 items-center">
                   <label class="w-40 text-right font-semibold text-sm">Previously licensed?</label>
                   <div class="flex gap-4">
                      <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="prevLic" value="yes" class="text-primary focus:ring-primary border-gray-300"> <span class="text-sm">Yes</span></label>
                      <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="prevLic" value="no" class="text-primary focus:ring-primary border-gray-300"> <span class="text-sm">No</span></label>
                   </div>
                </div>
             </div>

             <div class="flex justify-center gap-2 p-4 border-t border-border bg-gray-50">
                <button (click)="goBack()" class="px-4 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button (click)="prevStep()" class="px-4 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">Back</button>
                <button (click)="nextStep()" [disabled]="!selectedLicenseType" class="px-6 py-2 bg-gray-400 text-white rounded-md text-sm font-medium hover:bg-gray-500 disabled:opacity-50 transition-colors">Continue</button>
             </div>
          </div>
       }
       
       <!-- STEP 1.75: Qualification (Resident Individual Only) -->
       @if (currentStep() === 1.75) {
          <div class="bg-card border border-border rounded-lg shadow-sm p-0 space-y-0 animate-fade-in overflow-hidden">
              <div class="border-b p-4 bg-white">
                <p class="text-sm text-center italic">
                   Lines of authority that are currently held by the licensee in the resident state will appear below, but they will not be selectable.
                </p>
             </div>

             <div class="bg-orange-500 text-white px-4 py-2 font-semibold text-center">Qualification Information for State of {{ basicInfo.selectedState }}: {{ selectedLicenseType }}</div>
             
             <div class="text-center py-2 bg-white">
                <button class="text-primary hover:underline text-sm">View State Requirements ↗</button>
             </div>

             <div class="px-4 py-2 text-center text-sm space-y-2 bg-white">
                <p class="italic">Adjuster license applications may NOT be submitted online through this producer license application.</p>
             </div>

             <div class="p-6 space-y-6 bg-white">
                <div class="text-center space-y-2">
                   <h3 class="text-lg font-semibold">Qualification Code</h3>
                   <p class="text-sm text-muted-foreground">* At least one qualification must be selected.</p>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mt-4">
                   @for(code of qualificationCodes; track code) {
                      <label class="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                         <input type="checkbox" [value]="code" (change)="toggleQualification(code)" [checked]="selectedQualifications.includes(code)" class="text-primary focus:ring-primary border-gray-300" />
                         <span class="text-sm">{{code}}</span>
                      </label>
                   }
                </div>
             </div>

             <div class="flex justify-center gap-2 p-4 border-t border-border bg-gray-50">
                <button (click)="goBack()" class="px-4 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button (click)="prevStep()" class="px-4 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">Back</button>
                <button (click)="nextStep()" [disabled]="selectedQualifications.length === 0" class="px-6 py-2 bg-gray-400 text-white rounded-md text-sm font-medium hover:bg-gray-500 disabled:opacity-50 transition-colors">Continue</button>
             </div>
          </div>
       }

       <!-- STEP 2: Individual Details (Resident Individual Only) -->
       @if (currentStep() === 2) {
          <div class="bg-card border border-border rounded-lg shadow-sm overflow-hidden animate-fade-in bg-white">
             <app-individual-details-form 
                [data]="individualDetails" 
                (dataChange)="individualDetails = $event" 
                [selectedState]="basicInfo.selectedState"
             ></app-individual-details-form>
             
             <div class="flex justify-center gap-2 p-4 border-t border-border bg-gray-50">
                <button (click)="goBack()" class="px-4 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button (click)="prevStep()" class="px-4 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">Back</button>
                <button (click)="nextStep()" class="px-6 py-2 bg-gray-500 text-white rounded-md text-sm font-medium hover:bg-gray-600 transition-colors">Continue</button>
             </div>
          </div>
       }

       <!-- STEP 2.25: Employment -->
       @if (currentStep() === 2.25) {
          <div class="bg-card border border-border rounded-lg shadow-sm overflow-hidden animate-fade-in bg-white">
             <div class="p-6">
               <app-employment-history-form
                  [data]="employmentHistory"
                  (dataChange)="employmentHistory = $event"
               ></app-employment-history-form>
             </div>
             <div class="flex justify-center gap-2 p-4 border-t border-border bg-gray-50">
                <button (click)="goBack()" class="px-4 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button (click)="prevStep()" class="px-4 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">Back</button>
                <button (click)="nextStep()" class="px-6 py-2 bg-gray-500 text-white rounded-md text-sm font-medium hover:bg-gray-600 transition-colors">Continue</button>
             </div>
          </div>
       }

       <!-- STEP 2.375: Background -->
       @if (currentStep() === 2.375) {
          <div class="bg-card border border-border rounded-lg shadow-sm overflow-hidden animate-fade-in bg-white">
             <app-background-questions-form
                [data]="backgroundQuestions"
                (dataChange)="backgroundQuestions = $event"
             ></app-background-questions-form>
             <div class="flex justify-center gap-2 p-4 border-t border-border bg-gray-50">
                <button (click)="goBack()" class="px-4 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button (click)="prevStep()" class="px-4 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">Back</button>
                <button (click)="nextStep()" class="px-6 py-2 bg-gray-500 text-white rounded-md text-sm font-medium hover:bg-gray-600 transition-colors">Continue</button>
             </div>
          </div>
       }

       <!-- STEP 3: Review -->
       @if (currentStep() === 3) {
          <div class="bg-white border border-border rounded-lg shadow-sm p-6 space-y-6 animate-fade-in">
             <div class="text-center space-y-2 border-b pb-6">
                <h2 class="text-2xl font-bold text-foreground">Review & Submit Application</h2>
                <p class="text-muted-foreground">Please review your application details before submitting.</p>
             </div>

             <div class="bg-muted/30 p-6 rounded-lg space-y-4 text-sm">
                <div class="grid gap-3">
                    <div class="flex justify-between border-b border-gray-200 pb-2">
                       <span class="text-muted-foreground">Residency Type:</span>
                       <span class="font-medium capitalize">{{residency}}</span>
                    </div>
                    <div class="flex justify-between border-b border-gray-200 pb-2">
                       <span class="text-muted-foreground">Entity Type:</span>
                       <span class="font-medium capitalize">{{entity}}</span>
                    </div>
                     @if (entity === 'individual') {
                       <div class="flex justify-between border-b border-gray-200 pb-2">
                          <span class="text-muted-foreground">Applicant Name:</span>
                          <span class="font-medium">{{ residency === 'resident' ? individualDetails.firstName + ' ' + individualDetails.lastName : basicInfo.lastName }}</span>
                       </div>
                       <div class="flex justify-between border-b border-gray-200 pb-2">
                          <span class="text-muted-foreground">SSN:</span>
                          <span class="font-medium">***-**-{{ (residency === 'resident' ? individualDetails.ssn : basicInfo.ssn).slice(-4) }}</span>
                       </div>
                    }
                    <div class="flex justify-between border-b border-gray-200 pb-2">
                       <span class="text-muted-foreground">State(s):</span>
                       <span class="font-medium">{{ residency === 'non-resident' ? selectedStates.join(', ') : basicInfo.selectedState }}</span>
                    </div>
                    <div class="flex justify-between border-b border-gray-200 pb-2">
                       <span class="text-muted-foreground">License Type:</span>
                       <span class="font-medium">{{selectedLicenseType}}</span>
                    </div>
                    <div class="flex justify-between items-start">
                       <span class="text-muted-foreground">Lines of Authority:</span>
                       <div class="text-right flex flex-wrap gap-1 justify-end max-w-[60%]">
                          @for(qual of selectedQualifications; track qual) {
                             <span class="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium border border-gray-200">{{qual}}</span>
                          }
                       </div>
                    </div>
                </div>
             </div>
             
             <div class="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded text-sm flex gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>
                 <p>By submitting this application, you certify that all information provided is accurate and complete. False statements may result in denial or revocation of your license.</p>
             </div>

             <div class="flex justify-center gap-4 pt-6 border-t">
                <button (click)="prevStep()" class="px-6 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">Back</button>
                <button (click)="submit()" class="px-8 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 shadow-sm transition-colors">
                   Submit Application
                </button>
             </div>
          </div>
       }

    </div>
  `
})
export class NewInsuranceLicenseComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);

  residency = 'resident';
  entity = 'individual';
  currentStep = signal(1);

  // Form Data
  basicInfo = {
    lastName: '',
    ssn: '',
    confirmSsn: '',
    residentState: '',
    selectedState: ''
  };
  
  preparer = '';
  paymentMethod = 'credit-card';
  
  // Show/Hide flags
  showSsn = false;
  showConfirmSsn = false;
  
  selectedLicenseType = '';
  selectedLines: string[] = [];
  selectedStates: string[] = [];
  selectedQualifications: string[] = [];
  
  // State Viewing for Modal
  viewingState = signal<string | null>(null);

  // Complex Data Objects
  individualDetails: IndividualDetailsData = {
    ssn: '', npn: '', firstName: '', middleName: '', lastName: '', suffix: '', birthDate: '',
    gender: '', citizenCountryCode: 'United States', businessEmail: '', applicantEmail: '',
    businessWebsite: '', finraCrdIdentifier: '', aliases: [],
    residenceAddress: { lineOne: '', lineTwo: '', lineThree: '', city: '', state: '', postalCode: '', country: 'United States' },
    businessAddress: { lineOne: '', lineTwo: '', lineThree: '', city: '', state: '', postalCode: '', country: 'United States' },
    mailingAddress: { lineOne: '', lineTwo: '', lineThree: '', city: '', state: '', postalCode: '', country: 'United States' },
    residencePhone: '', businessPhone: '', businessPhoneExt: '', faxNumber: ''
  };

  employmentHistory: EmploymentHistoryData = {
    employmentEntries: [],
    affiliationEntries: []
  };

  backgroundQuestions: BackgroundQuestionsData = {
    criminalConviction: { answer: '', explanation: '' },
    pendingCharges: { answer: '', explanation: '' },
    administrativeAction: { answer: '', explanation: '' },
    licenseRevoked: { answer: '', explanation: '' },
    civilJudgment: { answer: '', explanation: '' },
    bankruptcy: { answer: '', explanation: '' },
    enoInsurance: { hasInsurance: '', carrierName: '', policyNumber: '', expirationDate: '', coverageAmount: '' }
  };

  // Constants
  STATES_ELECTRONIC = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
    "Delaware", "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana",
    "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York",
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Puerto Rico", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas",
    "U.S. Virgin Islands", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
    "Wisconsin", "Wyoming"
  ];
  
  STATE_LICENSE_TYPES: Record<string, string[]> = {
     "Alabama": ["Adjuster", "Insurance Producer", "Portable Electronics Ins Large", "Portable Electronics Ins Small", "Surplus Line Broker", "Temporary Producer"],
     "California": ["Life-Only Agent", "Accident & Health Agent", "Fire & Casualty Broker-Agent", "Surplus Line Broker", "Personal Lines Broker-Agent"],
     "Colorado": ["Insurance Producer", "Surplus Line Broker", "Public Adjuster"],
     "New York": ["Life Agent", "Accident & Health Agent", "Property & Casualty Broker", "Excess Line Broker", "Public Adjuster"],
     "Texas": ["Life Agent", "Health Agent", "General Lines Agent", "Surplus Lines Agent", "Public Adjuster"],
     "Florida": ["Life Agent", "Health Agent", "General Lines Agent", "Surplus Lines Agent", "Public Adjuster", "Title Agent"],
     // Default for others
     "default": ["Insurance Producer", "Surplus Line Broker", "Adjuster"]
  };
  
  getLicenseTypesForState(state: string): string[] {
      return this.STATE_LICENSE_TYPES[state] || this.STATE_LICENSE_TYPES['default'];
  }
  
  licenseTypes = ["Insurance Producer", "Adjuster", "Surplus Line Broker"];
  linesOfAuthority = ["Life", "Accident & Health", "Property", "Casualty", "Variable Life", "Personal Lines"];
  qualificationCodes = ["Car Rental", "Credit", "Crop", "Travel", "Casualty", "Property", "Personal Lines"];
  
  get states() { return this.STATES_ELECTRONIC; }

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.residency = params['residency'] || 'resident';
      this.entity = params['entity'] || 'individual';
      
      // If non-resident, start at step 0 to select resident state
      if (this.residency === 'non-resident') {
        this.currentStep.set(0);
      }
    });
  }
  
  openStatePopup(state: string) {
      this.viewingState.set(state);
  }

  selectStateFromPopup() {
      const state = this.viewingState();
      if (state) {
          this.basicInfo.selectedState = state;
          this.viewingState.set(null);
      }
  }

  isStep1Valid() {
    if (this.residency === 'non-resident') {
       return this.basicInfo.lastName && this.basicInfo.ssn && this.selectedStates.length > 0;
    }
    // Resident Individual validation
    return this.basicInfo.lastName && 
           this.basicInfo.ssn && 
           this.basicInfo.confirmSsn && 
           this.basicInfo.ssn === this.basicInfo.confirmSsn &&
           this.preparer && 
           this.basicInfo.selectedState;
  }

  toggleLine(line: string) {
    if (this.selectedLines.includes(line)) {
      this.selectedLines = this.selectedLines.filter(l => l !== line);
    } else {
      this.selectedLines.push(line);
    }
  }

  toggleState(state: string) {
    if (this.selectedStates.includes(state)) {
      this.selectedStates = this.selectedStates.filter(s => s !== state);
    } else {
      this.selectedStates.push(state);
    }
  }
  
  toggleQualification(code: string) {
    if (this.selectedQualifications.includes(code)) {
      this.selectedQualifications = this.selectedQualifications.filter(c => c !== code);
    } else {
      this.selectedQualifications.push(code);
    }
  }

  // Visual helper for progress bar mapping
  getDisplayStep() {
    const s = this.currentStep();
    if (s === 1 || s === 1.5 || s === 1.75) return 1;
    if (s === 2 || s === 2.25 || s === 2.375 || s === 2.5) return 2;
    return 3;
  }
  
  getBackButtonLabel() {
     const s = this.currentStep();
     if (s === 0) return 'Exit';
     if (s === 1 && this.residency === 'non-resident') return 'Back'; // Back to step 0
     if (s === 1) return 'Exit';
     return 'Back';
  }

  nextStep() {
    const curr = this.currentStep();
    
    // Logic for Resident Individual Flow
    if (this.residency === 'resident' && this.entity === 'individual') {
      if (curr === 1) {
         // Sync basic info
         this.individualDetails.firstName = 'Sarah'; // Mock
         this.individualDetails.lastName = this.basicInfo.lastName;
         this.individualDetails.ssn = this.basicInfo.ssn;
         this.currentStep.set(1.5);
      }
      else if (curr === 1.5) this.currentStep.set(1.75);
      else if (curr === 1.75) this.currentStep.set(2);
      else if (curr === 2) this.currentStep.set(2.25);
      else if (curr === 2.25) this.currentStep.set(2.375);
      else if (curr === 2.375) this.currentStep.set(3); // Skip straight to Review for demo
    } else {
       // Simplified/Non-Resident Flow
       if (curr === 0) this.currentStep.set(1);
       else if (curr === 1) this.currentStep.set(2.5); // Skip intermediary steps for non-resident
       else if (curr === 2.5) this.currentStep.set(3);
    }
  }

  prevStep() {
    const curr = this.currentStep();
    
     if (this.residency === 'resident' && this.entity === 'individual') {
      if (curr === 3) this.currentStep.set(2.375);
      else if (curr === 2.375) this.currentStep.set(2.25);
      else if (curr === 2.25) this.currentStep.set(2);
      else if (curr === 2) this.currentStep.set(1.75);
      else if (curr === 1.75) this.currentStep.set(1.5);
      else if (curr === 1.5) this.currentStep.set(1);
      else if (curr === 1) this.goBack();
    } else {
       // Simplified/Non-Resident Flow
       if (curr === 3) this.currentStep.set(1);
       else if (curr === 2.5) this.currentStep.set(1);
       else if (curr === 1 && this.residency === 'non-resident') this.currentStep.set(0);
       else if (curr === 1) this.goBack();
       else if (curr === 0) this.goBack();
    }
  }

  goBack() {
    this.router.navigate(['/app/agent-services/licensing/apply']);
  }

  submit() {
    alert('Application Submitted Successfully!');
    this.router.navigate(['/app/agent-dashboard']);
  }
}
