
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface BackgroundAnswer {
  answer: "yes" | "no" | "";
  explanation: string;
}

export interface BackgroundQuestionsData {
  criminalConviction: BackgroundAnswer;
  pendingCharges: BackgroundAnswer;
  administrativeAction: BackgroundAnswer;
  licenseRevoked: BackgroundAnswer;
  civilJudgment: BackgroundAnswer;
  bankruptcy: BackgroundAnswer;
  enoInsurance: {
    hasInsurance: "yes" | "no" | "";
    carrierName: string;
    policyNumber: string;
    expirationDate: string;
    coverageAmount: string;
  };
}

@Component({
  selector: 'app-background-questions-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-0">
      <div class="bg-gray-900 text-white px-4 py-3 text-center font-semibold rounded-t-lg">
        Background Questions
      </div>

      <div class="bg-amber-50 border-x border-b border-amber-200 p-4 mb-6">
        <div class="flex gap-3">
          <div class="text-sm text-amber-800">
            <p class="font-semibold mb-1">Important Notice</p>
            <p>You must answer all questions truthfully and completely.</p>
          </div>
        </div>
      </div>

      <div class="p-6 space-y-8 border-x border-b border-border rounded-b-lg bg-card">
         @for(q of questions; track q.id; let i = $index) {
            <div class="border border-border rounded-lg p-4 space-y-3 bg-background">
               <div class="flex gap-3">
                  <span class="font-semibold text-primary shrink-0">{{i + 1}}.</span>
                  <div class="space-y-2 flex-1">
                     <p class="font-medium text-foreground text-sm">{{q.question}}</p>
                     <p class="text-xs text-muted-foreground italic">{{q.note}}</p>

                     <div class="flex gap-6 pt-2">
                        <label class="flex items-center gap-2 cursor-pointer">
                           <input type="radio" [name]="q.id" value="yes" 
                                  [ngModel]="getAnswer(q.id)" 
                                  (ngModelChange)="updateAnswer(q.id, 'yes')"
                                  class="text-primary focus:ring-primary" />
                           <span class="text-sm">Yes</span>
                        </label>
                         <label class="flex items-center gap-2 cursor-pointer">
                           <input type="radio" [name]="q.id" value="no" 
                                  [ngModel]="getAnswer(q.id)" 
                                  (ngModelChange)="updateAnswer(q.id, 'no')"
                                  class="text-primary focus:ring-primary" />
                           <span class="text-sm">No</span>
                        </label>
                     </div>

                     @if(getAnswer(q.id) === 'yes') {
                        <div class="pt-2">
                           <label class="text-sm font-medium block mb-1">Please provide a detailed explanation <span class="text-destructive">*</span></label>
                           <textarea 
                              [ngModel]="getExplanation(q.id)"
                              (ngModelChange)="updateExplanation(q.id, $event)"
                              class="w-full min-h-[100px] p-2 text-sm border border-input rounded bg-background"
                              placeholder="Provide details..."
                           ></textarea>
                        </div>
                     }
                  </div>
               </div>
            </div>
         }
      </div>

      <!-- E&O Section -->
      <div class="mt-8 border rounded-lg overflow-hidden">
         <div class="bg-gray-900 text-white px-4 py-3 text-center font-semibold">
           Errors & Omissions (E&O) Insurance Information
         </div>
         <div class="p-6 bg-card space-y-4">
            <div class="space-y-3">
               <label class="font-medium text-sm block">Do you currently have Errors & Omissions insurance coverage?</label>
               <div class="flex gap-6">
                  <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="eno" value="yes"
                         [(ngModel)]="data().enoInsurance.hasInsurance" (ngModelChange)="emitChange()" />
                      <span class="text-sm">Yes</span>
                  </label>
                   <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="eno" value="no"
                         [(ngModel)]="data().enoInsurance.hasInsurance" (ngModelChange)="emitChange()" />
                      <span class="text-sm">No</span>
                  </label>
               </div>
            </div>

            @if(data().enoInsurance.hasInsurance === 'yes') {
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border mt-4">
                  <div class="space-y-1">
                     <label class="text-xs font-medium">Carrier Name <span class="text-destructive">*</span></label>
                     <input type="text" [(ngModel)]="data().enoInsurance.carrierName" (ngModelChange)="emitChange()" class="w-full h-8 text-sm px-2 border border-input rounded bg-background" />
                  </div>
                  <div class="space-y-1">
                     <label class="text-xs font-medium">Policy Number <span class="text-destructive">*</span></label>
                     <input type="text" [(ngModel)]="data().enoInsurance.policyNumber" (ngModelChange)="emitChange()" class="w-full h-8 text-sm px-2 border border-input rounded bg-background" />
                  </div>
                  <div class="space-y-1">
                     <label class="text-xs font-medium">Expiration Date <span class="text-destructive">*</span></label>
                     <input type="date" [(ngModel)]="data().enoInsurance.expirationDate" (ngModelChange)="emitChange()" class="w-full h-8 text-sm px-2 border border-input rounded bg-background" />
                  </div>
                   <div class="space-y-1">
                     <label class="text-xs font-medium">Coverage Amount <span class="text-destructive">*</span></label>
                     <input type="text" [(ngModel)]="data().enoInsurance.coverageAmount" (ngModelChange)="emitChange()" class="w-full h-8 text-sm px-2 border border-input rounded bg-background" placeholder="$1,000,000" />
                  </div>
               </div>
            }
         </div>
      </div>
    </div>
  `
})
export class BackgroundQuestionsFormComponent {
  data = input.required<BackgroundQuestionsData>();
  dataChange = output<BackgroundQuestionsData>();

  questions = [
    { id: "criminalConviction", question: "Have you ever been convicted of a crime?", note: "Exclude minor traffic violations." },
    { id: "pendingCharges", question: "Are there any criminal charges pending against you?", note: "" },
    { id: "administrativeAction", question: "Have you ever had a professional license denied or revoked?", note: "" },
    { id: "licenseRevoked", question: "Have you ever had an insurance license revoked?", note: "" },
    { id: "civilJudgment", question: "Have you had a civil judgment regarding fraud?", note: "" },
    { id: "bankruptcy", question: "Have you filed for bankruptcy in the past 10 years?", note: "" }
  ];

  getAnswer(id: string) {
    const key = id as keyof Omit<BackgroundQuestionsData, 'enoInsurance'>;
    return this.data()[key].answer;
  }

  getExplanation(id: string) {
    const key = id as keyof Omit<BackgroundQuestionsData, 'enoInsurance'>;
    return this.data()[key].explanation;
  }

  updateAnswer(id: string, val: "yes" | "no") {
    const key = id as keyof Omit<BackgroundQuestionsData, 'enoInsurance'>;
    const current = this.data();
    current[key].answer = val;
    if (val === 'no') current[key].explanation = '';
    this.emitChange();
  }

  updateExplanation(id: string, val: string) {
    const key = id as keyof Omit<BackgroundQuestionsData, 'enoInsurance'>;
    const current = this.data();
    current[key].explanation = val;
    this.emitChange();
  }

  emitChange() {
    this.dataChange.emit(this.data());
  }
}
