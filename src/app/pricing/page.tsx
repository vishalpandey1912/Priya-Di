'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, PaymentModal } from '@/components/ui';
import { Check, Star, Zap, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useProduct } from '@/context/ProductContext';

export default function PricingPage() {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { products } = useProduct();
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [purchasedPlans, setPurchasedPlans] = useState<string[]>([]);

    // Filter products to display on Pricing Page
    // Show Bundles, Test Series, and promoted Subjects
    const displayPlans = useMemo(() => {
        const filtered = products.filter(p => p.isActive && ['bundle', 'test_series', 'subject'].includes(p.type));
        // Sort: Recommended first
        return filtered.sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0));
    }, [products]);

    useEffect(() => {
        // Check local storage for purchased access (User-Specific)
        if (typeof window !== 'undefined' && user) {
            const purchased: string[] = [];
            // Check if user has access to the *primary* target of a product
            // This is a heuristic. Ideally we track "Order History" for exact product match.
            // But relying on access flags is robust.

            displayPlans.forEach(plan => {
                // If any of the targetIds are present? No, usually all.
                // Let's check if the *first* targetId is present as a proxy.
                const key = `access_${plan.targetIds[0]}_${user.email}`;
                if (localStorage.getItem(key)) purchased.push(plan.id);
            });
            setPurchasedPlans(purchased);
        }
    }, [isModalOpen, user, displayPlans]);

    const handleAddToCart = (plan: any) => {
        addToCart({
            id: plan.id,
            name: plan.name,
            price: plan.price,
            type: plan.type,
            targetIds: plan.targetIds
        });
    };

    const handlePaymentSuccess = () => {
        if (!selectedPlan || !user) return;

        const newOrder = {
            id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            user: user.name,
            plan: selectedPlan.name,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            amount: `₹${selectedPlan.price.toLocaleString()}`,
            status: 'Success'
        };

        const newPurchased = [...purchasedPlans];
        if (!newPurchased.includes(selectedPlan.id)) newPurchased.push(selectedPlan.id);

        // Grant Access Logic (Generic & User-Scoped)
        // This is THE magic fix that enables dynamic bundles!
        if (selectedPlan.targetIds && Array.isArray(selectedPlan.targetIds)) {
            selectedPlan.targetIds.forEach((target: string) => {
                localStorage.setItem(`access_${target}_${user.email}`, 'true');
            });
        }

        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));

        setPurchasedPlans(newPurchased);
        setIsModalOpen(false);
    };

    return (
        <div style={{ padding: '60px 20px', backgroundColor: '#f9fafb', minHeight: 'calc(100vh - 64px)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px', color: '#1f2937' }}>
                        Invest in Your Future
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
                        Choose the perfect plan to crack NEET with ease.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                    {displayPlans.map((plan) => {
                        const isPurchased = purchasedPlans.includes(plan.id);

                        return (
                            <Card
                                key={plan.id}
                                style={{
                                    position: 'relative',
                                    border: isPurchased ? '1px solid #d1fae5' : plan.isRecommended ? '2px solid #00A99D' : '1px solid #e5e7eb',
                                    transform: plan.isRecommended ? 'scale(1.05)' : 'none',
                                    zIndex: plan.isRecommended ? 10 : 1,
                                    backgroundColor: isPurchased ? '#f0fdfa' : 'white'
                                }}
                                padding="lg"
                            >
                                {plan.isRecommended && !isPurchased && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-12px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        backgroundColor: '#00A99D',
                                        color: 'white',
                                        padding: '4px 16px',
                                        borderRadius: '12px',
                                        fontSize: '0.875rem',
                                        fontWeight: 600
                                    }}>
                                        Recommended
                                    </div>
                                )}

                                {isPurchased && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '16px',
                                        right: '16px',
                                        backgroundColor: '#059669',
                                        color: 'white',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <Check size={12} /> Purchased
                                    </div>
                                )}

                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        backgroundColor: `${plan.color || '#00A99D'}15`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '16px'
                                    }}>
                                        {/* Dynamic Icon based on type - simplified */}
                                        {plan.type === 'bundle' || plan.name.includes('Full') ? <Zap size={24} color={plan.color || '#00A99D'} /> :
                                            plan.type === 'test_series' ? <Star size={24} color={plan.color || '#FFC107'} /> :
                                                <BookOpen size={24} color={plan.color || '#FF5722'} />}
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>{plan.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                        <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1f2937' }}>₹{plan.price.toLocaleString()}</span>
                                        <span style={{ color: '#6b7280' }}>/ one-time</span>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {plan.features.map((feature: string, i: number) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4b5563' }}>
                                            <div style={{
                                                minWidth: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                backgroundColor: '#dcfce7',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Check size={12} color="#166534" />
                                            </div>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <Button
                                        onClick={() => handleAddToCart(plan)}
                                        variant="outline"
                                        disabled={isPurchased}
                                        style={{ width: '100%', height: '48px', opacity: isPurchased ? 0.5 : 1 }}
                                    >
                                        Add to Cart
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setSelectedPlan(plan);
                                            setIsModalOpen(true);
                                        }}
                                        disabled={isPurchased}
                                        style={{
                                            width: '100%',
                                            backgroundColor: isPurchased ? '#10b981' : plan.isRecommended ? '#00A99D' : '#1f2937',
                                            height: '48px',
                                            fontSize: '1rem',
                                            opacity: isPurchased ? 0.8 : 1,
                                            cursor: isPurchased ? 'default' : 'pointer'
                                        }}
                                    >
                                        {isPurchased ? 'Owned' : 'Buy Now'}
                                    </Button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {selectedPlan && (
                <PaymentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    amount={selectedPlan.price}
                    planName={selectedPlan.name}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
}
