'use client';

import React from 'react';
import { Card, Button, Input } from '@/components/ui';
import { Search, Download, Eye } from 'lucide-react';
import { OrderDetailModal } from '@/components/admin/OrderDetailModal';

export default function OrdersPage() {
    const [orders, setOrders] = React.useState<any[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const mockOrders = [
            { id: 'ORD-7829', user: 'Amit Kumar', plan: 'NEET Physics Crash', date: 'Dec 15, 2025', amount: '₹4,999', status: 'Success' },
            { id: 'ORD-7830', user: 'Sneha Singh', plan: 'Biology Masterclass', date: 'Dec 14, 2025', amount: '₹2,499', status: 'Pending' },
            { id: 'ORD-7831', user: 'Rahul Verma', plan: 'Full Bundle', date: 'Dec 12, 2025', amount: '₹14,999', status: 'Success' },
            { id: 'ORD-7832', user: 'Priya Sharma', plan: 'Organic Chem', date: 'Dec 10, 2025', amount: '₹999', status: 'Failed' },
        ];
        // Combine stored orders with mock orders, avoiding potential duplicates if any (simple concat for now)
        setOrders([...storedOrders, ...mockOrders]);
    }, []);

    const filteredOrders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExportCSV = () => {
        const headers = ["Order ID", "Student", "Plan", "Date", "Amount", "Status"];
        const rows = filteredOrders.map(order => [
            order.id,
            order.user,
            order.plan,
            order.date,
            order.amount.replace('₹', '').replace(',', ''), // Clean amount for CSV
            order.status
        ]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "orders_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const [selectedOrder, setSelectedOrder] = React.useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleViewOrder = (order: any) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Orders</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Track payments and subscriptions.</p>
                </div>
                <Button variant="outline" onClick={handleExportCSV} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Download size={18} /> Export CSV
                </Button>
            </div>

            <OrderDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                order={selectedOrder}
            />

            <Card padding="md">
                <div style={{ marginBottom: '24px', maxWidth: '400px' }}>
                    <Input
                        placeholder="Search by Order ID or Student..."
                        icon={<Search size={18} />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                            <th style={{ padding: '12px', color: '#64748b' }}>Order ID</th>
                            <th style={{ padding: '12px', color: '#64748b' }}>Student</th>
                            <th style={{ padding: '12px', color: '#64748b' }}>Plan/Course</th>
                            <th style={{ padding: '12px', color: '#64748b' }}>Date</th>
                            <th style={{ padding: '12px', color: '#64748b' }}>Amount</th>
                            <th style={{ padding: '12px', color: '#64748b' }}>Status</th>
                            <th style={{ padding: '12px', color: '#64748b', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '16px 12px', fontWeight: 600 }}>#{order.id.replace('#', '')}</td>
                                <td style={{ padding: '16px 12px' }}>{order.user}</td>
                                <td style={{ padding: '16px 12px' }}>{order.plan}</td>
                                <td style={{ padding: '16px 12px', color: '#64748b' }}>{order.date}</td>
                                <td style={{ padding: '16px 12px', fontWeight: 600 }}>{order.amount}</td>
                                <td style={{ padding: '16px 12px' }}>
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
                                <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                                    <button
                                        onClick={() => handleViewOrder(order)}
                                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    )
}
