'use client';

import React, { useState, useEffect, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Button, Card } from '@/components/ui';
import { ArrowLeft, CheckCircle, XCircle, Timer, AlertCircle } from 'lucide-react';
import Link from 'next/link';

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
}

export default function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
    const { quizId } = use(params);
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    // Quiz State
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        fetchQuiz();
    }, [quizId]);

    const fetchQuiz = async () => {
        try {
            // Get Quiz Details
            const { data: quizData, error: quizError } = await supabase
                .from('quizzes')
                .select('*')
                .eq('id', quizId)
                .single();

            if (quizError) throw quizError;
            setQuiz(quizData);
            setTimeLeft(quizData.duration_minutes * 60);

            // Get Questions
            const { data: questionsData, error: questionsError } = await supabase
                .from('quiz_questions')
                .select('*')
                .eq('quiz_id', quizId);

            if (questionsError) throw questionsError;
            setQuestions(questionsData || []);

        } catch (error) {
            console.error('Error fetching quiz:', error);
        } finally {
            setLoading(false);
        }
    };

    // Timer Effect
    useEffect(() => {
        if (!loading && !isSubmitted && timeLeft > 0) {
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
    }, [loading, isSubmitted, timeLeft]);

    const handleOptionSelect = (questionId: string, optionIndex: number) => {
        if (isSubmitted) return;
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    const handleSubmit = () => {
        let calculatedScore = 0;
        questions.forEach(q => {
            if (selectedAnswers[q.id] === q.correct_option) {
                calculatedScore += 4; // Assuming 4 marks per correct answer (NEET pattern)
            } else if (selectedAnswers[q.id] !== undefined) {
                calculatedScore -= 1; // Negative marking
            }
        });
        setScore(calculatedScore);
        setIsSubmitted(true);
        window.scrollTo(0, 0);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Quiz...</div>;
    if (!quiz) return <div style={{ padding: '40px', textAlign: 'center' }}>Quiz not found</div>;

    const activeQuestion = questions[activeQuestionIndex];

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Link href="/neet" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#64748b' }}>
                    <ArrowLeft size={20} /> Exit Quiz
                </Link>
                {!isSubmitted && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        backgroundColor: timeLeft < 60 ? '#fef2f2' : '#f0f9ff',
                        color: timeLeft < 60 ? '#ef4444' : '#0284c7',
                        padding: '8px 16px', borderRadius: '20px', fontWeight: 600
                    }}>
                        <Timer size={20} /> {formatTime(timeLeft)}
                    </div>
                )}
            </div>

            {isSubmitted ? (
                // Result View
                <div style={{ textAlign: 'center' }}>
                    <Card style={{ marginBottom: '24px', padding: '32px', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Quiz Completed!</h2>
                        <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '24px' }}>Your Score</p>
                        <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary-color)', lineHeight: 1 }}>
                            {score} <span style={{ fontSize: '1.5rem', color: '#94a3b8' }}>/ {questions.length * 4}</span>
                        </div>
                    </Card>

                    <h3 style={{ textAlign: 'left', marginBottom: '16px' }}>Review Answers</h3>
                    {questions.map((q, index) => {
                        const userAnswer = selectedAnswers[q.id];
                        const isCorrect = userAnswer === q.correct_option;
                        const isSkipped = userAnswer === undefined;

                        return (
                            <Card key={q.id} style={{ marginBottom: '16px', textAlign: 'left', borderLeft: isSkipped ? '4px solid #cbd5e1' : isCorrect ? '4px solid #22c55e' : '4px solid #ef4444' }}>
                                <p style={{ fontWeight: 600, marginBottom: '12px' }}>Q{index + 1}. {q.question_text}</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {q.options.map((opt, i) => (
                                        <div key={i} style={{
                                            padding: '8px 12px', borderRadius: '6px',
                                            backgroundColor:
                                                i === q.correct_option ? '#dcfce7' : // Always show correct green
                                                    (i === userAnswer && !isCorrect) ? '#fee2e2' : '#f8fafc', // Show wrong red
                                            color:
                                                i === q.correct_option ? '#166534' :
                                                    (i === userAnswer && !isCorrect) ? '#991b1b' : 'inherit',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                        }}>
                                            <span>{opt}</span>
                                            {i === q.correct_option && <CheckCircle size={16} />}
                                            {i === userAnswer && !isCorrect && <XCircle size={16} />}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        );
                    })}

                    <Link href="/neet">
                        <Button size="lg" style={{ marginTop: '24px' }}>Back to Courses</Button>
                    </Link>
                </div>
            ) : (
                // Active Quiz View
                <div>
                    <Card style={{ padding: '0' }}>
                        {/* Progress Bar */}
                        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600, color: '#64748b' }}>Question {activeQuestionIndex + 1} of {questions.length}</span>
                            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{questions.length - Object.keys(selectedAnswers).length} Remaining</span>
                        </div>

                        <div style={{ padding: '24px' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '24px', lineHeight: 1.5 }}>
                                {activeQuestion.question_text}
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {activeQuestion.options.map((option, index) => {
                                    const isSelected = selectedAnswers[activeQuestion.id] === index;
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => handleOptionSelect(activeQuestion.id, index)}
                                            style={{
                                                padding: '16px',
                                                borderRadius: '8px',
                                                border: isSelected ? '2px solid var(--primary-color)' : '1px solid #e2e8f0',
                                                backgroundColor: isSelected ? '#f0fdf9' : 'white',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                fontWeight: 500
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '24px', height: '24px', borderRadius: '50%',
                                                    border: isSelected ? '6px solid var(--primary-color)' : '2px solid #cbd5e1',
                                                    backgroundColor: 'white'
                                                }} />
                                                {option}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ padding: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                variant="outline"
                                disabled={activeQuestionIndex === 0}
                                onClick={() => setActiveQuestionIndex(prev => prev - 1)}
                            >
                                Previous
                            </Button>

                            {activeQuestionIndex === questions.length - 1 ? (
                                <Button onClick={handleSubmit} style={{ backgroundColor: '#ef4444' }}>Submit Quiz</Button>
                            ) : (
                                <Button onClick={() => setActiveQuestionIndex(prev => prev + 1)}>Next Question</Button>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
