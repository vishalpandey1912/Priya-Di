'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import styles from './AdminLayout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, isLoading } = useAuth();
    const router = useRouter();

    // If on login page, render full screen without sidebar
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    // Protect Admin Routes
    React.useEffect(() => {
        if (!isLoading) {
            if (!user || user.role !== 'admin') {
                router.push('/admin/login');
            }
        }
    }, [user, isLoading, router]);

    if (isLoading) return <div>Loading Admin...</div>;

    if (!user || user.role !== 'admin') return null;

    return (
        <div className={styles.container}>
            <div className={styles.sidebarWrapper}>
                <AdminSidebar />
            </div>
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
