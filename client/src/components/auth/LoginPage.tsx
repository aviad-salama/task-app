import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { LoginData } from '../../types/auth';
import { API_BASE_URL } from '../../config/api';
import { memo, useState, useEffect } from 'react';

interface LoginPageProps {
  onSwitchToSignup: () => void;
  onLoginSuccess: (token: string) => void;
  // NEW: Accept success message prop
  successMessage?: string | null;
}

function LoginPage({ onSwitchToSignup, onLoginSuccess, successMessage }: LoginPageProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>();
  
  // Local state to control the visibility of the success message
  const [showSuccess, setShowSuccess] = useState(!!successMessage);

  // Auto-hide the success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
      return () => clearTimeout(timer); // Cleanup timer if component unmounts early
    }
  }, [successMessage]);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
      }
      return res.json();
    },
    onSuccess: (data) => {
      onLoginSuccess(data.token);
    }
  });

  const onSubmit: SubmitHandler<LoginData> = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-950 px-4 relative">
      
      {/* SUCCESS TOAST MESSAGE - positioned at top right */}
      {showSuccess && successMessage && (
        <div className="absolute top-8 right-8 bg-emerald-600/90 border border-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg shadow-emerald-900/20 backdrop-blur-sm animate-bounce-short">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 bg-slate-800 p-6 rounded-lg border border-slate-700 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-white text-center mb-2">Login</h1>

        {loginMutation.isError && (
          <div className="bg-red-900 border border-red-700 text-red-100 p-2 rounded text-sm text-center">
            {loginMutation.error.message}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <input
            type="email"
            placeholder="Email address"
            {...register('email', { required: 'Email is required' })}
            className="p-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-indigo-500"
          />
          {errors.email && <span className="text-red-400 text-sm">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <input
            type="password"
            placeholder="Password"
            {...register('password', { required: 'Password is required' })}
            className="p-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-indigo-500"
          />
          {errors.password && <span className="text-red-400 text-sm">{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-slate-600"
        >
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-slate-400 text-sm text-center mt-2">
          Don't have an account?{' '}
          <button type="button" onClick={onSwitchToSignup} className="text-indigo-400 hover:text-indigo-300 font-medium">
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}

export default memo(LoginPage);