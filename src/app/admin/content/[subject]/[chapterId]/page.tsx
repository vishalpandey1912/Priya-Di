'use client';

import { QuizBuilder } from '@/components/admin/QuizBuilder';
import { HelpCircle } from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { use } from 'react';
import { useState } from 'react';
import { ArrowLeft, Edit, FileText, Plus, Trash2, Video, X } from 'lucide-react';
import { Button, Card, Input } from '@/components/ui';
import Link from 'next/link';
import { useContent } from '@/context/ContentContext';
import { Material } from '@/data/content';

export default function AdminChapterPage({
    params,
}: {
    params: Promise<{ subject: string; chapterId: string }>;
}) {
    const { subject, chapterId } = use(params);
    const { getChapterById, addTopic, addMaterial, updateMaterial, deleteMaterial, deleteTopic, uploadFile, addQuiz, updateQuiz, deleteQuiz, quizzes } = useContent();
    const chapter = getChapterById(subject, chapterId);

    // Modal States
    const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
    const [newTopicTitle, setNewTopicTitle] = useState('');

    const [isMaterialModalOpen, setMaterialModalOpen] = useState(false);
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
    const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);

    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
    const [quizInitialData, setQuizInitialData] = useState<{ title: string, questions: any[] } | undefined>(undefined);

    const [materialType, setMaterialType] = useState<'pdf' | 'video' | 'image' | 'document' | 'test'>('pdf');
    const [materialTitle, setMaterialTitle] = useState('');
    const [materialUrl, setMaterialUrl] = useState(''); // Keep for manual URL
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    if (!chapter) return <div>Chapter not found</div>;

    const handleAddTopic = () => {
        if (!newTopicTitle.trim()) return;
        addTopic(subject, chapterId, newTopicTitle);
        setNewTopicTitle('');
        setIsTopicModalOpen(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedFile(e.target.files[0]);
            // Clear manual URL if file uploads
            setMaterialUrl('');
        }
    };

    const handleSaveQuiz = async (title: string, questions: any[]) => {
        if (editingQuizId) {
            await updateQuiz(editingQuizId, title, questions);
        } else if (selectedTopicId) {
            await addQuiz(selectedTopicId, title, questions);
        }
        setIsQuizModalOpen(false);
        setEditingQuizId(null);
        setQuizInitialData(undefined);
    };

    const openAddQuizModal = (topicId: string) => {
        setSelectedTopicId(topicId);
        setEditingQuizId(null);
        setQuizInitialData(undefined);
        setIsQuizModalOpen(true);
    };

    const openEditQuizModal = async (quiz: any) => {
        setEditingQuizId(quiz.id);

        // Fetch Questions
        const { data: questions } = await supabase
            .from('quiz_questions')
            .select('*')
            .eq('quiz_id', quiz.id);

        const mappedQuestions = questions?.map(q => ({
            id: q.id,
            questionText: q.question_text,
            options: q.options,
            correctOption: q.correct_option
        })) || [];

        setQuizInitialData({
            title: quiz.title,
            questions: mappedQuestions
        });

        setIsQuizModalOpen(true);
    };

    const handleDeleteQuiz = async (quizId: string) => {
        if (confirm('Are you sure you want to delete this quiz?')) {
            await deleteQuiz(quizId);
        }
    };

    const handleSaveMaterial = async () => {
        if (!selectedTopicId || !materialTitle) return;

        let finalUrl = materialUrl;

        if (uploadedFile) {
            setIsUploading(true);
            const publicUrl = await uploadFile(uploadedFile);
            setIsUploading(false);
            if (!publicUrl) {
                alert('Failed to upload file. Please try again.');
                return;
            }
            finalUrl = publicUrl;
        }

        if (!finalUrl) {
            alert('Please provide a URL or upload a file.');
            return;
        }

        if (editingMaterialId) {
            await updateMaterial(subject, chapterId, selectedTopicId, editingMaterialId, {
                title: materialTitle,
                url: finalUrl,
                type: materialType
            });
        } else {
            await addMaterial(subject, chapterId, selectedTopicId, {
                title: materialTitle,
                url: finalUrl,
                type: materialType
            });
        }

        setMaterialModalOpen(false);
    };

    const openAddMaterialModal = (topicId: string) => {
        resetMaterialModal();
        setSelectedTopicId(topicId);
        setMaterialModalOpen(true);
    };

    const openEditMaterialModal = (topicId: string, material: Material) => {
        setSelectedTopicId(topicId);
        setEditingMaterialId(material.id);
        setMaterialTitle(material.title);
        setMaterialType(material.type);
        setMaterialUrl(material.url || '');
        setMaterialModalOpen(true);
    };

    const resetMaterialModal = () => {
        setMaterialTitle('');
        setMaterialUrl('');
        setMaterialType('pdf');
        setUploadedFile(null);
        setEditingMaterialId(null);
        setIsUploading(false);
        setMaterialModalOpen(false); // Close the modal
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

                {chapter.topics.map((topic) => {
                    const quiz = quizzes?.find(q => q.topic_id === topic.id);

                    return (
                        <Card key={topic.id} padding="md">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{topic.title}</h3>
                                    {quiz && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                backgroundColor: '#dcfce7',
                                                color: '#166534',
                                                padding: '2px 8px',
                                                borderRadius: '99px',
                                                fontWeight: 600
                                            }}>
                                                Quiz Helper
                                            </span>
                                            <button onClick={() => openEditQuizModal(quiz)} style={{ cursor: 'pointer', border: 'none', background: 'none', color: '#64748b' }} title="Edit Quiz">
                                                <Edit size={14} />
                                            </button>
                                            <button onClick={() => handleDeleteQuiz(quiz.id)} style={{ cursor: 'pointer', border: 'none', background: 'none', color: '#ef4444' }} title="Delete Quiz">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {!quiz && (
                                        <Button size="sm" variant="outline" leftIcon={<HelpCircle size={14} />} onClick={() => openAddQuizModal(topic.id)}>
                                            Create Quiz
                                        </Button>
                                    )}
                                    <Button size="sm" variant="outline" leftIcon={<Plus size={14} />} onClick={() => openAddMaterialModal(topic.id)}>Add Material</Button>
                                    <button
                                        onClick={() => {
                                            if (confirm('Are you sure you want to delete this topic and all its contents?')) {
                                                deleteTopic(subject, chapterId, topic.id);
                                            }
                                        }}
                                        style={{
                                            border: '1px solid #fee2e2',
                                            background: '#fef2f2',
                                            color: '#ef4444',
                                            cursor: 'pointer',
                                            padding: '8px',
                                            borderRadius: '6px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
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
                    );
                })}
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
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>Material Type</label>
                                <select
                                    value={materialType}
                                    onChange={(e) => setMaterialType(e.target.value as any)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: 'white'
                                    }}
                                >
                                    <option value="pdf">PDF Document</option>
                                    <option value="video">Video</option>
                                    <option value="image">Image (JPG/PNG)</option>
                                    <option value="document">Word/Doc</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>
                                    Upload File {materialType === 'video' && '(or paste link below)'}
                                </label>
                                <input
                                    type="file"
                                    accept={
                                        materialType === 'pdf' ? '.pdf' :
                                            materialType === 'video' ? 'video/*' :
                                                materialType === 'image' ? 'image/*' :
                                                    '.doc,.docx,.txt'
                                    }
                                    onChange={handleFileChange}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '6px'
                                    }}
                                />
                                {uploadedFile && (
                                    <p style={{ marginTop: '4px', fontSize: '0.8rem', color: '#166534' }}>
                                        Selected: {uploadedFile.name}
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

            {/* Quiz Builder Modal */}
            <QuizBuilder
                isOpen={isQuizModalOpen}
                onClose={() => setIsQuizModalOpen(false)}
                onSave={handleSaveQuiz}
                initialData={quizInitialData}
            />
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
