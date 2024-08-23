// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {logout as logoutApi} from '../api/PostAPI';
import { useLocation } from 'react-router-dom';

interface AuthContextType {
    token: string | null;
    user_id: number | null;
    is_admin: boolean;
    setToken: (token: string | null) => void;
    setUserId: (user_id: number | null) => void;
    setIsAdmin: (is_admin: boolean) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user_id, setUserId] = useState<number | null>(localStorage.getItem('user_id') ? parseInt(localStorage.getItem('user_id') as string) : null);
    const [is_admin, setIsAdmin] = useState<boolean>(localStorage.getItem('is_admin') === 'true');
    const location = useLocation();

    const saveToken = (newToken: string | null) => {
        setToken(newToken);
        if (newToken === null) {
            localStorage.removeItem('token');
        } else {
            localStorage.setItem('token', newToken);
        }
    };

    const saveUserId = (newUserId: number | null) => {
        setUserId(newUserId);
        if (newUserId === null || newUserId < 0) {
            localStorage.removeItem('user_id');
        } else {
            localStorage.setItem('user_id', newUserId.toString());
        }
    };

    const saveIsAdmin = (newIsAdmin: boolean) => {
        setIsAdmin(newIsAdmin);
        localStorage.setItem('is_admin', newIsAdmin ? 'true' : 'false');
    }   

    const logout = () => {
        logoutApi(token as string);
        saveToken(null);
        saveUserId(null);
        setIsAdmin(false);
        // window.location.href = '/login';
        const redirectUrl = location.pathname + location.search;
        sessionStorage.setItem('redirectUrl', redirectUrl);
    };

    return (
        <AuthContext.Provider value={{ token, user_id, is_admin, setToken: saveToken, setUserId: saveUserId, setIsAdmin: saveIsAdmin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
