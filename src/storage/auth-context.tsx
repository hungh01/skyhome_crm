'use client';


import { User } from '@/type/user/user';
import { createContext, useContext, useState, ReactNode } from 'react';
import { useEffect } from 'react';

type AuthContextType = {
    isAuth: boolean;
    setIsAuth: (isAuth: boolean) => void;
    user: User | null;
    setUser: (user: User | null) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);


    return (
        <AuthContext.Provider value={{ isAuth, user, setUser, setIsAuth, isLoading, setIsLoading }}>
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
