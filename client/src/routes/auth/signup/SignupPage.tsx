import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { SignupData } from '../../../types/auth';
import { useAuth } from '../../../hooks/useAuth'; 
import { memo } from 'react';

function SignupPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<SignupData>();

  // Use our custom hook. Pass the success handler.
  const { signup, isSignupPending, signupError } = useAuth(
    undefined, // We don't need the login success handler here
    () => {
      navigate('/auth/login'); // Redirect to login on success
    }
  );

  const onSubmit: SubmitHandler<SignupData> = (data) => {
    signup(data); // Call the function provided by the hook
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 bg-slate-800 p-6 rounded-lg border border-slate-700 w-full max-w-md"
    >
      <h1 className="text-2xl font-bold text-white text-center mb-2">Create Account</h1>

      {/* Render error from the hook if exists */}
      {signupError && (
        <div className="bg-red-900 border border-red-700 text-red-100 p-2 rounded text-sm text-center">
          {signupError}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <input
          type="text"
          placeholder="Full Name"
          {...register('name', { 
            required: 'Full name is required',
            validate: (value) => value.trim().length > 0 || 'Full name cannot be empty'
          })}
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
        disabled={isSignupPending} // Use state from the hook
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-slate-600"
      >
        {isSignupPending ? 'Creating Account...' : 'Sign up'}
      </button>

      <p className="text-slate-400 text-sm text-center mt-2">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
          Login
        </Link>
      </p>
    </form>
  );
}

export default memo(SignupPage);