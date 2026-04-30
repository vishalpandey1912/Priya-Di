'use client';

import React, { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Button, Card } from '@/components/ui';
import { ArrowLeft, CheckCircle, XCircle, Timer, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PaymentModal } from '@/components/ui/PaymentModal/PaymentModal';
import { WatermarkOverlay } from '@/components/ui/WatermarkOverlay/WatermarkOverlay';
import { LeadCaptureGate } from '@/components/quiz/LeadCaptureGate';

interface Question {
    id: string;
    question_text: string;
    options: string[]; // Array of 4 options
    correct_option: number; // 0-3
    marks: number;
}

interface Quiz {
    id: string;
    title: string;
    duration_minutes: number;
    topic_id?: string;
    price?: number;
}

export default function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
    const { quizId } = use(params);
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Quiz State
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    // Lead capture gate state — anonymous users must enter name/email/phone before quiz loads.
    // We check localStorage on mount to skip if already captured. Logged-in users auto-pass.
    const [leadCaptured, setLeadCaptured] = useState<boolean | null>(null);

    useEffect(() => {
        if (user) {
            setLeadCaptured(true); // Logged-in users skip the gate
            return;
        }
        try {
            const stored = localStorage.getItem('de_lead_captured');
            setLeadCaptured(!!stored);
        } catch {
            setLeadCaptured(false);
        }
    }, [user]);

    // Quiz fetches only AFTER auth state is known AND lead is captured (or user is logged in).
    useEffect(() => {
        if (authLoading) return;
        if (leadCaptured === null) return;
        if (!leadCaptured) return;
        fetchQuiz();
    }, [quizId, authLoading, leadCaptured]);

    const fetchQuiz = async () => {
        try {
            // Direct Supabase query — works for anonymous and logged-in users.
            // All current quizzes are price=0 (free).
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

            // Non-free quizzes for anonymous users → show payment card
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

            if (qErr || !questionsData) {
                console.error('Failed to fetch questions:', qErr);
                setLoading(false);
                return;
            }

            // Shuffle for fairness across attempts
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

    // Timer Effect
    useEffect(() => {
        if (!loading && hasAccess && !isSubmitted && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [loading, hasAccess, isSubmitted, timeLeft]);

    const handleOptionSelect = (questionId: string, optionIndex: number) => {
        if (isSubmitted) return;
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    const handleSubmit = async () => {
        let calculatedScore = 0;
        let correctCount = 0;
        const totalAnswered = Object.keys(selectedAnswers).length;

        questions.forEach(q => {
            if (selectedAnswers[q.id] === q.correct_option) {
                calculatedScore += q.marks;
                correctCount++;
            } else if (selectedAnswers[q.id] !== undefined) {
                calculatedScore -= 1; // NEET-style: +4/-1 per question
            }
        });

        const wrongCount = totalAnswered - correctCount;
        const totalMarks = questions.length * 4;
        const percentage = totalMarks > 0 ? (calculatedScore / totalMarks) * 100 : 0;

        setScore(calculatedScore);
        setIsSubmitted(true);

        // Save Attempt with CORRECT column names
        if (user && quiz) {
            const { data: attempt, error: attemptError } = await supabase
                .from('quiz_attempts')
                .insert({
                    user_id: user.id,
                    quiz_id: quiz.id,
                    score: calculatedScore,
                    total_marks: totalMarks,
                    correct_count: correctCount,
                    wrong_count: wrongCount,
                    percentage: percentage,
                    answers: selectedAnswers,
                    completed_at: new Date().toISOString()
                })
                .select('id')
                .single();

            if (attemptError) {
                console.error('Error saving attempt:', attemptError);
            }

            // Award XP for correct answers (10 XP each per quiz_correct value)
            if (correctCount > 0) {
                try {
                    await fetch('/api/gamification/award-xp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            source: 'quiz_correct',
                            custom_xp: correctCount * 10
                        })
                    });
                } catch (xpErr) {
                    console.error('XP award failed:', xpErr);
                }
            }

            // Redirect to result page
            if (attempt?.id) {
                router.push(`/quiz/result/${attempt.id}`);
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading && leadCaptured) return <div style={{ padding: '48px 20px', textAlign: 'center', color: '#6b7280' }}>Loading quiz...</div>;

    if (!hasAccess && quiz) {
        return (
            <div className="p-8 flex flex-col items-center justify-center">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
                <p className="mb-6 text-gray-600">You need to unlock this quiz to rely attempt it.</p>
                <Button onClick={() => setShowPaymentModal(true)}>
                    Unlock for ₹{quiz.price}
                </Button>

                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    amount={quiz.price || 0}
                    planName={quiz.title}
                    onSuccess={() => {
                        setShowPaymentModal(false);
                        fetchQuiz();
                    }}
                    items={[{ id: quiz.id, title: quiz.title, type: 'quiz' }]}
                />
            </div>
        );
    }

    // Lead capture gate — block quiz fetch + render until user provides name/email/phone
    if (leadCaptured === null) {
        return <div style={{ padding: '48px 20px', textAlign: 'center', color: '#6b7280' }}>Loading...</div>;
    }
    if (!leadCaptured) {
        return (
            <LeadCaptureGate
                quizId={quizId}
                quizTitle={undefined}
                onSuccess={() => setLeadCaptured(true)}
            />
        );
    }

    if (!quiz || questions.length === 0) return <div style={{ padding: '48px 20px', textAlign: 'center', color: '#6b7280' }}>Quiz not found or empty.</div>;

    return (
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '20px 16px 40px' }}>
            {user && hasAccess && !isSubmitted && (
                <WatermarkOverlay
                    text={user.email || 'User'}
                    subtext={user.id?.slice(0, 8)}
                />
            )}

            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                gap: '12px',
                flexWrap: 'wrap'
            }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <h1 style={{
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        color: '#1a1a1a',
                        marginBottom: '4px',
                        fontFamily: "'Cormorant Garamond', serif",
                        lineHeight: 1.2
                    }}>{quiz.title}</h1>
                    <p style={{ color: '#6b7280', fontSize: '13px' }}>
                        Question {activeQuestionIndex + 1} of {questions.length}
                    </p>
                </div>
                {!isSubmitted && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#c41e1e',
                        background: '#fef2f2',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontFamily: 'monospace',
                        whiteSpace: 'nowrap'
                    }}>
                        <Timer size={18} />
                        {formatTime(timeLeft)}
                    </div>
                )}
            </div>

            {isSubmitted ? (
                <Card style={{ padding: '32px 24px', textAlign: 'center' }}>
                    <CheckCircle style={{ margin: '0 auto 16px', color: '#16a34a' }} size={56} />
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '8px', fontFamily: "'Cormorant Garamond', serif" }}>Quiz Submitted</h2>
                    <p style={{ color: '#4b5563', fontSize: '16px', marginBottom: '24px' }}>
                        Your Score: <span style={{ color: '#c41e1e', fontWeight: 700, fontSize: '20px' }}>{score}</span> / {questions.length * 4}
                    </p>

                    {!user && (
                        <div style={{
                            background: 'linear-gradient(135deg, #c41e1e 0%, #8b0000 100%)',
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '24px',
                            color: '#fff',
                            textAlign: 'left'
                        }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', opacity: 0.85, marginBottom: '6px' }}>SAVE YOUR PROGRESS</div>
                            <div style={{ fontSize: '17px', fontWeight: 700, marginBottom: '6px', fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.3 }}>
                                Sign up free to track your XP, build a streak, and unlock the leaderboard.
                            </div>
                            <div style={{ fontSize: '13px', opacity: 0.9, marginBottom: '12px', lineHeight: 1.5 }}>
                                You scored {score}/{questions.length * 4}. With an account, this would have earned you {questions.filter(q => selectedAnswers[q.id] === q.correct_option).length * 10} XP.
                            </div>
                            <Link href={`/signup?next=/quiz/${quizId}`} style={{
                                display: 'inline-block',
                                padding: '10px 20px',
                                background: '#fff',
                                color: '#c41e1e',
                                borderRadius: '8px',
                                fontWeight: 700,
                                fontSize: '14px',
                                textDecoration: 'none'
                            }}>
                                Sign Up Free →
                            </Link>
                        </div>
                    )}

                    <div className="flex justify-center gap-4 flex-wrap">
                        <Link href="/neet">
                            <Button variant="outline">More Quizzes</Button>
                        </Link>
                        <Button onClick={() => window.location.reload()}>Retake Quiz</Button>
                    </div>

                    {!user && (
                        <p style={{ marginTop: '20px', fontSize: '13px', color: '#6b7280' }}>
                            Stuck on questions? <a href="https://t.me/ProfPriyaPandeybot" target="_blank" rel="noopener noreferrer" style={{ color: '#c41e1e', fontWeight: 600 }}>Ask Priya AI on Telegram (free)</a>
                        </p>
                    )}
                </Card>
            ) : (
                <Card style={{ padding: '24px 20px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{
                            fontSize: '17px',
                            fontWeight: 600,
                            marginBottom: '20px',
                            color: '#1a1a1a',
                            lineHeight: 1.5
                        }}>
                            {activeQuestionIndex + 1}. {questions[activeQuestionIndex].question_text}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {questions[activeQuestionIndex].options.map((option, idx) => {
                                const isSelected = selectedAnswers[questions[activeQuestionIndex].id] === idx;
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => handleOptionSelect(questions[activeQuestionIndex].id, idx)}
                                        style={{
                                            padding: '14px 16px',
                                            border: isSelected ? '2px solid #c41e1e' : '1.5px solid #e5e7eb',
                                            background: isSelected ? '#fef2f2' : '#fff',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px'
                                        }}
                                    >
                                        <div style={{
                                            flexShrink: 0,
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            border: isSelected ? '2px solid #c41e1e' : '1.5px solid #d1d5db',
                                            background: isSelected ? '#c41e1e' : '#fff',
                                            color: isSelected ? '#fff' : '#6b7280',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 700,
                                            fontSize: '13px'
                                        }}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span style={{
                                            fontSize: '15px',
                                            color: '#1a1a1a',
                                            lineHeight: 1.5,
                                            flex: 1
                                        }}>{option}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '24px',
                        paddingTop: '16px',
                        borderTop: '1px solid #e5e7eb',
                        gap: '12px'
                    }}>
                        <button
                            onClick={() => setActiveQuestionIndex(prev => Math.max(0, prev - 1))}
                            disabled={activeQuestionIndex === 0}
                            style={{
                                padding: '10px 20px',
                                background: '#fff',
                                color: activeQuestionIndex === 0 ? '#d1d5db' : '#c41e1e',
                                border: `1.5px solid ${activeQuestionIndex === 0 ? '#e5e7eb' : '#c41e1e'}`,
                                borderRadius: '8px',
                                fontWeight: 600,
                                fontSize: '14px',
                                cursor: activeQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                                fontFamily: "'Karla', sans-serif"
                            }}
                        >
                            Previous
                        </button>

                        {activeQuestionIndex === questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                style={{
                                    padding: '10px 24px',
                                    background: '#16a34a',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(22,163,74,0.3)',
                                    fontFamily: "'Karla', sans-serif"
                                }}
                            >
                                Submit Quiz
                            </button>
                        ) : (
                            <button
                                onClick={() => setActiveQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                style={{
                                    padding: '10px 24px',
                                    background: '#c41e1e',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(196,30,30,0.3)',
                                    fontFamily: "'Karla', sans-serif"
                                }}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
}
