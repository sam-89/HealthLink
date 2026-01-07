
import { Component, signal, ViewChild, ElementRef, inject, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatbotService } from '../../core/chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating Toggle Button -->
    <button
      (click)="chatService.toggle()"
      class="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all transform hover:scale-105 z-50 focus:outline-none focus:ring-4 focus:ring-blue-300"
      [class.rotate-90]="chatService.isOpen()"
    >
      @if (!chatService.isOpen()) {
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      } @else {
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      }
    </button>

    <!-- Chat Window -->
    @if (chatService.isOpen()) {
      <div class="fixed bottom-24 right-6 w-96 h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-100 animate-slide-up">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between text-white shadow-md">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-lg tracking-tight">Onboarding AI</h3>
              <p class="text-xs text-blue-100 font-medium flex items-center gap-1">
                <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Gemini Live
              </p>
            </div>
          </div>
          <button (click)="chatService.toggle()" class="text-white/80 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <!-- Messages Area -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" #scrollContainer>
          @for (msg of chatService.messages(); track msg.id) {
            <div class="flex w-full animate-fade-in" [class.justify-end]="msg.sender === 'user'">
              <div 
                class="max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed"
                [class.bg-blue-600]="msg.sender === 'user'"
                [class.text-white]="msg.sender === 'user'"
                [class.rounded-br-none]="msg.sender === 'user'"
                [class.bg-white]="msg.sender === 'bot'"
                [class.text-gray-900]="msg.sender === 'bot'"
                [class.rounded-bl-none]="msg.sender === 'bot'"
                [class.border]="msg.sender === 'bot'"
                [class.border-gray-200]="msg.sender === 'bot'"
              >
                {{ msg.text }}
              </div>
            </div>
          }
          
          @if (chatService.isTyping()) {
            <div class="flex w-full animate-fade-in">
              <div class="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5 w-16 h-12">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          }
        </div>

        <!-- Input Area -->
        <div class="p-4 bg-white border-t border-gray-100 relative">
           <!-- Voice Mode Visualization Overlay -->
           @if (isListening()) {
             <div class="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center z-10 animate-fade-in rounded-b-2xl">
                <div class="flex items-center gap-1.5 h-12 mb-4">
                  <div class="w-1.5 bg-red-500 rounded-full animate-sound-wave h-4"></div>
                  <div class="w-1.5 bg-red-500 rounded-full animate-sound-wave h-8 delay-75"></div>
                  <div class="w-1.5 bg-red-500 rounded-full animate-sound-wave h-6 delay-150"></div>
                  <div class="w-1.5 bg-red-500 rounded-full animate-sound-wave h-10 delay-100"></div>
                  <div class="w-1.5 bg-red-500 rounded-full animate-sound-wave h-5 delay-200"></div>
                </div>
                <p class="text-base font-semibold text-gray-800 mb-1">Listening...</p>
                <p class="text-xs text-gray-500 mb-3">Speak now. I'll auto-send when you pause.</p>
                <button (click)="stopListening()" class="px-6 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-full text-sm font-medium transition-colors">
                  Stop Manually
                </button>
             </div>
           }

          <div class="flex items-end gap-2">
            <button 
              (click)="startListening()"
              class="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors group relative"
              title="Speak"
            >
              <div class="absolute inset-0 bg-blue-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-200"></div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            
            <textarea 
              rows="1"
              [(ngModel)]="userInput"
              (keydown.enter)="$event.preventDefault(); sendMessage()"
              placeholder="Type or speak..." 
              class="flex-1 border border-gray-200 bg-white rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none custom-scrollbar max-h-32 text-gray-900 placeholder-gray-500"
            ></textarea>
            
            <button 
              (click)="sendMessage()"
              [disabled]="!userInput.trim()"
              class="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .animate-slide-up {
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out;
    }
    @keyframes soundWave {
      0%, 100% { transform: scaleY(0.4); }
      50% { transform: scaleY(1.2); }
    }
    .animate-sound-wave {
      animation: soundWave 0.8s infinite ease-in-out;
    }
    .delay-75 { animation-delay: 75ms; }
    .delay-100 { animation-delay: 100ms; }
    .delay-150 { animation-delay: 150ms; }
    .delay-200 { animation-delay: 200ms; }
  `]
})
export class ChatbotComponent implements OnDestroy {
  chatService = inject(ChatbotService);
  router = inject(Router);

  isListening = signal(false);
  userInput = '';

  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private supportedMimeType: string = 'audio/webm';
  
  // Audio Analysis properties
  private audioContext: AudioContext | null = null;
  private silenceStart: number = 0;
  private hasDetectedSpeech: boolean = false;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor() {
    this.detectSupportedMimeType();
    
    // Auto-scroll effect when messages change
    effect(() => {
      // Track messages to trigger effect
      this.chatService.messages();
      setTimeout(() => this.scrollToBottom(), 50);
    });
  }

  ngOnDestroy() {
    this.stopListening();
  }

  private detectSupportedMimeType() {
    const types = ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav'];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        this.supportedMimeType = type;
        break;
      }
    }
  }

  async startListening() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream, { mimeType: this.supportedMimeType });
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: this.supportedMimeType });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
            const result = reader.result as string;
            const base64Audio = result.split(',')[1];
            
            // Delegate AI processing to service
            this.chatService.processVoiceMessage(base64Audio, this.supportedMimeType, this.router.url);
        };
        
        stream.getTracks().forEach(track => track.stop());
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        this.isListening.set(false);
      };

      this.mediaRecorder.start();
      this.isListening.set(true);

      // --- Silence Detection Logic ---
      this.audioContext = new AudioContext();
      const source = this.audioContext.createMediaStreamSource(stream);
      const analyser = this.audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.3;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      this.hasDetectedSpeech = false;
      this.silenceStart = Date.now();

      const checkForSilence = () => {
        if (!this.isListening() || !this.mediaRecorder || this.mediaRecorder.state !== 'recording') return;

        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sum / dataArray.length);
        
        const speechThreshold = 10; 
        const silenceDuration = 1500; 

        if (rms > speechThreshold) {
            this.hasDetectedSpeech = true;
            this.silenceStart = Date.now();
        }

        if (this.hasDetectedSpeech && (Date.now() - this.silenceStart > silenceDuration)) {
            this.stopListening();
        } else {
            requestAnimationFrame(checkForSilence);
        }
      };
      
      checkForSilence();

    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Could not access microphone.');
    }
  }

  stopListening() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }
  }

  sendMessage() {
    if (!this.userInput.trim()) return;
    const text = this.userInput;
    this.userInput = '';
    
    // Delegate to service
    this.chatService.sendMessage(text, this.router.url);
  }

  private scrollToBottom() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }
}
