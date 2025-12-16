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
    updateUser: (name: string, email: string) => void;
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

        // Mock Students Login (Password: student123)
        const MOCK_STUDENTS = [
            { name: 'Rahul Sharma', email: 'rahul.s@example.com', password: 'student123', role: 'student' as const },
            { name: 'Priya Patel', email: 'priya.p@example.com', password: 'student123', role: 'student' as const },
            { name: 'Amit Verma', email: 'amit.v@example.com', password: 'student123', role: 'student' as const },
            { name: 'Sneha Gupta', email: 'sneha.g@example.com', password: 'student123', role: 'student' as const },
            { name: 'Vikram Singh', email: 'vikram.s@example.com', password: 'student123', role: 'student' as const },
        ];

        const mockUser = MOCK_STUDENTS.find(u => u.email === email && u.password === password);
        if (mockUser) {
            const sessionUser: User = { name: mockUser.name, email: mockUser.email, role: 'student' };
            setUser(sessionUser);
            localStorage.setItem('currentUser', JSON.stringify(sessionUser));
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

    const updateUser = (name: string, email: string) => {
        if (!user) return;
        const updatedUser = { ...user, name, email };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser)); // Update current session

        // Also update the 'users' list if applicable (for full persistence across logout)
        // This attempts to sync changes back to the main user list "database"
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingIndex = users.findIndex((u: any) => u.email === user.email);
        if (existingIndex !== -1) {
            users[existingIndex] = { ...users[existingIndex], name, email };
            localStorage.setItem('users', JSON.stringify(users));
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateUser, isLoading }}>
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
