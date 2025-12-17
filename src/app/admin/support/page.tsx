'use client';

import React from 'react';
import { Card, Button } from '@/components/ui';
import { MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

const mockTickets = [
    { id: 1, user: 'Rahul Kumar', subject: 'Login Issue', status: 'Open', date: '2025-12-15' },
    { id: 2, user: 'Priya Singh', subject: 'Payment Failed', status: 'Resolved', date: '2025-12-14' },
    { id: 3, user: 'Amit Patel', subject: 'Notes not loading', status: 'Pending', date: '2025-12-14' },
];

export default function AdminSupportPage() {
    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px' }}>Support Tickets</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {mockTickets.map((ticket) => (
                    <Card key={ticket.id} padding="md" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: ticket.status === 'Open' ? '#fee2e2' : ticket.status === 'Resolved' ? '#FEE2E2' : '#fef9c3',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: ticket.status === 'Open' ? '#ef4444' : ticket.status === 'Resolved' ? '#10b981' : '#eab308'
                            }}>
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 600 }}>{ticket.subject}</h4>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    Requested by <span style={{ fontWeight: 500 }}>{ticket.user}</span> on {ticket.date}
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{
                                fontSize: '0.8rem', padding: '4px 8px', borderRadius: '12px', fontWeight: 500,
                                backgroundColor: ticket.status === 'Open' ? '#fee2e2' : ticket.status === 'Resolved' ? '#FEE2E2' : '#fef9c3',
                                color: ticket.status === 'Open' ? '#b91c1c' : ticket.status === 'Resolved' ? '#15803d' : '#a16207'
                            }}>
                                {ticket.status}
                            </span>
                            <Button size="sm" variant="outline">View</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
