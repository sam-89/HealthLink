
import { Component, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { StepperComponent, Step } from '../shared/components/stepper.component';
import { FileUploadComponent } from '../shared/components/file-upload.component';
import { VoiceCommandService } from '../core/voice-command.service';
import { ChatbotService } from '../core/chatbot.service';

interface DocUpload {
  name: string;
  required: boolean;
  file?: File;
  status: 'PENDING' | 'UPLOADED' | 'VERIFIED';
}

@Component({
  selector: 'app-agent-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StepperComponent, FileUploadComponent],
  template: `
    <div class="max-w-4xl mx-auto py-6 animate-fade-in">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-display font-bold text-foreground">Agent Onboarding</h1>
        <p class="text-muted-foreground mt-1">Complete all steps to activate your account</p>
      </div>

      <!-- Stepper -->
      <div class="mb-8">
        <app-stepper 
          [steps]="steps" 
          [activeIndex]="currentStep()" 
          (changeStep)="goToStep($event)"
        ></app-stepper>
      </div>

      <!-- Main Content Card -->
      <div class="bg-card rounded-xl shadow-card border border-border overflow-hidden min-h-[500px] flex flex-col">
        
        <div class="flex-1 p-8">
          
          <!-- STEP 1: Profile -->
          @if (currentStep() === 0) {
            <div class="animate-fade-in space-y-6">
              <div>
                <h2 class="text-xl font-bold text-foreground">Profile</h2>
                <p class="text-muted-foreground text-sm">Enter your personal information</p>
              </div>

              <form [formGroup]="profileForm" class="space-y-6">
                <!-- Row 1 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-foreground">First Name</label>
                    <input type="text" formControlName="firstName" class="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-input bg-background text-sm" placeholder="Sarah">
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-foreground">Last Name</label>
                    <input type="text" formControlName="lastName" class="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-input bg-background text-sm" placeholder="Johnson">
                  </div>
                </div>

                <!-- Row 2 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-foreground">Email</label>
                    <input type="email" formControlName="email" class="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-input bg-background text-sm" placeholder="sarah@example.com">
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-foreground">Phone</label>
                    <input type="tel" formControlName="phone" class="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-input bg-background text-sm" placeholder="(555) 123-4567">
                  </div>
                </div>

                 <!-- Row 3 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-foreground">National Producer Number (NPN)</label>
                    <input type="text" formControlName="npn" class="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-input bg-background text-sm" placeholder="12345678">
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-foreground">SSN (Last 4)</label>
                    <input type="text" formControlName="ssn" class="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-input bg-background text-sm" placeholder="••••">
                  </div>
                </div>

                 <!-- Row 4 -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-foreground">Street Address</label>
                  <input type="text" formControlName="streetAddress" class="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-input bg-background text-sm" placeholder="123 Main St">
                </div>

                 <!-- Row 5 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-foreground">City</label>
                    <input type="text" formControlName="city" class="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-input bg-background text-sm" placeholder="Los Angeles">
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-foreground">State</label>
                    <select formControlName="state" class="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-input bg-background text-sm">
                        <option value="">Select</option>
                        <option value="CA">California</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                        <option value="NY">New York</option>
                      </select>
                  </div>
                </div>

              </form>
            </div>
          }

          <!-- STEP 2: Licenses -->
          @if (currentStep() === 1) {
            <div class="animate-fade-in space-y-6">
              <div>
                <h2 class="text-xl font-bold text-foreground">Licenses</h2>
                <p class="text-muted-foreground text-sm">Add your state licenses and lines of authority</p>
              </div>
              
              <form [formGroup]="licenseForm" class="space-y-6">
                  
                  <!-- Row 1: State & Number -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="space-y-2">
                        <label class="block text-sm font-medium text-foreground">Licensed State</label>
                          <select formControlName="state" class="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-input bg-background text-sm">
                            <option value="">Select state</option>
                            <option value="CA">California</option>
                            <option value="TX">Texas</option>
                            <option value="FL">Florida</option>
                            <option value="NY">New York</option>
                          </select>
                      </div>

                      <div class="space-y-2">
                        <label class="block text-sm font-medium text-foreground">License Number</label>
                        <input type="text" formControlName="licenseNumber" class="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-input bg-background text-sm" placeholder="LIC-123456">
                      </div>
                  </div>

                  <!-- Row 2: Expiration -->
                  <div class="md:w-1/2 md:pr-3 space-y-2">
                     <label class="block text-sm font-medium text-foreground">Expiration Date</label>
                     <input type="date" formControlName="expirationDate" class="w-full px-3 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-input bg-background text-sm">
                  </div>

                  <!-- Row 3: Lines of Authority -->
                  <div class="space-y-3">
                    <label class="block text-sm font-medium text-foreground">Lines of Authority</label>
                    <div class="flex flex-wrap gap-3">
                      <!-- Custom Toggle Button Component via Template Logic -->
                      <label class="cursor-pointer select-none group">
                        <input type="checkbox" formControlName="health" class="hidden peer">
                        <div class="px-4 py-2 border border-input rounded-md text-sm font-medium bg-background hover:bg-muted peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary transition-all shadow-sm">
                           Health
                        </div>
                      </label>

                       <label class="cursor-pointer select-none group">
                        <input type="checkbox" formControlName="life" class="hidden peer">
                        <div class="px-4 py-2 border border-input rounded-md text-sm font-medium bg-background hover:bg-muted peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary transition-all shadow-sm">
                           Life
                        </div>
                      </label>

                       <label class="cursor-pointer select-none group">
                        <input type="checkbox" formControlName="variable" class="hidden peer">
                        <div class="px-4 py-2 border border-input rounded-md text-sm font-medium bg-background hover:bg-muted peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary transition-all shadow-sm">
                           Variable
                        </div>
                      </label>

                       <label class="cursor-pointer select-none group">
                        <input type="checkbox" formControlName="property" class="hidden peer">
                        <div class="px-4 py-2 border border-input rounded-md text-sm font-medium bg-background hover:bg-muted peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary transition-all shadow-sm">
                           Property
                        </div>
                      </label>

                       <label class="cursor-pointer select-none group">
                        <input type="checkbox" formControlName="casualty" class="hidden peer">
                        <div class="px-4 py-2 border border-input rounded-md text-sm font-medium bg-background hover:bg-muted peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:border-primary transition-all shadow-sm">
                           Casualty
                        </div>
                      </label>
                    </div>
                  </div>
              </form>
            </div>
          }
          
          <!-- STEP 3: Background -->
          @if (currentStep() === 2) {
             <div class="animate-fade-in space-y-6">
               <div>
                 <h2 class="text-xl font-bold text-foreground">Background</h2>
                 <p class="text-muted-foreground text-sm">Answer background disclosure questions</p>
               </div>
               
               <form [formGroup]="backgroundForm" class="space-y-8">
                  
                  <!-- Question 1 -->
                  <div class="space-y-3 p-4 border border-border rounded-lg bg-card/50">
                    <label class="block text-foreground font-medium text-sm">Have you ever had an insurance license revoked, suspended, or denied?</label>
                    <div class="flex items-center gap-6 pt-1">
                      <label class="flex items-center gap-2 cursor-pointer group">
                         <div class="relative flex items-center justify-center">
                            <input type="radio" formControlName="licenseRevoked" [value]="false" class="peer appearance-none w-4 h-4 border border-input rounded-full checked:border-primary checked:border-4 transition-all">
                         </div>
                         <span class="text-sm text-foreground group-hover:text-primary transition-colors">No</span>
                      </label>
                      <label class="flex items-center gap-2 cursor-pointer group">
                         <div class="relative flex items-center justify-center">
                            <input type="radio" formControlName="licenseRevoked" [value]="true" class="peer appearance-none w-4 h-4 border border-input rounded-full checked:border-primary checked:border-4 transition-all">
                         </div>
                         <span class="text-sm text-foreground group-hover:text-primary transition-colors">Yes</span>
                      </label>
                    </div>
                  </div>

                  <!-- Question 2 -->
                  <div class="space-y-3 p-4 border border-border rounded-lg bg-card/50">
                    <label class="block text-foreground font-medium text-sm">Have you ever been convicted of a felony?</label>
                    <div class="flex items-center gap-6 pt-1">
                      <label class="flex items-center gap-2 cursor-pointer group">
                         <div class="relative flex items-center justify-center">
                            <input type="radio" formControlName="felony" [value]="false" class="peer appearance-none w-4 h-4 border border-input rounded-full checked:border-primary checked:border-4 transition-all">
                         </div>
                         <span class="text-sm text-foreground group-hover:text-primary transition-colors">No</span>
                      </label>
                      <label class="flex items-center gap-2 cursor-pointer group">
                         <div class="relative flex items-center justify-center">
                            <input type="radio" formControlName="felony" [value]="true" class="peer appearance-none w-4 h-4 border border-input rounded-full checked:border-primary checked:border-4 transition-all">
                         </div>
                         <span class="text-sm text-foreground group-hover:text-primary transition-colors">Yes</span>
                      </label>
                    </div>
                  </div>

                  <!-- Question 3 -->
                  <div class="space-y-3 p-4 border border-border rounded-lg bg-card/50">
                    <label class="block text-foreground font-medium text-sm">Have you ever been subject to disciplinary action by any regulatory body?</label>
                    <div class="flex items-center gap-6 pt-1">
                      <label class="flex items-center gap-2 cursor-pointer group">
                         <div class="relative flex items-center justify-center">
                            <input type="radio" formControlName="disciplinaryAction" [value]="false" class="peer appearance-none w-4 h-4 border border-input rounded-full checked:border-primary checked:border-4 transition-all">
                         </div>
                         <span class="text-sm text-foreground group-hover:text-primary transition-colors">No</span>
                      </label>
                      <label class="flex items-center gap-2 cursor-pointer group">
                         <div class="relative flex items-center justify-center">
                            <input type="radio" formControlName="disciplinaryAction" [value]="true" class="peer appearance-none w-4 h-4 border border-input rounded-full checked:border-primary checked:border-4 transition-all">
                         </div>
                         <span class="text-sm text-foreground group-hover:text-primary transition-colors">Yes</span>
                      </label>
                    </div>
                  </div>

                  <!-- Question 4 -->
                  <div class="space-y-3 p-4 border border-border rounded-lg bg-card/50">
                    <label class="block text-foreground font-medium text-sm">Are you currently under investigation by any regulatory authority?</label>
                    <div class="flex items-center gap-6 pt-1">
                      <label class="flex items-center gap-2 cursor-pointer group">
                         <div class="relative flex items-center justify-center">
                            <input type="radio" formControlName="investigation" [value]="false" class="peer appearance-none w-4 h-4 border border-input rounded-full checked:border-primary checked:border-4 transition-all">
                         </div>
                         <span class="text-sm text-foreground group-hover:text-primary transition-colors">No</span>
                      </label>
                      <label class="flex items-center gap-2 cursor-pointer group">
                         <div class="relative flex items-center justify-center">
                            <input type="radio" formControlName="investigation" [value]="true" class="peer appearance-none w-4 h-4 border border-input rounded-full checked:border-primary checked:border-4 transition-all">
                         </div>
                         <span class="text-sm text-foreground group-hover:text-primary transition-colors">Yes</span>
                      </label>
                    </div>
                  </div>

               </form>
             </div>
          }

          <!-- STEP 4: Documents -->
          @if (currentStep() === 3) {
             <div class="animate-fade-in space-y-6">
                <div>
                  <h2 class="text-xl font-bold text-foreground">Documents</h2>
                  <p class="text-muted-foreground text-sm">Upload required proofs</p>
                </div>
                
                <div class="space-y-4">
                  @for (doc of documents(); track doc.name; let i = $index) {
                     <div class="border border-border rounded-lg p-4 flex items-center justify-between bg-card hover:border-primary/50 transition-colors">
                        <div class="flex items-center gap-4">
                          <div class="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
                             [class.bg-success/15]="doc.status === 'UPLOADED'"
                             [class.text-success]="doc.status === 'UPLOADED'"
                             [class.bg-muted]="doc.status === 'PENDING'"
                             [class.text-muted-foreground]="doc.status === 'PENDING'"
                          >
                             <!-- Icons -->
                             @if (doc.status === 'UPLOADED') {
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                             } @else {
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                             }
                          </div>
                          <div>
                            <p class="font-medium text-foreground text-sm">{{ doc.name }}</p>
                            <p class="text-xs text-muted-foreground">
                              @if (doc.status === 'UPLOADED') {
                                {{ doc.file?.name }}
                              } @else {
                                Required
                              }
                            </p>
                          </div>
                        </div>
                        @if (doc.status === 'PENDING') {
                           <button (click)="triggerUpload(i)" class="px-3 py-1.5 text-xs bg-background border border-input text-foreground font-medium rounded hover:bg-muted transition-colors shadow-sm">Upload</button>
                        } @else {
                           <button (click)="removeFile(i)" class="text-xs text-destructive hover:underline">Remove</button>
                        }
                     </div>
                  }
                  <div class="mt-6">
                     <app-file-upload (fileDropped)="handleGlobalDrop($event)"></app-file-upload>
                  </div>
                </div>
             </div>
          }
          
        </div>

        <!-- Actions Footer -->
        <div class="px-8 py-5 bg-muted/30 border-t border-border flex justify-between items-center rounded-b-xl">
           <button 
            (click)="prev()" 
            class="px-4 py-2 border border-input bg-background rounded-lg text-foreground font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm shadow-sm"
            [disabled]="currentStep() === 0"
          >
            Back
          </button>
          
          @if (currentStep() < steps.length - 1) {
            <button 
              (click)="next()" 
              class="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 shadow-sm transition-colors text-sm"
            >
              Continue
            </button>
          } @else {
            <button 
              (click)="submit()" 
              class="px-4 py-2 bg-success text-success-foreground rounded-lg font-medium hover:bg-success/90 shadow-sm transition-colors text-sm"
            >
              Submit Application
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  `]
})
export class AgentWizardComponent {
  currentStep = signal(0);
  
