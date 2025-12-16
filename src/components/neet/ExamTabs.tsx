'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, PlayCircle, HelpCircle, PenTool } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import styles from './ExamTabs.module.css';

const tabs = [
    { id: 'notes', label: 'Notes', icon: <FileText size={18} /> },
    { id: 'videos', label: 'Videos', icon: <PlayCircle size={18} /> },
    { id: 'tests', label: 'Mock Tests', icon: <PenTool size={18} /> },
    { id: 'doubts', label: 'Doubts', icon: <HelpCircle size={18} /> },
];

export const ExamTabs = () => {
    const [activeTab, setActiveTab] = useState('notes');

    return (
        <div className={styles.container}>
            {/* Tab Navigation */}
            <div className={styles.tabList}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <Card className={styles.contentArea}>
                {activeTab === 'notes' && (
                    <div className={styles.grid}>
                        <h3>Recent Notes</h3>
                        <Link href="/neet/biology/1" className={styles.placeholderItem}>
                            Chapter 1: The Living World (PDF)
                        </Link>
                        <Link href="/neet/biology/2" className={styles.placeholderItem}>
                            Chapter 2: Biological Classification (PDF)
                        </Link>
                    </div>
                )}
                {activeTab === 'videos' && (
                    <div className={styles.grid}>
                        <h3>Concept Videos</h3>
                        <Link href="/neet/biology/3" className={styles.videoPlaceholder}>
                            Introduction to Botany
                        </Link>
                    </div>
                )}
                {activeTab === 'tests' && <div>No active tests currently.</div>}
                {activeTab === 'doubts' && <div>Join the discussion forum.</div>}
            </Card>
        </div>
    );
};
