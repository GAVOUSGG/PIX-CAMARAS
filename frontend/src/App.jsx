import React, { useEffect, useState } from "react";
import LoginPage from "./components/Auth/LoginPage";
import OAuthCallback from "./components/GoogleCalendar/OAuthCallback";
import MainApp from "./MainApp";

function App() {
  const [user, setUser] = useState(null);

  // Check for existing session
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (data) => {
    setUser(data.user);
    sessionStorage.setItem('user', JSON.stringify(data.user));
    sessionStorage.setItem('token', data.token);
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  };

  // Verificar si estamos en la página de callback de OAuth
  const isOAuthCallback = window.location.pathname === '/oauth/callback' || 
                          window.location.search.includes('code=');

  useEffect(() => {
    // Si estamos en el callback, limpiar la URL después de procesar
    if (isOAuthCallback && window.location.search.includes('code=')) {
      // El componente OAuthCallback manejará el callback
    }
  }, [isOAuthCallback]);

  // Mostrar el componente de callback si estamos en esa ruta
  if (isOAuthCallback) {
    return <OAuthCallback />;
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <MainApp user={user} onLogout={handleLogout} />;
}

export default App;
