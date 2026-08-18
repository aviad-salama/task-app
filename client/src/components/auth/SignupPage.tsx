import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { SignupData } from '../../types/auth';
import { memo } from 'react';
import { API_BASE_URL } from '../../config/api';

interface SignupPageProps {
  onSwitchToLogin: () => void;
  onSignupSuccess: () => void;
}

function SignupPage({ onSwitchToLogin, onSignupSuccess }: SignupPageProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupData>();

  // NEW: TanStack Mutation for the Register API call
  const signupMutation = useMutation({
    mutationFn: async (data: SignupData) => {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      return res.json();
    },
    // On success, notify App.tsx to switch view back to login
    onSuccess: () => {
      onSignupSuccess();
    }
  });

  const onSubmit: SubmitHandler<SignupData> = (data) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-950">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 bg-slate-800 p-6 rounded-lg border border-slate-700 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-white text-center mb-2">Create Account</h1>

        {/* Display server error */}
        {signupMutation.isError && (
          <div className="bg-red-900 border border-red-700 text-red-100 p-2 rounded text-sm text-center">
            {signupMutation.error.message}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <input
            type="text"
            placeholder="Full Name"
            {...register('name', { required: 'Full name is required' })}
            className="p-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-indigo-500"
          />
          {errors.name && <span className="text-red-400 text-sm">{errors.name.message}</span>}
        </div>

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
            {...register('password', { required: 'Password is required', minLength: 6 })}
            className="p-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-indigo-500"
          />
          {errors.password && <span className="text-red-400 text-sm">{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          disabled={signupMutation.isPending}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-slate-600"
        >
          {signupMutation.isPending ? 'Creating Account...' : 'Sign up'}
        </button>

        <p className="text-slate-400 text-sm text-center mt-2">
          Already have an account?{' '}
          <button type="button" onClick={onSwitchToLogin} className="text-indigo-400 hover:text-indigo-300 font-medium">
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

export default memo(SignupPage);