  steps: Step[] = [
    { label: 'Profile', icon: 'user' },
    { label: 'Licenses', icon: 'badge' },
    { label: 'Background', icon: 'shield' },
    { label: 'Documents', icon: 'doc' }
  ];

  private fb: FormBuilder = inject(FormBuilder);
  voiceService = inject(VoiceCommandService);
  chatbot = inject(ChatbotService);

  private greetedSteps = new Set<number>();

  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    npn: ['', Validators.required],
    ssn: ['', [Validators.required, Validators.minLength(4)]],
    streetAddress: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required]
  });

  licenseForm = this.fb.group({
    state: ['', Validators.required],
    licenseNumber: ['', Validators.required],
    expirationDate: ['', Validators.required],
    health: [false],
    life: [false],
    variable: [false],
    property: [false],
    casualty: [false]
  });

  backgroundForm = this.fb.group({
    licenseRevoked: [null, Validators.required],
    felony: [null, Validators.required],
    disciplinaryAction: [null, Validators.required],
    investigation: [null, Validators.required]
  });

  documents = signal<DocUpload[]>([
    { name: 'Driver License', required: true, status: 'PENDING' },
    { name: 'E&O Certificate', required: true, status: 'PENDING' },
    { name: 'Anti-Money Laundering Cert', required: true, status: 'PENDING' }
  ]);

  constructor() {
    effect(() => {
      const command = this.voiceService.command();
      if (!command || (Date.now() - command.timestamp > 1000)) return; 

      if (command.action === 'NEXT_STEP') {
        this.next();
      } else if (command.action === 'PREV_STEP') {
        this.prev();
      } else if (command.action === 'FILL_FORM' && command.data) {
        this.profileForm.patchValue(command.data);
        this.licenseForm.patchValue(command.data);
      }
    });

    effect(() => {
      const step = this.currentStep();
      if (!this.greetedSteps.has(step)) {
        this.greetedSteps.add(step);
        this.proactiveAssist(step);
      }
    });
  }

  proactiveAssist(step: number) {
     this.chatbot.open();
     setTimeout(() => {
        switch(step) {
          case 0: 
            this.chatbot.addBotMessage("Welcome! I've opened the profile form. You can say 'Fill my profile' to use your saved data, or just dictate the fields.");
            break;
          case 1:
            this.chatbot.addBotMessage("For licenses, you can upload a photo of your license later, or tell me your license number now.");
            break;
          case 2:
            this.chatbot.addBotMessage("Please answer these background questions carefully. Disclosing history now prevents delays later.");
            break;
          case 3:
            this.chatbot.addBotMessage("Almost done! Drag and drop your documents here, or use the app on your phone to take photos.");
            break;
        }
     }, 500);
  }

  triggerUpload(index: number) {
    alert('Please use the drag and drop zone below for this demo.');
  }

  handleGlobalDrop(file: File) {
    this.documents.update(docs => {
      const idx = docs.findIndex(d => d.status === 'PENDING');
      if (idx !== -1) {
        docs[idx] = { ...docs[idx], status: 'UPLOADED', file: file };
      }
      return [...docs];
    });
  }

  removeFile(index: number) {
    this.documents.update(docs => {
      docs[index] = { ...docs[index], status: 'PENDING', file: undefined };
      return [...docs];
    });
  }

  goToStep(index: number) {
    if (index <= this.currentStep() + 1) {
        this.currentStep.set(index);
    }
  }

  next() {
    const curr = this.currentStep();
    this.currentStep.set(curr + 1);
  }

  prev() {
    this.currentStep.update(v => v - 1);
  }

  submit() {
    alert('Application Submitted Successfully!');
  }
}
