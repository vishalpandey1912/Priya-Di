'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import styles from './AdminLayout.module.css';
import { Menu } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

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
                        display: 'flex',
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
