'use client';

import React, { useState } from 'react';
import { Button, Input, Card } from '@/components/ui';
import { Plus, Trash2, CheckCircle, X, HelpCircle } from 'lucide-react';

interface Question {
    id: string;
    questionText: string;
    options: string[];
    correctOption: number;
}

interface QuizBuilderProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, questions: Question[], price: number) => void;
    initialData?: { title: string, questions: Question[], price?: number };
}

export function QuizBuilder({ isOpen, onClose, onSave, initialData }: QuizBuilderProps) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [price, setPrice] = useState(initialData?.price?.toString() || '');
    const [questions, setQuestions] = useState<Question[]>(initialData?.questions || [
        { id: '1', questionText: '', options: ['', '', '', ''], correctOption: 0 }
    ]);

    // Reset state when modal opens/changes
    React.useEffect(() => {
        if (isOpen) {
            setTitle(initialData?.title || '');
            setPrice(initialData?.price?.toString() || '');
            setQuestions(initialData?.questions || [
                { id: '1', questionText: '', options: ['', '', '', ''], correctOption: 0 }
            ]);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            { id: Date.now().toString(), questionText: '', options: ['', '', '', ''], correctOption: 0 }
        ]);
    };

    const handleRemoveQuestion = (index: number) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const updateQuestionText = (index: number, text: string) => {
        const newQuestions = [...questions];
        newQuestions[index].questionText = text;
        setQuestions(newQuestions);
    };

    const updateOptionText = (qIndex: number, oIndex: number, text: string) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = text;
        setQuestions(newQuestions);
    };

    const setCorrectOption = (qIndex: number, oIndex: number) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctOption = oIndex;
        setQuestions(newQuestions);
    };

    const handleSave = () => {
        if (!title.trim()) {
            alert('Please enter a quiz title');
            return;
        }
        // Basic validation
        const invalidQuestions = questions.some(q => !q.questionText.trim() || q.options.some(o => !o.trim()));
        if (invalidQuestions) {
            alert('Please fill in all questions and options');
            return;
        }

        onSave(title, questions, parseFloat(price) || 0);
        // Reset state
        setTitle('');
        setPrice('');
        setQuestions([{ id: '1', questionText: '', options: ['', '', '', ''], correctOption: 0 }]);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <Card style={{ width: '800px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <HelpCircle size={24} color="var(--primary-color)" />
                        {initialData ? 'Edit Quiz' : 'Create Quiz'}
                    </h2>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <Input
                            label="Quiz Title"
                            placeholder="e.g. Thermodynamics Practice Test"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div style={{ width: '150px' }}>
                        <Input
                            label="Price (₹)"
                            placeholder="0"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '12px' }}>
                    {questions.map((q, qIndex) => (
                        <div key={q.id} style={{
                            backgroundColor: '#f8fafc',
                            padding: '16px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            marginBottom: '16px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontWeight: 600 }}>Question {qIndex + 1}</span>
                                {questions.length > 1 && (
                                    <button
                                        onClick={() => handleRemoveQuestion(qIndex)}
                                        style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            <Input
                                placeholder="Enter question text..."
                                value={q.questionText}
                                onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                                style={{ marginBottom: '16px', backgroundColor: 'white' }}
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {q.options.map((opt, oIndex) => (
                                    <div key={oIndex} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div
                                            onClick={() => setCorrectOption(qIndex, oIndex)}
                                            style={{
                                                cursor: 'pointer',
                                                color: q.correctOption === oIndex ? '#22c55e' : '#cbd5e1'
                                            }}
                                        >
                                            <CheckCircle size={20} fill={q.correctOption === oIndex ? '#FEE2E2' : 'none'} />
                                        </div>
                                        <Input
                                            placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                            value={opt}
                                            onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                                            style={{ margin: 0, borderColor: q.correctOption === oIndex ? '#22c55e' : undefined }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                    <Button variant="outline" onClick={handleAddQuestion} leftIcon={<Plus size={16} />}>
                        Add Question
                    </Button>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSave}>Save Quiz</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
