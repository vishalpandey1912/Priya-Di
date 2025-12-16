'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Input } from '@/components/ui';
import { Lock, GraduationCap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const success = await login(email, password);
            // Wait a bit to ensure context updates
            if (success) {
                // Double check authentication happens in context, but for admin we redirect to admin dashboard
                router.push('/admin/dashboard');
            } else {
                setError('Invalid Admin Credentials');
            }
        } catch (err) {
            setError('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f1f5f9'
        }}>
            <Card padding="lg" style={{ width: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'rgba(0, 169, 157, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <GraduationCap size={32} color="var(--primary-color)" />
                    </div>
                    <h1>Admin Portal</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Sign in to manage Desi Educators</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Input
                        label="Email"
                        type="email"
                        icon={<Lock size={16} />}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@desi.com"
                    />
                    <Input
                        label="Password"
                        type="password"
                        icon={<Lock size={16} />}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••"
                    />

                    {error && <p style={{ color: 'var(--error-color)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

                    <Button type="submit" style={{ width: '100%' }} disabled={loading} isLoading={loading}>
                        Access Dashboard
                    </Button>
                </form>
            </Card>
        </div>
    );
}
