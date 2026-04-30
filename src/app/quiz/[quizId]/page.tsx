'use client';

import React, { useState, useEffect, use, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { WatermarkOverlay } from '@/components/ui/WatermarkOverlay/WatermarkOverlay';
import { LeadCaptureGate } from '@/components/quiz/LeadCaptureGate';
import styles from './quiz.module.css';

interface Question {
    id: string;
    question_text: string;
    options: string[];
    correct_option: number;
    marks: number;
}

interface Quiz {
    id: string;
    title: string;
    duration_minutes: number;
    topic_id?: string;
    price?: number;
}

const subjectFromTitle = (title?: string): string => {
    if (!title) return 'NEET';
    const t = title.toLowerCase();
    if (t.includes('physic') || t.includes('mechan') || t.includes('optic') || t.includes('electric') || t.includes('atom') || t.includes('nucle')) return 'Physics';
    if (t.includes('chem') || t.includes('bond') || t.includes('equilib') || t.includes('coord') || t.includes('aldeh') || t.includes('hydrocar')) return 'Chemistry';
    return 'Biology';
};

export default function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
    const { quizId } = use(params);
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);

    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    const [leadCaptured, setLeadCaptured] = useState<boolean | null>(null);

    useEffect(() => {
        if (user) { setLeadCaptured(true); return; }
        try {
            const stored = localStorage.getItem('de_lead_captured');
            setLeadCaptured(!!stored);
        } catch {
            setLeadCaptured(false);
        }
    }, [user]);

    useEffect(() => {
        if (authLoading) return;
        if (leadCaptured === null) return;
        if (!leadCaptured) return;
        fetchQuiz();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quizId, authLoading, leadCaptured]);

    const fetchQuiz = async () => {
        try {
            const { data: quizData, error: quizErr } = await supabase
                .from('quizzes')
                .select('id, title, duration_minutes, topic_id, price')
                .eq('id', quizId)
                .single();

            if (quizErr || !quizData) {
                console.error('Failed to fetch quiz:', quizErr);
                setLoading(false);
                return;
            }

            if ((quizData.price ?? 0) > 0 && !user) {
                setQuiz(quizData);
                setHasAccess(false);
                setLoading(false);
                return;
            }

            const { data: questionsData, error: qErr } = await supabase
                .from('quiz_questions')
                .select('id, question_text, options, correct_option, marks')
                .eq('quiz_id', quizId);

            if (qErr || !questionsData || questionsData.length === 0) {
                console.error('Failed to fetch questions:', qErr);
                setLoading(false);
                return;
            }

            const shuffled = [...questionsData].sort(() => Math.random() - 0.5);
            setQuiz(quizData);
            setQuestions(shuffled);
            setHasAccess(true);
            setTimeLeft((quizData.duration_minutes || 30) * 60);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching quiz:', error);
            setLoading(false);
        }
    };

    // Timer
    useEffect(() => {
        if (!loading && hasAccess && !isSubmitted && timeLeft > 0) {
            const t = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) { handleSubmit(); return 0; }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(t);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, hasAccess, isSubmitted, timeLeft]);

    const handleOptionSelect = (questionId: string, optionIndex: number) => {
        if (isSubmitted) return;
        setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    };

    const handleSubmit = async () => {
        if (isSubmitted) return;

        let calculatedScore = 0;
        let correctCount = 0;
        const totalAnswered = Object.keys(selectedAnswers).length;

        questions.forEach(q => {
            if (selectedAnswers[q.id] === q.correct_option) {
                calculatedScore += q.marks;
                correctCount++;
            } else if (selectedAnswers[q.id] !== undefined) {
                calculatedScore -= 1;
            }
        });

        const wrongCount = totalAnswered - correctCount;
        const totalMarks = questions.length * 4;
        const percentage = totalMarks > 0 ? (calculatedScore / totalMarks) * 100 : 0;

        setScore(calculatedScore);
        setIsSubmitted(true);

        if (user && quiz) {
            const { data: attempt } = await supabase
                .from('quiz_attempts')
                .insert({
                    user_id: user.id,
                    quiz_id: quiz.id,
                    score: calculatedScore,
                    total_marks: totalMarks,
                    correct_count: correctCount,
                    wrong_count: wrongCount,
                    percentage,
                    answers: selectedAnswers,
                    completed_at: new Date().toISOString()
                })
                .select('id')
                .single();

            if (correctCount > 0) {
                try {
                    await fetch('/api/gamification/award-xp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ source: 'quiz_correct', custom_xp: correctCount * 10 })
                    });
                } catch {}
            }

            if (attempt?.id) {
                router.push(`/quiz/result/${attempt.id}`);
            }
        }
    };

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    // ─── Render gates ───
    if (leadCaptured === null) {
        return (
            <div className={styles.shell}>
                <div className={styles.loading}>
                    <div className={styles.loadingSpinner} />
                    Loading…
                </div>
            </div>
        );
    }
    if (!leadCaptured) {
        return (
            <div className={styles.shell}>
                <LeadCaptureGate quizId={quizId} onSuccess={() => setLeadCaptured(true)} />
            </div>
        );
    }
    if (loading) {
        return (
            <div className={styles.shell}>
                <div className={styles.loading}>
                    <div className={styles.loadingSpinner} />
                    Preparing your quiz…
                </div>
            </div>
        );
    }
    if (!quiz || questions.length === 0) {
        return (
            <div className={styles.shell}>
                <div className={styles.loading}>Quiz not found or empty.</div>
            </div>
        );
    }

    const currentQ = questions[activeQuestionIndex];
    const selected = selectedAnswers[currentQ.id];
    const totalMarks = questions.length * 4;
    const correctCount = isSubmitted ? questions.filter(q => selectedAnswers[q.id] === q.correct_option).length : 0;
    const wrongCount = isSubmitted ? Object.keys(selectedAnswers).length - correctCount : 0;
    const skipCount = isSubmitted ? questions.length - Object.keys(selectedAnswers).length : 0;
    const percentage = isSubmitted ? Math.max(0, (score / totalMarks) * 100) : 0;
    const xpEarned = correctCount * 10;
    const subject = subjectFromTitle(quiz.title);
    const timerLow = !isSubmitted && timeLeft > 0 && timeLeft < 60;
    const progressPercent = ((activeQuestionIndex + 1) / questions.length) * 100;

    // Result screen
    if (isSubmitted) {
        // Confetti palette
        const confColors = ['#c41e1e', '#16a34a', '#fbbf24', '#3b82f6', '#a855f7'];
        const confBits = Array.from({ length: 36 }).map((_, i) => ({
            color: confColors[i % confColors.length],
            left: Math.random() * 100,
            delay: Math.random() * 0.4,
            duration: 1.8 + Math.random() * 1.2,
        }));

        // Score circle math
        const radius = 70;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (Math.max(0, percentage) / 100) * circumference;

        return (
            <div className={styles.shell}>
                <div className={styles.container}>
                    <div className={styles.resultCard}>
                        {percentage >= 50 && (
                            <div className={styles.celebrate}>
                                {confBits.map((b, i) => (
                                    <span
                                        key={i}
                                        className={styles.confettiBit}
                                        style={{
                                            left: `${b.left}%`,
                                            background: b.color,
                                            animationDelay: `${b.delay}s`,
                                            animationDuration: `${b.duration}s`,
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        <div className={styles.resultBanner}>Quiz Complete</div>
                        <div className={styles.resultTitle}>
                            {percentage >= 75 ? 'Outstanding.' : percentage >= 50 ? 'Solid effort.' : percentage >= 25 ? 'Keep going.' : 'Practice makes perfect.'}
                        </div>

                        <div className={styles.scoreCircle}>
                            <svg className={styles.scoreCircleSvg} viewBox="0 0 160 160">
                                <circle className={styles.scoreCircleBg} cx="80" cy="80" r={radius} />
                                <circle
                                    className={styles.scoreCircleFill}
                                    cx="80"
                                    cy="80"
                                    r={radius}
                                    strokeDasharray={circumference}
                                    strokeDashoffset={offset}
                                />
                            </svg>
                            <div className={styles.scoreNumber}>
                                <strong>{score}</strong>
                                <span>of {totalMarks}</span>
                            </div>
                        </div>

                        <div className={styles.statRow}>
                            <div className={`${styles.stat} ${styles.statCorrect}`}>
                                <div className={styles.statNum}>{correctCount}</div>
                                <div className={styles.statLabel}>Correct</div>
                            </div>
                            <div className={`${styles.stat} ${styles.statWrong}`}>
                                <div className={styles.statNum}>{wrongCount}</div>
                                <div className={styles.statLabel}>Wrong</div>
                            </div>
                            <div className={styles.stat}>
                                <div className={styles.statNum}>{skipCount}</div>
                                <div className={styles.statLabel}>Skipped</div>
                            </div>
                        </div>

                        {!user && (
                            <div className={styles.xpCta}>
                                <div className={styles.xpBadge}>SAVE YOUR PROGRESS</div>
                                <div className={styles.xpHeading}>You would have earned {xpEarned} XP.</div>
                                <div className={styles.xpSub}>
                                    Sign up free to track XP, build a streak, and climb the weekly leaderboard.
                                </div>
                                <Link href={`/signup?next=/quiz/${quizId}`} className={styles.xpCtaBtn}>
                                    Sign Up Free
                                </Link>
                            </div>
                        )}

                        <div className={styles.resultActions}>
                            <Link href="/neet" className={`${styles.navBtn} ${styles.navBtnPrev}`} style={{ flex: 1, textAlign: 'center', textDecoration: 'none', display: 'inline-block' }}>
                                More Quizzes
                            </Link>
                            <button onClick={() => window.location.reload()} className={`${styles.navBtn} ${styles.navBtnNext}`}>
                                Retake
                            </button>
                        </div>

                        <a
                            href="https://t.me/ProfPriyaPandeybot"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.priyaLink}
                        >
                            Stuck? Ask Priya AI on Telegram →
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Quiz screen
    return (
        <div className={styles.shell}>
            {user && (
                <WatermarkOverlay text={user.email || 'User'} subtext={user.id?.slice(0, 8)} />
            )}
            <div className={styles.container}>
                {/* Top bar */}
                <div className={styles.topBar}>
                    <button onClick={() => router.push('/neet')} className={styles.exitBtn} aria-label="Exit">×</button>
                    <div className={styles.progressTrack}>
                        <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
                    </div>
                    <div className={`${styles.timer} ${timerLow ? styles.timerWarning : ''}`}>
                        {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Question card */}
                <div className={styles.qHeader}>
                    <div className={styles.qNum}>Q {activeQuestionIndex + 1} of {questions.length}</div>
                    <div className={styles.subjectBadge}>{subject}</div>
                </div>

                <div className={styles.questionCard} key={currentQ.id}>
                    <div className={styles.questionText}>{currentQ.question_text}</div>

                    <div className={styles.options}>
                        {currentQ.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleOptionSelect(currentQ.id, idx)}
                                className={`${styles.option} ${selected === idx ? styles.optionSelected : ''}`}
                            >
                                <div className={styles.optionLetter}>{String.fromCharCode(65 + idx)}</div>
                                <div className={styles.optionText}>{option}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Nav row */}
                <div className={styles.navRow}>
                    <button
                        onClick={() => setActiveQuestionIndex(i => Math.max(0, i - 1))}
                        disabled={activeQuestionIndex === 0}
                        className={`${styles.navBtn} ${styles.navBtnPrev}`}
                    >
                        Previous
                    </button>
                    {activeQuestionIndex === questions.length - 1 ? (
                        <button onClick={handleSubmit} className={`${styles.navBtn} ${styles.navBtnSubmit}`}>
                            Submit
                        </button>
                    ) : (
                        <button
                            onClick={() => setActiveQuestionIndex(i => Math.min(questions.length - 1, i + 1))}
                            className={`${styles.navBtn} ${styles.navBtnNext}`}
                        >
                            Next →
                        </button>
                    )}
                </div>

                {/* Dots progress (compact for ≤24 questions; hide for more) */}
                {questions.length <= 24 && (
                    <div className={styles.dots}>
                        {questions.map((q, i) => (
                            <div
                                key={q.id}
                                className={`${styles.dot} ${i === activeQuestionIndex ? styles.dotActive : (selectedAnswers[q.id] !== undefined ? styles.dotAnswered : '')}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
