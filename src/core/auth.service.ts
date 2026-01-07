
import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export type UserRole = 'AGENT' | 'AGENCY_ADMIN' | 'OPS_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal to hold current user state
  private _currentUser = signal<User | null>(null);

  currentUser = this._currentUser.asReadonly();
  isAuthenticated = computed(() => !!this._currentUser());

  constructor(private router: Router) {}

  login(role: UserRole) {
    // Simulating API login
    const mockUser: User = {
      id: 'usr_' + Math.floor(Math.random() * 1000),
      name: role === 'AGENT' ? 'Sarah Johnson' : (role === 'OPS_ADMIN' ? 'Michael Chen' : 'Agency Lead'),
      email: role === 'AGENT' ? 'sarah@agent.com' : 'admin@healthlink.com',
      role: role,
      avatar: `https://ui-avatars.com/api/?name=${role}&background=0D8ABC&color=fff`
    };
    
    this._currentUser.set(mockUser);
    
    // Redirect based on role
    if (role === 'AGENT') {
      this.router.navigate(['/app/agent-dashboard']);
    } else if (role === 'AGENCY_ADMIN') {
      this.router.navigate(['/app/agency-dashboard']);
    } else {
      // OPS_ADMIN
      this.router.navigate(['/app/ops-dashboard']);
    }
  }

  logout() {
    this._currentUser.set(null);
    this.router.navigate(['/auth']);
  }
}
        