'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useEffect } from 'react';

type AuthContextType = {
    isAuth: boolean;
    login: () => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        const stored = localStorage.getItem('isAuth');
        setIsAuth(stored === 'true');
        setIsLoading(false);
    }, []);

    const login = () => {
        setIsAuth(true);
        localStorage.setItem('isAuth', 'true');
    };
    const logout = () => {
        setIsAuth(false);
        localStorage.setItem('isAuth', 'false');
    };

    if (isLoading) return null;
    return (
        <AuthContext.Provider value={{ isAuth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
