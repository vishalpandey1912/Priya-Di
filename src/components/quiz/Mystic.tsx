'use client';

import React, { useEffect, useState, useRef } from 'react';

type MysticState = 'idle' | 'happy' | 'sad' | 'fire' | 'thinking' | 'excited' | 'celebrating' | 'cheering';
type IdlePose = 'sitting' | 'walking' | 'lying' | 'belly' | 'stretch' | 'pawWash' | 'looking';

interface Props {
    state: MysticState;
    className?: string;
    /** Question count answered so far in this session — drives idle behaviour intensity */
    progress?: number;
}

const IDLE_CYCLE: IdlePose[] = ['sitting', 'looking', 'pawWash', 'sitting', 'walking', 'lying', 'belly', 'sitting', 'stretch', 'sitting'];

export const Mystic = ({ state, className, progress = 0 }: Props) => {
    const [idlePose, setIdlePose] = useState<IdlePose>('sitting');
    const [idleIndex, setIdleIndex] = useState(0);
    const [randomBlink, setRandomBlink] = useState(0);
    const blinkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Cycle idle poses every 6-11s — random feel
    useEffect(() => {
        if (state !== 'idle') return;
        const dur = 6000 + Math.random() * 5000;
        const t = setTimeout(() => {
            const next = (idleIndex + 1) % IDLE_CYCLE.length;
            setIdleIndex(next);
            setIdlePose(IDLE_CYCLE[next]);
        }, dur);
        return () => clearTimeout(t);
    }, [state, idleIndex]);

    // Random extra blink intervals (more "alive" feel)
    useEffect(() => {
        if (state !== 'idle') return;
        const tick = () => {
            setRandomBlink(x => x + 1);
            blinkTimer.current = setTimeout(tick, 2000 + Math.random() * 4000);
        };
        blinkTimer.current = setTimeout(tick, 3000);
        return () => { if (blinkTimer.current) clearTimeout(blinkTimer.current); };
    }, [state]);

    // Reset to sitting when state is non-idle
    useEffect(() => {
        if (state !== 'idle') setIdlePose('sitting');
    }, [state]);

    const isHappy = state === 'happy' || state === 'fire' || state === 'excited' || state === 'celebrating' || state === 'cheering';
    const isSad = state === 'sad';
    const isFire = state === 'fire';
    const isExcited = state === 'excited' || state === 'celebrating' || state === 'cheering';
    const isThinking = state === 'thinking';

    const FUR = '#d4a574';
    const FUR_DARK = '#8b5a2b';
    const FUR_LIGHT = '#e8c197';
    const BELLY = '#f5e0c0';
    const NOSE = '#c41e1e';
    const EYE_GREEN = '#1f6e1f';
    const PUPIL = '#0a0a0a';

    const showSitting = state !== 'idle' || idlePose === 'sitting';
    const showWalking = state === 'idle' && idlePose === 'walking';
    const showLying = state === 'idle' && idlePose === 'lying';
    const showBelly = state === 'idle' && idlePose === 'belly';
    const showStretch = state === 'idle' && idlePose === 'stretch';
    const showPawWash = state === 'idle' && idlePose === 'pawWash';
    const showLooking = state === 'idle' && idlePose === 'looking';

    return (
        <svg viewBox="0 0 140 110" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Mystic the NEET cat">
            <style>{`
                /* —————— Tail behaviours —————— */
                .m-tail-idle { transform-origin: 90px 76px; animation: mTailIdle 3s ease-in-out infinite; }
                .m-tail-happy { transform-origin: 90px 76px; animation: mTailHappy 0.4s ease-in-out infinite; }
                .m-tail-fire { transform-origin: 90px 76px; animation: mTailHappy 0.22s ease-in-out infinite; }
                .m-tail-excited { transform-origin: 90px 76px; animation: mTailHappy 0.28s ease-in-out infinite; }
                .m-tail-sad { transform-origin: 90px 76px; animation: mTailSad 0.8s ease-out forwards; }
                .m-tail-think { transform-origin: 90px 76px; animation: mTailThink 1.4s ease-in-out infinite; }
                .m-tail-walk { transform-origin: 90px 76px; animation: mTailWalk 0.9s ease-in-out infinite; }
                .m-tail-belly { transform-origin: 90px 76px; animation: mTailBelly 1.5s ease-in-out infinite; }

                /* —————— Body —————— */
                .m-body-bounce { transform-origin: 70px 80px; animation: mBodyBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) infinite alternate; }
                .m-body-celebrate { transform-origin: 70px 80px; animation: mBodyCelebrate 0.6s ease-in-out infinite; }

                /* —————— Eyes / blink —————— */
                .m-eye-blink { transform-origin: center; animation: mBlink 5s ease-in-out infinite; }
                .m-eye-blink-2 { animation-delay: 0.06s; }
                .m-pupil-shifty { animation: mPupilShift 4s ease-in-out infinite; }
                .m-pupil-shifty-2 { animation-delay: 0.1s; }

                /* —————— Ears —————— */
                .m-ear-l { transform-origin: 50px 16px; animation: mEarTwitch 6s ease-in-out infinite; }
                .m-ear-r { transform-origin: 88px 16px; animation: mEarTwitch 7s ease-in-out infinite; animation-delay: 0.4s; }
                .m-ear-perk { transform-origin: 50px 16px; animation: mEarPerk 0.4s ease-out forwards; }
                .m-ear-perk-r { transform-origin: 88px 16px; }

                /* —————— Whiskers —————— */
                .m-whisk-l { transform-origin: 38px 50px; animation: mWhiskerTwitch 8s ease-in-out infinite; }
                .m-whisk-r { transform-origin: 100px 50px; animation: mWhiskerTwitch 8s ease-in-out infinite; animation-delay: 0.5s; }

                /* —————— Paws —————— */
                .m-pawwash { transform-origin: 50px 88px; animation: mPawWash 1.5s ease-in-out infinite; }
                .m-belly-paw-l { transform-origin: 48px 60px; animation: mBellyPaw 1.2s ease-in-out infinite; }
                .m-belly-paw-r { transform-origin: 80px 60px; animation: mBellyPaw 1.2s ease-in-out infinite; animation-delay: 0.3s; }

                /* —————— Walk legs —————— */
                .m-leg-walk-1 { transform-origin: center bottom; animation: mLegSwing1 0.7s ease-in-out infinite; }
                .m-leg-walk-2 { transform-origin: center bottom; animation: mLegSwing2 0.7s ease-in-out infinite; }
                .m-leg-walk-3 { transform-origin: center bottom; animation: mLegSwing2 0.7s ease-in-out infinite; }
                .m-leg-walk-4 { transform-origin: center bottom; animation: mLegSwing1 0.7s ease-in-out infinite; }

                /* —————— Sparkles & FX —————— */
                .m-sparkle-1 { transform-origin: 70px 50px; animation: mSparkleSpin 1.6s linear infinite; }
                .m-sparkle-2 { transform-origin: 70px 50px; animation: mSparkleSpin 2.1s linear infinite reverse; animation-delay: 0.3s; }
                .m-sparkle-3 { transform-origin: 70px 50px; animation: mSparkleSpin 1.9s linear infinite; animation-delay: 0.7s; }

                /* —————— Sleep / purr / breathing —————— */
                .m-purr-z-1 { animation: mPurr 2.5s ease-out infinite; opacity: 0; }
                .m-purr-z-2 { animation: mPurr 2.5s ease-out infinite; animation-delay: 0.8s; opacity: 0; }
                .m-purr-z-3 { animation: mPurr 2.5s ease-out infinite; animation-delay: 1.6s; opacity: 0; }
                .m-breath { transform-origin: 70px 80px; animation: mBreathe 3.5s ease-in-out infinite; }
                .m-tear { transform-origin: 58px 52px; animation: mTear 1.5s ease-in infinite; }
                .m-thought { animation: mThought 2s ease-in-out infinite; }

                /* —————— Stretch —————— */
                .m-stretch { animation: mStretch 0.7s cubic-bezier(0.4, 0, 0.6, 1) forwards; }

                /* —————— Look around —————— */
                .m-look-pupil { animation: mLookAround 4s ease-in-out infinite; }

                /* —————— Heart —————— */
                .m-heart { animation: mHeart 1.2s ease-out infinite; transform-origin: center; }

                @keyframes mTailIdle { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-15deg); } }
                @keyframes mTailHappy { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(-30deg); } }
                @keyframes mTailSad { from { transform: rotate(0); } to { transform: rotate(40deg); } }
                @keyframes mTailThink { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(-18deg); } }
                @keyframes mTailWalk { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(15deg); } }
                @keyframes mTailBelly { 0%, 100% { transform: rotate(20deg); } 50% { transform: rotate(-5deg); } }
                @keyframes mBodyBounce { from { transform: translateY(0) scaleX(1); } to { transform: translateY(-2px) scaleX(1.02); } }
                @keyframes mBodyCelebrate { 0%, 100% { transform: translateY(0); } 25% { transform: translateY(-6px) rotate(-3deg); } 75% { transform: translateY(-3px) rotate(3deg); } }
                @keyframes mBlink { 0%, 91%, 95%, 100% { transform: scaleY(1); } 93% { transform: scaleY(0.05); } }
                @keyframes mPupilShift { 0%, 40% { transform: translateX(0); } 45%, 55% { transform: translateX(-1.5px); } 60%, 95% { transform: translateX(0); } 96%, 100% { transform: translateX(0); } }
                @keyframes mEarTwitch { 0%, 90%, 100% { transform: rotate(0); } 92% { transform: rotate(-4deg); } 96% { transform: rotate(4deg); } }
                @keyframes mEarPerk { from { transform: rotate(0); } to { transform: rotate(-6deg) translateY(-2px); } }
                @keyframes mWhiskerTwitch { 0%, 88%, 100% { transform: rotate(0); } 92% { transform: rotate(2deg); } 96% { transform: rotate(-2deg); } }
                @keyframes mPawWash { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 25% { transform: translate(2px, -22px) rotate(-15deg); } 50% { transform: translate(0, -28px) rotate(0deg); } 75% { transform: translate(-2px, -22px) rotate(15deg); } }
                @keyframes mBellyPaw { 0%, 100% { transform: rotate(0) scale(1); } 50% { transform: rotate(15deg) translateX(-2px) scale(1.05); } }
                @keyframes mLegSwing1 { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-3px) rotate(-12deg); } }
                @keyframes mLegSwing2 { 0%, 100% { transform: translateY(-3px) rotate(-12deg); } 50% { transform: translateY(0) rotate(0); } }
                @keyframes mSparkleSpin { 0% { transform: rotate(0) scale(0.7); opacity: 0.4; } 50% { transform: rotate(180deg) scale(1.2); opacity: 1; } 100% { transform: rotate(360deg) scale(0.7); opacity: 0.4; } }
                @keyframes mPurr { 0% { opacity: 0; transform: translate(0, 0) scale(0.5); } 25% { opacity: 1; } 80% { opacity: 0.7; transform: translate(8px, -14px) scale(1.1); } 100% { opacity: 0; transform: translate(15px, -22px) scale(1.3); } }
                @keyframes mBreathe { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.025); } }
                @keyframes mTear { 0% { transform: translateY(0) scaleY(0.4); opacity: 0; } 25% { transform: translateY(0) scaleY(1); opacity: 1; } 85% { transform: translateY(10px) scaleY(1.2); opacity: 0.7; } 100% { transform: translateY(18px) scaleY(0.3); opacity: 0; } }
                @keyframes mThought { 0%, 100% { opacity: 0.6; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-2px); } }
                @keyframes mStretch { 0% { transform: scaleX(1) scaleY(1); } 50% { transform: scaleX(1.3) scaleY(0.85); } 100% { transform: scaleX(1.15) scaleY(0.92); } }
                @keyframes mLookAround { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-2px); } 75% { transform: translateX(2px); } }
                @keyframes mHeart { 0% { transform: translateY(0) scale(0.4); opacity: 0; } 20% { transform: translateY(-5px) scale(1); opacity: 1; } 100% { transform: translateY(-25px) scale(0.6); opacity: 0; } }
            `}</style>

            {/* ════════════ BELLY-UP (lying on back, paws in air, purring) ════════════ */}
            {showBelly && (
                <g>
                    <ellipse cx="70" cy="98" rx="40" ry="3" fill="rgba(0,0,0,0.18)" />
                    <g className="m-breath">
                        <ellipse cx="70" cy="80" rx="36" ry="13" fill={FUR} />
                        <ellipse cx="70" cy="78" rx="26" ry="9" fill={BELLY} />
                        <path d="M 50 72 Q 52 80 50 88" stroke={FUR_DARK} strokeWidth="1.5" fill="none" opacity="0.55" />
                        <path d="M 70 70 Q 70 80 70 90" stroke={FUR_DARK} strokeWidth="1.5" fill="none" opacity="0.55" />
                        <path d="M 90 72 Q 88 80 90 88" stroke={FUR_DARK} strokeWidth="1.5" fill="none" opacity="0.55" />
                    </g>
                    <path d="M 102 80 Q 118 70 112 58" stroke={FUR} strokeWidth="6" strokeLinecap="round" fill="none" className="m-tail-belly" />
                    {/* Head off to side */}
                    <circle cx="38" cy="80" r="13" fill={FUR} />
                    <path d="M 28 76 Q 32 75 36 76" stroke={FUR_DARK} strokeWidth="1.2" fill="none" opacity="0.5" />
                    {/* Closed sleepy eyes */}
                    <path d="M 31 78 Q 33 76 35 78" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    <path d="M 39 78 Q 41 76 43 78" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    <ellipse cx="28" cy="82" rx="1.5" ry="1" fill={NOSE} />
                    <path d="M 26 84 Q 28 86 30 84" stroke="#1a1a1a" strokeWidth="1" fill="none" strokeLinecap="round" />
                    {/* Paws up */}
                    <g className="m-belly-paw-l">
                        <ellipse cx="56" cy="62" rx="4.5" ry="6.5" fill={FUR} />
                        <ellipse cx="54" cy="58" rx="2.5" ry="3" fill={BELLY} />
                    </g>
                    <g className="m-belly-paw-r">
                        <ellipse cx="84" cy="62" rx="4.5" ry="6.5" fill={FUR} />
                        <ellipse cx="86" cy="58" rx="2.5" ry="3" fill={BELLY} />
                    </g>
                    {/* Back legs splayed */}
                    <ellipse cx="100" cy="78" rx="5" ry="6" fill={FUR} />
                    {/* Purr */}
                    <text x="50" y="62" fontSize="11" fill="#9ca3af" className="m-purr-z-1" style={{ fontFamily: 'Karla, sans-serif', fontWeight: 700 }}>z</text>
                    <text x="46" y="56" fontSize="9" fill="#9ca3af" className="m-purr-z-2" style={{ fontFamily: 'Karla, sans-serif', fontWeight: 700 }}>z</text>
                    <text x="42" y="50" fontSize="7" fill="#9ca3af" className="m-purr-z-3" style={{ fontFamily: 'Karla, sans-serif', fontWeight: 700 }}>z</text>
                </g>
            )}

            {/* ════════════ LYING (loaf on side) ════════════ */}
            {showLying && (
                <g>
                    <ellipse cx="70" cy="98" rx="42" ry="3" fill="rgba(0,0,0,0.18)" />
                    <g className="m-breath">
                        <ellipse cx="70" cy="84" rx="40" ry="11" fill={FUR} />
                        <ellipse cx="70" cy="88" rx="30" ry="6" fill={BELLY} />
                    </g>
                    <path d="M 48 79 Q 50 84 48 89" stroke={FUR_DARK} strokeWidth="1.2" fill="none" opacity="0.5" />
                    <path d="M 60 77 Q 62 84 60 91" stroke={FUR_DARK} strokeWidth="1.2" fill="none" opacity="0.5" />
                    <path d="M 76 77 Q 78 84 76 91" stroke={FUR_DARK} strokeWidth="1.2" fill="none" opacity="0.5" />
                    <path d="M 106 86 Q 118 80 113 72 Q 109 66 100 70" stroke={FUR} strokeWidth="6" strokeLinecap="round" fill="none" />
                    {/* Head resting */}
                    <circle cx="38" cy="78" r="12" fill={FUR} />
                    <path d="M 30 70 L 28 60 L 35 68 Z" fill={FUR} />
                    <path d="M 46 70 L 48 60 L 41 68 Z" fill={FUR} />
                    <path d="M 31 68 L 30 64 L 33 68 Z" fill={NOSE} opacity="0.5" />
                    <path d="M 45 68 L 46 64 L 43 68 Z" fill={NOSE} opacity="0.5" />
                    {/* Closed eyes */}
                    <path d="M 32 77 Q 34 76 36 77" stroke="#1a1a1a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
                    <path d="M 40 77 Q 42 76 44 77" stroke="#1a1a1a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
                    <path d="M 36 81 L 40 81 L 38 83 Z" fill={NOSE} />
                    <path d="M 34 86 Q 38 88 42 86" stroke="#1a1a1a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                </g>
            )}

            {/* ════════════ STRETCH (downward dog) ════════════ */}
            {showStretch && (
                <g>
                    <ellipse cx="70" cy="98" rx="36" ry="3" fill="rgba(0,0,0,0.18)" />
                    <g className="m-stretch" style={{ transformOrigin: '70px 70px' }}>
                        <path d="M 36 82 Q 70 50 104 82 L 104 92 L 36 92 Z" fill={FUR} />
                        <path d="M 52 70 Q 54 84 52 90" stroke={FUR_DARK} strokeWidth="1.4" fill="none" opacity="0.55" />
                        <path d="M 70 56 Q 70 75 70 90" stroke={FUR_DARK} strokeWidth="1.4" fill="none" opacity="0.55" />
                        <path d="M 88 70 Q 86 84 88 90" stroke={FUR_DARK} strokeWidth="1.4" fill="none" opacity="0.55" />
                        <circle cx="32" cy="78" r="11" fill={FUR} />
                        <path d="M 26 72 L 22 64 L 30 70 Z" fill={FUR} />
                        <path d="M 38 72 L 42 64 L 34 70 Z" fill={FUR} />
                        <path d="M 26 78 Q 28 77 30 78" stroke="#1a1a1a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                        <path d="M 34 78 Q 36 77 38 78" stroke="#1a1a1a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                        <ellipse cx="32" cy="84" rx="3" ry="2.5" fill="#7c2d12" />
                        <path d="M 102 74 Q 110 54 106 42" stroke={FUR} strokeWidth="6" strokeLinecap="round" fill="none" />
                        <ellipse cx="38" cy="92" rx="4" ry="3" fill={FUR_DARK} />
                        <ellipse cx="100" cy="92" rx="4" ry="3" fill={FUR_DARK} />
                    </g>
                </g>
            )}

            {/* ════════════ WALKING (sideways, legs alternating) ════════════ */}
            {showWalking && (
                <g>
                    <ellipse cx="70" cy="98" rx="32" ry="3" fill="rgba(0,0,0,0.18)" />
                    <ellipse cx="64" cy="78" rx="28" ry="11" fill={FUR} />
                    <ellipse cx="64" cy="82" rx="22" ry="6" fill={BELLY} />
                    <path d="M 50 70 Q 52 78 50 86" stroke={FUR_DARK} strokeWidth="1.3" fill="none" opacity="0.55" />
                    <path d="M 64 68 Q 64 78 64 88" stroke={FUR_DARK} strokeWidth="1.3" fill="none" opacity="0.55" />
                    <path d="M 78 70 Q 76 78 78 86" stroke={FUR_DARK} strokeWidth="1.3" fill="none" opacity="0.55" />
                    <path d="M 90 78 Q 108 60 102 44 Q 100 38 106 38" stroke={FUR} strokeWidth="6" strokeLinecap="round" fill="none" className="m-tail-walk" />
                    <circle cx="36" cy="68" r="14" fill={FUR} />
                    <path d="M 26 56 L 22 42 L 32 54 Z" fill={FUR} />
                    <path d="M 46 56 L 50 42 L 40 54 Z" fill={FUR} />
                    <path d="M 27 53 L 26 47 L 31 53 Z" fill={NOSE} opacity="0.6" />
                    <path d="M 45 53 L 46 47 L 41 53 Z" fill={NOSE} opacity="0.6" />
                    <ellipse cx="32" cy="68" rx="3" ry="3.5" fill="#fff" />
                    <ellipse cx="33" cy="69" rx="1.5" ry="2.5" fill={EYE_GREEN} />
                    <circle cx="34" cy="68" r="0.8" fill="#fff" />
                    <ellipse cx="42" cy="68" rx="3" ry="3.5" fill="#fff" />
                    <ellipse cx="43" cy="69" rx="1.5" ry="2.5" fill={EYE_GREEN} />
                    <circle cx="44" cy="68" r="0.8" fill="#fff" />
                    <path d="M 35 74 L 39 74 L 37 76 Z" fill={NOSE} />
                    <path d="M 34 78 Q 37 80 40 78" stroke="#1a1a1a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
                    <line x1="22" y1="72" x2="32" y2="74" stroke="#1a1a1a" strokeWidth="0.8" strokeLinecap="round" />
                    <line x1="48" y1="72" x2="42" y2="74" stroke="#1a1a1a" strokeWidth="0.8" strokeLinecap="round" />
                    <ellipse cx="50" cy="90" rx="3" ry="5" fill={FUR} className="m-leg-walk-1" />
                    <ellipse cx="58" cy="90" rx="3" ry="5" fill={FUR} className="m-leg-walk-2" />
                    <ellipse cx="70" cy="90" rx="3" ry="5" fill={FUR} className="m-leg-walk-3" />
                    <ellipse cx="78" cy="90" rx="3" ry="5" fill={FUR} className="m-leg-walk-4" />
                </g>
            )}

            {/* ════════════ PAW WASH ════════════ */}
            {showPawWash && (
                <g>
                    <ellipse cx="70" cy="98" rx="28" ry="3" fill="rgba(0,0,0,0.18)" />
                    <ellipse cx="70" cy="80" rx="22" ry="14" fill={FUR} />
                    <ellipse cx="70" cy="84" rx="14" ry="7" fill={BELLY} />
                    <path d="M 100 80 Q 116 78 114 62 Q 112 54 105 58" stroke={FUR} strokeWidth="6" strokeLinecap="round" fill="none" className="m-tail-idle" />
                    <circle cx="70" cy="44" r="26" fill={FUR} />
                    <path d="M 60 28 L 58 34 L 60 30 L 62 34 L 64 28" stroke={FUR_DARK} strokeWidth="1.6" fill="none" opacity="0.6" />
                    <path d="M 76 28 L 78 34 L 80 30 L 82 34 L 84 28" stroke={FUR_DARK} strokeWidth="1.6" fill="none" opacity="0.6" />
                    <path d="M 52 28 L 48 10 L 64 24 Z" fill={FUR} />
                    <path d="M 88 28 L 92 10 L 76 24 Z" fill={FUR} />
                    <path d="M 53 24 L 52 16 L 59 23 Z" fill={NOSE} opacity="0.6" />
                    <path d="M 87 24 L 88 16 L 81 23 Z" fill={NOSE} opacity="0.6" />
                    {/* Eyes (closed contentedly while washing) */}
                    <path d="M 58 44 Q 62 41 66 44" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M 74 44 Q 78 41 82 44" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M 67 52 L 73 52 L 70 55 Z" fill={NOSE} />
                    <path d="M 64 58 Q 70 60 76 58" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    <line x1="42" y1="50" x2="54" y2="52" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
                    <line x1="42" y1="56" x2="54" y2="55" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
                    <line x1="98" y1="50" x2="86" y2="52" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
                    <line x1="98" y1="56" x2="86" y2="55" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
                    {/* Front paw being washed (raised, animated) */}
                    <ellipse cx="50" cy="88" rx="5" ry="4" fill={FUR} className="m-pawwash" />
                    <ellipse cx="80" cy="88" rx="5" ry="4" fill={FUR} />
                </g>
            )}

            {/* ════════════ LOOKING AROUND ════════════ */}
            {showLooking && (
                <g>
                    <ellipse cx="70" cy="98" rx="28" ry="3" fill="rgba(0,0,0,0.18)" />
                    <g className="m-breath">
                        <ellipse cx="70" cy="80" rx="22" ry="14" fill={FUR} />
                        <ellipse cx="70" cy="84" rx="14" ry="7" fill={BELLY} />
                    </g>
                    <path d="M 100 80 Q 116 78 114 62 Q 112 54 105 58" stroke={FUR} strokeWidth="6" strokeLinecap="round" fill="none" className="m-tail-idle" />
                    <circle cx="70" cy="44" r="26" fill={FUR} />
                    <path d="M 60 28 L 58 34 L 60 30 L 62 34 L 64 28" stroke={FUR_DARK} strokeWidth="1.6" fill="none" opacity="0.6" />
                    <path d="M 76 28 L 78 34 L 80 30 L 82 34 L 84 28" stroke={FUR_DARK} strokeWidth="1.6" fill="none" opacity="0.6" />
                    <path d="M 52 28 L 48 10 L 64 24 Z" fill={FUR} />
                    <path d="M 88 28 L 92 10 L 76 24 Z" fill={FUR} />
                    <path d="M 53 24 L 52 16 L 59 23 Z" fill={NOSE} opacity="0.6" />
                    <path d="M 87 24 L 88 16 L 81 23 Z" fill={NOSE} opacity="0.6" />
                    {/* Eyes look around (pupils animate) */}
                    <ellipse cx="62" cy="44" rx="4" ry="5" fill="#fff" />
                    <g className="m-look-pupil">
                        <ellipse cx="62" cy="45" rx="1.6" ry="3" fill={EYE_GREEN} />
                        <circle cx="62.5" cy="44" r="0.7" fill="#fff" />
                    </g>
                    <ellipse cx="78" cy="44" rx="4" ry="5" fill="#fff" />
                    <g className="m-look-pupil">
                        <ellipse cx="78" cy="45" rx="1.6" ry="3" fill={EYE_GREEN} />
                        <circle cx="78.5" cy="44" r="0.7" fill="#fff" />
                    </g>
                    <path d="M 67 52 L 73 52 L 70 55 Z" fill={NOSE} />
                    <path d="M 70 55 L 70 58" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 67 58 Q 70 60 73 58" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    <g className="m-whisk-l">
                        <line x1="42" y1="50" x2="54" y2="52" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
                        <line x1="42" y1="56" x2="54" y2="55" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
                    </g>
                    <g className="m-whisk-r">
                        <line x1="98" y1="50" x2="86" y2="52" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
                        <line x1="98" y1="56" x2="86" y2="55" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
                    </g>
                    <ellipse cx="60" cy="88" rx="5" ry="4" fill={FUR} />
                    <ellipse cx="80" cy="88" rx="5" ry="4" fill={FUR} />
                </g>
            )}

            {/* ════════════ SITTING (reactions + default idle) ════════════ */}
            {showSitting && (
                <g className={isExcited ? 'm-body-celebrate' : isHappy ? 'm-body-bounce' : ''}>
                    <ellipse cx="70" cy="98" rx="30" ry="3" fill="rgba(0,0,0,0.18)" />

                    {/* Tail */}
                    <g className={
                        isFire ? 'm-tail-fire' :
                        isExcited ? 'm-tail-excited' :
                        isHappy ? 'm-tail-happy' :
                        isSad ? 'm-tail-sad' :
                        isThinking ? 'm-tail-think' :
                        'm-tail-idle'
                    }>
                        <path d="M 92 80 Q 110 78 108 62 Q 106 52 98 58" stroke={FUR} strokeWidth="6" strokeLinecap="round" fill="none" />
                    </g>

                    <g className="m-breath">
                        <ellipse cx="70" cy="80" rx="22" ry="14" fill={FUR} />
                        <ellipse cx="70" cy="84" rx="14" ry="7" fill={BELLY} />
                    </g>
                    <path d="M 55 74 Q 57 80 55 86" stroke={FUR_DARK} strokeWidth="1.5" fill="none" opacity="0.55" />
                    <path d="M 70 72 Q 70 80 70 88" stroke={FUR_DARK} strokeWidth="1.5" fill="none" opacity="0.55" />
                    <path d="M 85 74 Q 83 80 85 86" stroke={FUR_DARK} strokeWidth="1.5" fill="none" opacity="0.55" />

                    {/* Head */}
                    <circle cx="70" cy="44" r="26" fill={FUR} />
                    <path d="M 60 28 L 58 34 L 60 30 L 62 34 L 64 28" stroke={FUR_DARK} strokeWidth="1.6" fill="none" opacity="0.6" />
                    <path d="M 76 28 L 78 34 L 80 30 L 82 34 L 84 28" stroke={FUR_DARK} strokeWidth="1.6" fill="none" opacity="0.6" />
                    <path d="M 48 48 Q 46 50 48 54" stroke={FUR_DARK} strokeWidth="1.3" fill="none" opacity="0.5" />
                    <path d="M 92 48 Q 94 50 92 54" stroke={FUR_DARK} strokeWidth="1.3" fill="none" opacity="0.5" />

                    {/* Ears */}
                    <g className={isHappy ? 'm-ear-perk' : 'm-ear-l'}>
                        <path d="M 52 28 L 48 10 L 64 24 Z" fill={FUR} />
                        <path d="M 53 24 L 52 16 L 59 23 Z" fill={NOSE} opacity="0.6" />
                    </g>
                    <g className={isHappy ? 'm-ear-perk-r' : 'm-ear-r'}>
                        <path d="M 88 28 L 92 10 L 76 24 Z" fill={FUR} />
                        <path d="M 87 24 L 88 16 L 81 23 Z" fill={NOSE} opacity="0.6" />
                    </g>

                    {/* Eyes */}
                    {isHappy ? (
                        <>
                            <path d="M 56 44 Q 62 38 68 44" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                            <path d="M 72 44 Q 78 38 84 44" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                            {isExcited && (
                                <>
                                    <text x="48" y="52" fontSize="12" fill="#c41e1e" className="m-heart">♥</text>
                                    <text x="84" y="52" fontSize="12" fill="#c41e1e" className="m-heart" style={{ animationDelay: '0.2s' }}>♥</text>
                                </>
                            )}
                        </>
                    ) : isSad ? (
                        <>
                            <ellipse cx="62" cy="46" rx="3.5" ry="3" fill="#fff" />
                            <ellipse cx="78" cy="46" rx="3.5" ry="3" fill="#fff" />
                            <circle cx="62" cy="47" r="1.7" fill={EYE_GREEN} />
                            <circle cx="78" cy="47" r="1.7" fill={EYE_GREEN} />
                            <ellipse cx="58" cy="52" rx="1.5" ry="2.2" fill="#60a5fa" className="m-tear" />
                            <path d="M 56 38 L 64 41" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
                            <path d="M 84 38 L 76 41" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
                        </>
                    ) : isThinking ? (
                        <>
                            <ellipse cx="62" cy="44" rx="4" ry="5" fill="#fff" />
                            <ellipse cx="62" cy="46" rx="1.5" ry="3" fill={EYE_GREEN} className="m-pupil-shifty" />
                            <circle cx="63" cy="45" r="0.8" fill="#fff" />
                            <ellipse cx="78" cy="44" rx="4" ry="5" fill="#fff" />
                            <ellipse cx="78" cy="46" rx="1.5" ry="3" fill={EYE_GREEN} className="m-pupil-shifty m-pupil-shifty-2" />
                            <circle cx="79" cy="45" r="0.8" fill="#fff" />
                            <text x="100" y="32" fontSize="14" fill="#9ca3af" className="m-thought" style={{ fontFamily: 'sans-serif' }}>?</text>
                        </>
                    ) : (
                        <>
                            <g className="m-eye-blink" style={{ transformOrigin: '62px 44px' }}>
                                <ellipse cx="62" cy="44" rx="4" ry="5" fill="#fff" />
                                <ellipse cx="62.5" cy="45" rx="1.5" ry="3" fill={EYE_GREEN} />
                                <circle cx="63.5" cy="44" r="0.8" fill="#fff" />
                            </g>
                            <g className="m-eye-blink m-eye-blink-2" style={{ transformOrigin: '78px 44px' }}>
                                <ellipse cx="78" cy="44" rx="4" ry="5" fill="#fff" />
                                <ellipse cx="78.5" cy="45" rx="1.5" ry="3" fill={EYE_GREEN} />
                                <circle cx="79.5" cy="44" r="0.8" fill="#fff" />
                            </g>
                        </>
                    )}

                    {/* Sparkles for fire */}
                    {isFire && (
                        <g>
                            <text x="38" y="22" fontSize="14" fill="#fbbf24" className="m-sparkle-1">✦</text>
                            <text x="98" y="20" fontSize="11" fill="#fbbf24" className="m-sparkle-2">✦</text>
                            <text x="32" y="50" fontSize="9" fill="#fbbf24" className="m-sparkle-3">✦</text>
                        </g>
                    )}

                    {/* Excited stars */}
                    {state === 'celebrating' && (
                        <g>
                            <text x="44" y="20" fontSize="12" fill="#fbbf24" className="m-sparkle-1">★</text>
                            <text x="92" y="22" fontSize="14" fill="#fbbf24" className="m-sparkle-2">★</text>
                            <text x="100" y="44" fontSize="10" fill="#fbbf24" className="m-sparkle-3">★</text>
                            <text x="36" y="40" fontSize="10" fill="#fbbf24" className="m-sparkle-1">✦</text>
                        </g>
                    )}

                    {/* Nose */}
                    <path d="M 67 52 L 73 52 L 70 55 Z" fill={NOSE} />

                    {/* Mouth */}
                    {isExcited ? (
                        <ellipse cx="70" cy="60" rx="5" ry="4" fill="#7c2d12" />
                    ) : isHappy ? (
                        <path d="M 64 58 Q 70 64 76 58" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
                    ) : isSad ? (
                        <path d="M 64 62 Q 70 58 76 62" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
                    ) : (
                        <>
                            <path d="M 70 55 L 70 58" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M 67 58 Q 70 60 73 58" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                        </>
                    )}

                    {/* Whiskers (animated) */}
                    <g className="m-whisk-l">
                        <line x1="42" y1="50" x2="54" y2="52" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
                        <line x1="42" y1="56" x2="54" y2="55" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
                    </g>
                    <g className="m-whisk-r">
                        <line x1="98" y1="50" x2="86" y2="52" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
                        <line x1="98" y1="56" x2="86" y2="55" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
                    </g>

                    <ellipse cx="60" cy="88" rx="5" ry="4" fill={FUR} />
                    <ellipse cx="80" cy="88" rx="5" ry="4" fill={FUR} />
                    <ellipse cx="60" cy="89" rx="2" ry="1.2" fill={FUR_DARK} opacity="0.6" />
                    <ellipse cx="80" cy="89" rx="2" ry="1.2" fill={FUR_DARK} opacity="0.6" />
                </g>
            )}
        </svg>
    );
};

