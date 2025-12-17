'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '@/components/ui';
import { Search, Shield, Ban, CheckCircle, MoreHorizontal } from 'lucide-react';
import { UserFormModal } from '@/components/admin/UserFormModal';
import { supabase } from '@/lib/supabase';

interface User {
    name: string;
    email: string;
    role: 'student' | 'admin';
    status?: 'active' | 'blocked';
    joinedAt?: string;
}

// Mock Data for permanent testing
const MOCK_USERS: User[] = [
    { name: 'Rahul Sharma', email: 'rahul.s@example.com', role: 'student', status: 'active', joinedAt: '12 Dec, 2024' },
    { name: 'Priya Patel', email: 'priya.p@example.com', role: 'student', status: 'active', joinedAt: '10 Dec, 2024' },
    { name: 'Amit Verma', email: 'amit.v@example.com', role: 'student', status: 'blocked', joinedAt: '05 Dec, 2024' },
    { name: 'Sneha Gupta', email: 'sneha.g@example.com', role: 'student', status: 'active', joinedAt: '14 Dec, 2024' },
    { name: 'Vikram Singh', email: 'vikram.s@example.com', role: 'student', status: 'active', joinedAt: '15 Dec, 2024' },
];

export default function UsersManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userPlans, setUserPlans] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const fetchUsers = async () => {
            // 1. Fetch Profiles from Supabase
            const { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching users:', error);
                return;
            }

            // 2. Map to UI User format
            let dbUsers: User[] = (profiles || []).map(p => ({
                name: p.name || 'Unknown',
                email: p.email,
                role: p.role || 'student',
                status: 'active', // Default to active as we don't have block status in DB yet
                joinedAt: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'
            }));

            // 3. Ensure Super Admin is visible
            if (!dbUsers.find(u => u.email === 'admin@desi.com')) {
                dbUsers.unshift({ name: 'Super Admin', email: 'admin@desi.com', role: 'admin', status: 'active', joinedAt: 'System' });
            }

            setUsers(dbUsers);

            // 4. Fetch Plans (Optional: Fetching orders to show badges)
            // For now, we'll skip complex join and just show 'None' or fetch real orders later.
            // Let's at least keep the mock logic if available or just empty.
            setUserPlans({});
        };

        fetchUsers();
    }, []);

    const toggleUserStatus = (email: string) => {
        const updatedUsers = users.map(u => {
            if (u.email === email) {
                return { ...u, status: u.status === 'active' ? 'blocked' : 'active' };
            }
            return u;
        });
        setUsers(updatedUsers as User[]);
        // Save status changes
        // Note: For full persistence we'd need to update the source (mock vs local) carefully
        // Simplified: Save purely local users back to local storage
        const storageUsers = updatedUsers.filter(u => u.role !== 'admin').map(u => ({
            name: u.name,
            email: u.email,
            password: 'student123', // Retain/Fallback
            role: u.role,
            status: u.status,
            joinedAt: u.joinedAt
        }));
        // We actually want to save only 'new' users to localStorage in this hybrid model, 
        // but for simplicity let's save everyone so status persists
        localStorage.setItem('users', JSON.stringify(storageUsers));
    };

    const handleAddUser = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleSaveUser = (data: any) => {
        if (editingUser) {
            // Update
            const updatedUsers = users.map(u => u.email === editingUser.email ? { ...u, ...data } : u);
            setUsers(updatedUsers as User[]);
        } else {
            // Create
            const newUser: User = {
                ...data,
                role: 'student',
                status: 'active',
                joinedAt: new Date().toLocaleDateString()
            };
            setUsers([...users, newUser]);

            // Persist to local storage for AuthContext to pick up
            const currentStorage = JSON.parse(localStorage.getItem('users') || '[]');
            currentStorage.push({ ...newUser, password: data.password });
            localStorage.setItem('users', JSON.stringify(currentStorage));
        }
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
                <Button onClick={handleAddUser}>+ Add User</Button>
            </div>

            <UserFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSaveUser}
                initialData={editingUser}
            />

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
                            <th style={{ padding: '12px', color: '#64748b' }}>Plans</th>
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
                                <td style={{ padding: '16px 12px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {userPlans[user.email] && userPlans[user.email].map((plan, idx) => (
                                            <span key={idx} style={{
                                                fontSize: '0.75rem',
                                                backgroundColor: plan === 'None' ? '#f1f5f9' : '#fff7ed',
                                                color: plan === 'None' ? '#64748b' : '#c2410c',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                display: 'inline-block',
                                                width: 'fit-content'
                                            }}>
                                                {plan}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td style={{ padding: '16px 12px', color: '#64748b' }}>{user.joinedAt}</td>
                                <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                                    {user.role !== 'admin' && (
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleEditUser(user)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => toggleUserStatus(user.email)}
                                            >
                                                {user.status === 'active' ? 'Block' : 'Unblock'}
                                            </Button>
                                        </div>
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
