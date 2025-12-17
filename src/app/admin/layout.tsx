'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import styles from './AdminLayout.module.css';
import { Menu } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);


    // Protect Admin Routes with Supabase
    React.useEffect(() => {
        const checkAuth = async () => {
            try {
                // Add a timeout to prevent infinite loading
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject('Timeout'), 5000));
                const authPromise = supabase.auth.getSession();

                const { data: { session }, error } = await Promise.race([authPromise, timeoutPromise]) as any;

                if (error) throw error;

                console.log('AdminLayout: Checking session', { session });

                if (!session) {
                    if (pathname !== '/admin/login') {
                        console.log('AdminLayout: No session, redirecting to login');
                        router.push('/admin/login');
                    } else {
                        setIsLoading(false); // Validly on login page
                    }
                } else {
                    console.log('AdminLayout: Session found, authenticating');
                    setIsAuthenticated(true);
                    if (pathname === '/admin/login') {
                        console.log('AdminLayout: Already logged in, redirecting to dashboard');
                        router.push('/admin/content');
                    }
                }
            } catch (error) {
                console.error('Auth check failed or timed out', error);
                if (pathname !== '/admin/login') {
                    router.push('/admin/login');
                } else {
                    setIsLoading(false);
                }
            } finally {
                if (pathname !== '/admin/login') {
                    setIsLoading(false);
                }
            }
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('AdminLayout: Auth state change', event, session);
            if (event === 'SIGNED_OUT') {
                setIsAuthenticated(false);
                router.push('/admin/login');
            } else if (session) {
                setIsAuthenticated(true);
                if (pathname === '/admin/login') {
                    router.push('/admin/content');
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [pathname, router]);

    // If on login page, render full screen without sidebar
    if (pathname === '/admin/login') {
        // If we are authenticated, we are likely redirecting, but render children briefly
        return <>{children}</>;
    }

    if (isLoading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading Admin...</div>;

    if (!isAuthenticated) return null;

    return (
        <div className={styles.container}>
            <div className={styles.sidebarWrapper}>
                <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            </div>
            <main className={styles.main}>
                <button
                    className={styles.mobileToggle}
                    onClick={() => setIsSidebarOpen(true)}
                    style={{
                        marginBottom: '16px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        // display: 'flex' handled by CSS class .mobileToggle
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: 600,
                        color: '#64748b'
                    }}
                >
                    <Menu size={24} /> Menu
                </button>
                {children}
            </main>
        </div>
    );
}
