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

    const [courses, setCourses] = React.useState<any[]>([]);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        if (user) {
            const email = user.email;
            const hasFullAccess = localStorage.getItem(`access_full_bundle_${email}`);
            const hasPhysics = localStorage.getItem(`access_physics_${email}`);
            const hasChemistry = localStorage.getItem(`access_chemistry_${email}`);
            const hasBiology = localStorage.getItem(`access_biology_${email}`);
            const hasTestSeries = localStorage.getItem(`access_test_series_${email}`);

            const activeCourses = [
                { name: 'Full NEET Bundle', enrolled: !!hasFullAccess, progress: 12, color: '#00A99D' },
                { name: 'Physics Mastery', enrolled: !!(hasPhysics || hasFullAccess), progress: 20, color: '#FF5722' },
                { name: 'Chemistry Mastery', enrolled: !!(hasChemistry || hasFullAccess), progress: 32, color: '#2196F3' },
                { name: 'Biology Mastery', enrolled: !!(hasBiology || hasFullAccess), progress: 45, color: '#8b5cf6' },
                { name: 'All India Test Series', enrolled: !!hasTestSeries, progress: 5, color: '#FFC107' },
            ].filter(c => c.enrolled);

            setCourses(activeCourses);
        }
    }, [user]);

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
                {/* Enrolled Courses / Progress */}
                <section className={styles.progressSection}>
                    <h2>Your Enrolled Courses</h2>
                    <Card className={styles.progressCard}>
                        {courses.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '32px 0', color: '#64748b' }}>
                                <p>You haven't enrolled in any courses yet.</p>
                                <Link href="/pricing">
                                    <Button size="sm" style={{ marginTop: '12px' }}>Browse Courses</Button>
                                </Link>
                            </div>
                        ) : (
                            courses.map((course, i) => (
                                <div key={i} className={styles.subjectRow}>
                                    <div className={styles.subjectInfo}>
                                        <span className={styles.subjectName}>{course.name}</span>
                                        <span className={styles.subjectPercent}>{course.progress}%</span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div className={styles.progressFill} style={{ width: `${course.progress}%`, backgroundColor: course.color }}></div>
                                    </div>
                                </div>
                            ))
                        )}
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
