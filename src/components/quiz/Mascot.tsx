'use client';

import React from 'react';

type MascotState = 'idle' | 'happy' | 'sad' | 'fire';

interface Props {
    state: MascotState;
    className?: string;
}

/**
 * Bagheera — the Desi Educators NEET prep cat mascot.
 * Different facial expressions react to quiz answers.
 *
 * Drawn entirely in inline SVG so it scales crisp at any size and
 * the colors can be themed via the parent's CSS.
 */
export const Mascot = ({ state, className }: Props) => {
    const isHappy = state === 'happy' || state === 'fire';
    const isSad = state === 'sad';
    const isFire = state === 'fire';

    return (
        <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Bagheera the NEET cat"
        >
            {/* Drop shadow */}
            <ellipse cx="50" cy="92" rx="28" ry="3" fill="rgba(0,0,0,0.18)" />

            {/* Body (sitting) */}
            <ellipse cx="50" cy="78" rx="22" ry="14" fill="#3a3a3a" />

            {/* Tail curl on right */}
            <path d="M 70 78 Q 86 76 84 60 Q 82 52 75 56" stroke="#3a3a3a" strokeWidth="6" strokeLinecap="round" fill="none" />

            {/* Head */}
            <circle cx="50" cy="42" r="26" fill="#3a3a3a" />

            {/* Ears (triangular) */}
            <path d="M 32 26 L 28 8 L 44 22 Z" fill="#3a3a3a" />
            <path d="M 68 26 L 72 8 L 56 22 Z" fill="#3a3a3a" />
            {/* Inner ear */}
            <path d="M 33 22 L 32 14 L 39 21 Z" fill="#c41e1e" opacity="0.7" />
            <path d="M 67 22 L 68 14 L 61 21 Z" fill="#c41e1e" opacity="0.7" />

            {/* Eyes */}
            {isHappy && (
                <>
                    {/* Closed happy eyes (upturned crescents) */}
                    <path d="M 38 42 Q 42 36 46 42" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M 54 42 Q 58 36 62 42" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </>
            )}
            {isSad && (
                <>
                    {/* Sad downturned eyes */}
                    <ellipse cx="42" cy="44" rx="3.5" ry="3" fill="#fff" />
                    <ellipse cx="58" cy="44" rx="3.5" ry="3" fill="#fff" />
                    <circle cx="42" cy="45" r="1.7" fill="#1a1a1a" />
                    <circle cx="58" cy="45" r="1.7" fill="#1a1a1a" />
                    {/* Tear */}
                    <ellipse cx="38" cy="50" rx="1.5" ry="2.2" fill="#60a5fa" opacity="0.85" />
                    {/* Sad eyebrows */}
                    <path d="M 36 36 L 44 39" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 64 36 L 56 39" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
                </>
            )}
            {state === 'idle' && (
                <>
                    {/* Curious bright eyes */}
                    <ellipse cx="42" cy="42" rx="4" ry="5" fill="#fff" />
                    <ellipse cx="58" cy="42" rx="4" ry="5" fill="#fff" />
                    <circle cx="43" cy="43" r="2.2" fill="#1a1a1a" />
                    <circle cx="59" cy="43" r="2.2" fill="#1a1a1a" />
                    <circle cx="44" cy="42" r="0.8" fill="#fff" />
                    <circle cx="60" cy="42" r="0.8" fill="#fff" />
                </>
            )}

            {/* Sparkles for fire/streak state */}
            {isFire && (
                <>
                    <text x="20" y="20" fontSize="14" fill="#fbbf24">✦</text>
                    <text x="78" y="18" fontSize="11" fill="#fbbf24">✦</text>
                    <text x="14" y="48" fontSize="9" fill="#fbbf24">✦</text>
                </>
            )}

            {/* Nose */}
            <path d="M 47 50 L 53 50 L 50 53 Z" fill="#c41e1e" />

            {/* Mouth */}
            {isHappy && (
                <path d="M 44 56 Q 50 62 56 56" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
            )}
            {isSad && (
                <path d="M 44 60 Q 50 56 56 60" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
            )}
            {state === 'idle' && (
                <>
                    <path d="M 50 53 L 50 56" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 47 56 Q 50 58 53 56" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </>
            )}

            {/* Whiskers */}
            <line x1="22" y1="48" x2="34" y2="50" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
            <line x1="22" y1="54" x2="34" y2="53" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
            <line x1="78" y1="48" x2="66" y2="50" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
            <line x1="78" y1="54" x2="66" y2="53" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />

            {/* Front paws (sitting) */}
            <ellipse cx="40" cy="86" rx="5" ry="4" fill="#3a3a3a" />
            <ellipse cx="60" cy="86" rx="5" ry="4" fill="#3a3a3a" />
        </svg>
    );
};

// Reactions Bagheera says
export const mascotMessages = {
    correct: ['Shabaash!', 'Bilkul sahi!', 'Hawww!', 'Genius!', 'Wah!', 'NEET ready!', 'Kya baat!', 'Top!'],
    wrong: ['Achha try.', 'Next one!', 'Koi baat nahi.', 'Padh le yaar.', 'Read NCERT!', 'Almost!', 'Try harder!'],
    fire: ['STREAK ON FIRE!', 'Don\'t stop!', 'Kya scene hai!', 'Bachhe, ruk mat!', 'Unstoppable!'],
    intro: ['Tap an option →', 'Pick one!', 'Let\'s go!'],
};
