import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui';
import { ChevronRight } from 'lucide-react';
import { getChaptersBySubject } from '@/data/content';

export default async function SubjectPage({
    params,
}: {
    params: Promise<{ subject: string }>;
}) {
    const { subject } = await params;
    const subjectName = subject.charAt(0).toUpperCase() + subject.slice(1);
    const chapters = getChaptersBySubject(subject);

    return (
        <div style={{ padding: '0 0' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '2rem' }}>{subjectName}</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Select a chapter to start learning.</p>
            </div>

            {chapters.length === 0 ? (
                <p>No chapters added yet.</p>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {chapters.map((chapter) => (
                        <Link key={chapter.id} href={`/neet/${subject}/${chapter.id}`}>
                            <Card hoverable padding="md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{chapter.title}</h3>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{chapter.topics.length} Topics</span>
                                </div>
                                <ChevronRight size={20} color="var(--text-light)" />
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
