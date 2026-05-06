'use client';

import React, { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { WatermarkOverlay } from '@/components/ui/WatermarkOverlay/WatermarkOverlay';
import { LeadCaptureGate } from '@/components/quiz/LeadCaptureGate';
import { Mystic, mysticMessages, getMysticReaction } from '@/components/quiz/Mystic';
import styles from './quiz.module.css';

interface Question {
    id: string;
    question_text: string;
    options: string[];
    correct_option: number;
    marks: number;
    explanation?: string;
}

interface Quiz {
    id: string;
    title: string;
    duration_minutes: number;
    topic_id?: string;
    price?: number;
}

interface AnswerRecord {
    selected: number;
    isCorrect: boolean;
}

const subjectFromTitle = (title?: string): string => {
    if (!title) return 'NEET';
    const t = title.toLowerCase();
    if (t.includes('physic') || t.includes('mechan') || t.includes('optic') || t.includes('electric') || t.includes('atom') || t.includes('nucle') || t.includes('motion') || t.includes('energy')) return 'Physics';
    if (t.includes('chem') || t.includes('bond') || t.includes('equilib') || t.includes('coord') || t.includes('aldeh') || t.includes('hydrocar') || t.includes('block')) return 'Chemistry';
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

    const [activeIndex, setActiveIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, AnswerRecord>>({});
    const [streak, setStreak] = useState(0);
    const [wrongStreak, setWrongStreak] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [score, setScore] = useState(0);
    const [runningScore, setRunningScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    // Mystic reaction
    const [mysticState, setMysticState] = useState<'idle' | 'happy' | 'sad' | 'fire' | 'thinking' | 'excited' | 'celebrating' | 'cheering'>('idle');
    const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
    const [mysticThinkingTriggered, setMysticThinkingTriggered] = useState(false);
    const [mysticMessage, setMysticMessage] = useState<string | null>(null);
    const [scoreBump, setScoreBump] = useState(false);

    const [leadCaptured, setLeadCaptured] = useState<boolean | null>(null);

    useEffect(() => {
        if (user) { setLeadCaptured(true); return; }
        try {
            const stored = sessionStorage.getItem('de_lead_captured');
            setLeadCaptured(!!stored);
        } catch {
            setLeadCaptured(false);
        }
    }, [user]);

    useEffect(() => {
        if (authLoading || leadCaptured === null || !leadCaptured) return;
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

            if (quizErr || !quizData) { setLoading(false); return; }
            if ((quizData.price ?? 0) > 0 && !user) {
                setQuiz(quizData); setHasAccess(false); setLoading(false); return;
            }

            const { data: questionsData } = await supabase
                .from('quiz_questions')
                .select('id, question_text, options, correct_option, marks, explanation')
                .eq('quiz_id', quizId);

            if (!questionsData || questionsData.length === 0) { setLoading(false); return; }

            const shuffled = [...questionsData].sort(() => Math.random() - 0.5);
            setQuiz(quizData);
            setQuestions(shuffled);
            setHasAccess(true);
            setTimeLeft((quizData.duration_minutes || 30) * 60);
            setLoading(false);
        } catch (e) {
            console.error(e); setLoading(false);
        }
    };

    // Timer (only runs while quiz is in progress)
    useEffect(() => {
        if (!loading && hasAccess && !isFinished && timeLeft > 0) {
            const t = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) { handleFinish(); return 0; }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(t);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, hasAccess, isFinished, timeLeft]);

    const currentQ = questions[activeIndex];
    const currentAnswer = currentQ ? answers[currentQ.id] : undefined;
    const hasAnswered = !!currentAnswer;

    // Mystic "thinking" — if user dwells on a question 12+ seconds without answering
    useEffect(() => {
        if (hasAnswered || isFinished || mysticThinkingTriggered || mysticState !== 'idle') return;
        const dwellTimer = setTimeout(() => {
            setMysticThinkingTriggered(true);
            const reaction = getMysticReaction({ type: 'thinking', secondsOnQuestion: 12 });
            setMysticState(reaction.state);
            setMysticMessage(reaction.message);
            setTimeout(() => {
                setMysticState('idle');
                setMysticMessage(null);
            }, 4000);
        }, 12000);
        return () => clearTimeout(dwellTimer);
    }, [activeIndex, hasAnswered, isFinished, mysticThinkingTriggered, mysticState]);

    const handlePick = (idx: number) => {
        if (!currentQ || hasAnswered) return;
        const isCorrect = idx === currentQ.correct_option;
        const newStreak = isCorrect ? streak + 1 : 0;
        const newWrongStreak = isCorrect ? 0 : wrongStreak + 1;
        const answeredCount = Object.keys(answers).length + 1; // including this one

        setAnswers(prev => ({ ...prev, [currentQ.id]: { selected: idx, isCorrect } }));
        setStreak(newStreak);
        setWrongStreak(newWrongStreak);

        // Score
        const delta = isCorrect ? currentQ.marks : -1;
        setRunningScore(prev => prev + delta);
        setScoreBump(true);
        setTimeout(() => setScoreBump(false), 400);

        // Smart Mystic reaction — milestones override per-answer reactions
        const isMilestone = (
            answeredCount === 5 ||
            answeredCount === 10 ||
            answeredCount === 20 ||
            answeredCount === Math.floor(questions.length / 2) ||
            answeredCount === questions.length - 3
        );

        let reaction;
        if (isMilestone && isCorrect) {
            reaction = getMysticReaction({ type: 'milestone', count: answeredCount, total: questions.length });
        } else if (isCorrect) {
            reaction = getMysticReaction({ type: 'correct', streak: newStreak });
        } else {
            reaction = getMysticReaction({ type: 'wrong', streak: newStreak, wrongStreak: newWrongStreak } as any);
        }
        setMysticState(reaction.state);
        setMysticMessage(reaction.message);

        // Reset to idle after a beat (longer for celebrations so users see them)
        const msgDuration = reaction.state === 'celebrating' ? 3500 : 2200;
        const stateDuration = reaction.state === 'celebrating' ? 3700 : 2400;
        setTimeout(() => setMysticMessage(null), msgDuration);
        setTimeout(() => setMysticState('idle'), stateDuration);
    };

    const handleContinue = () => {
        if (!currentQ) return;
        // Snap mascot back to idle on advance, reset thinking timer
        setMysticState('idle');
        setMysticMessage(null);
        setMysticThinkingTriggered(false);
        setQuestionStartTime(Date.now());
        if (activeIndex < questions.length - 1) {
            setActiveIndex(i => i + 1);
        } else {
            handleFinish();
        }
    };

    const handleFinish = async () => {
        if (isFinished) return;

        let calculatedScore = 0;
        let correctCount = 0;
        let wrongCount = 0;
        const totalAnswered = Object.keys(answers).length;

        questions.forEach(q => {
            const a = answers[q.id];
            if (!a) return;
            if (a.isCorrect) {
                calculatedScore += q.marks;
                correctCount++;
            } else {
                calculatedScore -= 1;
                wrongCount++;
            }
        });

        const totalMarks = questions.length * 4;
        const percentage = totalMarks > 0 ? (calculatedScore / totalMarks) * 100 : 0;

        setScore(calculatedScore);
        setIsFinished(true);

        if (user && quiz) {
            const selectedAnswersForDB: Record<string, number> = {};
            Object.entries(answers).forEach(([qid, a]) => { selectedAnswersForDB[qid] = a.selected; });

            const { data: attempt } = await supabase
                .from('quiz_attempts')
                .insert({
                    user_id: user.id, quiz_id: quiz.id,
                    score: calculatedScore, total_marks: totalMarks,
                    correct_count: correctCount, wrong_count: wrongCount,
                    percentage, answers: selectedAnswersForDB,
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

            if (attempt?.id) router.push(`/quiz/result/${attempt.id}`);
        }
    };

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    // ─── Render gates ───
    if (leadCaptured === null) {
        return <div className={styles.shell}><div className={styles.loading}><div className={styles.loadingSpinner} />Loading…</div></div>;
    }
    if (!leadCaptured) {
        return <div className={styles.shell}><LeadCaptureGate quizId={quizId} onSuccess={() => setLeadCaptured(true)} /></div>;
    }
    if (loading) {
        return <div className={styles.shell}><div className={styles.loading}><div className={styles.loadingSpinner} />Preparing your quiz…</div></div>;
    }
    if (!quiz || questions.length === 0) {
        return <div className={styles.shell}><div className={styles.loading}>Quiz not found or empty.</div></div>;
    }

    const totalMarks = questions.length * 4;
    const correctCount = Object.values(answers).filter(a => a.isCorrect).length;
    const wrongCount = Object.values(answers).filter(a => !a.isCorrect).length;
    const skipCount = questions.length - correctCount - wrongCount;
    const percentage = isFinished ? Math.max(0, (score / totalMarks) * 100) : 0;
    const xpEarned = correctCount * 10;
    const subject = subjectFromTitle(quiz.title);
    const timerLow = !isFinished && timeLeft > 0 && timeLeft < 60;
    const progressPercent = ((activeIndex + (hasAnswered ? 1 : 0)) / questions.length) * 100;

    // ─── RESULT SCREEN ───
    if (isFinished) {
        const confColors = ['#c41e1e', '#16a34a', '#fbbf24', '#3b82f6', '#a855f7'];
        const confBits = Array.from({ length: 36 }).map((_, i) => ({
            color: confColors[i % confColors.length],
            left: Math.random() * 100,
            delay: Math.random() * 0.4,
            duration: 1.8 + Math.random() * 1.2,
        }));
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
                                    <span key={i} className={styles.confettiBit} style={{ left: `${b.left}%`, background: b.color, animationDelay: `${b.delay}s`, animationDuration: `${b.duration}s` }} />
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
                                <circle className={styles.scoreCircleFill} cx="80" cy="80" r={radius} strokeDasharray={circumference} strokeDashoffset={offset} />
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
                                <div className={styles.xpSub}>Sign up free to track XP, build a streak, and climb the weekly leaderboard.</div>
                                <Link href={`/signup?next=/quiz/${quizId}`} className={styles.xpCtaBtn}>Sign Up Free</Link>
                            </div>
                        )}

                        <div className={styles.resultActions}>
                            <Link href="/neet" className={`${styles.navBtn} ${styles.navBtnPrev}`} style={{ flex: 1, textAlign: 'center', textDecoration: 'none', display: 'inline-block' }}>More Quizzes</Link>
                            <button onClick={() => window.location.reload()} className={`${styles.navBtn} ${styles.navBtnNext}`}>Retake</button>
                        </div>

                        <a href="https://t.me/ProfPriyaPandeybot" target="_blank" rel="noopener noreferrer" className={styles.priyaLink}>
                            Stuck? Ask Priya AI on Telegram →
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // ─── QUIZ SCREEN ───
    return (
        <div className={styles.shell}>
            {user && <WatermarkOverlay text={user.email || 'User'} subtext={user.id?.slice(0, 8)} />}
            <div className={`${styles.container} ${hasAnswered ? styles.containerWithFeedback : ''}`}>
                {/* Top bar */}
                <div className={styles.topBar}>
                    <button onClick={() => router.push('/neet')} className={styles.exitBtn} aria-label="Exit">×</button>
                    <div className={styles.progressTrack}>
                        <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
                    </div>
                    <div className={`${styles.scorePill} ${scoreBump ? styles.scorePillBump : ''}`}>
                        <span className={styles.scorePillIcon}>🏆</span>
                        {runningScore}
                    </div>
                    <div className={`${styles.timer} ${timerLow ? styles.timerWarning : ''}`}>{formatTime(timeLeft)}</div>
                </div>

                <div className={styles.qHeader}>
                    <div className={styles.qNum}>Q {activeIndex + 1} of {questions.length}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {streak >= 2 && (
                            <div className={styles.streakBadge} key={streak}>
                                <span className={styles.streakFlame}>🔥</span>
                                {streak} streak
                            </div>
                        )}
                        <div className={styles.subjectBadge}>{subject}</div>
                    </div>
                </div>

                <div className={styles.mascotZone}>
                    <div className={styles.questionCard} key={currentQ.id}>
                    <div className={styles.questionText}>{currentQ.question_text}</div>

                    <div className={styles.options}>
                        {currentQ.options.map((option, idx) => {
                            let cls = styles.option;
                            if (hasAnswered) {
                                cls += ` ${styles.optionLocked}`;
                                if (currentAnswer.selected === idx) {
                                    cls += currentAnswer.isCorrect ? ` ${styles.optionCorrect}` : ` ${styles.optionWrong}`;
                                } else if (idx === currentQ.correct_option) {
                                    cls += ` ${styles.optionCorrectReveal}`;
                                } else {
                                    cls += ` ${styles.optionDimmed}`;
                                }
                            }
                            return (
                                <button key={idx} onClick={() => handlePick(idx)} className={cls}>
                                    <div className={styles.optionLetter}>{String.fromCharCode(65 + idx)}</div>
                                    <div className={styles.optionText}>{option}</div>
                                    {hasAnswered && currentAnswer.selected === idx && currentAnswer.isCorrect && (
                                        <>
                                            <div className={`${styles.floatingPoints} ${styles.floatingPointsCorrect}`}>+{currentQ.marks}</div>
                                            <div className={styles.optionCheckmark}>✓</div>
                                        </>
                                    )}
                                    {hasAnswered && currentAnswer.selected === idx && !currentAnswer.isCorrect && (
                                        <>
                                            <div className={`${styles.floatingPoints} ${styles.floatingPointsWrong}`}>−1</div>
                                            <div className={styles.optionCross}>✕</div>
                                        </>
                                    )}
                                    {hasAnswered && idx === currentQ.correct_option && currentAnswer.selected !== idx && (
                                        <div className={styles.optionCheckmark}>✓</div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    </div>

                    {/* Mystic — inline beside question */}
                    <div className={`${styles.mascot} ${
                        mysticState === 'happy' ? styles.mascotHappy :
                        mysticState === 'sad' ? styles.mascotSad :
                        mysticState === 'fire' ? styles.mascotFire : ''
                    }`}>
                        {mysticMessage && (
                            <div className={styles.mascotSpeech}>
                                {mysticMessage}
                            </div>
                        )}
                        <Mystic state={mysticState} progress={Object.keys(answers).length} />
                    </div>
                </div>

                {/* Dots progress (compact) */}
                {questions.length <= 24 && (
                    <div className={styles.dots}>
                        {questions.map((q, i) => {
                            const ans = answers[q.id];
                            return (
                                <div
                                    key={q.id}
                                    className={`${styles.dot} ${i === activeIndex ? styles.dotActive : (ans ? styles.dotAnswered : '')}`}
                                    style={ans && !ans.isCorrect ? { background: 'rgba(196, 30, 30, 0.7)' } : ans?.isCorrect ? { background: 'rgba(22, 163, 74, 0.7)' } : undefined}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Bottom feedback panel — slides up when an answer is locked */}
            {hasAnswered && (
                <div className={`${styles.feedbackPanel} ${currentAnswer.isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}`}>
                    <div className={styles.feedbackInner}>
                        <div className={styles.feedbackHeader}>
                            <div className={styles.feedbackBadge}>{currentAnswer.isCorrect ? '✓' : '✕'}</div>
                            <div>
                                <div className={styles.feedbackTitle}>
                                    {currentAnswer.isCorrect ? 'Correct!' : 'Not quite.'}
                                </div>
                                <div className={styles.feedbackSubtitle}>
                                    {currentAnswer.isCorrect ? `+${currentQ.marks} marks earned` : '−1 mark for wrong answer'}
                                </div>
                            </div>
                        </div>
                        {/* Always show the correct answer — both for correct (confirmation) and wrong (correction) */}
                        <div className={styles.feedbackExplanation}>
                            <strong>{currentAnswer.isCorrect ? 'Answer:' : 'Correct answer:'}</strong>{' '}
                            {String.fromCharCode(65 + currentQ.correct_option)}. {currentQ.options[currentQ.correct_option]}
                        </div>
                        {/* Show the NCERT explanation if available — fallback to a generic line if missing */}
                        <div className={styles.feedbackExplanation}>
                            <strong>Why:</strong>{' '}
                            {currentQ.explanation && currentQ.explanation.trim().length > 0
                                ? currentQ.explanation
                                : `Refer to the relevant NCERT section. The correct option is ${String.fromCharCode(65 + currentQ.correct_option)}.`}
                        </div>
                        <button onClick={handleContinue} className={styles.feedbackBtn}>
                            {activeIndex === questions.length - 1 ? 'See Results →' : 'Continue →'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
