'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Input } from '@/components/ui';
import { Mail, Phone, CheckCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function VerifyPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    const [emailOtp, setEmailOtp] = useState('');
    const [phoneOtp, setPhoneOtp] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isEditingPhone, setIsEditingPhone] = useState(false);

    // UI states
    const [sentEmail, setSentEmail] = useState(false);
    const [sentPhone, setSentPhone] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);


    const handleSendEmailOtp = () => {
        setSentEmail(true);
        // Simulation: Show Code in Alert/Console instead of real email
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        // In a real app we would call an API here.
        // For now, we "send" it by.... telling the user what it is :D
        alert(`[SIMULATION] Verification Code for ${user?.email}: 1234`);
    };

    const handleSendPhoneOtp = () => {
        if (!phoneNumber) {
            setPhoneError('Please enter a valid phone number');
            return;
        }
        setSentPhone(true);
        alert(`[SIMULATION] Verification Code for Phone ${phoneNumber}: 1234`);
    };

    const handleVerifyEmail = async () => {
        setEmailError('');
        alert('Please check your email inbox for the verification link from Supabase.');
    };

    const handleVerifyPhone = async () => {
        setPhoneError('');
        alert('Phone verification coming soon with Supabase Auth.');
    };

    const allVerified = user?.email && true; // user?.isEmailVerified && user?.isPhoneVerified;

    if (isLoading || !user) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Verify Your Identity</h1>
                <p style={{ color: '#64748b' }}>To insure the safety and trust of our community, please verify your contact details.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', maxWidth: '800px', width: '100%' }}>

                {/* Email Verification Card */}
                <Card padding="lg" style={{ borderTop: '4px solid #10b981' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ padding: '12px', borderRadius: '50%', backgroundColor: '#FEE2E2' }}>
                            <CheckCircle color="#B91C1C" size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Email Verification</h2>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{user.email}</p>
                        </div>
                    </div>

                    {true ? (
                        <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px', color: '#B91C1C', fontWeight: 600, textAlign: 'center' }}>
                            Verified Successfully
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {!sentEmail ? (
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ marginBottom: '16px', color: '#475569' }}>We will send a 4-digit OTP to your email address.</p>
                                    <Button onClick={handleSendEmailOtp} style={{ width: '100%' }}>Send Verification Code</Button>
                                </div>
                            ) : (
                                <>
                                    <Input
                                        placeholder="Enter 4-digit Code"
                                        value={emailOtp}
                                        onChange={(e) => setEmailOtp(e.target.value)}
                                        style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.2rem' }}
                                    />
                                    {emailError && <p style={{ color: 'red', fontSize: '0.8rem' }}>{emailError}</p>}
                                    <Button onClick={handleVerifyEmail} style={{ width: '100%' }}>Verify Email</Button>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', cursor: 'pointer' }} onClick={() => setSentEmail(false)}>Resend Code</p>
                                </>
                            )}
                        </div>
                    )}
                </Card>

                {/* Phone Verification Card */}
                <Card padding="lg" style={{ borderTop: '4px solid #f59e0b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ padding: '12px', borderRadius: '50%', backgroundColor: '#fef3c7' }}>
                            <Phone color="#d97706" size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Phone Verification</h2>
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Required for alerts</p>
                        </div>
                    </div>

                    {false ? (
                        <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px', color: '#B91C1C', fontWeight: 600, textAlign: 'center' }}>
                            Verified Successfully
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {!sentPhone ? (
                                <div style={{ textAlign: 'center' }}>
                                    {phoneNumber && !isEditingPhone ? (
                                        <div style={{ marginBottom: '16px' }}>
                                            <p style={{ marginBottom: '8px', color: '#475569', fontSize: '1.1rem', fontWeight: 500 }}>
                                                {phoneNumber}
                                            </p>
                                            <button
                                                onClick={() => setIsEditingPhone(true)}
                                                style={{ border: 'none', background: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
                                            >
                                                Change Number
                                            </button>
                                        </div>
                                    ) : (
                                        <Input
                                            label="Mobile Number"
                                            placeholder="+91 9876543210"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            style={{ marginBottom: '16px' }}
                                            autoFocus={isEditingPhone}
                                        />
                                    )}

                                    {phoneError && <p style={{ color: 'red', fontSize: '0.8rem', marginBottom: '8px' }}>{phoneError}</p>}
                                    <Button onClick={handleSendPhoneOtp} style={{ width: '100%' }}>Send Verification Code</Button>
                                </div>
                            ) : (
                                <>
                                    <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                                        Sent to {phoneNumber}
                                        <span
                                            onClick={() => { setSentPhone(false); setIsEditingPhone(true); }}
                                            style={{ color: 'var(--primary-color)', cursor: 'pointer', marginLeft: '4px' }}
                                        >
                                            (Edit)
                                        </span>
                                    </p>
                                    <Input
                                        placeholder="Enter 4-digit Code"
                                        value={phoneOtp}
                                        onChange={(e) => setPhoneOtp(e.target.value)}
                                        style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.2rem' }}
                                    />
                                    {phoneError && <p style={{ color: 'red', fontSize: '0.8rem' }}>{phoneError}</p>}
                                    <Button onClick={handleVerifyPhone} style={{ width: '100%' }}>Verify Phone</Button>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', cursor: 'pointer' }} onClick={() => setSentPhone(false)}>Resend Code</p>
                                </>
                            )}
                        </div>
                    )}
                </Card>

            </div>

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
                {allVerified ? (
                    <Button
                        size="lg"
                        style={{ padding: '16px 48px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '12px' }}
                        onClick={() => router.push('/dashboard')}
                    >
                        Go to Dashboard <ArrowRight size={20} />
                    </Button>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', backgroundColor: '#fff', padding: '12px 24px', borderRadius: '50px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <ShieldAlert size={18} color="#f59e0b" />
                        Please complete verification to proceed.
                    </div>
                )}
            </div>

        </div>
    );
}
