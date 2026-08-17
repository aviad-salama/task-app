import { useForm, SubmitHandler } from 'react-hook-form';
import { SignupData } from '../../types/auth';
import { memo } from 'react';

// Props definition for SignupPage component
interface SignupPageProps {
  serverError?: string | null;
  onSwitchToLogin: () => void;
}

function SignupPage({ serverError, onSwitchToLogin }: SignupPageProps) {
  // Initialize react-hook-form methods
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignupData>();

  // Form submission handler
  const onSubmit: SubmitHandler<SignupData> = (data) => {
    console.log('Signup submitted:', data);
    // Future integration: call signup mutation here
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-950">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 bg-slate-800 p-6 rounded-lg border border-slate-700 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-white text-center mb-2">Create Account</h1>

        {/* Display server-side error if present */}
        {serverError && (
          <div className="bg-red-900 border border-red-700 text-red-100 p-2 rounded text-sm text-center">
            {serverError}
          </div>
        )}

        {/* Full name field */}
        <div className="flex flex-col gap-1">
          <input
            type="text"
            placeholder="Full Name"
            {...register('name', { required: 'Full name is required' })}
            className="p-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-indigo-500"
          />
          {errors.name && (
            <span className="text-red-400 text-sm">{errors.name.message}</span>
          )}
        </div>

        {/* Email field */}
        <div className="flex flex-col gap-1">
          <input
            type="email"
            placeholder="Email address"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Invalid email format'
              }
            })}
            className="p-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-indigo-500"
          />
          {errors.email && (
            <span className="text-red-400 text-sm">{errors.email.message}</span>
          )}
        </div>

        {/* Password field */}
        <div className="flex flex-col gap-1">
          <input
            type="password"
            placeholder="Password"
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            className="p-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-indigo-500"
          />
          {errors.password && (
            <span className="text-red-400 text-sm">{errors.password.message}</span>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-slate-600"
        >
          {isSubmitting ? 'Creating Account...' : 'Sign up'}
        </button>

        {/* Switch to login option */}
        <p className="text-slate-400 text-sm text-center mt-2">
          Already have an account?{' '}
          <button 
            type="button" 
            onClick={onSwitchToLogin} 
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

export default memo(SignupPage);