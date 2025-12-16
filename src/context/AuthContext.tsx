'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    name: string;
    email: string;
    phone?: string;
    role: 'student' | 'admin';
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
    logout: () => void;
    updateUser: (name: string, email: string) => void;
    verifyEmail: (code: string) => Promise<boolean>;
    verifyPhone: (code: string, phoneNumber?: string) => Promise<boolean>;
    googleLogin: () => Promise<void>;
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
            const adminUser: User = { name: 'Super Admin', email, role: 'admin', isEmailVerified: true, isPhoneVerified: true };
            setUser(adminUser);
            localStorage.setItem('currentUser', JSON.stringify(adminUser));
            return true;
        }

        // Mock Students Login (Password: student123)
        const MOCK_STUDENTS = [
            { name: 'Rahul Sharma', email: 'rahul.s@example.com', password: 'student123', role: 'student' as const, isEmailVerified: true, isPhoneVerified: true },
            { name: 'Priya Patel', email: 'priya.p@example.com', password: 'student123', role: 'student' as const, isEmailVerified: true, isPhoneVerified: true },
            { name: 'Amit Verma', email: 'amit.v@example.com', password: 'student123', role: 'student' as const, isEmailVerified: true, isPhoneVerified: true },
            { name: 'Sneha Gupta', email: 'sneha.g@example.com', password: 'student123', role: 'student' as const, isEmailVerified: true, isPhoneVerified: true },
            { name: 'Vikram Singh', email: 'vikram.s@example.com', password: 'student123', role: 'student' as const, isEmailVerified: true, isPhoneVerified: true },
        ];

        const mockUser = MOCK_STUDENTS.find(u => u.email === email && u.password === password);
        if (mockUser) {
            const sessionUser: User = {
                name: mockUser.name,
                email: mockUser.email,
                role: 'student',
                isEmailVerified: true,
                isPhoneVerified: true
            };
            setUser(sessionUser);
            localStorage.setItem('currentUser', JSON.stringify(sessionUser));
            return true;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find((u: any) => u.email === email && u.password === password);

        if (foundUser) {
            const sessionUser: User = {
                name: foundUser.name,
                email: foundUser.email,
                phone: foundUser.phone,
                role: 'student',
                isEmailVerified: foundUser.isEmailVerified || false,
                isPhoneVerified: foundUser.isPhoneVerified || false
            };
            setUser(sessionUser);
            localStorage.setItem('currentUser', JSON.stringify(sessionUser));
            return true;
        }
        return false;
    };

    const signup = async (name: string, email: string, password: string, phone?: string) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const users = JSON.parse(localStorage.getItem('users') || '[]');

        if (users.find((u: any) => u.email === email)) {
            return false; // User already exists
        }

        const newUser: User & { password: string } = {
            name,
            email,
            password,
            phone: phone || '',
            role: 'student',
            isEmailVerified: false,
            isPhoneVerified: false
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Auto login after signup
        // Exclude password from session
        const { password: _, ...sessionUser } = newUser;
        setUser(sessionUser);
        localStorage.setItem('currentUser', JSON.stringify(sessionUser));

        // Initialize User Defaults (NEET/Class 12) & Phone
        localStorage.setItem(`user_details_${email}`, JSON.stringify({
            targetExam: 'NEET',
            currentClass: 'Class 12',
            phone: phone || ''
        }));

        return true;
    };

    const verifyEmail = async (code: string) => {
        if (!user) return false;
        // Verify logic (Simulation: accept any 4 digit code for now, or specific one)
        if (code.length === 4) {
            const updatedUser = { ...user, isEmailVerified: true };
            setUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

            // Update in 'db'
            updateUserInStorage(updatedUser);
            return true;
        }
        return false;
    };

    const verifyPhone = async (code: string, phoneNumber?: string) => {
        if (!user) return false;
        if (code.length === 4) {
            let updatedUser = { ...user, isPhoneVerified: true };

            if (phoneNumber) {
                updatedUser = { ...updatedUser, phone: phoneNumber };
                // Update user details storage specifically
                const userDetailsKey = `user_details_${user.email}`;
                const existingDetails = JSON.parse(localStorage.getItem(userDetailsKey) || '{}');
                localStorage.setItem(userDetailsKey, JSON.stringify({
                    ...existingDetails,
                    phone: phoneNumber
                }));
            }

            setUser(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

            // Update in 'db'
            updateUserInStorage(updatedUser);
            return true;
        }
        return false;
    };

    const googleLogin = async () => {
        // Simulate Google Login
        // In a real app, this would return a token and user details
        // We'll simulate a random verified user or just verify the current session if checking flow?
        // Actually, this is usually a separate login flow.
        // Let's create a "Google User"
        const email = `google_user_${Math.floor(Math.random() * 1000)}@gmail.com`;
        const googleUser: User = {
            name: 'Google User',
            email: email,
            role: 'student',
            isEmailVerified: true, // Google trusted
            isPhoneVerified: false // Phone usually strictly verified separately or trusted? Let's say false for now to test phone flow, or true if we assume google has it. User asked for "gmail only" trust.
        };
        setUser(googleUser);
        localStorage.setItem('currentUser', JSON.stringify(googleUser));

        // Initialize Defaults if new
        if (!localStorage.getItem(`user_details_${email}`)) {
            localStorage.setItem(`user_details_${email}`, JSON.stringify({
                targetExam: 'NEET',
                currentClass: 'Class 12',
                phone: ''
            }));
        }

        // Add to 'db' if not exists logic omitted for brevity in mock, just setting session
        router.push('/dashboard');
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
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        updateUserInStorage(updatedUser);
    };

    const updateUserInStorage = (updatedUser: User) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingIndex = users.findIndex((u: any) => u.email === updatedUser.email);
        if (existingIndex !== -1) {
            // Keep password
            const existing = users[existingIndex];
            users[existingIndex] = { ...existing, ...updatedUser };
            localStorage.setItem('users', JSON.stringify(users));
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateUser, verifyEmail, verifyPhone, googleLogin, isLoading }}>
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
