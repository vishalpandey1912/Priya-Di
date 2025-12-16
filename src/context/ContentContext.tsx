'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { contentData as initialContent, Chapter, Topic, Material } from '@/data/content';

interface ContentContextType {
    chapters: Chapter[];
    addChapter: (subjectId: string, title: string) => void;
    deleteChapter: (chapterId: string) => void;
    addTopic: (subjectId: string, chapterId: string, title: string) => void;
    addMaterial: (subjectId: string, chapterId: string, topicId: string, material: Omit<Material, 'id'>) => void;
    updateMaterial: (subjectId: string, chapterId: string, topicId: string, materialId: string, updates: Partial<Material>) => void;
    deleteMaterial: (subjectId: string, chapterId: string, topicId: string, materialId: string) => void;
    getChaptersBySubject: (subjectId: string) => Chapter[];
    getChapterById: (subjectId: string, chapterId: string) => Chapter | undefined;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider = ({ children }: { children: React.ReactNode }) => {
    const [chapters, setChapters] = useState<Chapter[]>(initialContent);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const savedContent = localStorage.getItem('siteContent');
        if (savedContent) {
            try {
                const parsed = JSON.parse(savedContent);
                // Merge strategy: simpler to just use saved if exists, 
                // but for now let's prioritize saved content completely to allow "deletions" to persist
                setChapters(parsed);
            } catch (e) {
                console.error("Failed to parse saved content", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage whenever chapters change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('siteContent', JSON.stringify(chapters));
        }
    }, [chapters, isLoaded]);

    const addChapter = (subjectId: string, title: string) => {
        const newChapter: Chapter = {
            id: Date.now().toString(), // Simple ID generation
            subjectId: subjectId.toLowerCase(),
            title,
            topics: []
        };
        setChapters(prev => [...prev, newChapter]);
    };

    const addTopic = (subjectId: string, chapterId: string, title: string) => {
        setChapters(prev => prev.map(c => {
            if (c.id === chapterId && c.subjectId === subjectId) {
                return {
                    ...c,
                    topics: [...c.topics, { id: Date.now().toString(), title, materials: [] }]
                };
            }
            return c;
        }));
    };

    const addMaterial = (subjectId: string, chapterId: string, topicId: string, material: Omit<Material, 'id'>) => {
        setChapters(prev => prev.map(c => {
            if (c.id === chapterId && c.subjectId === subjectId) {
                return {
                    ...c,
                    topics: c.topics.map(t => {
                        if (t.id === topicId) {
                            return {
                                ...t,
                                materials: [...t.materials, { ...material, id: Date.now().toString() }]
                            };
                        }
                        return t;
                    })
                };
            }
            return c;
        }));
    };

    const updateMaterial = (subjectId: string, chapterId: string, topicId: string, materialId: string, updates: Partial<Material>) => {
        setChapters(prev => prev.map(c => {
            if (c.id === chapterId && c.subjectId === subjectId) {
                return {
                    ...c,
                    topics: c.topics.map(t => {
                        if (t.id === topicId) {
                            return {
                                ...t,
                                materials: t.materials.map(m =>
                                    m.id === materialId ? { ...m, ...updates } : m
                                )
                            };
                        }
                        return t;
                    })
                };
            }
            return c;
        }));
    };

    const deleteMaterial = (subjectId: string, chapterId: string, topicId: string, materialId: string) => {
        setChapters(prev => prev.map(c => {
            if (c.id === chapterId && c.subjectId === subjectId) {
                return {
                    ...c,
                    topics: c.topics.map(t => {
                        if (t.id === topicId) {
                            return {
                                ...t,
                                materials: t.materials.filter(m => m.id !== materialId)
                            };
                        }
                        return t;
                    })
                };
            }
            return c;
        }));
    };

    const deleteChapter = (chapterId: string) => {
        setChapters(prev => prev.filter(c => c.id !== chapterId));
    };

    const getChaptersBySubject = (subjectId: string) => {
        return chapters.filter(c => c.subjectId === subjectId.toLowerCase());
    };

    const getChapterById = (subjectId: string, chapterId: string) => {
        return chapters.find(c => c.subjectId === subjectId.toLowerCase() && c.id === chapterId);
    };

    return (
        <ContentContext.Provider value={{
            chapters,
            addChapter,
            deleteChapter,
            addTopic,
            addMaterial,
            updateMaterial,
            deleteMaterial,
            getChaptersBySubject,
            getChapterById
        }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => {
    const context = useContext(ContentContext);
    if (context === undefined) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
};
