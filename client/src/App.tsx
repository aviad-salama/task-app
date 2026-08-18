import { useState, useEffect } from 'react';
import MainPage from './pages/MainPage';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'login' | 'signup' | 'main'>('login');
  
  // NEW: State to store the success message after signup
  const [signupSuccessMessage, setSignupSuccessMessage] = useState<string | null>(null);

  // Check for existing token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setCurrentView('main');
    }
  }, []);

  const handleLoginSuccess = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setCurrentView('main');
    // Clear message when logging in
    setSignupSuccessMessage(null);
  };

  // CHANGED: Accept user name to show in the success message
  const handleSignupSuccess = (userName: string) => {
    setSignupSuccessMessage(`${userName} signed up successfully!`);
    setCurrentView('login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentView('login');
  };

  return (
    <>
      {currentView === 'login' && (
        <LoginPage 
          onSwitchToSignup={() => setCurrentView('signup')} 
          onLoginSuccess={handleLoginSuccess}
          // Pass the success message to LoginPage
          successMessage={signupSuccessMessage}
        />
      )}
      {currentView === 'signup' && (
        <SignupPage 
          onSwitchToLogin={() => setCurrentView('login')}
          onSignupSuccess={handleSignupSuccess}
        />
      )}
      {currentView === 'main' && token && (
        <MainPage token={token} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;