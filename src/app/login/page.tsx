'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';
import { Button, Card, Input } from '@/components/ui';
import styles from '../(auth)/auth.module.css';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await login(email, password);

            // Check if the user is an admin after successful login
            // Note: In real app, we should check claim or profile.
            // For now, based on email assumption or just redirect to dashboard

            if (email === 'vishal.pandey1912@gmail.com') {
                router.push('/admin/dashboard');
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Card className={styles.authCard}>
                <div className={styles.header}>
                    <h1>Welcome Back</h1>
                    <p>Login to continue your preparation</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email"
                        icon={<Mail size={18} />}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        icon={<Lock size={18} />}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <p style={{ color: 'red', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

                    <div className={styles.forgotPassword}>
                        <Link href="/forgot-password">Forgot Password?</Link>
                    </div>

                    <Button type="submit" style={{ width: '100%' }} disabled={isLoading} isLoading={isLoading}>
                        Log In
                    </Button>
                </form>

                <div className={styles.divider}>OR</div>

                <Button
                    variant="outline"
                    className={styles.fullWidth}
                    style={{ width: '100%' }}
                    onClick={() => alert('Google Login coming soon!')}
                    type="button"
                >
                    Continue with Google
                </Button>

                <div className={styles.footer}>
                    Don't have an account?{' '}
                    <Link href="/signup" className={styles.link}>
                        Sign Up
                    </Link>
                </div>
            </Card>
        </div>
    );
}
