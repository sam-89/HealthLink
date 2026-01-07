import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/agent';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      
      // Redirect based on email pattern
      if (data.email.includes('agency')) {
        navigate('/agency');
      } else if (data.email.includes('ops') || data.email.includes('admin')) {
        navigate('/ops');
      } else {
        navigate('/agent');
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    }
  };

  const demoLogin = (role: 'agent' | 'agency' | 'ops') => {
    setValue('email', `${role}@healthlink.com`);
    setValue('password', 'demo123');
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">
          Welcome back
        </h1>
        <p className="text-muted-foreground">
          Sign in to your HealthLink account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            {...register('email')}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="text-xs text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={watch('remember')}
            onCheckedChange={(checked) => setValue('remember', checked as boolean)}
          />
          <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
            Remember me for 30 days
          </Label>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      {/* Demo accounts */}
      <div className="mt-8 pt-6 border-t">
        <p className="text-xs text-muted-foreground text-center mb-4">
          Demo accounts — Click to autofill
        </p>
        <div className="grid grid-cols-3 gap-2">
          {(['agent', 'agency', 'ops'] as const).map((role) => (
            <Button
              key={role}
              variant="outline"
              size="sm"
              onClick={() => demoLogin(role)}
              className="capitalize"
            >
              {role}
            </Button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground text-center mt-6">
        Don&apos;t have an account?{' '}
        <a href="#" className="text-primary font-medium hover:underline">
          Register now
        </a>
      </p>
    </div>
  );
}
