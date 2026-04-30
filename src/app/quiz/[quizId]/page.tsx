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

    if (loading && leadCaptured) return <div className="p-8 text-center">Loading quiz...</div>;

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
        return <div className="p-8 text-center">Loading...</div>;
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

    if (!quiz || questions.length === 0) return <div className="p-8 text-center">Quiz not found or empty.</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            {user && hasAccess && !isSubmitted && (
                <WatermarkOverlay
                    text={user.email || 'User'}
                    subtext={user.id?.slice(0, 8)}
                />
            )}

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">{quiz.title}</h1>
                    <p className="text-gray-500 text-sm">Question {activeQuestionIndex + 1} of {questions.length}</p>
                </div>
                {!isSubmitted && (
                    <div className="flex items-center gap-2 text-xl font-mono font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                        <Timer size={24} />
                        {formatTime(timeLeft)}
                    </div>
                )}
            </div>

            {isSubmitted ? (
                <Card className="p-8 text-center">
                    <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
                    <h2 className="text-3xl font-bold mb-2">Quiz Submitted!</h2>
                    <p className="text-gray-600 mb-6">Your Score: <span className="text-blue-600 font-bold">{score}</span> / {questions.length * 4}</p>

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
                <Card className="p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-4">
                            {activeQuestionIndex + 1}. {questions[activeQuestionIndex].question_text}
                        </h3>

                        <div className="space-y-3">
                            {questions[activeQuestionIndex].options.map((option, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleOptionSelect(questions[activeQuestionIndex].id, idx)}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAnswers[questions[activeQuestionIndex].id] === idx
                                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                        : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${selectedAnswers[questions[activeQuestionIndex].id] === idx
                                            ? 'border-blue-600 bg-blue-600 text-white'
                                            : 'border-gray-300'
                                            }`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span>{option}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between mt-8 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => setActiveQuestionIndex(prev => Math.max(0, prev - 1))}
                            disabled={activeQuestionIndex === 0}
                        >
                            Previous
                        </Button>

                        {activeQuestionIndex === questions.length - 1 ? (
                            <Button
                                onClick={handleSubmit}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                Submit Quiz
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setActiveQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                            >
                                Next
                            </Button>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
}
