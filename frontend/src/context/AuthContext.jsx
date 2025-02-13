import React, { createContext, useState, useContext } from 'react';
import { isAuthTokenValid, removeAuthTokenFromCookies } from '../utils/cookies'
import { login as apiLogin } from '../utils/api';

// Cria o contexto
const AuthContext = createContext();

// Provedor de autenticação
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(isAuthTokenValid());

  const login = async (username, password) => {

    try {
          const response = await apiLogin(username, password);
          setIsAuthenticated(true);
          return response;
      } catch (error) {
          throw error;
      }

  };

  const logout = () => {
    removeAuthTokenFromCookies();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useAuth = () => useContext(AuthContext);