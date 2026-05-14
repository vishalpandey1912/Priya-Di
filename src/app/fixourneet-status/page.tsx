'use client';

import { useEffect, useState, useRef } from 'react';

// Public page (unlinked, hard-to-guess URL) — shows live counts.
// Polls /api/fixourneet/count every 10 seconds.
// Browser notification + audio alert when daily count crosses 70.

const BRAND = { red: '#c41e1e' };
const DAILY_LIMIT = 100;     // Resend free tier cap
const ALERT_THRESHOLD = 70;  // when to start the loud alarm

interface Counts {
    total: number;
    verified_candidates: number;
    parents: number;
    educators: number;
    supporters: number;
    last_24h: number;
    signups_today_ist: number;
    signups_this_month_ist: number;
    unverified_total: number;
    unverified_today_ist: number;
    verified_today_ist: number;
    last_signup_at: string | null;
    now_utc: string;
}

export default function FixOurNeetStatus() {
    const [counts, setCounts] = useState<Counts | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [lastFetched, setLastFetched] = useState<Date | null>(null);
    const [notifPermission, setNotifPermission] = useState<NotificationPermission | 'unsupported'>('default');
    const [alertFired, setAlertFired] = useState(false);
    const [soundOn, setSoundOn] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const prevTodayRef = useRef<number>(0);

    // Request notification permission on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!('Notification' in window)) {
            setNotifPermission('unsupported');
            return;
        }
        setNotifPermission(Notification.permission);
    }, []);

    const askPermission = async () => {
        if (!('Notification' in window)) return;
        const result = await Notification.requestPermission();
        setNotifPermission(result);
    };

    const fetchCounts = async () => {
        try {
            const r = await fetch('/api/fixourneet/count?bust=' + Date.now(), { cache: 'no-store' });
            const j = await r.json();
            setCounts(j);
            setLastFetched(new Date());
            setError(null);

            // Trigger alert when crossing the threshold
            const todaySignups = j.signups_today_ist || 0;
            if (todaySignups >= ALERT_THRESHOLD && prevTodayRef.current < ALERT_THRESHOLD) {
                fireAlert(todaySignups);
            }
            prevTodayRef.current = todaySignups;
        } catch (e: any) {
            setError(e.message || 'Could not fetch counts');
        }
    };

    const fireAlert = (n: number) => {
        setAlertFired(true);
        // Browser notification
        if (notifPermission === 'granted') {
            new Notification('⚠️ Fix Our NEET — 70 emails sent today', {
                body: `Daily count is now ${n}/100. Upgrade to Resend Pro to avoid hitting the cap.`,
                tag: 'fixourneet-70-alert',
                requireInteraction: true
            });
        }
        // Audio beep
        playBeep();
    };

    const playBeep = () => {
        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const ctx = audioCtxRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
            osc.start();
            osc.stop(ctx.currentTime + 1.2);
            // Three beeps
            setTimeout(() => {
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.connect(gain2); gain2.connect(ctx.destination);
                osc2.frequency.value = 1100;
                gain2.gain.setValueAtTime(0.2, ctx.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
                osc2.start();
                osc2.stop(ctx.currentTime + 1);
            }, 400);
        } catch {}
    };

    useEffect(() => {
        fetchCounts();
        const i = setInterval(fetchCounts, 10_000);
        return () => clearInterval(i);
    }, []);

    const today = counts?.signups_today_ist || 0;
    const pct = Math.min(100, (today / DAILY_LIMIT) * 100);
    let barColor = '#16a34a';   // green: 0-49
    let zone = 'OK';
    if (today >= 90)      { barColor = '#7f1d1d'; zone = 'CRITICAL — UPGRADE NOW'; }
    else if (today >= 70) { barColor = BRAND.red; zone = 'WARNING — TIME TO UPGRADE'; }
    else if (today >= 50) { barColor = '#d97706'; zone = 'CAUTION — KEEP WATCH'; }

    const lastSignup = counts?.last_signup_at ? new Date(counts.last_signup_at) : null;
    const lastSignupAgo = lastSignup ? Math.round((Date.now() - lastSignup.getTime()) / 1000) : null;

    return (
        <div style={{
            minHeight: '100vh',
            background: today >= ALERT_THRESHOLD ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' : 'linear-gradient(135deg, #fefdfb 0%, #faf8f5 100%)',
            padding: '24px 16px',
            fontFamily: "'Karla', system-ui, sans-serif",
            color: '#0f172a',
            transition: 'background 0.5s'
        }}>
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 28, fontWeight: 700, margin: 0
                    }}>
                        Fix Our NEET — Live Tracker
                    </h1>
                    <div style={{ fontSize: 11, color: '#64748b' }}>
                        {lastFetched ? `updated ${lastFetched.toLocaleTimeString('en-IN')}` : 'loading...'}
                    </div>
                </div>

                {/* MAIN DAILY EMAIL COUNTER */}
                <div style={{
                    background: '#fff', borderRadius: 16, padding: 24,
                    boxShadow: '0 6px 24px rgba(0,0,0,0.06)',
                    border: today >= ALERT_THRESHOLD ? `3px solid ${BRAND.red}` : '1px solid #e5e7eb',
                    marginBottom: 16
                }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 1.5 }}>
                        EMAILS SENT TODAY (IST) — RESEND FREE TIER CAP: 100
                    </div>
                    <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1, marginTop: 8, color: barColor, fontFamily: "'JetBrains Mono', monospace" }}>
                        {today}
                        <span style={{ fontSize: 22, color: '#94a3b8', marginLeft: 8 }}>/ {DAILY_LIMIT}</span>
                    </div>
                    <div style={{ height: 12, background: '#f1f5f9', borderRadius: 6, marginTop: 14, overflow: 'hidden' }}>
                        <div style={{
                            height: '100%', width: pct + '%',
                            background: barColor, borderRadius: 6,
                            transition: 'width 0.6s, background 0.6s'
                        }} />
                    </div>
                    <div style={{
                        marginTop: 12, padding: '8px 12px',
                        background: today >= ALERT_THRESHOLD ? BRAND.red : (today >= 50 ? '#fef3c7' : '#dcfce7'),
                        color: today >= ALERT_THRESHOLD ? '#fff' : (today >= 50 ? '#92400e' : '#166534'),
                        borderRadius: 8, fontSize: 13, fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                        <span>{zone}</span>
                        {today >= 50 && (
                            <a href="https://resend.com/settings/billing" target="_blank" rel="noopener" style={{
                                color: today >= ALERT_THRESHOLD ? '#fff' : '#92400e',
                                textDecoration: 'underline', fontWeight: 700
                            }}>
                                Upgrade to Pro $20 →
                            </a>
                        )}
                    </div>
                </div>

                {/* SECONDARY STATS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 16 }}>
                    <StatCard label="VERIFIED TODAY" value={counts?.verified_today_ist ?? 0} color="#16a34a" />
                    <StatCard label="UNVERIFIED TODAY" value={counts?.unverified_today_ist ?? 0} color="#94a3b8" hint="awaiting email click" />
                    <StatCard label="VERIFIED EVER" value={counts?.total ?? 0} color={BRAND.red} />
                    <StatCard label="THIS MONTH (IST)" value={counts?.signups_this_month_ist ?? 0} color="#0f172a" hint={`/ 3000 Resend monthly`} />
                </div>

                {/* BREAKDOWN BY ROLE */}
                <div style={{
                    background: '#fff', borderRadius: 12, padding: '18px 20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb',
                    marginBottom: 16
                }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 1.5, marginBottom: 12 }}>
                        VERIFIED SIGNATORIES BY ROLE
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                        <RolePill label="Candidates" n={counts?.verified_candidates ?? 0} />
                        <RolePill label="Educators" n={counts?.educators ?? 0} />
                        <RolePill label="Parents" n={counts?.parents ?? 0} />
                        <RolePill label="Supporters" n={counts?.supporters ?? 0} />
                    </div>
                </div>

                {/* LAST SIGNUP */}
                <div style={{
                    background: '#fff', borderRadius: 12, padding: '14px 18px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #e5e7eb',
                    fontSize: 13, color: '#475569', marginBottom: 16
                }}>
                    Last signup: {lastSignupAgo === null ? 'none yet' :
                        lastSignupAgo < 60 ? `${lastSignupAgo}s ago` :
                        lastSignupAgo < 3600 ? `${Math.floor(lastSignupAgo / 60)}m ago` :
                        `${Math.floor(lastSignupAgo / 3600)}h ago`}
                </div>

                {/* NOTIFICATION CONTROLS */}
                <div style={{
                    background: '#0f172a', color: '#cbd5e1', borderRadius: 12,
                    padding: '16px 18px', fontSize: 13, lineHeight: 1.6
                }}>
                    <div style={{ fontWeight: 700, color: '#fff', marginBottom: 10 }}>
                        🔔 Alerts when daily count hits {ALERT_THRESHOLD}
                    </div>
                    {notifPermission === 'unsupported' && <div>Browser doesn't support notifications.</div>}
                    {notifPermission === 'default' && (
                        <button onClick={askPermission} style={{
                            background: BRAND.red, color: '#fff', border: 'none',
                            padding: '8px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600,
                            cursor: 'pointer'
                        }}>
                            Enable browser notifications
                        </button>
                    )}
                    {notifPermission === 'granted' && <div>✅ Browser notifications enabled.</div>}
                    {notifPermission === 'denied' && (
                        <div>❌ Notifications blocked. Enable in browser settings to receive alerts.</div>
                    )}
                    <div style={{ marginTop: 10, fontSize: 12, color: '#94a3b8' }}>
                        Keep this tab open. Audio beep will fire when count hits {ALERT_THRESHOLD}. Refresh: every 10s.
                    </div>
                    <div style={{ marginTop: 6, fontSize: 11, color: '#64748b' }}>
                        Tip: bookmark this URL on your phone too — works the same.
                    </div>
                </div>

                {error && (
                    <div style={{
                        background: '#fee2e2', color: '#991b1b', padding: 10,
                        borderRadius: 8, fontSize: 13, marginTop: 12
                    }}>
                        Error: {error}
                    </div>
                )}

                {alertFired && (
                    <div style={{
                        background: BRAND.red, color: '#fff', padding: 16,
                        borderRadius: 12, marginTop: 16, fontSize: 15, fontWeight: 700,
                        textAlign: 'center'
                    }}>
                        🚨 Daily count crossed {ALERT_THRESHOLD}. Upgrade Resend to Pro now: <a href="https://resend.com/settings/billing" target="_blank" rel="noopener" style={{ color: '#fff', textDecoration: 'underline' }}>https://resend.com/settings/billing</a>
                    </div>
                )}

                <div style={{ marginTop: 30, fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>
                    Unlinked admin page · refresh every 10s · data from petition_counts() RPC
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, color, hint }: { label: string; value: number; color: string; hint?: string }) {
    return (
        <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', border: '1px solid #e5e7eb', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: 1, marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{value}</div>
            {hint && <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>{hint}</div>}
        </div>
    );
}

function RolePill({ label, n }: { label: string; n: number }) {
    return (
        <div style={{ textAlign: 'center', padding: '10px 8px', background: '#f8fafc', borderRadius: 8 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: "'JetBrains Mono', monospace" }}>{n}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#64748b', letterSpacing: 0.5, marginTop: 2 }}>{label}</div>
        </div>
    );
}
