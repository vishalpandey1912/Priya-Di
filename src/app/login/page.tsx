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
            const success = await login(email, password);
            if (success) {
                router.push('/dashboard');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('Something went wrong');
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

                <Button variant="outline" className={styles.fullWidth} style={{ width: '100%' }}>
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
