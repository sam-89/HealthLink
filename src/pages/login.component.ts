
import { Component, inject, signal } from '@angular/core';
import { AuthService, UserRole } from '../core/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="flex min-h-screen w-full font-sans">
      <!-- Left Panel (Branding) -->
      <div class="hidden lg:flex lg:w-1/2 bg-[#1883C7] flex-col justify-between p-16 text-white relative overflow-hidden">
        <!-- Background Pattern/Gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent"></div>

        <!-- Header -->
        <div class="relative z-10 flex items-center gap-3">
           <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
               <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
             </svg>
           </div>
           <span class="text-xl font-bold tracking-wide">HealthLink</span>
        </div>

        <!-- Main Content -->
        <div class="relative z-10 max-w-lg mb-20">
          <h1 class="text-5xl font-bold leading-tight mb-6">Streamline Your Healthcare Compliance</h1>
          <p class="text-blue-100 text-lg leading-relaxed">
            The enterprise platform for healthcare agent onboarding, licensing, and compliance management. 
            Join thousands of agencies who trust HealthLink to manage their workforce.
          </p>
        </div>

        <!-- Footer -->
        <div class="relative z-10 flex gap-6 text-sm text-blue-100/80">
          <span>&copy; 2024 HealthLink</span>
          <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>

      <!-- Right Panel (Login Form) -->
      <div class="w-full lg:w-1/2 bg-[#F9FAFB] flex flex-col items-center justify-center p-8">
        <div class="w-full max-w-md space-y-8">
          
          <!-- Header (Mobile Logo visible only on small screens) -->
          <div class="lg:hidden flex justify-center mb-8">
            <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-2xl">H</span>
            </div>
          </div>

          <div class="text-center lg:text-left space-y-2">
            <h2 class="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p class="text-slate-500">Sign in to your HealthLink account</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
            
            <!-- Email -->
            <div class="space-y-2">
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input 
                id="email" 
                type="email" 
                formControlName="email"
                placeholder="you@company.com"
                class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
              >
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" class="text-sm font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
              </div>
              <div class="relative">
                <input 
                  id="password" 
                  [type]="showPassword() ? 'text' : 'password'" 
                  formControlName="password"
                  placeholder="••••••••"
                  class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 pr-10"
                >
                <button 
                  type="button" 
                  (click)="togglePassword()"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  @if (showPassword()) {
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  }
                </button>
              </div>
            </div>

            <!-- Remember Me -->
            <div class="flex items-center">
              <input 
                id="remember-me" 
                name="remember-me" 
                type="checkbox" 
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">Remember me for 30 days</label>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#1570EF] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Sign in
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-[#F9FAFB] text-gray-500">Demo accounts — Click to autofill</span>
            </div>
          </div>

          <!-- Demo Buttons -->
          <div class="grid grid-cols-3 gap-3">
            <button 
              type="button"
              (click)="autofill('AGENT')"
              class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Agent
            </button>
             <button 
              type="button"
              (click)="autofill('AGENCY_ADMIN')"
              class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Agency
            </button>
             <button 
              type="button"
              (click)="autofill('OPS_ADMIN')"
              class="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Ops
            </button>
          </div>

          <!-- Footer Link -->
          <p class="text-center text-sm text-gray-600 pt-4">
            Don't have an account? 
            <a href="#" class="font-medium text-blue-600 hover:text-blue-500">Register now</a>
          </p>

        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  auth = inject(AuthService);
  fb: FormBuilder = inject(FormBuilder);
  
  showPassword = signal(false);
  
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['AGENT'] as any 
  });

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  autofill(role: UserRole) {
    let email = '';
    
    switch(role) {
      case 'AGENT': email = 'alex@agent.com'; break;
      case 'AGENCY_ADMIN': email = 'admin@agency.com'; break;
      case 'OPS_ADMIN': email = 'sarah@healthlink.com'; break;
    }

    this.loginForm.patchValue({
      email: email,
      password: 'password123',
      role: role
    });

    // Optional: Auto submit for smoother demo experience, or let user click button
    // this.onSubmit();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // In a real app we would use email/pass, here we use the hidden role field or derive it
      // For this demo, we can just use the role stored in form or derived from email if we wanted logic
      // But let's rely on the role set during autofill, or default to Agent if typed manually
      const val = this.loginForm.value;
      const role = val.role as UserRole || 'AGENT';
      this.auth.login(role);
    }
  }
}
