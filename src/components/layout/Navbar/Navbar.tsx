'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, BookOpen, GraduationCap, LayoutDashboard, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import styles from './Navbar.module.css';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'NEET Exam', href: '/neet', icon: <BookOpen size={18} /> },
        { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} /> },
    ];

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <GraduationCap size={28} className={styles.logoIcon} />
                    <span>Desi Educators</span>
                </Link>

                {/* Desktop Navigation */}
                <div className={styles.desktopNav}>
                    {navLinks.map((link) => (
                        <Link key={link.name} href={link.href} className={styles.navLink}>
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className={styles.desktopActions}>
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                                <UserCircle size={24} />
                                <span style={{ fontWeight: 500 }}>{user.name}</span>
                            </div>
                            {/* Admin Link */}
                            {user.role === 'admin' && (
                                <Link href="/admin/dashboard">
                                    <Button size="sm" variant="outline">Admin Panel</Button>
                                </Link>
                            )}
                            <Button variant="ghost" size="sm" onClick={logout}>Log Out</Button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm">Log In</Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="sm">Start Prep Free</Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button className={styles.menuToggle} onClick={toggleMenu} aria-label="Toggle menu">
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
                <div className={styles.mobileLinks}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={styles.mobileLink}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.icon && <span className={styles.linkIcon}>{link.icon}</span>}
                            {link.name}
                        </Link>
                    ))}
                    <div className={styles.mobileActions}>
                        {user ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                                    <UserCircle size={20} />
                                    <span>{user.name}</span>
                                </div>
                                <Button size="sm" onClick={() => { logout(); setIsMenuOpen(false); }}>
                                    Log Out
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                    <Button variant="outline" className={styles.fullWidth}>Log In</Button>
                                </Link>
                                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                                    <Button className={styles.fullWidth}>Start Prep Free</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
