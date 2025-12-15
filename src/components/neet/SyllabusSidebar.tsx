'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, Book } from 'lucide-react';
import styles from './SyllabusSidebar.module.css';

import { syllabusData } from '@/data/syllabus';

export const SyllabusSidebar = () => {
    const [expandedSubject, setExpandedSubject] = useState<string | null>('biology');

    const toggleSubject = (subjectId: string) => {
        setExpandedSubject(expandedSubject === subjectId ? null : subjectId);
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <Book size={20} />
                <h3>NEET Syllabus</h3>
            </div>
            <div className={styles.content}>
                {syllabusData.map((data) => (
                    <div key={data.id} className={styles.subjectGroup}>
                        <button
                            className={styles.subjectHeader}
                            onClick={() => toggleSubject(data.id)}
                        >
                            <span>{data.name}</span>
                            {expandedSubject === data.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>

                        {expandedSubject === data.id && (
                            <div className={styles.unitList}>
                                {data.units.map((unit) => (
                                    <Link
                                        key={unit.id}
                                        href={`/neet/${data.id}/${unit.id}`}
                                        className={styles.unitLink}
                                    >
                                        {unit.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </aside>
    );
};
