import React from 'react';
import styles from './Card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hoverable?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({
    children,
    className = '',
    hoverable = false,
    padding = 'md',
    ...props
}: CardProps) => {
    return (
        <div
            className={`
        ${styles.card} 
        ${hoverable ? styles.hoverable : ''} 
        ${styles['padding-' + padding]}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
};
