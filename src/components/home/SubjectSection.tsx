import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui';
import { Dna, Atom, FlaskConical } from 'lucide-react'; // Biology, Physics, Chemistry icons
import styles from './SubjectSection.module.css';

export const SubjectSection = () => {
    const subjects = [
        {
            id: 'biology',
            title: 'Biology',
            desc: 'Botany & Zoology with NCERT line-by-line coverage.',
            icon: <Dna size={32} color="#00A99D" />, // Primary Teal
            color: 'rgba(0, 169, 157, 0.1)',
            href: '/neet/biology'
        },
        {
            id: 'physics',
            title: 'Physics',
            desc: 'Visual concept clarity and numerical mastery.',
            icon: <Atom size={32} color="#FF5722" />, // Deep Orange
            color: 'rgba(255, 87, 34, 0.1)',
            href: '/neet/physics'
        },
        {
            id: 'chemistry',
            title: 'Chemistry',
            desc: 'Physical, Organic, and Inorganic simply explained.',
            icon: <FlaskConical size={32} color="#2196F3" />, // Blue
            color: 'rgba(33, 150, 243, 0.1)',
            href: '/neet/chemistry'
        }
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>Start Learning by Subject</h2>
                    <p>Structured courses designed designed for NEET 2026</p>
                </div>

                <div className={styles.grid}>
                    {subjects.map((sub) => (
                        <Link key={sub.id} href={sub.href}>
                            <Card hoverable className={styles.card}>
                                <div className={styles.iconBox} style={{ backgroundColor: sub.color }}>
                                    {sub.icon}
                                </div>
                                <h3>{sub.title}</h3>
                                <p>{sub.desc}</p>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