// Smarter messages — context-aware
export const mysticMessages = {
    correct: ['Shabaash!', 'Bilkul sahi!', 'Hawww!', 'Genius!', 'Wah!', 'NEET ready!', 'Kya baat!', 'Top!', 'Sahi pakdaa!', 'Fadu!'],
    wrong: ['Achha try.', 'Next one!', 'Koi baat nahi.', 'Padh le yaar.', 'Read NCERT!', 'Almost!', 'Try harder!', 'Don\'t worry!'],
    fire: ['STREAK ON FIRE!', 'Don\'t stop!', 'Kya scene hai!', 'Bachhe, ruk mat!', 'Unstoppable!', 'On a roll!'],
    excited: ['You got this!', 'Keep going!', 'Beast mode!', 'NEET ready!', 'Aur lao!'],
    celebrating: ['Mast hai!', 'Outstanding!', 'Top of the game!', 'Future Doc!'],
    cheering: ['You\'re crushing it!', 'Stellar!', 'Topper material!'],
    thinking: ['Hmm…', 'Take your time.', 'Read carefully.', 'Soch ke jawaab de.'],
    intro: ['Tap an option →', 'Pick one!', 'Let\'s go!', 'Aaja shuru karein!'],
    return: ['Welcome back!', 'Ready to study?', 'Good to see you!', 'Aa gaye phir se?'],
    milestone5: ['5 down!', 'Nice rhythm!'],
    milestone10: ['10 done!', 'Solid pace!'],
    milestone20: ['20! Kamaal!', 'You\'re flying!'],
    halfway: ['Halfway there!', 'Don\'t stop now!'],
    almostDone: ['So close!', 'Last few!'],
};

