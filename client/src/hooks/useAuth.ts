import { useMutation } from '@tanstack/react-query';
import { loginApi, signupApi } from '../services/authService';
import { LoginData, SignupData } from '../types/auth';

/**
 * Custom hook to encapsulate authentication logic and state using TanStack Query.
 */
export function useAuth(
  onLoginSuccess?: (token: string) => void,
  onSignupSuccess?: () => void
) {
  // Mutation for logging in
  const loginMutation = useMutation({
    mutationFn: (data: LoginData) => loginApi(data),
    onSuccess: (data) => {
      if (onLoginSuccess) {
        onLoginSuccess(data.token);
      }
    }
  });

  // Mutation for signing up
  const signupMutation = useMutation({
    mutationFn: (data: SignupData) => signupApi(data),
    onSuccess: () => {
      if (onSignupSuccess) {
        onSignupSuccess();
      }
    }
  });

  return {
    login: loginMutation.mutate,
    isLoginPending: loginMutation.isPending,
    loginError: loginMutation.isError ? loginMutation.error.message : null,

    signup: signupMutation.mutate,
    isSignupPending: signupMutation.isPending,
    signupError: signupMutation.isError ? signupMutation.error.message : null,
  };
}