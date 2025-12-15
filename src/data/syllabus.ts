export interface Unit {
    id: string;
    name: string;
}

export interface Subject {
    id: string; // e.g., 'biology'
    name: string; // e.g. 'Biology'
    units: Unit[];
}

export const syllabusData: Subject[] = [
    {
        id: 'biology',
        name: 'Biology',
        units: [
            { name: 'The Living World', id: '1' },
            { name: 'Biological Classification', id: '2' },
            { name: 'Plant Kingdom', id: '3' },
            { name: 'Animal Kingdom', id: '4' },
        ]
    },
    {
        id: 'physics',
        name: 'Physics',
        units: [
            { name: 'Physical World', id: '1' },
            { name: 'Units and Measurements', id: '2' },
        ]
    },
    {
        id: 'chemistry',
        name: 'Chemistry',
        units: [
            { name: 'Some Basic Concepts', id: '1' },
            { name: 'Structure of Atom', id: '2' },
        ]
    }
];
