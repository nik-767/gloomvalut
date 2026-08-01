import { loginUser, getCurrentUser } from '../api/authapi';
import { getUserIdFromToken } from '../utils/jwt';
import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

/**
 * Stores authentication state and exposes login/logout helpers to the app.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Saves JWT tokens and the normalized user object in localStorage.
   */
  const persistAuth = (tokens, profile) => {
    const normalizedTokens = tokens?.access ? tokens : tokens?.tokens;
    const accessToken = normalizedTokens?.access;
    const tokenUserId = getUserIdFromToken(accessToken);

    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
    }

    if (normalizedTokens?.refresh) {
      localStorage.setItem('refresh_token', normalizedTokens.refresh);
    }

    const nextUser = {
      id: profile?.id ?? tokenUserId ?? null,
      username: profile?.username ?? profile?.name ?? 'Guest',
      email: profile?.email ?? '',
    };

    localStorage.setItem('current_user', JSON.stringify(nextUser));
    setUser(nextUser);
    setIsAuthenticated(true);
  };

  /**
   * Authenticates a user and persists the returned JWT tokens.
   */
  const login = async (credentials) => {
    const response = await loginUser(credentials);
    const tokens = response?.tokens ?? response;

    persistAuth(tokens, {
      username: credentials?.username,
      email: credentials?.email ?? '',
    });
  };

  /**
   * Clears all auth storage and resets React auth state.
   */
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');

    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Restores a previous session from localStorage on app startup.
   */
  const loadUser = async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Convenience hook for reading authentication state anywhere in the tree.
 */
export const useAuth = () => useContext(AuthContext);
