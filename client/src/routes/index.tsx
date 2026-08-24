import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './auth';
import LoginPage from './auth/login';
import SignupPage from './auth/signup';
import TasksPage from './tasks';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Root task management route */}
      <Route path="/" element={<TasksPage />} />

      {/* Nested authentication layout & views */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Route>

      {/* Wildcard redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}