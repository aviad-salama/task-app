import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { LoginData } from '../../../types/auth';
import { API_BASE_URL } from '../../../config/api';
import { memo } from 'react';

function LoginPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || errorData.error || 'Login failed');
      }
      return res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      navigate('/');
    }
  });

  const onSubmit: SubmitHandler<LoginData> = (data) => {
    loginMutation.mutate(data);
  };

  return (
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
        <Link to="/auth/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">
          Sign up
        </Link>
      </p>
    </form>
  );
}

export default memo(LoginPage);