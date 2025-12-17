'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './Accordion.module.css';

interface AccordionItemProps {
    title: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export const AccordionItem = ({ title, children, defaultOpen = false }: AccordionItemProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={styles.item}>
            <button
                className={`${styles.trigger} ${isOpen ? styles.active : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{title}</span>
                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {isOpen && <div className={styles.content}>{children}</div>}
        </div>
    );
};

export const Accordion = ({ children }: { children: React.ReactNode }) => {
    return <div className={styles.accordion}>{children}</div>;
};
