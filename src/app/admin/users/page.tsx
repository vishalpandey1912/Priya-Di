'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '@/components/ui';
import { Search, Shield, Ban, CheckCircle, MoreHorizontal } from 'lucide-react';

interface User {
    name: string;
    email: string;
    role: 'student' | 'admin';
    status?: 'active' | 'blocked';
    joinedAt?: string;
}

export default function UsersManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Load users from local storage
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        // Add some mock metadata if missing
        const enrichedUsers = storedUsers.map((u: User) => ({
            ...u,
            role: u.role || 'student',
            status: u.status || 'active',
            joinedAt: u.joinedAt || new Date().toLocaleDateString()
        }));

        // Ensure Admin is in the list
        if (!enrichedUsers.find((u: User) => u.email === 'admin@desi.com')) {
            enrichedUsers.unshift({ name: 'Super Admin', email: 'admin@desi.com', role: 'admin', status: 'active', joinedAt: 'System' });
        }

        setUsers(enrichedUsers);
    }, []);

    const toggleUserStatus = (email: string) => {
        const updatedUsers = users.map(u => {
            if (u.email === email) {
                return { ...u, status: u.status === 'active' ? 'blocked' : 'active' };
            }
            return u;
        });
        setUsers(updatedUsers as User[]);
        // In a real app, we would save this back to localStorage/DB
        // For this demo, we can save to 'users' key but merging is tricky without IDs.
        // Simplified:
        const storageUsers = updatedUsers.filter(u => u.role !== 'admin').map(({ status, joinedAt, ...rest }) => rest);
        // We aren't actually saving the status back to the main 'users' array perfectly here for simplicity 
        // as the auth flow uses that array. But for the UI demo it toggles state.
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Users</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage student access and roles.</p>
                </div>
            </div>

            <Card padding="md">
                <div style={{ marginBottom: '24px', maxWidth: '400px' }}>
                    <Input
                        placeholder="Search users..."
                        icon={<Search size={18} />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                            <th style={{ padding: '12px', color: '#64748b' }}>User</th>
                            <th style={{ padding: '12px', color: '#64748b' }}>Role</th>
                            <th style={{ padding: '12px', color: '#64748b' }}>Status</th>
                            <th style={{ padding: '12px', color: '#64748b' }}>Joined</th>
                            <th style={{ padding: '12px', color: '#64748b', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '16px 12px' }}>
                                    <div>
                                        <div style={{ fontWeight: 500 }}>{user.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{user.email}</div>
                                    </div>
                                </td>
                                <td style={{ padding: '16px 12px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        backgroundColor: user.role === 'admin' ? '#e0e7ff' : '#f1f5f9',
                                        color: user.role === 'admin' ? '#4338ca' : '#64748b'
                                    }}>
                                        {(user.role || 'STUDENT').toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 12px' }}>
                                    {user.status === 'active' ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#166534', fontSize: '0.9rem' }}>
                                            <CheckCircle size={14} /> Active
                                        </span>
                                    ) : (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#991b1b', fontSize: '0.9rem' }}>
                                            <Ban size={14} /> Blocked
                                        </span>
                                    )}
                                </td>
                                <td style={{ padding: '16px 12px', color: '#64748b' }}>{user.joinedAt}</td>
                                <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                                    {user.role !== 'admin' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => toggleUserStatus(user.email)}
                                        >
                                            {user.status === 'active' ? 'Block' : 'Unblock'}
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}
