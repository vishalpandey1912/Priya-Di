'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, CreditCard, Lock } from 'lucide-react';
import { Button, Input } from '@/components/ui';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    planName: string;
    onSuccess: () => void;
}

export const PaymentModal = ({ isOpen, onClose, amount, planName, onSuccess }: PaymentModalProps) => {
    const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [discountApplied, setDiscountApplied] = useState(0);
    const [finalAmount, setFinalAmount] = useState(amount);

    React.useEffect(() => {
        setFinalAmount(amount);
        setDiscountApplied(0);
        setCouponCode('');
    }, [amount, isOpen]);

    const applyCoupon = () => {
        const coupons = JSON.parse(localStorage.getItem('siteCoupons') || '[]');
        const coupon = coupons.find((c: any) => c.code === couponCode.toUpperCase() && c.active);

        if (coupon) {
            let discount = 0;
            if (coupon.type === 'percent') {
                discount = Math.floor((amount * coupon.discount) / 100);
            } else {
                discount = coupon.discount;
            }
            setDiscountApplied(discount);
            setFinalAmount(Math.max(0, amount - discount));
        } else {
            alert('Invalid or expired coupon code');
        }
    };

    if (!isOpen) return null;

    const handlePay = async () => {
        setStep('processing');
        setLoading(true);

        try {
            // Simulate Payment Gateway
            await new Promise(resolve => setTimeout(resolve, 2000));

            const { data: { user } } = await import('@/lib/supabase').then(m => m.supabase.auth.getUser());

            if (user) {
                const { supabase } = await import('@/lib/supabase');

                // 1. Create Order
                const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
                const { error: orderError } = await supabase.from('orders').insert({
                    id: orderId, // Changed from order_id to match SQL
                    user_id: user.id,
                    amount: finalAmount.toString(), // Schema expects text
                    plan_name: planName,
                    status: 'Success',
                    created_at: new Date().toISOString()
                });

                if (orderError) throw orderError;

                // 2. Create Enrollment
                // planName usually "Unlock: Material Title"
                const cleanPlanName = planName.replace('Unlock: ', '').trim();
                // We need the ID, but PaymentModal only gets planName. 
                // Let's rely on callback or parent to handle enrollment?
                // Parent `ChapterPage` knows the ID. 
                // Let's keep `handlePaymentSuccess` in parent doing the heavy lifting?
                // OR better: PaymentModal just handles payment record, Parent handles enrollment?
                // Re-reading: ChapterPage handles 'hasItemAccess'.
                // Ideally, PaymentModal should be pure.
                // But we want to centralize logic.
                // Let's stick to Parent Component handling success logic for content access.
                // BUT PaymentModal MUST record the transaction in DB.
            }

            setLoading(false);
            setStep('success');
            setTimeout(() => {
                onSuccess();
                setStep('details');
            }, 1500);

        } catch (err: any) {
            console.error('Payment Error Full:', JSON.stringify(err, null, 2));
            console.error('Payment Error Message:', err?.message || err?.error_description || 'Unknown error');
            setLoading(false);
            alert(`Payment failed: ${err?.message || 'Please try again.'}`);
        }
    };

    const modalContent = (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                width: '100%',
                maxWidth: '480px',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#64748b'
                    }}
                >
                    <X size={24} />
                </button>

                {step === 'details' && (
                    <>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Complete Payment</h2>
                        <p style={{ color: '#64748b', marginBottom: '24px' }}>
                            Unlock full access to <strong>{planName}</strong>
                        </p>

                        <div style={{
                            backgroundColor: '#f8fafc',
                            padding: '16px',
                            borderRadius: '8px',
                            marginBottom: '24px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ color: '#475569', fontWeight: 500 }}>Total Amount</span>
                            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#00A99D' }}>₹{amount}</span>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Card Number (Mock)</label>
                            <div style={{ position: 'relative' }}>
                                <CreditCard size={20} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    placeholder="4242 4242 4242 4242"
                                    defaultValue="4242 4242 4242 4242"
                                    style={{
                                        width: '100%',
                                        padding: '10px 10px 10px 40px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Expiry</label>
                                <input
                                    type="text"
                                    defaultValue="12/28"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>CVC</label>
                                <input
                                    type="text"
                                    defaultValue="123"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Coupon Section */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Coupon Code</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Input
                                    placeholder="Enter code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    disabled={discountApplied > 0}
                                />
                                <Button
                                    variant="outline"
                                    onClick={applyCoupon}
                                    disabled={discountApplied > 0}
                                >
                                    {discountApplied > 0 ? 'Applied' : 'Apply'}
                                </Button>
                            </div>
                            {discountApplied > 0 && (
                                <p style={{ fontSize: '0.8rem', color: '#166534', marginTop: '4px' }}>
                                    Coupon applied! You saved ₹{discountApplied}.
                                </p>
                            )}
                        </div>

                        <Button onClick={handlePay} className="w-full" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <Lock size={16} /> Pay ₹{finalAmount}
                        </Button>

                        <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
                            Secured by DesiPayments (Mock Mode)
                        </p>
                    </>
                )}

                {step === 'processing' && (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div className="spinner" style={{
                            width: '40px',
                            height: '40px',
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #00A99D',
                            borderRadius: '50%',
                            margin: '0 auto 24px',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                        <style jsx>{`
                            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                        `}</style>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Processing Payment...</h3>
                        <p style={{ color: '#64748b' }}>Please do not close this window.</p>
                    </div>
                )}

                {step === 'success' && (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 24px' }} />
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#10b981' }}>Payment Successful!</h3>
                        <p style={{ color: '#64748b' }}>You now have access to {planName}.</p>
                    </div>
                )}
            </div>
        </div>
    );

    return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
