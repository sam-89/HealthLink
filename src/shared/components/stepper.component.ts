
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Step {
  label: string;
  icon: string; // 'user', 'badge', 'shield', 'doc'
}

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-hide">
      @for (step of steps(); track $index; let last = $last) {
        <div 
          class="flex items-center cursor-pointer select-none"
          (click)="onStepClick($index)"
        >
          <!-- Step Pill -->
          <div 
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            [class.bg-blue-600]="$index === activeIndex()"
            [class.text-white]="$index === activeIndex()"
            [class.text-gray-500]="$index !== activeIndex()"
            [class.hover:text-blue-600]="$index !== activeIndex()"
            [class.hover:bg-blue-50]="$index !== activeIndex()"
          >
            <!-- Icon Switcher -->
            @switch (step.icon) {
              @case ('user') {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              @case ('badge') {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              @case ('shield') {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              @case ('doc') {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              }
            }
            <span>{{ step.label }}</span>
          </div>

          <!-- Separator -->
          @if (!last) {
            <div class="px-2 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
  `]
})
export class StepperComponent {
  steps = input.required<Step[]>();
  activeIndex = input.required<number>();
  changeStep = output<number>();

  onStepClick(index: number) {
    // Logic to prevent skipping ahead is usually handled by parent state, 
    // but emitting here allows the parent to decide.
    this.changeStep.emit(index);
  }
}
