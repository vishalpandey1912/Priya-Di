'use client';

import React, { useEffect, useState } from 'react';

type MysticState = 'idle' | 'happy' | 'sad' | 'fire';
type IdlePose = 'sitting' | 'walking' | 'lying' | 'belly' | 'stretch';

interface Props {
    state: MysticState;
    className?: string;
}

const IDLE_CYCLE: IdlePose[] = ['sitting', 'sitting', 'walking', 'lying', 'belly', 'stretch', 'sitting'];

export const Mystic = ({ state, className }: Props) => {
    const [idlePose, setIdlePose] = useState<IdlePose>('sitting');
    const [idleIndex, setIdleIndex] = useState(0);

    // Cycle through idle poses every 7-12 seconds randomly when calmly idle
    useEffect(() => {
        if (state !== 'idle') return;
        const dur = 7000 + Math.random() * 5000;
        const t = setTimeout(() => {
            const next = (idleIndex + 1) % IDLE_CYCLE.length;
            setIdleIndex(next);
            setIdlePose(IDLE_CYCLE[next]);
        }, dur);
        return () => clearTimeout(t);
    }, [state, idleIndex]);

    // When state changes (happy/sad/fire), interrupt idle cycle by setting pose to sitting
    useEffect(() => {
        if (state !== 'idle') {
            setIdlePose('sitting');
        }
    }, [state]);

    const isHappy = state === 'happy' || state === 'fire';
    const isSad = state === 'sad';
    const isFire = state === 'fire';

    // Golden tabby palette
    const FUR = '#d4a574';        // base golden
    const FUR_DARK = '#8b5a2b';   // darker stripes
    const BELLY = '#f0d9b5';      // light belly cream
    const NOSE = '#c41e1e';       // brand red nose
    const EYE = '#1f6e1f';        // green cat eyes (gold tabby trait)

    // Pose-specific rendering
    const showSitting = state !== 'idle' || idlePose === 'sitting';
    const showWalking = state === 'idle' && idlePose === 'walking';
    const showLying = state === 'idle' && idlePose === 'lying';
    const showBelly = state === 'idle' && idlePose === 'belly';
    const showStretch = state === 'idle' && idlePose === 'stretch';

    return (
        <svg
            viewBox="0 0 120 100"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Mystic the NEET cat"
        >
            <style>{`
                .m-tail-idle { transform-origin: 78px 76px; animation: mTailIdle 3s ease-in-out infinite; }
                .m-tail-happy { transform-origin: 78px 76px; animation: mTailHappy 0.4s ease-in-out infinite; }
                .m-tail-fire { transform-origin: 78px 76px; animation: mTailHappy 0.25s ease-in-out infinite; }
                .m-tail-sad { transform-origin: 78px 76px; animation: mTailSad 0.8s ease-out forwards; }
                .m-tail-walk { transform-origin: 78px 76px; animation: mTailWalk 0.8s ease-in-out infinite; }
                .m-tail-belly { transform-origin: 78px 76px; animation: mTailBelly 1.5s ease-in-out infinite; }

                .m-leg-walk-l { transform-origin: 45px 88px; animation: mLegL 0.6s ease-in-out infinite; }
                .m-leg-walk-r { transform-origin: 65px 88px; animation: mLegR 0.6s ease-in-out infinite; }

                .m-eye { transform-origin: center; animation: mBlink 5s ease-in-out infinite; }
                .m-eye-2 { animation-delay: 0.06s; }

                .m-belly-paw-l { transform-origin: 38px 60px; animation: mBellyPaw 1.2s ease-in-out infinite; }
                .m-belly-paw-r { transform-origin: 70px 60px; animation: mBellyPaw 1.2s ease-in-out infinite; animation-delay: 0.3s; }

                .m-purr-z { animation: mPurr 2.5s ease-out infinite; opacity: 0; }
                .m-purr-z-2 { animation-delay: 0.8s; }
                .m-purr-z-3 { animation-delay: 1.6s; }

                .m-stretch-arch { animation: mStretch 0.7s cubic-bezier(0.4, 0, 0.6, 1) forwards; }

                .m-sparkle { transform-origin: 60px 50px; animation: mSparkle 2s linear infinite; }
                .m-sparkle-2 { animation-delay: 0.5s; animation-duration: 1.7s; }
                .m-sparkle-3 { animation-delay: 1s; animation-duration: 2.3s; }

                .m-tear { transform-origin: 48px 52px; animation: mTear 1.5s ease-in infinite; }

                .m-body-bounce { transform-origin: center; animation: mBodyBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) infinite alternate; }

                @keyframes mTailIdle {
                    0%, 100% { transform: rotate(0); }
                    50% { transform: rotate(-15deg); }
                }
                @keyframes mTailHappy {
                    0%, 100% { transform: rotate(-8deg); }
                    50% { transform: rotate(-30deg); }
                }
                @keyframes mTailSad {
                    from { transform: rotate(0); }
                    to { transform: rotate(40deg); }
                }
                @keyframes mTailWalk {
                    0%, 100% { transform: rotate(-5deg); }
                    50% { transform: rotate(8deg); }
                }
                @keyframes mTailBelly {
                    0%, 100% { transform: rotate(20deg); }
                    50% { transform: rotate(-5deg); }
                }
                @keyframes mLegL {
                    0%, 100% { transform: translateX(0) rotate(0); }
                    50% { transform: translateX(-3px) rotate(-5deg); }
                }
                @keyframes mLegR {
                    0%, 100% { transform: translateX(0) rotate(0); }
                    50% { transform: translateX(3px) rotate(5deg); }
                }
                @keyframes mBlink {
                    0%, 92%, 96%, 100% { transform: scaleY(1); }
                    94% { transform: scaleY(0.05); }
                }
                @keyframes mBellyPaw {
                    0%, 100% { transform: rotate(0); }
                    50% { transform: rotate(15deg) translateX(-2px); }
                }
                @keyframes mPurr {
                    0% { opacity: 0; transform: translateY(0) scale(0.5); }
                    20% { opacity: 1; }
                    80% { opacity: 0.7; transform: translateY(-12px) scale(1.1); }
                    100% { opacity: 0; transform: translateY(-20px) scale(1.3); }
                }
                @keyframes mStretch {
                    0% { transform: scaleX(1) scaleY(1); }
                    50% { transform: scaleX(1.3) scaleY(0.85); }
                    100% { transform: scaleX(1.15) scaleY(0.92); }
                }
                @keyframes mSparkle {
                    0% { transform: rotate(0) scale(0.7); opacity: 0.4; }
                    50% { transform: rotate(180deg) scale(1.2); opacity: 1; }
                    100% { transform: rotate(360deg) scale(0.7); opacity: 0.4; }
                }
                @keyframes mTear {
                    0% { transform: translateY(0) scaleY(0.4); opacity: 0; }
                    25% { transform: translateY(0) scaleY(1); opacity: 1; }
                    85% { transform: translateY(10px) scaleY(1.2); opacity: 0.7; }
                    100% { transform: translateY(18px) scaleY(0.3); opacity: 0; }
                }
                @keyframes mBodyBounce {
                    from { transform: translateY(0) scaleX(1); }
                    to { transform: translateY(-2px) scaleX(1.02); }
                }
            `}</style>

            {/* ─── BELLY-UP POSE (lying on back, paws in air, purring) ─── */}
            {showBelly && (
                <g>
                    <ellipse cx="60" cy="92" rx="35" ry="3" fill="rgba(0,0,0,0.18)" />
                    {/* Body lying on back — wide ellipse */}
                    <ellipse cx="60" cy="78" rx="30" ry="14" fill={FUR} />
                    {/* Belly cream */}
                    <ellipse cx="60" cy="74" rx="22" ry="9" fill={BELLY} />
                    {/* Stripes on body */}
                    <path d="M 45 70 Q 47 76 45 82" stroke={FUR_DARK} strokeWidth="1.5" fill="none" opacity="0.6" />
                    <path d="M 75 70 Q 73 76 75 82" stroke={FUR_DARK} strokeWidth="1.5" fill="none" opacity="0.6" />
                    {/* Tail flicking */}
                    <path d="M 88 78 Q 100 70 95 60" stroke={FUR} strokeWidth="6" strokeLinecap="round" fill="none" className="m-tail-belly" />
                    {/* Head tucked back / right side */}
                    <circle cx="32" cy="78" r="14" fill={FUR} />
                    {/* Stripes on head */}
                    <path d="M 22 72 Q 26 70 30 72" stroke={FUR_DARK} strokeWidth="1.2" fill="none" opacity="0.5" />
                    <path d="M 22 78 Q 26 76 30 78" stroke={FUR_DARK} strokeWidth="1.2" fill="none" opacity="0.5" />
                    {/* Closed content eyes (sleepy) */}
                    <path d="M 25 76 Q 27 74 29 76" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    <path d="M 33 76 Q 35 74 37 76" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    {/* Tiny nose */}
                    <ellipse cx="22" cy="80" rx="1.5" ry="1" fill={NOSE} />
                    {/* Smile */}
                    <path d="M 20 82 Q 22 84 24 82" stroke="#1a1a1a" strokeWidth="1" fill="none" strokeLinecap="round" />
                    {/* Front paws up in air */}
                    <g className="m-belly-paw-l">
                        <ellipse cx="50" cy="62" rx="4" ry="6" fill={FUR} />
                        <ellipse cx="48" cy="58" rx="2.5" ry="3" fill={BELLY} />
                    </g>
                    <g className="m-belly-paw-r">
                        <ellipse cx="70" cy="62" rx="4" ry="6" fill={FUR} />
                        <ellipse cx="72" cy="58" rx="2.5" ry="3" fill={BELLY} />
                    </g>
                    {/* Back legs */}
                    <ellipse cx="82" cy="78" rx="4" ry="5" fill={FUR} />
                    {/* PURRING Zs */}
                    <text x="44" y="62" fontSize="11" fill="#9ca3af" className="m-purr-z" style={{ fontFamily: 'Karla, sans-serif', fontWeight: 700 }}>z</text>
                    <text x="40" y="58" fontSize="9" fill="#9ca3af" className="m-purr-z m-purr-z-2" style={{ fontFamily: 'Karla, sans-serif', fontWeight: 700 }}>z</text>
                    <text x="36" y="54" fontSize="7" fill="#9ca3af" className="m-purr-z m-purr-z-3" style={{ fontFamily: 'Karla, sans-serif', fontWeight: 700 }}>z</text>
                </g>
            )}

            {/* ─── LYING POSE (loaf on side) ─── */}
            {showLying && (
                <g>
                    <ellipse cx="60" cy="92" rx="36" ry="3" fill="rgba(0,0,0,0.18)" />
                    {/* Body curled */}
                    <ellipse cx="60" cy="80" rx="34" ry="11" fill={FUR} />
                    {/* Belly */}
                    <ellipse cx="60" cy="84" rx="26" ry="6" fill={BELLY} />
                    {/* Stripes */}
                    <path d="M 40 75 Q 42 80 40 85" stroke={FUR_DARK} strokeWidth="1.2" fill="none" opacity="0.5" />
                    <path d="M 52 73 Q 54 80 52 87" stroke={FUR_DARK} strokeWidth="1.2" fill="none" opacity="0.5" />
                    <path d="M 64 73 Q 66 80 64 87" stroke={FUR_DARK} strokeWidth="1.2" fill="none" opacity="0.5" />
                    {/* Tail wrapped around */}
                    <path d="M 90 82 Q 100 78 96 70 Q 92 64 84 68" stroke={FUR} strokeWidth="6" strokeLinecap="round" fill="none" className="m-tail-belly" />
                    {/* Head resting */}
                    <circle cx="34" cy="74" r="13" fill={FUR} />
                    {/* Ears (small) */}
                    <path d="M 26 66 L 24 56 L 32 64 Z" fill={FUR} />
                    <path d="M 42 66 L 44 56 L 36 64 Z" fill={FUR} />
                    <path d="M 27 64 L 26 60 L 30 64 Z" fill={NOSE} opacity="0.5" />
                    <path d="M 41 64 L 42 60 L 38 64 Z" fill={NOSE} opacity="0.5" />
                    {/* Sleepy eyes */}
                    <path d="M 28 73 Q 30 72 32 73" stroke="#1a1a1a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
                    <path d="M 36 73 Q 38 72 40 73" stroke="#1a1a1a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
                    {/* Nose */}
                    <path d="M 32 77 L 36 77 L 34 79 Z" fill={NOSE} />
                    {/* Smile */}
                    <path d="M 30 82 Q 34 84 38 82" stroke="#1a1a1a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                </g>
            )}

            {/* ─── STRETCH POSE (downward dog) ─── */}
            {showStretch && (
                <g>
                    <ellipse cx="60" cy="92" rx="32" ry="3" fill="rgba(0,0,0,0.18)" />
                    <g className="m-stretch-arch" style={{ transformOrigin: '60px 70px' }}>
                        {/* Body arched */}
                        <path d="M 30 78 Q 60 50 90 78 L 90 88 L 30 88 Z" fill={FUR} />
                        {/* Stripes */}
                        <path d="M 45 70 Q 47 80 45 86" stroke={FUR_DARK} strokeWidth="1.4" fill="none" opacity="0.55" />
                        <path d="M 60 56 Q 60 70 60 86" stroke={FUR_DARK} strokeWidth="1.4" fill="none" opacity="0.55" />
                        <path d="M 75 70 Q 73 80 75 86" stroke={FUR_DARK} strokeWidth="1.4" fill="none" opacity="0.55" />
                        {/* Head down low forward */}
                        <circle cx="28" cy="74" r="11" fill={FUR} />
                        {/* Ears */}
                        <path d="M 22 68 L 20 60 L 27 66 Z" fill={FUR} />
                        <path d="M 34 68 L 36 60 L 29 66 Z" fill={FUR} />
                        {/* Eyes mid-stretch (squinted) */}
                        <path d="M 22 74 Q 24 73 26 74" stroke="#1a1a1a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                        <path d="M 30 74 Q 32 73 34 74" stroke="#1a1a1a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                        {/* Mouth open in yawn */}
                        <ellipse cx="28" cy="80" rx="2.5" ry="2" fill="#7c2d12" />
                        {/* Tail up */}
                        <path d="M 88 70 Q 96 50 92 38" stroke={FUR} strokeWidth="6" strokeLinecap="round" fill="none" />
                        {/* Paws */}
                        <ellipse cx="34" cy="88" rx="4" ry="3" fill={FUR_DARK} />
                        <ellipse cx="86" cy="88" rx="4" ry="3" fill={FUR_DARK} />
                    </g>
                </g>
            )}

            {/* ─── WALKING POSE (sideways, legs alternating) ─── */}
            {showWalking && (
                <g>
                    <ellipse cx="60" cy="92" rx="28" ry="3" fill="rgba(0,0,0,0.18)" />
                    {/* Body */}
                    <ellipse cx="55" cy="74" rx="24" ry="11" fill={FUR} />
                    {/* Belly */}
                    <ellipse cx="55" cy="78" rx="18" ry="6" fill={BELLY} />
                    {/* Stripes */}
                    <path d="M 42 66 Q 44 74 42 82" stroke={FUR_DARK} strokeWidth="1.3" fill="none" opacity="0.55" />
                    <path d="M 55 64 Q 55 74 55 84" stroke={FUR_DARK} strokeWidth="1.3" fill="none" opacity="0.55" />
                    <path d="M 68 66 Q 66 74 68 82" stroke={FUR_DARK} strokeWidth="1.3" fill="none" opacity="0.55" />
                    {/* Tail upright (happy walking cat) */}
                    <path d="M 78 74 Q 92 56 88 42 Q 86 36 90 38" stroke={FUR} strokeWidth="6" strokeLinecap="round" fill="none" className="m-tail-walk" />
                    {/* Head */}
                    <circle cx="32" cy="64" r="13" fill={FUR} />
                    {/* Ears */}
                    <path d="M 24 54 L 21 42 L 30 52 Z" fill={FUR} />
                    <path d="M 40 54 L 43 42 L 34 52 Z" fill={FUR} />
                    <path d="M 25 52 L 24 47 L 29 52 Z" fill={NOSE} opacity="0.6" />
                    <path d="M 39 52 L 40 47 L 35 52 Z" fill={NOSE} opacity="0.6" />
                    {/* Eyes (looking forward) */}
                    <ellipse cx="28" cy="64" rx="2.5" ry="3" fill="#fff" className="m-eye" />
                    <circle cx="29" cy="65" r="1.4" fill={EYE} />
                    <ellipse cx="38" cy="64" rx="2.5" ry="3" fill="#fff" className="m-eye m-eye-2" />
                    <circle cx="39" cy="65" r="1.4" fill={EYE} />
                    {/* Nose */}
                    <path d="M 31 70 L 35 70 L 33 72 Z" fill={NOSE} />
                    {/* Mouth */}
                    <path d="M 30 74 Q 33 76 36 74" stroke="#1a1a1a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
                    {/* Whiskers */}
                    <line x1="20" y1="68" x2="28" y2="70" stroke="#1a1a1a" strokeWidth="0.8" strokeLinecap="round" />
                    <line x1="44" y1="68" x2="38" y2="70" stroke="#1a1a1a" strokeWidth="0.8" strokeLinecap="round" />
                    {/* Legs walking — alternating animation */}
                    <ellipse cx="42" cy="86" rx="3" ry="5" fill={FUR} className="m-leg-walk-l" />
                    <ellipse cx="50" cy="86" rx="3" ry="5" fill={FUR} className="m-leg-walk-r" />
                    <ellipse cx="62" cy="86" rx="3" ry="5" fill={FUR} className="m-leg-walk-l" />
                    <ellipse cx="70" cy="86" rx="3" ry="5" fill={FUR} className="m-leg-walk-r" />
                </g>
            )}

            {/* ─── SITTING POSE (default, used for all reactions and idle sit) ─── */}
            {showSitting && (
                <g className={isHappy ? 'm-body-bounce' : ''}>
                    <ellipse cx="60" cy="92" rx="28" ry="3" fill="rgba(0,0,0,0.18)" />

                    {/* Tail with state-driven animation */}
                    <g className={
                        isFire ? 'm-tail-fire' :
                        isHappy ? 'm-tail-happy' :
                        isSad ? 'm-tail-sad' : 'm-tail-idle'
                    }>
                        <path d="M 80 78 Q 96 76 94 60 Q 92 52 85 56" stroke={FUR} strokeWidth="6" strokeLinecap="round" fill="none" />
                    </g>

                    {/* Body */}
                    <ellipse cx="60" cy="78" rx="22" ry="14" fill={FUR} />
                    {/* Belly cream */}
                    <ellipse cx="60" cy="82" rx="14" ry="7" fill={BELLY} />
                    {/* Body stripes */}
                    <path d="M 45 72 Q 47 78 45 84" stroke={FUR_DARK} strokeWidth="1.5" fill="none" opacity="0.55" />
                    <path d="M 60 70 Q 60 78 60 86" stroke={FUR_DARK} strokeWidth="1.5" fill="none" opacity="0.55" />
                    <path d="M 75 72 Q 73 78 75 84" stroke={FUR_DARK} strokeWidth="1.5" fill="none" opacity="0.55" />

                    {/* Head */}
                    <circle cx="60" cy="42" r="26" fill={FUR} />
                    {/* Forehead stripe (signature tabby M) */}
                    <path d="M 50 26 L 52 32 L 54 28 L 56 32 L 58 26" stroke={FUR_DARK} strokeWidth="1.6" fill="none" opacity="0.6" />
                    <path d="M 62 26 L 64 32 L 66 28 L 68 32 L 70 26" stroke={FUR_DARK} strokeWidth="1.6" fill="none" opacity="0.6" />
                    {/* Cheek stripes */}
                    <path d="M 38 46 Q 36 48 38 52" stroke={FUR_DARK} strokeWidth="1.3" fill="none" opacity="0.5" />
                    <path d="M 82 46 Q 84 48 82 52" stroke={FUR_DARK} strokeWidth="1.3" fill="none" opacity="0.5" />

                    {/* Ears */}
                    <path d="M 42 26 L 38 8 L 54 22 Z" fill={FUR} />
                    <path d="M 78 26 L 82 8 L 66 22 Z" fill={FUR} />
                    <path d="M 43 22 L 42 14 L 49 21 Z" fill={NOSE} opacity="0.6" />
                    <path d="M 77 22 L 78 14 L 71 21 Z" fill={NOSE} opacity="0.6" />

                    {/* Eyes */}
                    {isHappy ? (
                        <>
                            <path d="M 48 42 Q 52 36 56 42" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                            <path d="M 64 42 Q 68 36 72 42" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        </>
                    ) : isSad ? (
                        <>
                            <ellipse cx="52" cy="44" rx="3.5" ry="3" fill="#fff" />
                            <ellipse cx="68" cy="44" rx="3.5" ry="3" fill="#fff" />
                            <circle cx="52" cy="45" r="1.7" fill={EYE} />
                            <circle cx="68" cy="45" r="1.7" fill={EYE} />
                            <ellipse cx="48" cy="50" rx="1.5" ry="2.2" fill="#60a5fa" className="m-tear" />
                            <path d="M 46 36 L 54 39" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
                            <path d="M 74 36 L 66 39" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
                        </>
                    ) : (
                        <>
                            <g className="m-eye" style={{ transformOrigin: '52px 42px' }}>
                                <ellipse cx="52" cy="42" rx="4" ry="5" fill="#fff" />
                                <ellipse cx="53" cy="43" rx="1.5" ry="3" fill={EYE} />
                                <circle cx="54" cy="42" r="0.8" fill="#fff" />
                            </g>
                            <g className="m-eye m-eye-2" style={{ transformOrigin: '68px 42px' }}>
                                <ellipse cx="68" cy="42" rx="4" ry="5" fill="#fff" />
                                <ellipse cx="69" cy="43" rx="1.5" ry="3" fill={EYE} />
                                <circle cx="70" cy="42" r="0.8" fill="#fff" />
                            </g>
                        </>
                    )}

                    {/* Sparkles for fire */}
                    {isFire && (
                        <g>
                            <text x="30" y="20" fontSize="14" fill="#fbbf24" className="m-sparkle" style={{ fontFamily: 'sans-serif' }}>✦</text>
                            <text x="88" y="18" fontSize="11" fill="#fbbf24" className="m-sparkle m-sparkle-2" style={{ fontFamily: 'sans-serif' }}>✦</text>
                            <text x="22" y="48" fontSize="9" fill="#fbbf24" className="m-sparkle m-sparkle-3" style={{ fontFamily: 'sans-serif' }}>✦</text>
                        </g>
                    )}

                    {/* Nose */}
                    <path d="M 57 50 L 63 50 L 60 53 Z" fill={NOSE} />

                    {/* Mouth */}
                    {isHappy && (
                        <path d="M 54 56 Q 60 62 66 56" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
                    )}
                    {isSad && (
                        <path d="M 54 60 Q 60 56 66 60" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
                    )}
                    {state === 'idle' && (
                        <>
                            <path d="M 60 53 L 60 56" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M 57 56 Q 60 58 63 56" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        </>
                    )}

                    {/* Whiskers */}
                    <line x1="32" y1="48" x2="44" y2="50" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
                    <line x1="32" y1="54" x2="44" y2="53" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
                    <line x1="88" y1="48" x2="76" y2="50" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
                    <line x1="88" y1="54" x2="76" y2="53" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />

                    {/* Front paws */}
                    <ellipse cx="50" cy="86" rx="5" ry="4" fill={FUR} />
                    <ellipse cx="70" cy="86" rx="5" ry="4" fill={FUR} />
                    <ellipse cx="50" cy="87" rx="2" ry="1.2" fill={FUR_DARK} opacity="0.6" />
                    <ellipse cx="70" cy="87" rx="2" ry="1.2" fill={FUR_DARK} opacity="0.6" />
                </g>
            )}
        </svg>
    );
};

export const mysticMessages = {
    correct: ['Shabaash!', 'Bilkul sahi!', 'Hawww!', 'Genius!', 'Wah!', 'NEET ready!', 'Kya baat!', 'Top!'],
    wrong: ['Achha try.', 'Next one!', 'Koi baat nahi.', 'Padh le yaar.', 'Read NCERT!', 'Almost!', 'Try harder!'],
    fire: ['STREAK ON FIRE!', 'Don\'t stop!', 'Kya scene hai!', 'Bachhe, ruk mat!', 'Unstoppable!'],
    intro: ['Tap an option →', 'Pick one!', 'Let\'s go!'],
};
