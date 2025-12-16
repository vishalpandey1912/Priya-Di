'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

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
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: '64px' }}>
            <AdminSidebar />
            <main style={{ flex: 1, marginLeft: '250px', padding: '32px' }}>
                {children}
            </main>
        </div>
    );
}
