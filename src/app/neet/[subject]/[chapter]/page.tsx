'use client';

import React, { use } from 'react';
import { Accordion, AccordionItem } from '@/components/ui';
import { PlayCircle, FileText, HelpCircle } from 'lucide-react';
import { useContent } from '@/context/ContentContext';

export default function ChapterPage({
    params,
}: {
    params: Promise<{ subject: string; chapter: string }>;
}) {
    const { subject, chapter: chapterId } = use(params);
    const { getChapterById } = useContent();
    const chapterData = getChapterById(subject, chapterId);

    if (!chapterData) {
        return <div>Chapter not found.</div>;
    }

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--primary-color)', textTransform: 'capitalize' }}>
                    {subject} &gt; Chapter {chapterId}
                </span>
                <h1 style={{ fontSize: '1.75rem', marginTop: '8px' }}>{chapterData.title}</h1>
            </div>

            <Accordion>
                {chapterData.topics.length === 0 && <p>Coming soon...</p>}
                {chapterData.topics.map((topic, index) => (
                    <AccordionItem key={topic.id} title={topic.title} defaultOpen={index === 0}>
                        {topic.materials.length === 0 ? (
                            <p style={{ color: 'var(--text-light)' }}>No content uploaded yet.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {topic.materials.map(material => (
                                    <a
                                        key={material.id}
                                        href={material.url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '4px 0' }}>
                                            {material.type === 'pdf' && <FileText size={16} color="var(--primary-color)" />}
                                            {material.type === 'video' && <PlayCircle size={16} color="var(--secondary-color)" style={{ fill: 'var(--primary-color)' }} />}
                                            {material.type === 'test' && <HelpCircle size={16} />}

                                            <span style={{ flex: 1 }}>{material.title}</span>
                                            {material.duration && <span style={{ fontSize: '0.8rem', color: '#999' }}>({material.duration})</span>}
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
