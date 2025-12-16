'use client';

import React, { use } from 'react';
import { Accordion, AccordionItem } from '@/components/ui';
import { PaymentModal, Button } from '@/components/ui';
import { PlayCircle, FileText, HelpCircle, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useContent } from '@/context/ContentContext';

export default function ChapterPage({
    params,
}: {
    params: Promise<{ subject: string; chapter: string }>;
}) {
    const { subject, chapter: chapterId } = use(params);
    const { getChapterById } = useContent();
    const { user } = useAuth();
    const chapterData = getChapterById(subject, chapterId);

    const [prices, setPrices] = React.useState<Record<string, string>>({});
    const [isOwnedGlobal, setIsOwnedGlobal] = React.useState(false);
    const [ownedItems, setOwnedItems] = React.useState<string[]>([]);
    const [selectedItem, setSelectedItem] = React.useState<{ id: string, name: string, price: number } | null>(null);

    React.useEffect(() => {
        // Load Item Prices
        const storedPrices = JSON.parse(localStorage.getItem('itemPrices') || '{}');
        setPrices(storedPrices);

        // Check Global Access (Subject/Bundle)
        if (user) {
            const subjectAccess = localStorage.getItem(`access_${subject}_${user.email}`);
            const fullAccess = localStorage.getItem(`access_full_bundle_${user.email}`);
            if (subjectAccess || fullAccess) {
                setIsOwnedGlobal(true);
            } else {
                setIsOwnedGlobal(false);
            }
        }

        // Check Individual Item Access
        // We scan localStorage keys for 'access_item_' prefix? Or just check on render?
        // Let's scan keys is expensive? No.
        // Better: When we load, just keep track. But we don't know item IDs upfront without iterating content.
        // Let's just has access check helper.
    }, [subject, user]);

    const hasItemAccess = (itemId: string) => {
        if (isOwnedGlobal) return true;
        if (typeof window === 'undefined' || !user) return false;
        return !!localStorage.getItem(`access_item_${itemId}_${user.email}`);
    };

    const handleBuyItem = (e: React.MouseEvent, item: { id: string, title: string, price: string }) => {
        e.preventDefault();
        setSelectedItem({
            id: item.id,
            name: item.title,
            price: parseInt(item.price)
        });
    };

    const handlePaymentSuccess = () => {
        if (!selectedItem || !user) return;

        localStorage.setItem(`access_item_${selectedItem.id}_${user.email}`, 'true');
        setOwnedItems(prev => [...prev, selectedItem.id]); // Force re-render logic if we used state
        // Actually hasItemAccess reads from localStorage directly but that won't trigger re-render unless we force update or use state.
        // Let's use a trigger.

        const newOrder = {
            id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            user: user.name,
            plan: `Content: ${selectedItem.name}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            amount: `₹${selectedItem.price}`,
            status: 'Success'
        };
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));

        setSelectedItem(null);
        window.location.reload(); // Simple way to refresh access state
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
                {chapterData.topics.map((topic, index) => (
                    <AccordionItem key={topic.id} title={topic.title} defaultOpen={index === 0}>
                        {topic.materials.length === 0 ? (
                            <p style={{ color: 'var(--text-light)' }}>No content uploaded yet.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {topic.materials.map(material => {
                                    const price = prices[material.id];
                                    const isLocked = price && !hasItemAccess(material.id);

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
                                                <a
                                                    href={material.url || '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '4px 0' }}>
                                                        {material.type === 'pdf' && <FileText size={16} color="var(--primary-color)" />}
                                                        {material.type === 'video' && <PlayCircle size={16} color="var(--secondary-color)" style={{ fill: 'var(--primary-color)' }} />}
                                                        {material.type === 'test' && <HelpCircle size={16} />}

                                                        <span style={{ flex: 1 }}>{material.title}</span>
                                                        {material.duration && <span style={{ fontSize: '0.8rem', color: '#999' }}>({material.duration})</span>}
                                                    </div>
                                                </a>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </AccordionItem>
                ))}
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
