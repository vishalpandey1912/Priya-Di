'use client';

import React from 'react';

type MysticState = 'idle' | 'happy' | 'sad' | 'fire';

interface Props {
    state: MysticState;
    className?: string;
}

/**
 * Mystic — the Desi Educators NEET prep cat mascot.
 * Genuinely animated: tail swishes, eyes blink, ears wiggle,
 * sparkles spin around on streaks. Not just a static drawing
 * with a bounce — the cat itself is alive.
 */
export const Mystic = ({ state, className }: Props) => {
    const isHappy = state === 'happy' || state === 'fire';
    const isSad = state === 'sad';
    const isFire = state === 'fire';

    return (
        <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Mystic the NEET cat"
        >
            <style>{`
                .mystic-tail {
                    transform-origin: 70px 76px;
                    animation: mysticTailIdle 2.5s ease-in-out infinite;
                }
                .mystic-tail-happy { animation: mysticTailHappy 0.4s ease-in-out infinite; }
                .mystic-tail-sad { animation: mysticTailSad 1s ease-out forwards; }
                .mystic-tail-fire { animation: mysticTailHappy 0.25s ease-in-out infinite; }

                .mystic-ear-l, .mystic-ear-r {
                    transform-origin: center;
                    animation: mysticEarIdle 5s ease-in-out infinite;
                }
                .mystic-ear-r { animation-delay: 0.3s; }
                .mystic-ear-sad { animation: mysticEarSad 0.5s ease-out forwards; }

                .mystic-eye-blink {
                    transform-origin: center;
                    animation: mysticBlink 4s ease-in-out infinite;
                }
                .mystic-eye-blink-2 { animation-delay: 0.05s; }

                .mystic-body-happy {
                    transform-origin: center;
                    animation: mysticBodyBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) infinite alternate;
                }

                .mystic-sparkle {
                    transform-origin: 50px 50px;
                    animation: mysticSparkle 2s linear infinite;
                }
                .mystic-sparkle-2 { animation-delay: 0.5s; animation-duration: 1.7s; }
                .mystic-sparkle-3 { animation-delay: 1s; animation-duration: 2.3s; }

                .mystic-tear {
                    animation: mysticTear 1.5s ease-in infinite;
                    transform-origin: 38px 50px;
                }

                @keyframes mysticTailIdle {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(-12deg); }
                }
                @keyframes mysticTailHappy {
                    0%, 100% { transform: rotate(-5deg); }
                    50% { transform: rotate(-25deg); }
                }
                @keyframes mysticTailSad {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(35deg); }
                }
                @keyframes mysticEarIdle {
                    0%, 92%, 100% { transform: rotate(0); }
                    94% { transform: rotate(-3deg); }
                    97% { transform: rotate(3deg); }
                }
                @keyframes mysticEarSad {
                    from { transform: rotate(0deg) translateY(0); }
                    to { transform: rotate(8deg) translateY(3px); }
                }
                @keyframes mysticBlink {
                    0%, 92%, 96%, 100% { transform: scaleY(1); }
                    94% { transform: scaleY(0.08); }
                }
                @keyframes mysticBodyBounce {
                    from { transform: translateY(0) scaleX(1); }
                    to { transform: translateY(-2px) scaleX(1.02); }
                }
                @keyframes mysticSparkle {
                    0% { transform: rotate(0deg) scale(0.8); opacity: 0.4; }
                    50% { transform: rotate(180deg) scale(1.2); opacity: 1; }
                    100% { transform: rotate(360deg) scale(0.8); opacity: 0.4; }
                }
                @keyframes mysticTear {
                    0% { transform: translateY(0) scaleY(0.4); opacity: 0; }
                    20% { transform: translateY(0) scaleY(1); opacity: 1; }
                    80% { transform: translateY(8px) scaleY(1.2); opacity: 0.8; }
                    100% { transform: translateY(15px) scaleY(0.4); opacity: 0; }
                }
            `}</style>

            {/* Drop shadow */}
            <ellipse cx="50" cy="92" rx="28" ry="3" fill="rgba(0,0,0,0.18)" />

            {/* Tail (animated, behind body) */}
            <g className={
                isFire ? 'mystic-tail mystic-tail-fire' :
                isHappy ? 'mystic-tail mystic-tail-happy' :
                isSad ? 'mystic-tail mystic-tail-sad' : 'mystic-tail'
            }>
                <path
                    d="M 70 78 Q 86 76 84 60 Q 82 52 75 56"
                    stroke="#3a3a3a"
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                />
            </g>

            {/* Body */}
            <g className={isHappy ? 'mystic-body-happy' : ''}>
                <ellipse cx="50" cy="78" rx="22" ry="14" fill="#3a3a3a" />
            </g>

            {/* Head */}
            <circle cx="50" cy="42" r="26" fill="#3a3a3a" />

            {/* Ears */}
            <g className={isSad ? 'mystic-ear-sad' : 'mystic-ear-l'} style={{ transformOrigin: '36px 22px' }}>
                <path d="M 32 26 L 28 8 L 44 22 Z" fill="#3a3a3a" />
                <path d="M 33 22 L 32 14 L 39 21 Z" fill="#c41e1e" opacity="0.7" />
            </g>
            <g className={isSad ? 'mystic-ear-sad' : 'mystic-ear-r'} style={{ transformOrigin: '64px 22px' }}>
                <path d="M 68 26 L 72 8 L 56 22 Z" fill="#3a3a3a" />
                <path d="M 67 22 L 68 14 L 61 21 Z" fill="#c41e1e" opacity="0.7" />
            </g>

            {/* Eyes — animated blinking */}
            {isHappy ? (
                <>
                    <path d="M 38 42 Q 42 36 46 42" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M 54 42 Q 58 36 62 42" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </>
            ) : isSad ? (
                <>
                    <ellipse cx="42" cy="44" rx="3.5" ry="3" fill="#fff" />
                    <ellipse cx="58" cy="44" rx="3.5" ry="3" fill="#fff" />
                    <circle cx="42" cy="45" r="1.7" fill="#1a1a1a" />
                    <circle cx="58" cy="45" r="1.7" fill="#1a1a1a" />
                    <ellipse className="mystic-tear" cx="38" cy="50" rx="1.5" ry="2.2" fill="#60a5fa" />
                    <path d="M 36 36 L 44 39" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 64 36 L 56 39" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
                </>
            ) : (
                <>
                    <g className="mystic-eye-blink" style={{ transformOrigin: '42px 42px' }}>
                        <ellipse cx="42" cy="42" rx="4" ry="5" fill="#fff" />
                        <circle cx="43" cy="43" r="2.2" fill="#1a1a1a" />
                        <circle cx="44" cy="42" r="0.8" fill="#fff" />
                    </g>
                    <g className="mystic-eye-blink mystic-eye-blink-2" style={{ transformOrigin: '58px 42px' }}>
                        <ellipse cx="58" cy="42" rx="4" ry="5" fill="#fff" />
                        <circle cx="59" cy="43" r="2.2" fill="#1a1a1a" />
                        <circle cx="60" cy="42" r="0.8" fill="#fff" />
                    </g>
                </>
            )}

            {/* Sparkles for fire/streak — orbiting around the head */}
            {isFire && (
                <g>
                    <text x="20" y="20" fontSize="14" fill="#fbbf24" className="mystic-sparkle">✦</text>
                    <text x="78" y="18" fontSize="11" fill="#fbbf24" className="mystic-sparkle mystic-sparkle-2">✦</text>
                    <text x="14" y="48" fontSize="9" fill="#fbbf24" className="mystic-sparkle mystic-sparkle-3">✦</text>
                </g>
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

            {/* Front paws */}
            <ellipse cx="40" cy="86" rx="5" ry="4" fill="#3a3a3a" />
            <ellipse cx="60" cy="86" rx="5" ry="4" fill="#3a3a3a" />
        </svg>
    );
};

export const mysticMessages = {
    correct: ['Shabaash!', 'Bilkul sahi!', 'Hawww!', 'Genius!', 'Wah!', 'NEET ready!', 'Kya baat!', 'Top!'],
    wrong: ['Achha try.', 'Next one!', 'Koi baat nahi.', 'Padh le yaar.', 'Read NCERT!', 'Almost!', 'Try harder!'],
    fire: ['STREAK ON FIRE!', 'Don\'t stop!', 'Kya scene hai!', 'Bachhe, ruk mat!', 'Unstoppable!'],
    intro: ['Tap an option →', 'Pick one!', 'Let\'s go!'],
};
