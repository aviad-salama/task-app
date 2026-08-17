import { useState } from 'react';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import MainPage from './pages/MainPage';

// CHANGED: App now acts only as a simple router based on authentication state
function App() {
  // NEW: Store token in state, initialize from localStorage
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  
  // NEW: State to toggle between login and signup views
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  // Helper to handle successful login
  const handleLoginSuccess = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // Helper to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // If user is not logged in, show Auth views
  if (!token) {
    if (authView === 'login') {
      return (
        <LoginPage 
          onLoginSuccess={handleLoginSuccess} 
          onSwitchToSignup={() => setAuthView('signup')} 
        />
      );
    }
    
    return (
      <SignupPage 
        onSwitchToLogin={() => setAuthView('login')} 
        onSignupSuccess={() => setAuthView('login')} // Return to login after signup
      />
    );
  }

  // If logged in, show the main tasks page
  return <MainPage token={token} onLogout={handleLogout} />;
}

export default App;