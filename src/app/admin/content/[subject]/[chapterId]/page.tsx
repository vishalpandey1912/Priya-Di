'use client';

import React, { useState, use } from 'react';
import { Card, Button, Input } from '@/components/ui';
import { useContent } from '@/context/ContentContext';
import { Plus, ArrowLeft, FileText, Video, Trash2, X, Edit } from 'lucide-react';
import Link from 'next/link';

export default function AdminChapterPage({
    params,
}: {
    params: Promise<{ subject: string; chapterId: string }>;
}) {
    const { subject, chapterId } = use(params);
    const { getChapterById, addTopic, addMaterial, updateMaterial, deleteMaterial } = useContent();
    const chapter = getChapterById(subject, chapterId);

    // Modal States
    const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
    const [newTopicTitle, setNewTopicTitle] = useState('');

    const [isMaterialModalOpen, setMaterialModalOpen] = useState(false);
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
    const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);

    const [materialType, setMaterialType] = useState<'pdf' | 'video'>('pdf');
    const [materialTitle, setMaterialTitle] = useState('');
    const [materialUrl, setMaterialUrl] = useState('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    if (!chapter) return <div>Chapter not found</div>;

    const handleAddTopic = () => {
        if (!newTopicTitle) return;
        addTopic(subject, chapterId, newTopicTitle);
        setNewTopicTitle('');
        setIsTopicModalOpen(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Check file size (limit to 3MB for localStorage safety)
            if (file.size > 3 * 1024 * 1024) {
                alert("File is too large for the demo (Max 3MB). Please use a smaller file.");
                return;
            }

            setUploadedFile(file);
            setMaterialTitle(file.name.split('.')[0]); // Auto-fill title

            // Convert to Base64 for storage
            const reader = new FileReader();
            reader.onloadend = () => {
                setMaterialUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveMaterial = () => {
        if (!selectedTopicId || !materialTitle) return;

        // If it's an "Edit"
        if (editingMaterialId) {
            updateMaterial(subject, chapterId, selectedTopicId, editingMaterialId, {
                type: materialType,
                title: materialTitle,
                url: materialUrl
            });
        } else {
            // New Material
            addMaterial(subject, chapterId, selectedTopicId, {
                type: materialType,
                title: materialTitle,
                url: materialUrl
            });
        }

        resetMaterialModal();
    };

    const openAddMaterialModal = (topicId: string) => {
        resetMaterialModal();
        setSelectedTopicId(topicId);
        setMaterialModalOpen(true);
    };

    const openEditMaterialModal = (topicId: string, material: any) => {
        setSelectedTopicId(topicId);
        setEditingMaterialId(material.id);
        setMaterialTitle(material.title);
        setMaterialType(material.type);
        setMaterialUrl(material.url || '');
        setMaterialModalOpen(true);
    };

    const resetMaterialModal = () => {
        setMaterialModalOpen(false);
        setEditingMaterialId(null);
        setMaterialTitle('');
        setMaterialUrl('');
        setUploadedFile(null);
        setMaterialType('pdf');
    };

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <Link href="/admin/content" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', marginBottom: '16px' }}>
                    <ArrowLeft size={16} /> Back to Courses
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span style={{ textTransform: 'capitalize', color: 'var(--primary-color)', fontWeight: 600 }}>{subject}</span>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{chapter.title}</h1>
                    </div>
                    <Button leftIcon={<Plus size={18} />} onClick={() => setIsTopicModalOpen(true)}>Add New Topic</Button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {chapter.topics.length === 0 && (
                    <Card padding="lg" style={{ textAlign: 'center', color: '#64748b' }}>
                        <p>No topics yet. Create one to start adding materials.</p>
                    </Card>
                )}

                {chapter.topics.map((topic) => (
                    <Card key={topic.id} padding="md">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{topic.title}</h3>
                            <Button size="sm" variant="outline" leftIcon={<Plus size={14} />} onClick={() => openAddMaterialModal(topic.id)}>Add Material</Button>
                        </div>

                        {topic.materials.length === 0 ? (
                            <p style={{ fontSize: '0.9rem', color: '#94a3b8', fontStyle: 'italic' }}>No notes or videos added.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {topic.materials.map((material) => (
                                    <div key={material.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '8px 12px',
                                        backgroundColor: '#f8fafc',
                                        borderRadius: '6px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {material.type === 'pdf' ? <FileText size={16} color="#00A99D" /> : <Video size={16} color="#3b82f6" />}
                                            {material.url ? (
                                                <a href={material.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ fontSize: '0.9rem', fontWeight: 500, textDecoration: 'underline' }}>{material.title}</span>
                                                </a>
                                            ) : (
                                                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{material.title}</span>
                                            )}
                                            {material.url && <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({material.type === 'pdf' ? 'PDF' : 'Video'})</span>}
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => openEditMaterialModal(topic.id, material)}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this material?')) {
                                                        deleteMaterial(subject, chapterId, topic.id, material.id);
                                                    }
                                                }}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            {/* Add Topic Modal */}
            {isTopicModalOpen && (
                <div style={modalOverlayStyle}>
                    <Card style={modalContentStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h3 style={{ fontWeight: 700 }}>Add Topic</h3>
                            <button onClick={() => setIsTopicModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <Input label="Topic Name" placeholder="e.g. Introduction" value={newTopicTitle} onChange={(e) => setNewTopicTitle(e.target.value)} />
                        <Button style={{ marginTop: '16px', width: '100%' }} onClick={handleAddTopic}>Create Topic</Button>
                    </Card>
                </div>
            )}

            {/* Add/Edit Material Modal */}
            {isMaterialModalOpen && (
                <div style={modalOverlayStyle}>
                    <Card style={modalContentStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h3 style={{ fontWeight: 700 }}>{editingMaterialId ? 'Edit Material' : 'Add Material'}</h3>
                            <button onClick={resetMaterialModal} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Type</label>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <input type="radio" checked={materialType === 'pdf'} onChange={() => setMaterialType('pdf')} /> PDF Document
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <input type="radio" checked={materialType === 'video'} onChange={() => setMaterialType('video')} /> Video
                                </label>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                            {/* File Upload UI */}
                            <div style={{ marginBottom: '8px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem' }}>
                                    Upload {materialType === 'pdf' ? 'File' : 'Video'} {materialType === 'video' && '(Max 5MB)'}
                                </label>
                                <input
                                    type="file"
                                    accept={materialType === 'pdf' ? ".pdf,.doc,.docx" : "video/*"}
                                    onChange={handleFileChange}
                                    style={{ width: '100%' }}
                                />
                                {materialUrl && materialUrl.startsWith('data:') && (
                                    <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '4px' }}>✓ File prepared for upload</p>
                                )}
                                {materialType === 'video' && (
                                    <p style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '4px' }}>
                                        Warning: Large videos will crash the demo. Please use small clips (under 5MB).
                                    </p>
                                )}
                            </div>

                            <Input
                                label="Title"
                                placeholder={materialType === 'pdf' ? "e.g. NCERT Summary" : "e.g. Lecture 1"}
                                value={materialTitle}
                                onChange={(e) => setMaterialTitle(e.target.value)}
                            />

                            <Input
                                label={materialType === 'pdf' ? "Or Paste URL" : "Or Video Link"}
                                placeholder="Paste external link if skipping upload"
                                value={materialUrl}
                                onChange={(e) => setMaterialUrl(e.target.value)}
                                disabled={!!uploadedFile}
                            />
                        </div>

                        <Button style={{ marginTop: '16px', width: '100%' }} onClick={handleSaveMaterial}>
                            {editingMaterialId ? 'Update Material' : 'Add Material'}
                        </Button>
                    </Card>
                </div>
            )}
        </div>
    );
}

const modalOverlayStyle = {
    position: 'fixed' as const,
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000
};

const modalContentStyle = {
    width: '400px',
    maxWidth: '90%'
};
