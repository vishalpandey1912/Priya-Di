'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    name: string;
    email: string;
    role: 'student' | 'admin';
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for active session on mount
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Hardcoded Admin Login
        if (email === 'admin@desi.com' && password === 'admin') {
            const adminUser: User = { name: 'Super Admin', email, role: 'admin' };
            setUser(adminUser);
            localStorage.setItem('currentUser', JSON.stringify(adminUser));
            return true;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find((u: any) => u.email === email && u.password === password);

        if (foundUser) {
            const sessionUser: User = { name: foundUser.name, email: foundUser.email, role: 'student' };
            setUser(sessionUser);
            localStorage.setItem('currentUser', JSON.stringify(sessionUser));
            return true;
        }
        return false;
    };

    const signup = async (name: string, email: string, password: string) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const users = JSON.parse(localStorage.getItem('users') || '[]');

        if (users.find((u: any) => u.email === email)) {
            return false; // User already exists
        }

        const newUser = { name, email, password, role: 'student' };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Auto login after signup
        const sessionUser: User = { name, email, role: 'student' };
        setUser(sessionUser);
        localStorage.setItem('currentUser', JSON.stringify(sessionUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
