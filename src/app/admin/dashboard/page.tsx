'use client';

import React from 'react';
import { StatCard } from '@/components/admin/StatCard';
import { DollarSign, Users, BookOpen, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui';

export default function AdminDashboardPage() {
    return (
        <div>
            <h1 style={{ marginBottom: '24px', fontSize: '1.8rem', fontWeight: 800 }}>Dashboard Overview</h1>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '24px',
                marginBottom: '32px'
            }}>
                <StatCard
                    label="Total Revenue"
                    value="₹4,25,000"
                    trend="12.5%"
                    trendUp={true}
                    icon={<DollarSign size={24} />}
                    color="#00A99D"
                />
                <StatCard
                    label="Active Students"
                    value="1,240"
                    trend="8.1%"
                    trendUp={true}
                    icon={<Users size={24} />}
                    color="#3b82f6"
                />
                <StatCard
                    label="Course Material"
                    value="48 Chapters"
                    icon={<BookOpen size={24} />}
                    color="#f59e0b"
                />
                <StatCard
                    label="Pending Orders"
                    value="12"
                    trend="2.4%"
                    trendUp={false}
                    icon={<ShoppingBag size={24} />}
                    color="#ec4899"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Recent Orders Table */}
                <Card title="Recent Orders">
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                                <th style={{ padding: '12px', color: '#64748b', fontSize: '0.875rem' }}>Order ID</th>
                                <th style={{ padding: '12px', color: '#64748b', fontSize: '0.875rem' }}>Student</th>
                                <th style={{ padding: '12px', color: '#64748b', fontSize: '0.875rem' }}>Course</th>
                                <th style={{ padding: '12px', color: '#64748b', fontSize: '0.875rem' }}>Amount</th>
                                <th style={{ padding: '12px', color: '#64748b', fontSize: '0.875rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { id: '#ORD-001', student: 'Amit Kumar', course: 'NEET Physics Crash', amount: '₹4,999', status: 'Success' },
                                { id: '#ORD-002', student: 'Sneha Singh', course: 'Biology Masterclass', amount: '₹2,499', status: 'Pending' },
                                { id: '#ORD-003', student: 'Rahul Verma', course: 'Full NEET Bundle', amount: '₹14,999', status: 'Success' },
                                { id: '#ORD-004', student: 'Priya Sharma', course: 'Chemistry Notes', amount: '₹999', status: 'Failed' },
                            ].map((order, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px', fontWeight: 500 }}>{order.id}</td>
                                    <td style={{ padding: '12px', color: '#64748b' }}>{order.student}</td>
                                    <td style={{ padding: '12px' }}>{order.course}</td>
                                    <td style={{ padding: '12px', fontWeight: 600 }}>{order.amount}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            backgroundColor: order.status === 'Success' ? '#dcfce7' : order.status === 'Pending' ? '#fef3c7' : '#fee2e2',
                                            color: order.status === 'Success' ? '#166534' : order.status === 'Pending' ? '#92400e' : '#991b1b'
                                        }}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>

                {/* Quick Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Card title="Quick Actions">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                            <Link href="/admin/content">
                                <button style={{
                                    padding: '12px',
                                    backgroundColor: '#00A99D',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    width: '100%'
                                }}>
                                    + Add New Course
                                </button>
                            </Link>
                            <Link href="/admin/support">
                                <button
                                    style={{
                                        padding: '12px',
                                        backgroundColor: '#fff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        width: '100%'
                                    }}
                                >
                                    View Support Tickets (3)
                                </button>
                            </Link>
                        </div>
                    </Card>

                    <Card title="Traffic Source">
                        <div style={{ marginTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Google Search</span>
                                <strong>65%</strong>
                            </div>
                            <div style={{ width: '100%', background: '#f1f5f9', height: '6px', borderRadius: '4px' }}>
                                <div style={{ width: '65%', background: '#3b82f6', height: '100%', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                        <div style={{ marginTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Direct</span>
                                <strong>20%</strong>
                            </div>
                            <div style={{ width: '100%', background: '#f1f5f9', height: '6px', borderRadius: '4px' }}>
                                <div style={{ width: '20%', background: '#10b981', height: '100%', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
