import React, { createContext, useContext, useState} from 'react';
import { loginUser , getCurrentUser} from '../api/authapi';
import React, { createContext, useState, useEffect } from "react";
//create a new context
export const AuthContext = createContext();

export const AuthProvider = ({ children}) => {

    const [User, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (credentials) => {
        const tokens = await loginUser(credentials);

        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);

        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
    };
    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

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
            const curentUser = await getCurrentUser();

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
        <AuthContext.provider value={{
        User,
        loading,
        isAuthenticated,
        login,
        logout
        }}
        >
            {children}
        </AuthContext.provider>
    );
};