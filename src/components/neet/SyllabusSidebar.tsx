'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, Book } from 'lucide-react';
import styles from './SyllabusSidebar.module.css';

import { useContent } from '@/context/ContentContext';

export const SyllabusSidebar = () => {
    const { chapters } = useContent();
    const [expandedSubject, setExpandedSubject] = useState<string | null>('biology');

    const toggleSubject = (subjectId: string) => {
        setExpandedSubject(expandedSubject === subjectId ? null : subjectId);
    };

    // Group chapters by subject
    const subjects = [
        { id: 'biology', name: 'Biology' },
        { id: 'physics', name: 'Physics' },
        { id: 'chemistry', name: 'Chemistry' }
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <Book size={20} />
                <h3>NEET Syllabus</h3>
            </div>
            <div className={styles.content}>
                {subjects.map((subject) => {
                    const subjectChapters = chapters.filter(c => c.subjectId === subject.id);

                    return (
                        <div key={subject.id} className={styles.subjectGroup}>
                            <button
                                className={styles.subjectHeader}
                                onClick={() => toggleSubject(subject.id)}
                            >
                                <span>{subject.name}</span>
                                {expandedSubject === subject.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>

                            {expandedSubject === subject.id && (
                                <div className={styles.unitList}>
                                    {subjectChapters.length > 0 ? (
                                        subjectChapters.map((chapter) => (
                                            <Link
                                                key={chapter.id}
                                                href={`/neet/${subject.id}/${chapter.id}`}
                                                className={styles.unitLink}
                                            >
                                                {chapter.title}
                                            </Link>
                                        ))
                                    ) : (
                                        <div style={{ padding: '8px 16px', fontSize: '0.85rem', color: '#94a3b8' }}>
                                            No chapters available.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
};
