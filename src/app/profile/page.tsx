'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '@/components/ui';
import { User, Mail, Save, UserCircle, BookOpen, ShoppingBag, LayoutDashboard, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { INDIAN_STATES, CITIES_BY_STATE } from '@/data/locations';

const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const YEARS = Array.from({ length: 60 }, (_, i) => (2025 - i).toString()); // 2025 down to 1966

export default function ProfilePage() {
    const { user, updateUser, isLoading } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState('overview');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // Extended Details State
    const [targetExam, setTargetExam] = useState('Select Exam');
    const [currentClass, setCurrentClass] = useState('Select Class');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');

    const [dobDay, setDobDay] = useState('');
    const [dobMonth, setDobMonth] = useState('');
    const [dobYear, setDobYear] = useState('');

    const [isEditing, setIsEditing] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // Data States
    const [orders, setOrders] = useState<any[]>([]);

    const [myCourses, setMyCourses] = useState<any[]>([]);

    // Real user stats (default to 0 for now)
    const stats = [
        { label: 'Courses Enrolled', value: '0', icon: BookOpen, color: '#00A99D' },
        { label: 'Tests Attempted', value: '0', icon: ShieldCheck, color: '#FF5722' },
        { label: 'Hours Studied', value: '0h', icon: Clock, color: '#2196F3' }
    ];

    const [phone, setPhone] = useState('');
    const [isChangingPhone, setIsChangingPhone] = useState(false);
    const [newPhone, setNewPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        } else if (user) {
            setName(user.name);
            setEmail(user.email);

            // Load extended details
            const savedDetails = JSON.parse(localStorage.getItem(`user_details_${user.email}`) || '{}');
            setTargetExam(savedDetails.targetExam || 'Select Exam');
            setCurrentClass(savedDetails.currentClass || 'Select Class');
            setPhone(savedDetails.phone || '');
            setPhone(savedDetails.phone || '');
            if (savedDetails.dob) {
                const [y, m, d] = savedDetails.dob.split('-');
                setDobYear(y || '');
                setDobMonth(m ? MONTHS[parseInt(m) - 1] : '');
                setDobDay(d ? parseInt(d).toString() : '');
            } else {
                setDobYear('');
                setDobMonth('');
                setDobDay('');
            }
            setState(savedDetails.state || '');
            setCity(savedDetails.city || '');

            // Fetch Orders
            const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            setOrders(allOrders.filter((o: any) => o.user === user.name));

            // Determine Courses (User Scoped)
            const courses = [];
            const email = user.email;
            const hasBundle = localStorage.getItem(`access_full_bundle_${email}`);

            if (hasBundle) {
                courses.push({ name: 'NEET 2026 Full Course', progress: 0, subject: 'Bundle' });
            } else {
                if (localStorage.getItem(`access_physics_${email}`)) courses.push({ name: 'Physics Mastery', progress: 0, subject: 'Physics' });
                if (localStorage.getItem(`access_chemistry_${email}`)) courses.push({ name: 'Chemistry Essentials', progress: 0, subject: 'Chemistry' });
                if (localStorage.getItem(`access_biology_${email}`)) courses.push({ name: 'Biology Deep Dive', progress: 0, subject: 'Biology' });
            }

            // Test Series is separate (not included in default bundle targetIds, so check independently)
            if (localStorage.getItem(`access_test_series_${email}`)) {
                courses.push({ name: 'All India Test Series', progress: 0, subject: 'Test Series' });
            }

            setMyCourses(courses);
        }
    }, [user, isLoading, router]);

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newState = e.target.value;
        setState(newState);
        setCity(''); // Reset city when state changes
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser(name, email);

        // Persist extended details
        const formattedMonth = (MONTHS.indexOf(dobMonth) + 1).toString().padStart(2, '0');
        const formattedDay = dobDay.padStart(2, '0');
        const dob = (dobYear && dobMonth && dobDay) ? `${dobYear}-${formattedMonth}-${formattedDay}` : '';

        const details = { targetExam, currentClass, phone, dob, state, city };
        localStorage.setItem(`user_details_${user?.email}`, JSON.stringify(details));

        setIsEditing(false);
        setSuccessMsg('Profile updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
    };



    if (isLoading || !user) {
        return <div style={{ padding: '80px', textAlign: 'center', color: '#64748b' }}>Loading your profile...</div>;
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
        { id: 'courses', label: 'My Courses', icon: <BookOpen size={20} /> },
        { id: 'orders', label: 'Order History', icon: <ShoppingBag size={20} /> },
        { id: 'settings', label: 'Settings', icon: <User size={20} /> },
    ];

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 64px)', padding: '40px 20px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Header Section */}
                <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '24px', backgroundColor: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        backgroundColor: '#e0f2f1',
                        color: '#00A99D',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        fontWeight: 700
                    }}>
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '8px', fontWeight: 800 }}>{user.name}</h1>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '12px' }}>{user.email}</p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <span style={{ padding: '6px 16px', backgroundColor: '#00A99D', color: 'white', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                                {targetExam} Aspirant
                            </span>
                            <span style={{ padding: '6px 16px', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                                {currentClass}
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'flex-start' }}>
                    {/* Sidebar Tabs */}
                    <div style={{ flex: '1 1 280px', minWidth: '250px' }}>
                        <Card padding="none" style={{ height: 'fit-content', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '16px 24px',
                                            width: '100%',
                                            border: 'none',
                                            backgroundColor: activeTab === tab.id ? '#f0fdfa' : 'white',
                                            color: activeTab === tab.id ? '#00A99D' : '#64748b',
                                            fontWeight: activeTab === tab.id ? 600 : 500,
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            borderLeft: activeTab === tab.id ? '4px solid #00A99D' : '4px solid transparent',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Content Area */}
                    <div style={{ flex: '999 1 300px', minHeight: '500px', maxWidth: '100%' }}>

                        {/* OVERVIEW TAB */}
                        {activeTab === 'overview' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
                                    {stats.map((stat, i) => (
                                        <Card key={i} padding="md">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: `${stat.color}20` }}>
                                                    <stat.icon size={24} color={stat.color} />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stat.value}</div>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{stat.label}</div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '8px' }}>Continue Learning</h3>
                                {myCourses.length > 0 ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                                        {myCourses.slice(0, 6).map((course, i) => (
                                            <Card key={i} padding="lg">
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#00A99D', backgroundColor: '#e0f2f1', padding: '4px 8px', borderRadius: '4px' }}>
                                                        {course.subject}
                                                    </span>
                                                </div>
                                                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>{course.name}</h4>
                                                <div style={{ marginBottom: '16px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px', color: '#64748b' }}>
                                                        <span>Progress</span>
                                                        <span>{course.progress}%</span>
                                                    </div>
                                                    <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '4px' }}>
                                                        <div style={{ width: `${course.progress}%`, height: '100%', backgroundColor: '#00A99D', borderRadius: '4px' }}></div>
                                                    </div>
                                                </div>
                                                <Link href="/dashboard">
                                                    <Button variant="outline" size="sm" style={{ width: '100%' }}>Resume Learning</Button>
                                                </Link>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                                        <p style={{ color: '#64748b' }}>You haven't enrolled in any courses yet.</p>
                                        <Link href="/pricing" style={{ color: '#00A99D', fontWeight: 600, marginTop: '8px', display: 'inline-block' }}>Browse Courses &rarr;</Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* MY COURSES TAB */}
                        {activeTab === 'courses' && (
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>My Enrolled Courses</h2>
                                {myCourses.length > 0 ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                                        {myCourses.map((course, i) => (
                                            <Card key={i} padding="lg">
                                                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>{course.name}</h4>
                                                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>Subject: {course.subject}</p>
                                                <Link href="/dashboard">
                                                    <Button style={{ width: '100%' }}>Go to Classroom</Button>
                                                </Link>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '16px' }}>
                                        <BookOpen size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px' }}>No Courses Found</h3>
                                        <p style={{ color: '#64748b', marginBottom: '24px' }}>Start your journey by enrolling in a course today.</p>
                                        <Link href="/pricing">
                                            <Button>Explore Courses</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ORDERS TAB */}
                        {activeTab === 'orders' && (
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Order History</h2>
                                <Card padding="none">
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                                <tr>
                                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Order ID</th>
                                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Date</th>
                                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Plan / Course</th>
                                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Amount</th>
                                                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orders.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                                                            No orders found.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    orders.map((order, i) => (
                                                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                            <td style={{ padding: '16px', fontWeight: 500 }}>{order.id}</td>
                                                            <td style={{ padding: '16px', color: '#64748b' }}>{order.date}</td>
                                                            <td style={{ padding: '16px' }}>{order.plan}</td>
                                                            <td style={{ padding: '16px', fontWeight: 600 }}>{order.amount}</td>
                                                            <td style={{ padding: '16px' }}>
                                                                <span style={{
                                                                    padding: '4px 10px',
                                                                    borderRadius: '20px',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 600,
                                                                    backgroundColor: '#dcfce7',
                                                                    color: '#166534'
                                                                }}>
                                                                    Success
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </div>
                        )}

                        {/* SETTINGS TAB */}
                        {activeTab === 'settings' && (
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Account Settings</h2>
                                <Card padding="lg">
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                                        Personal Information
                                    </h3>

                                    {successMsg && (
                                        <div style={{
                                            marginBottom: '24px',
                                            padding: '12px',
                                            backgroundColor: '#dcfce7',
                                            color: '#166534',
                                            borderRadius: '8px',
                                            fontWeight: 500,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}>
                                            <ShieldCheck size={18} /> {successMsg}
                                        </div>
                                    )}

                                    <form onSubmit={handleSave}>
                                        {/* Basic Info */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#334155' }}>Full Name</label>
                                                <Input
                                                    icon={<User size={18} />}
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#334155' }}>Email Address</label>
                                                <Input
                                                    type="email"
                                                    icon={<Mail size={18} />}
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                        </div>

                                        {/* Academic Info */}
                                        <div style={{ marginBottom: '24px' }}>
                                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '16px', color: '#64748b' }}>Academic Details</h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#334155' }}>Target Exam</label>
                                                    <select
                                                        value={targetExam}
                                                        onChange={(e) => setTargetExam(e.target.value)}
                                                        disabled={!isEditing}
                                                        style={{
                                                            width: '100%',
                                                            padding: '10px 12px',
                                                            border: '1px solid #e2e8f0',
                                                            borderRadius: '8px',
                                                            backgroundColor: isEditing ? 'white' : '#f8fafc',
                                                            fontSize: '1rem'
                                                        }}
                                                    >
                                                        <option value="NEET">NEET</option>
                                                        <option value="JEE Main">JEE Main</option>
                                                        <option value="JEE Advanced">JEE Advanced</option>
                                                        <option value="Board Exams">Board Exams</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#334155' }}>Current Class</label>
                                                    <select
                                                        value={currentClass}
                                                        onChange={(e) => setCurrentClass(e.target.value)}
                                                        disabled={!isEditing}
                                                        style={{
                                                            width: '100%',
                                                            padding: '10px 12px',
                                                            border: '1px solid #e2e8f0',
                                                            borderRadius: '8px',
                                                            backgroundColor: isEditing ? 'white' : '#f8fafc',
                                                            fontSize: '1rem'
                                                        }}
                                                    >
                                                        <option value="Class 11">Class 11</option>
                                                        <option value="Class 12">Class 12</option>
                                                        <option value="Dropper">Dropper</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Location & Personal */}
                                        <div style={{ marginBottom: '32px' }}>
                                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '16px', color: '#64748b' }}>Personal Details</h4>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#334155' }}>Date of Birth</label>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <select
                                                            value={dobDay}
                                                            onChange={(e) => setDobDay(e.target.value)}
                                                            disabled={!isEditing}
                                                            style={{
                                                                flex: 1,
                                                                padding: '10px',
                                                                border: '1px solid #e2e8f0',
                                                                borderRadius: '8px',
                                                                backgroundColor: isEditing ? 'white' : '#f8fafc',
                                                                fontSize: '0.9rem'
                                                            }}
                                                        >
                                                            <option value="">Day</option>
                                                            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                                        </select>
                                                        <select
                                                            value={dobMonth}
                                                            onChange={(e) => setDobMonth(e.target.value)}
                                                            disabled={!isEditing}
                                                            style={{
                                                                flex: 2,
                                                                padding: '10px',
                                                                border: '1px solid #e2e8f0',
                                                                borderRadius: '8px',
                                                                backgroundColor: isEditing ? 'white' : '#f8fafc',
                                                                fontSize: '0.9rem'
                                                            }}
                                                        >
                                                            <option value="">Month</option>
                                                            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                                                        </select>
                                                        <select
                                                            value={dobYear}
                                                            onChange={(e) => setDobYear(e.target.value)}
                                                            disabled={!isEditing}
                                                            style={{
                                                                flex: 1.5,
                                                                padding: '10px',
                                                                border: '1px solid #e2e8f0',
                                                                borderRadius: '8px',
                                                                backgroundColor: isEditing ? 'white' : '#f8fafc',
                                                                fontSize: '0.9rem'
                                                            }}
                                                        >
                                                            <option value="">Year</option>
                                                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#334155' }}>State</label>
                                                    <select
                                                        value={state}
                                                        onChange={handleStateChange}
                                                        disabled={!isEditing}
                                                        style={{
                                                            width: '100%',
                                                            padding: '10px 12px',
                                                            border: '1px solid #e2e8f0',
                                                            borderRadius: '8px',
                                                            backgroundColor: isEditing ? 'white' : '#f8fafc',
                                                            fontSize: '1rem'
                                                        }}
                                                    >
                                                        <option value="">Select State</option>
                                                        {INDIAN_STATES.map((s) => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#334155' }}>City</label>
                                                    <select
                                                        value={city}
                                                        onChange={(e) => setCity(e.target.value)}
                                                        disabled={!isEditing || !state}
                                                        style={{
                                                            width: '100%',
                                                            padding: '10px 12px',
                                                            border: '1px solid #e2e8f0',
                                                            borderRadius: '8px',
                                                            backgroundColor: isEditing && state ? 'white' : '#f8fafc',
                                                            fontSize: '1rem'
                                                        }}
                                                    >
                                                        <option value="">Select City</option>
                                                        {state && CITIES_BY_STATE[state]?.map((c) => (
                                                            <option key={c} value={c}>{c}</option>
                                                        ))}
                                                        {state && !CITIES_BY_STATE[state] && <option value="Other">Other</option>}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '32px' }}>
                                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#334155' }}>Phone Number</label>
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                <Input
                                                    type="tel"
                                                    value={phone}
                                                    readOnly
                                                    disabled
                                                    placeholder="Enter your phone number"
                                                    style={{ backgroundColor: '#f1f5f9', flex: 1, cursor: 'not-allowed' }}
                                                />
                                                {isEditing && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setIsChangingPhone(true)}
                                                    >
                                                        Change
                                                    </Button>
                                                )}
                                            </div>
                                            {isEditing && <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>Verified number. Click 'Change' to update.</p>}
                                        </div>

                                        {/* Phone Change Modal/Section */}
                                        {isChangingPhone && (
                                            <div style={{
                                                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                                                backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '400px' }}>
                                                    <h3 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Update Phone Number</h3>

                                                    {!isOtpSent ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                            <Input
                                                                placeholder="Enter New Mobile Number"
                                                                value={newPhone}
                                                                onChange={(e) => setNewPhone(e.target.value)}
                                                            />
                                                            <Button onClick={() => {
                                                                if (newPhone.length < 10) {
                                                                    alert('Please enter a valid 10-digit number');
                                                                    return;
                                                                }
                                                                setIsOtpSent(true);
                                                                alert(`OTP SENT to ${newPhone}: 1234`);
                                                            }}>
                                                                Send OTP
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Enter the OTP sent to {newPhone}</p>
                                                            <Input
                                                                placeholder="Enter 4-digit OTP"
                                                                value={otp}
                                                                onChange={(e) => setOtp(e.target.value)}
                                                            />
                                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                                <Button onClick={() => {
                                                                    if (otp === '1234') {
                                                                        setPhone(newPhone);
                                                                        setIsChangingPhone(false);
                                                                        setIsOtpSent(false);
                                                                        setNewPhone('');
                                                                        setOtp('');
                                                                        setSuccessMsg('Phone number updated!');
                                                                    } else {
                                                                        alert('Invalid OTP');
                                                                    }
                                                                }} style={{ flex: 1 }}>
                                                                    Verify & Update
                                                                </Button>
                                                                <Button variant="outline" onClick={() => setIsOtpSent(false)}>Back</Button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <Button
                                                        variant="ghost"
                                                        style={{ width: '100%', marginTop: '16px' }}
                                                        onClick={() => {
                                                            setIsChangingPhone(false);
                                                            setIsOtpSent(false);
                                                            setNewPhone('');
                                                            setOtp('');
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                            {isEditing ? (
                                                <>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            setIsEditing(false);
                                                            setName(user.name);
                                                            setEmail(user.email);
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <Save size={18} /> Save Changes
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button type="button" onClick={() => setIsEditing(true)}>
                                                    Edit Profile
                                                </Button>
                                            )}
                                        </div>
                                    </form>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
