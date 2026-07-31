import { loginUser , getCurrentUser} from '../api/authapi';
import React, { createContext, useState, useEffect , useContext } from "react";
//create a new context
export const AuthContext = createContext();

export const AuthProvider = ({ children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
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
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

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
        logout
        }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};