// Event types Mystic responds to
export type MysticEvent =
    | { type: 'idle' }
    | { type: 'correct'; streak: number }
    | { type: 'wrong'; streak: number }
    | { type: 'milestone'; count: number; total: number }
    | { type: 'thinking'; secondsOnQuestion: number }
    | { type: 'return' }
    | { type: 'celebrate' };

export const getMysticReaction = (event: MysticEvent): { state: MysticState; message: string } => {
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    switch (event.type) {
        case 'correct':
            if (event.streak >= 5) return { state: 'celebrating', message: pick(mysticMessages.celebrating) };
            if (event.streak >= 3) return { state: 'fire', message: pick(mysticMessages.fire) };
            return { state: 'happy', message: pick(mysticMessages.correct) };
        case 'wrong':
            return { state: 'sad', message: pick(mysticMessages.wrong) };
        case 'milestone':
            if (event.count === 5) return { state: 'cheering', message: pick(mysticMessages.milestone5) };
            if (event.count === 10) return { state: 'cheering', message: pick(mysticMessages.milestone10) };
            if (event.count === 20) return { state: 'celebrating', message: pick(mysticMessages.milestone20) };
            if (event.count === Math.floor(event.total / 2)) return { state: 'cheering', message: pick(mysticMessages.halfway) };
            if (event.count === event.total - 3) return { state: 'excited', message: pick(mysticMessages.almostDone) };
            return { state: 'happy', message: pick(mysticMessages.correct) };
        case 'thinking':
            return { state: 'thinking', message: pick(mysticMessages.thinking) };
        case 'return':
            return { state: 'happy', message: pick(mysticMessages.return) };
        case 'celebrate':
            return { state: 'celebrating', message: pick(mysticMessages.celebrating) };
        default:
            return { state: 'idle', message: '' };
    }
};
