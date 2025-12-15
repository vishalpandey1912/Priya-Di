import React from 'react';
import { SyllabusSidebar } from '@/components/neet';
import styles from './NeetLayout.module.css';

export default function NeetLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.layout}>
            <div className={styles.container}>
                <div className={styles.sidebarWrapper}>
                    <SyllabusSidebar />
                </div>
                <div className={styles.mainContent}>
                    {children}
                </div>
            </div>
        </div>
    );
}
