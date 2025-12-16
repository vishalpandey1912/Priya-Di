'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, Button, PaymentModal } from '@/components/ui';
import { ChevronRight, Lock } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useProduct } from '@/context/ProductContext';

export default function SubjectPage({
    params,
}: {
    params: Promise<{ subject: string }>;
}) {
    const { subject } = use(params);
    const { getChaptersBySubject } = useContent();
    const { getProductByTarget } = useProduct();
    const subjectName = subject.charAt(0).toUpperCase() + subject.slice(1);
    const chapters = getChaptersBySubject(subject);

    // Find the product that sells this subject (or the first one targeting it)
    const product = getProductByTarget(subject);

    const { user } = useAuth();
    const { addToCart } = useCart();
    const [selectedProduct, setSelectedProduct] = React.useState<any>(null); // Product to buy (Subject or Chapter)
    const [isOwned, setIsOwned] = React.useState(false);
    const [locks, setLocks] = React.useState<Record<string, boolean>>({});

    // Check ownership and load locks
    React.useEffect(() => {
        const storedLocks = JSON.parse(localStorage.getItem('contentLocks') || '{}');
        setLocks(storedLocks);

        if (user) {
            // Check specific access (works for bundles too now as they write all targets)
            const subjectAccess = localStorage.getItem(`access_${subject}_${user.email}`);
            const fullAccess = localStorage.getItem(`access_full_bundle_${user.email}`); // Fallback for legacy
            if (subjectAccess || fullAccess) {
                setIsOwned(true);
            } else {
                setIsOwned(false);
            }
        } else {
            setIsOwned(false);
        }
    }, [subject, user]);

    const handleSuccess = () => {
        if (!user || !selectedProduct) return;

        // Grant Access Generic Logic
        selectedProduct.targetIds.forEach((target: string) => {
            localStorage.setItem(`access_${target}_${user.email}`, 'true');
        });

        const newOrder = {
            id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            user: user.name,
            plan: selectedProduct.name,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            amount: `₹${selectedProduct.price.toLocaleString()}`,
            status: 'Success'
        };
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));

        // If we bought the whole subject, mark as owned. 
        // If we bought a chapter, we ideally need to refresh locks or re-render.
        // check if `selectedProduct` targets the subject
        if (selectedProduct.targetIds.includes(subject)) {
            setIsOwned(true);
        } else {
            // Force reload or re-check?
            // Simple way: Access writes to localStorage, loop reads from localStorage? 
            // In the loop below, `isChapterLocked` checks `locks`. 
            // `locks` is generic content locks. 
            // But we also need to check user access for that specific chapter!
            // I need to update the check in the loop to also check `access_{chapterId}`.
            window.location.reload();
        }

        setSelectedProduct(null);
    };

    const isSubjectLocked = locks[subject] !== false;

    return (
        <div style={{ padding: '0 0' }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem' }}>{subjectName}</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Select a chapter to start learning.</p>
                </div>
                {(!isOwned && isSubjectLocked && product) && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                            variant="outline"
                            onClick={() => addToCart({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                type: product.type,
                                targetIds: product.targetIds
                            })}
                        >
                            Add to Cart
                        </Button>
                        <Button onClick={() => setSelectedProduct(product)} style={{ backgroundColor: '#FFC107', color: 'black' }}>
                            Buy Now
                        </Button>
                    </div>
                )}
                {isOwned && (
                    <div style={{ padding: '8px 16px', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '8px', fontWeight: 600 }}>
                        Enrolled
                    </div>
                )}
            </div>

            {selectedProduct && (
                <PaymentModal
                    isOpen={!!selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    amount={selectedProduct.price}
                    planName={selectedProduct.name}
                    onSuccess={handleSuccess}
                />
            )}

            {chapters.length === 0 ? (
                <p>No chapters added yet.</p>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {chapters.map((chapter) => {
                        // Check if user has explicit access to this chapter
                        const hasChapterAccess = user ? localStorage.getItem(`access_${chapter.id}_${user.email}`) : false;

                        // Logic: Locked if (Subject Locked AND No Explicit Access)
                        const chapterLockKey = `${subject}_${chapter.id}`;
                        const isChapterLocked = !isOwned && !hasChapterAccess && (
                            locks[chapterLockKey] !== undefined
                                ? locks[chapterLockKey]
                                : isSubjectLocked
                        );

                        const chapterProduct = getProductByTarget(chapter.id);

                        return (
                            <div key={`${chapter.subjectId}-${chapter.id}`}>
                                {isChapterLocked ? (
                                    <Card padding="md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.9, backgroundColor: '#f9fafb' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', color: '#64748b' }}>{chapter.title}</h3>
                                            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{chapter.topics.length} Topics • Locked</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {chapterProduct ? (
                                                <Button size="sm" onClick={() => setSelectedProduct(chapterProduct)}>
                                                    Unlock ₹{chapterProduct.price}
                                                </Button>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '0.8rem' }}>
                                                    <Lock size={14} /> Course Material
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                ) : (
                                    <Link href={`/neet/${subject}/${chapter.id}`}>
                                        <Card hoverable padding="md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{chapter.title}</h3>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{chapter.topics.length} Topics</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <ChevronRight size={20} color="var(--text-light)" />
                                            </div>
                                        </Card>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
