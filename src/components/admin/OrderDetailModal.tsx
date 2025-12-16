'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, Mail, User, Calendar, CreditCard, Package } from 'lucide-react';
import { Button } from '@/components/ui';

interface Order {
    id: string;
    user: string;
    plan: string;
    date: string;
    amount: string;
    status: string;
}

interface OrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
}

export const OrderDetailModal = ({ isOpen, onClose, order }: OrderDetailModalProps) => {
    if (!isOpen || !order) return null;

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
                width: '100%',
                maxWidth: '600px',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '90vh'
            }}>
                {/* Header */}
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Order Details</h2>
                        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>#{order.id.replace('#', '')}</span>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '24px', overflowY: 'auto' }}>

                    {/* Status Banner */}
                    <div style={{
                        marginBottom: '24px',
                        padding: '16px',
                        borderRadius: '8px',
                        backgroundColor: order.status === 'Success' ? '#dcfce7' : order.status === 'Pending' ? '#fef3c7' : '#fee2e2',
                        color: order.status === 'Success' ? '#166534' : order.status === 'Pending' ? '#92400e' : '#991b1b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontWeight: 500
                    }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'currentColor' }}></div>
                        Payment Status: {order.status}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>
                                <User size={16} /> Customer
                            </label>
                            <div style={{ fontWeight: 600 }}>{order.user}</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>student@example.com</div>
                        </div>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>
                                <Calendar size={16} /> Date
                            </label>
                            <div style={{ fontWeight: 600 }}>{order.date}</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>10:42 AM</div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#64748b', marginBottom: '8px' }}>
                            <Package size={16} /> Order Summary
                        </label>
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                                <span>{order.plan}</span>
                                <span style={{ fontWeight: 600 }}>{order.amount}</span>
                            </div>
                            <div style={{ padding: '12px 16px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                                <span>Total</span>
                                <span style={{ color: '#00A99D' }}>{order.amount}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>
                            <CreditCard size={16} /> Payment Method
                        </label>
                        <div style={{ fontWeight: 500 }}>Visa ending in 4242</div>
                    </div>

                </div>

                {/* Footer */}
                <div style={{
                    padding: '16px 24px',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px'
                }}>
                    <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Printer size={16} />}
                        onClick={() => {
                            window.print();
                        }}
                    >
                        Print Invoice
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Mail size={16} />}
                        onClick={() => {
                            // Mock email action
                            const subject = `Invoice for Order #${order.id}`;
                            const body = `Hi ${order.user},\n\nHere is your invoice details for ${order.plan}.\nAmount: ${order.amount}\n\nThanks,\nDesi Educators`;
                            window.open(`mailto:student@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                        }}
                    >
                        Email Customer
                    </Button>
                </div>
            </div>
        </div>
    );

    return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
