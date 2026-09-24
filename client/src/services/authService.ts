// client/src/services/authService.ts
import { API_BASE_URL } from '../config/api';
import { LoginData, SignupData } from '../types/auth';

/**
 * Service function to handle user login.
 * Sends credentials to the server and returns the JWT token.
 */
export async function loginApi(data: LoginData): Promise<{ token: string }> {
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
}//sda

/**
 * Service function to handle user registration.
 * Sends new user data to the server and returns the created user object.
 */
export async function signupApi(data: SignupData): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || errorData.message || 'Registration failed');
  }

  return res.json();
}