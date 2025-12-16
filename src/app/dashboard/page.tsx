'use client';

import React, { useEffect } from 'react';
import { Card, Button } from '@/components/ui';
import { BookOpen, Target, TrendingUp, Clock } from 'lucide-react';
import styles from './Dashboard.module.css';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1>High five, {user.name}! 👋</h1>
                <p>You're on track to complete Biology by next week.</p>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <Card padding="md" className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(0, 169, 157, 0.1)' }}>
                        <Target size={24} color="var(--primary-color)" />
                    </div>
                    <div>
                        <h3>68%</h3>
                        <p>Overall Accuracy</p>
                    </div>
                </Card>
                <Card padding="md" className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(33, 150, 243, 0.1)' }}>
                        <BookOpen size={24} color="#2196F3" />
                    </div>
                    <div>
                        <h3>12/98</h3>
                        <p>Chapters Completed</p>
                    </div>
                </Card>
                <Card padding="md" className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: 'rgba(255, 193, 7, 0.1)' }}>
                        <TrendingUp size={24} color="#FFC107" />
                    </div>
                    <div>
                        <h3>Top 15%</h3>
                        <p>Current Rank</p>
                    </div>
                </Card>
            </div>

            <div className={styles.mainGrid}>
                {/* Recent Activity / Progress */}
                <section className={styles.progressSection}>
                    <h2>Subject Progress</h2>
                    <Card className={styles.progressCard}>
                        <div className={styles.subjectRow}>
                            <div className={styles.subjectInfo}>
                                <span className={styles.subjectName}>Biology</span>
                                <span className={styles.subjectPercent}>45%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '45%', backgroundColor: '#00A99D' }}></div>
                            </div>
                        </div>
                        <div className={styles.subjectRow}>
                            <div className={styles.subjectInfo}>
                                <span className={styles.subjectName}>Physics</span>
                                <span className={styles.subjectPercent}>20%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '20%', backgroundColor: '#FF5722' }}></div>
                            </div>
                        </div>
                        <div className={styles.subjectRow}>
                            <div className={styles.subjectInfo}>
                                <span className={styles.subjectName}>Chemistry</span>
                                <span className={styles.subjectPercent}>32%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '32%', backgroundColor: '#2196F3' }}></div>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Continue Learning */}
                <section className={styles.continueSection}>
                    <h2>Continue Learning</h2>
                    <Card className={styles.continueCard}>
                        <div className={styles.continueHeader}>
                            <div className={styles.iconCircle}>
                                <Clock size={20} />
                            </div>
                            <div>
                                <h4>Genetics: DNA Replication</h4>
                                <p>Biology • Chapter 6</p>
                            </div>
                        </div>
                        <Link href="/neet/biology/genetics">
                            <Button size="sm" className="w-full">Resume Video</Button>
                        </Link>
                    </Card>

                    <Card className={styles.continueCard}>
                        <div className={styles.continueHeader}>
                            <div className={styles.iconCircle}>
                                <Target size={20} />
                            </div>
                            <div>
                                <h4>Rotational Motion - Test 2</h4>
                                <p>Physics • Mock Test</p>
                            </div>
                        </div>
                        <Link href="/neet/physics/rotational-motion">
                            <Button variant="outline" size="sm" className="w-full">Start Test</Button>
                        </Link>
                    </Card>
                </section>
            </div>
        </div>
    );
}
