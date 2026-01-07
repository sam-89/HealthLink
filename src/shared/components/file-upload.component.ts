
import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  template: `
    <div 
      class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
      (click)="fileInput.click()"
      [class.border-blue-500]="isDragging()"
      [class.bg-blue-50]="isDragging()"
    >
      <input 
        #fileInput 
        type="file" 
        class="hidden" 
        (change)="onFileSelected($event)"
      >
      
      <div class="flex flex-col items-center justify-center space-y-3">
        <div class="p-3 bg-blue-100 rounded-full text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div class="text-sm text-gray-600">
          <span class="font-semibold text-blue-600">Click to upload</span> or drag and drop
        </div>
        <p class="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
      </div>
    </div>
  `
})
export class FileUploadComponent {
  fileDropped = output<File>();
  isDragging = signal(false);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.fileDropped.emit(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileDropped.emit(input.files[0]);
    }
  }
}
