'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, Button, Input } from '@/components/ui';
import { Edit, Trash2, Plus, Search, FileText, Video, X } from 'lucide-react';
import { useContent } from '@/context/ContentContext';

export default function ContentManagementPage() {
    const { chapters, addChapter, deleteChapter } = useContent();
    const [searchTerm, setSearchTerm] = useState('');

    // Add Chapter State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newChapterTitle, setNewChapterTitle] = useState('');
    const [newChapterSubject, setNewChapterSubject] = useState('biology'); // Default

    const handleAddChapter = () => {
        if (!newChapterTitle.trim()) return;
        addChapter(newChapterSubject, newChapterTitle);
        setNewChapterTitle('');
        setIsModalOpen(false);
    };

    // Filter logic
    const filteredChapters = chapters.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.subjectId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Course Content</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage chapters, notes, and videos.</p>
                </div>
            </div>

            <Card padding="md">
                <div style={{ marginBottom: '24px', display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <Input
                            placeholder="Search chapters..."
                            icon={<Search size={18} />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button leftIcon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>Add New Chapter</Button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                            <th style={{ padding: '12px', color: '#64748b', fontSize: '0.875rem' }}>Subject</th>
                            <th style={{ padding: '12px', color: '#64748b', fontSize: '0.875rem' }}>Chapter Title</th>
                            <th style={{ padding: '12px', color: '#64748b', fontSize: '0.875rem' }}>Topics</th>
                            <th style={{ padding: '12px', color: '#64748b', fontSize: '0.875rem' }}>Materials</th>
                            <th style={{ padding: '12px', color: '#64748b', fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredChapters.map((chapter) => (
                            <tr key={`${chapter.subjectId}-${chapter.id}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '16px 12px', textTransform: 'capitalize' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        background: '#f1f5f9',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        color: '#64748b'
                                    }}>
                                        {chapter.subjectId}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 12px', fontWeight: 500 }}>{chapter.title}</td>
                                <td style={{ padding: '16px 12px', color: '#64748b' }}>{chapter.topics.length} items</td>
                                <td style={{ padding: '16px 12px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#64748b' }}>
                                            <FileText size={14} />
                                            {chapter.topics.reduce((acc, t) => acc + t.materials.filter(m => m.type === 'pdf').length, 0)}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#64748b' }}>
                                            <Video size={14} />
                                            {chapter.topics.reduce((acc, t) => acc + t.materials.filter(m => m.type === 'video').length, 0)}
                                        </span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                        <Link href={`/admin/content/${chapter.subjectId}/${chapter.id}`}>
                                            <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }} title="Manage Content">
                                                <Edit size={18} />
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => deleteChapter(chapter.id)}
                                            style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}
                                            title="Delete Chapter"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            {/* Add Chapter Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '24px',
                        borderRadius: '12px',
                        width: '400px',
                        maxWidth: '90%'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Add New Chapter</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Subject</label>
                                <select
                                    value={newChapterSubject}
                                    onChange={(e) => setNewChapterSubject(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '1rem'
                                    }}
                                >
                                    <option value="biology">Biology</option>
                                    <option value="physics">Physics</option>
                                    <option value="chemistry">Chemistry</option>
                                </select>
                            </div>

                            <Input
                                label="Chapter Title"
                                placeholder="e.g. Thermodynamics"
                                value={newChapterTitle}
                                onChange={(e) => setNewChapterTitle(e.target.value)}
                            />

                            <Button onClick={handleAddChapter} style={{ width: '100%' }}>Create Chapter</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
