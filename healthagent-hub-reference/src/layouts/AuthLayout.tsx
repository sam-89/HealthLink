import { Outlet } from 'react-router-dom';
import { Shield } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-muted">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-display font-bold text-white">HealthLink</span>
        </div>

        <div className="max-w-md">
          <h1 className="text-4xl font-display font-bold text-white leading-tight mb-6">
            Streamline Your Healthcare Compliance
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            The enterprise platform for healthcare agent onboarding, licensing, and compliance management.
            Join thousands of agencies who trust HealthLink to manage their workforce.
          </p>
        </div>

        <div className="flex items-center gap-8 text-white/60 text-sm">
          <span>© 2024 HealthLink</span>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold">HealthLink</span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
