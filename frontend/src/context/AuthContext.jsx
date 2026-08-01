import { loginUser, getCurrentUser } from '../api/authapi';
import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const persistAuth = (tokens, profile) => {
        const normalizedTokens = tokens?.access ? tokens : tokens?.tokens;

        if (normalizedTokens?.access) {
            localStorage.setItem('access_token', normalizedTokens.access);
        }

        if (normalizedTokens?.refresh) {
            localStorage.setItem('refresh_token', normalizedTokens.refresh);
        }

        const nextUser = {
            id: profile?.id ?? null,
            username: profile?.username ?? profile?.name ?? 'Guest',
            email: profile?.email ?? '',
        };

        localStorage.setItem('current_user', JSON.stringify(nextUser));
        setUser(nextUser);
        setIsAuthenticated(true);
    };

    const login = async (credentials) => {
        const response = await loginUser(credentials);
        const tokens = response?.tokens ?? response;
        const profile = response?.user ?? {
            username: credentials?.username,
            email: credentials?.email ?? '',
        };

        persistAuth(tokens, profile);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('current_user');

        setUser(null);
        setIsAuthenticated(false);
    };

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
        } catch (error) {
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};