
import { Injectable, signal } from '@angular/core';

export type VoiceAction = 'NAVIGATE' | 'FILL_FORM' | 'NEXT_STEP' | 'PREV_STEP' | 'NONE';

export interface VoiceCommand {
  action: VoiceAction;
  data?: any;
  target?: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class VoiceCommandService {
  // Signal to broadcast commands to active components
  command = signal<VoiceCommand | null>(null);

  dispatch(action: VoiceAction, data?: any, target?: string) {
    this.command.set({
      action,
      data,
      target,
      timestamp: Date.now()
    });
  }
}
