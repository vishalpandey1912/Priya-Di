'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileText, PlayCircle, HelpCircle, PenTool } from 'lucide-react';
import { Card, Button } from '@/components/ui';
import { useContent } from '@/context/ContentContext';
import styles from './ExamTabs.module.css';

const tabs = [
    { id: 'notes', label: 'Notes', icon: <FileText size={18} /> },
    { id: 'videos', label: 'Videos', icon: <PlayCircle size={18} /> },
    { id: 'tests', label: 'Mock Tests', icon: <PenTool size={18} /> },
    { id: 'doubts', label: 'Doubts', icon: <HelpCircle size={18} /> },
];

export const ExamTabs = () => {
    const [activeTab, setActiveTab] = useState('notes');

    const { chapters } = useContent();

    // Get recent 3 chapters with materials
    const recentNotes = chapters
        .filter(c => c.topics.some(t => t.materials.length > 0))
        .slice(0, 3);

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
                        {recentNotes.length > 0 ? (
                            recentNotes.map(chapter => (
                                <Link key={chapter.id} href={`/neet/${chapter.subjectId}/${chapter.id}`} className={styles.placeholderItem}>
                                    {chapter.title} (PDF)
                                </Link>
                            ))
                        ) : (
                            <p>No recent notes found.</p>
                        )}
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
