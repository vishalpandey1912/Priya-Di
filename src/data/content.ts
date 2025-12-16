export interface Material {
    id: string;
    type: 'pdf' | 'video' | 'test';
    title: string;
    url?: string; // In real app this would be link to storage
    duration?: string; // For videos
}

export interface Topic {
    id: string;
    title: string;
    materials: Material[];
}

export interface Chapter {
    id: string;
    subjectId: string;
    title: string;
    topics: Topic[];
}

// Helper to easily add content:
// Add your chapters here.
export const contentData: Chapter[] = [
    // --- Biology Chapters ---
    {
        id: 'bio-1',
        subjectId: 'biology',
        title: 'Chapter 1: The Living World',
        topics: [
            {
                id: 'bio-1-t1',
                title: 'Topic 1: What is Living?',
                materials: [
                    { id: 'bio-1-m1', type: 'pdf', title: 'Notes: Defining Characteristics' },
                    { id: 'bio-1-m2', type: 'video', title: 'Video: Growth & Reproduction', duration: '15 mins' },
                    {
                        id: 'bio-1-m_new',
                        type: 'pdf',
                        title: 'My Uploaded Notes (Living World)',
                        url: '/notes/RESUME.pdf' // Matches the file in public/notes
                    }
                ]
            },
            {
                id: 'bio-1-t2',
                title: 'Topic 2: Diversity in the Living World',
                materials: [
                    { id: 'bio-1-m3', type: 'pdf', title: 'Notes: Taxonomy Categories' }
                ]
            }
        ]
    },
    {
        id: 'bio-2',
        subjectId: 'biology',
        title: 'Chapter 2: Biological Classification',
        topics: [
            {
                id: 'bio-2-t1',
                title: 'Topic 1: Kingdom Monera',
                materials: [
                    { id: 'bio-2-m1', type: 'pdf', title: 'Notes: Characteristics of Monera' },
                    { id: 'bio-2-m2', type: 'video', title: 'Video: Bacteria Structure', duration: '20 mins' }
                ]
            },
            {
                id: 'bio-2-t2',
                title: 'Topic 2: Kingdom Protista',
                materials: []
            },
            {
                id: 'bio-2-t3',
                title: 'Topic 3: Kingdom Fungi',
                materials: []
            }
        ]
    },
    { id: 'bio-3', subjectId: 'biology', title: 'Chapter 3: Plant Kingdom', topics: [] },
    { id: 'bio-4', subjectId: 'biology', title: 'Chapter 4: Animal Kingdom', topics: [] },

    // --- Physics Chapters ---
    { id: 'phy-1', subjectId: 'physics', title: 'Chapter 1: Physical World', topics: [] },
    { id: 'phy-2', subjectId: 'physics', title: 'Chapter 2: Units and Measurements', topics: [] },

    // --- Chemistry Chapters ---
    { id: 'chem-1', subjectId: 'chemistry', title: 'Chapter 1: Some Basic Concepts', topics: [] },
    { id: 'chem-2', subjectId: 'chemistry', title: 'Chapter 2: Structure of Atom', topics: [] },
];

export const getChaptersBySubject = (subjectId: string) => {
    return contentData.filter(c => c.subjectId === subjectId.toLowerCase());
};

export const getChapterById = (subjectId: string, chapterId: string) => {
    return contentData.find(c => c.subjectId === subjectId.toLowerCase() && c.id === chapterId);
};
