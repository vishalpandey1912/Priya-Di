'use client';

import React, { use } from 'react';
import { Accordion, AccordionItem } from '@/components/ui';
import { PaymentModal, Button } from '@/components/ui';
import { PlayCircle, FileText, HelpCircle, Lock, Image, File } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useContent } from '@/context/ContentContext';

export default function ChapterPage({
    params,
}: {
    params: Promise<{ subject: string; chapter: string }>;
}) {
    const { subject, chapter: chapterId } = use(params);
    const { getChapterById, userProgress, toggleProgress, quizzes } = useContent();
    const { user } = useAuth();
    const chapterData = getChapterById(subject, chapterId);


    const [isOwnedGlobal, setIsOwnedGlobal] = React.useState(false);
    const [ownedItems, setOwnedItems] = React.useState<string[]>([]);
    const [selectedItem, setSelectedItem] = React.useState<{ id: string, name: string, price: number } | null>(null);



    const [enrollments, setEnrollments] = React.useState<string[]>([]);


    React.useEffect(() => {
        const checkAccess = async () => {
            if (!user) return;

            // Fetch Enrollments from Supabase
            const { supabase } = await import('@/lib/supabase');
            const { data, error } = await supabase
                .from('enrollments')
                .select('target_id')
                .eq('user_id', user.id);

            if (data) {
                setEnrollments(data.map(e => e.target_id));
            }
        };

        checkAccess();
    }, [subject, user]);

    const hasItemAccess = (itemId: string) => {
        if (!user) return false;
        // Check local state (fetched from DB)
        if (enrollments.includes('full_bundle')) return true;
        if (enrollments.includes(subject)) return true; // Subject level access
        return enrollments.includes(itemId);
    };

    const handleBuyItem = (e: React.MouseEvent, item: { id: string, title: string, price: number }) => {
        e.preventDefault();

        if (!user) {
            // Redirect to login if not authenticated
            window.location.href = `/login?next=${window.location.pathname}`;
            return;
        }

        setSelectedItem({
            id: item.id,
            name: item.title,
            price: item.price
        });
    };

    const handlePaymentSuccess = async () => {
        if (!selectedItem || !user) return;

        // Add to Enrollments in Supabase
        const { supabase } = await import('@/lib/supabase');
        await supabase.from('enrollments').insert({
            user_id: user.id,
            target_id: selectedItem.id, // Material ID
            target_type: 'material',
            created_at: new Date().toISOString()
        });

        // Update local state to reflect change immediately
        setEnrollments(prev => [...prev, selectedItem.id]);

        setSelectedItem(null);
    };

    if (!chapterData) {
        return <div>Chapter not found.</div>;
    }

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--primary-color)', textTransform: 'capitalize' }}>
                    {subject} &gt; Chapter {chapterId}
                </span>
                <h1 style={{ fontSize: '1.75rem', marginTop: '8px' }}>{chapterData.title}</h1>
            </div>

            <Accordion>
                {chapterData.topics.length === 0 && <p>Coming soon...</p>}
                {chapterData.topics.map((topic, index) => {
                    const quiz = quizzes?.find(q => q.topic_id === topic.id);

                    return (
                        <AccordionItem
                            key={topic.id}
                            title={
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <span>{topic.title}</span>
                                    {quiz && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.href = `/quiz/${quiz.id}`;
                                            }}
                                            style={{
                                                fontSize: '0.75rem',
                                                backgroundColor: '#ef4444',
                                                color: 'white',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontWeight: 600,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <HelpCircle size={12} /> Unit Test
                                        </div>
                                    )}
                                </div>
                            }
                            defaultOpen={index === 0}
                        >
                            {topic.materials.length === 0 ? (
                                <p style={{ color: 'var(--text-light)' }}>No content uploaded yet.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {topic.materials.map(material => {
                                        const price = material.price || 0;
                                        const isLocked = price > 0 && !hasItemAccess(material.id);
                                        const isCompleted = userProgress[material.id] || false;

                                        return (
                                            <div key={material.id}>
                                                {isLocked ? (
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        padding: '8px',
                                                        backgroundColor: '#f9fafb',
                                                        borderRadius: '6px',
                                                        border: '1px solid #e5e7eb',
                                                        justifyContent: 'space-between'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.7 }}>
                                                            <Lock size={16} color="var(--primary-color)" />
                                                            <span style={{ fontWeight: 500 }}>{material.title}</span>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            style={{ height: '32px', fontSize: '0.8rem' }}
                                                            onClick={(e) => handleBuyItem(e, { id: material.id, title: material.title, price })}
                                                        >
                                                            Unlock ₹{price}
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '4px 0' }}>
                                                        {/* Progress Checkbox */}
                                                        <div
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                toggleProgress(material.id, !isCompleted);
                                                            }}
                                                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                                        >
                                                            {isCompleted ? (
                                                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                                </div>
                                                            ) : (
                                                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #cbd5e1' }}></div>
                                                            )}
                                                        </div>

                                                        <a
                                                            href={material.url || '#'}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{ textDecoration: 'none', color: 'inherit', display: 'block', flex: 1 }}
                                                        >
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                                {material.type === 'pdf' && <FileText size={16} color="var(--primary-color)" />}
                                                                {material.type === 'video' && <PlayCircle size={16} color="var(--secondary-color)" style={{ fill: 'var(--primary-color)' }} />}
                                                                {material.type === 'test' && <HelpCircle size={16} />}
                                                                {material.type === 'image' && <Image size={16} color="#8b5cf6" />}
                                                                {material.type === 'document' && <File size={16} color="#06b6d4" />}

                                                                <span style={{ flex: 1 }}>{material.title}</span>
                                                                {material.duration && <span style={{ fontSize: '0.8rem', color: '#999' }}>({material.duration})</span>}
                                                            </div>
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </AccordionItem>
                    );
                })}
            </Accordion>

            {selectedItem && (
                <PaymentModal
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                    amount={selectedItem.price}
                    planName={`Unlock: ${selectedItem.name}`}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
}
