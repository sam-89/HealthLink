
import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GeminiService } from './gemini.service';
import { VoiceCommandService } from './voice-command.service';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  isOpen = signal(false);
  isTyping = signal(false);
  messages = signal<ChatMessage[]>([
    { id: '1', text: 'Hi! I am your AI Onboarding Assistant. Use your voice to fill forms or navigate!', sender: 'bot', timestamp: new Date() }
  ]);

  private gemini = inject(GeminiService);
  private voiceService = inject(VoiceCommandService);
  private router = inject(Router);

  toggle() {
    this.isOpen.update(v => !v);
  }

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }

  addBotMessage(text: string) {
    this.messages.update(msgs => [...msgs, {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date()
    }]);
    this.speak(text);
  }

  addUserMessage(text: string) {
    this.messages.update(msgs => [...msgs, {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    }]);
  }

  async sendMessage(userText: string, contextUrl: string) {
    this.addUserMessage(userText);
    this.isTyping.set(true);
    
    const result = await this.gemini.chatWithAssistant(userText, null, contextUrl);
    
    this.handleGeminiResponse(result);
  }

  async processVoiceMessage(audioBase64: string, mimeType: string, contextUrl: string) {
    this.isTyping.set(true);
    const result = await this.gemini.chatWithAssistant(null, audioBase64, contextUrl, mimeType);
    this.handleGeminiResponse(result);
  }

  private handleGeminiResponse(result: { speech: string, action: string, data: any, target?: string }) {
    this.isTyping.set(false);
    this.addBotMessage(result.speech);

    if (result.action === 'NAVIGATE' && result.target) {
      this.router.navigate([result.target]);
    } else if (result.action !== 'NONE') {
      this.voiceService.dispatch(result.action as any, result.data, result.target);
    }
  }

  speak(text: string) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  }
}
