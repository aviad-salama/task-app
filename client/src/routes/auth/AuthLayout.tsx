import { Outlet, Navigate } from 'react-router-dom';

export default function AuthLayout() {
  const token = localStorage.getItem('token');

  // Redirect to tasks if user is already authenticated
  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4">
      {/* Outlet renders either LoginPage or SignupPage */}
      <Outlet />
    </div>
  );
}