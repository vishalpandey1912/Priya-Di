import React from 'react';
import { BookOpen, PlayCircle, CheckCircle, PieChart } from 'lucide-react';
import styles from './Features.module.css';

export const Features = () => {
    const features = [
        {
            title: 'NCERT-Aligned Notes',
            desc: 'Concise, high-yield notes strictly based on NCERT for Biology, Physics, & Chemistry.',
            icon: <BookOpen size={24} color="#DC2626" />
        },
        {
            title: 'Concept Videos',
            desc: 'Short, crisp video explanations for difficult concepts and derivations.',
            icon: <PlayCircle size={24} color="#DC2626" />
        },
        {
            title: 'Topic-wise MCQs',
            desc: 'Thousands of questions sorted by topic/difficulty with detailed solutions.',
            icon: <CheckCircle size={24} color="#DC2626" />
        },
        {
            title: 'Performance Analytics',
            desc: 'Track your accuracy, speed, and weak areas with our advanced dashboard.',
            icon: <PieChart size={24} color="#DC2626" />
        }
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.textSide}>
                    <h2>Why Choose Desi Educators?</h2>
                    <p>We focus on what matters: Building concepts and practicing rigorously.</p>
                    <ul className={styles.featureList}>
                        {features.map((f, i) => (
                            <li key={i} className={styles.featureItem}>
                                <div className={styles.icon}>{f.icon}</div>
                                <div>
                                    <h3>{f.title}</h3>
                                    <p>{f.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.imageSide}>
                    {/* Placeholder for feature image */}
                    <div className={styles.featureImagePlaceholder}>
                        <div className={styles.mockupScreen}>
                            <div className={styles.mockupHeader}></div>
                            <div className={styles.mockupContent}>
                                <div className={styles.line}></div>
                                <div className={styles.line} style={{ width: '80%' }}></div>
                                <div className={styles.chartCircle}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
