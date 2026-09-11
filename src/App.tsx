import { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('view') === 'login' || params.get('tab') === 'login') {
          return false;
        }
        if (params.get('deal') || params.get('tab') || localStorage.getItem('ceruti_logged_in') === 'true') {
          return true;
        }
      } catch {
        // ignore
      }
    }
    return false;
  });

  const handleLogin = () => {
    try {
      localStorage.setItem('ceruti_logged_in', 'true');
    } catch {
      // ignore
    }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('ceruti_logged_in');
      const url = new URL(window.location.href);
      url.searchParams.delete('deal');
      url.searchParams.delete('tab');
      window.history.replaceState({}, '', url.pathname);
    } catch {
      // ignore
    }
    setIsLoggedIn(false);
  };

  return (
    <>
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
}
