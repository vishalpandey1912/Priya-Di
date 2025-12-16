import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    ShoppingCart,
    Settings,
    LogOut,
    GraduationCap,
    MessageSquare,
    DollarSign
} from 'lucide-react';
import styles from './AdminSidebar.module.css';
import { useAuth } from '@/context/AuthContext';

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export const AdminSidebar = ({ isOpen = false, onClose }: AdminSidebarProps) => {
    const pathname = usePathname();
    const { logout } = useAuth();

    const links = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Courses', href: '/admin/content', icon: <BookOpen size={20} /> },
        { name: 'Monetization', href: '/admin/monetization', icon: <DollarSign size={20} /> },
        { name: 'Users', href: '/admin/users', icon: <Users size={20} /> },
        { name: 'Orders', href: '/admin/orders', icon: <ShoppingCart size={20} /> },
        { name: 'Settings', href: '/admin/settings', icon: <Settings size={20} /> },
        { name: 'Support', href: '/admin/support', icon: <MessageSquare size={20} /> },
    ];

    return (
        <>
            <div
                className={`${styles.backdrop} ${isOpen ? styles.visible : ''}`}
                onClick={onClose}
            />
            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.header}>
                    <GraduationCap size={28} color="var(--primary-color)" />
                    <span className={styles.brand}>Desi Admin</span>
                </div>

                <nav className={styles.nav}>
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${styles.link} ${pathname === link.href ? styles.active : ''}`}
                            onClick={onClose}
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className={styles.footer}>
                    <button onClick={logout} className={styles.logoutBtn}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};
