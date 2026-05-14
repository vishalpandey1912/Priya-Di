'use client';

import { useEffect, useState, useRef, FormEvent } from 'react';
import Link from 'next/link';

// ─── BRAND ─────────────────────────────────────────────────────────────
const BRAND = { red: '#c41e1e', redLight: '#fef2f2', redDark: '#991b1b' };

// ─── STATES & UTs ──────────────────────────────────────────────────────
const STATES = [
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
    'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
    'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
    'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
    'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu',
    'Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'
];

const STATE_BOARDS = [
    'CBSE','ICSE','Andhra Pradesh Board','Assam Board','Bihar Board','Chhattisgarh Board',
    'Goa Board','Gujarat Board','Haryana Board','Himachal Pradesh Board','Jharkhand Board',
    'Karnataka Board','Kerala Board','Madhya Pradesh Board','Maharashtra Board','Manipur Board',
    'Meghalaya Board','Mizoram Board','Nagaland Board','Odisha Board','Punjab Board',
    'Rajasthan Board (RBSE)','Sikkim Board','Tamil Nadu Board','Telangana Board','Tripura Board',
    'Uttar Pradesh Board (UP Board)','Uttarakhand Board','West Bengal Board','J&K Board','Other'
];

// ─── SIX ASKS ──────────────────────────────────────────────────────────
const ASKS = [
    {
        n: 1,
        title: "A re-NEET schedule with at least 21 days' written notice.",
        body: "Candidates have prepared for two to four years for this exam. After cancellation on 12 May, they need time to recover, reorganise, and revise. NTA must publish the re-NEET date with a minimum of 21 clear days' notice, in writing, on neet.nta.nic.in."
    },
    {
        n: 2,
        title: 'Free re-allotment of exam centres, plus travel and accommodation reimbursement where the centre changes.',
        body: "Many candidates have relocated since 3 May (post-Class 12 results, family moves). Every re-NEET candidate should have a one-time free choice to reselect exam city. Where NTA assigns a city other than the candidate's first preference, return travel by 3AC rail and one night of accommodation up to Rs. 2,500 should be reimbursed on production of receipts."
    },
    {
        n: 3,
        title: 'Published chain of custody and exam-day security protocol, with CCTV retention.',
        body: 'Before re-NEET day, NTA must publish: the printing vendor, the transport chain from press to centres, the opening protocol at each centre, and the verification process. Every examination hall must be under CCTV with footage retained for a minimum of 90 days, accessible to CBI and the Supreme Court if required.'
    },
    {
        n: 4,
        title: 'An independent observer panel for the re-NEET.',
        body: 'A panel of three retired High Court judges, three senior medical educators (current or former Deans of government medical colleges), and at least one cybersecurity and digital-forensics expert should be constituted to monitor the re-NEET. The cybersecurity expert is essential because the 2026 leak was digital in nature — a 410-question document circulated on WhatsApp groups weeks before the exam. The panel must have unannounced access to any centre on exam day, plus end-to-end audit access to the digital paper-handling and result-processing chain, with a written report submitted to the Ministry within seven days of the exam.'
    },
    {
        n: 5,
        title: 'An integrated counselling and academic calendar, published with the re-NEET dates.',
        body: "Re-NEET will compress the counselling cycle by four to six weeks. To prevent confusion and seat loss, the Ministry of Health and Family Welfare (through MCC) and the National Medical Commission must publish, in writing, alongside the re-NEET date: revised All India Quota and State Quota counselling dates (no state may open Round 1 before AIQ result), free upgrade between rounds without forfeit of security deposit, formal extension of the MBBS academic session start, corresponding adjustment of FMGE / NEXT / internship / NEET PG dates for the 2026 cohort, and confirmation that state domicile eligibility is determined by the original application, not by the re-NEET centre."
    },
    {
        n: 6,
        title: 'A funded mental health support and grievance redressal line for re-NEET candidates.',
        body: 'The Ministry of Education, in coordination with NIMHANS or AIIMS Delhi, must operationalise a dedicated mental health helpline for re-NEET 2026 candidates and their families, funded for a minimum of 90 days from the re-NEET date. A separate grievance redressal cell, with a published 48-hour response standard, must handle exam-day incidents, centre allocation disputes, and counselling issues.'
    }
];

// ─── COSIGNATORIES ─────────────────────────────────────────────────────
const COSIGS = [
    { name: 'Priya Pandey', title: 'Founder, Desi Educators · Biology Educator since 2017 · MSc Gold Medalist' },
    { name: 'Santosh Pandey', title: 'Solicitor (England & Wales) · Advocate (India) · Legal Coordinator, Fix Our NEET' }
];

// ─── COUNTER ───────────────────────────────────────────────────────────
type Counts = { total: number; verified_candidates: number; parents: number; educators: number; supporters?: number; last_24h: number; _note?: string };

function LiveCounter() {
    const [counts, setCounts] = useState<Counts>({ total: 0, verified_candidates: 0, parents: 0, educators: 0, last_24h: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const fetchCounts = async () => {
            try {
                const r = await fetch('/api/fixourneet/count', { cache: 'no-store' });
                const j = await r.json();
                if (mounted) { setCounts(j); setLoading(false); }
            } catch { if (mounted) setLoading(false); }
        };
        fetchCounts();
        const i = setInterval(fetchCounts, 60_000);
        return () => { mounted = false; clearInterval(i); };
    }, []);

    return (
        <div style={{
            background: '#fff', border: '1.5px solid #e5e7eb',
            borderRadius: 14, padding: '20px 24px', marginTop: 20,
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
        }}>
            <div style={{
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                fontSize: 40, fontWeight: 700, color: '#0f172a', lineHeight: 1,
                opacity: loading ? 0.5 : 1, transition: 'opacity 0.3s'
            }}>
                {counts.total.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginTop: 6, letterSpacing: 0.5 }}>
                VERIFIED SIGNATORIES
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 14, fontSize: 13, color: '#475569' }}>
                <span><strong style={{ color: '#0f172a' }}>{counts.verified_candidates.toLocaleString('en-IN')}</strong> candidates</span>
                <span style={{ color: '#cbd5e1' }}>·</span>
                <span><strong style={{ color: '#0f172a' }}>{counts.educators.toLocaleString('en-IN')}</strong> educators</span>
                <span style={{ color: '#cbd5e1' }}>·</span>
                <span><strong style={{ color: '#0f172a' }}>{counts.parents.toLocaleString('en-IN')}</strong> parents</span>
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>
                <strong style={{ color: BRAND.red }}>{counts.last_24h.toLocaleString('en-IN')}</strong> joined in the last 24 hours
            </div>
        </div>
    );
}

// ─── SIGN FORM ─────────────────────────────────────────────────────────
function SignForm() {
    const [role, setRole] = useState<string>('');
    const [isMinor, setIsMinor] = useState(false);
    const [whatsapp, setWhatsapp] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        const fd = new FormData(formRef.current!);
        const payload: any = {
            full_name: fd.get('full_name'),
            email: fd.get('email'),
            city: fd.get('city'),
            state: fd.get('state'),
            role: fd.get('role'),
            privacy_consent: fd.get('privacy_consent') === 'on',
            desi_educators_optin: fd.get('desi_educators_optin') === 'on',
            is_minor: fd.get('is_minor') === 'on',
            whatsapp_consent: fd.get('whatsapp_consent') === 'on'
        };

        if (role === 'candidate') {
            payload.neet_attempt = fd.get('neet_attempt');
            payload.class_12_passing_year = fd.get('class_12_passing_year');
            payload.target_year = fd.get('target_year');
            payload.preferred_medium = fd.get('preferred_medium') || null;
            payload.state_board = fd.get('state_board') || null;
            payload.neet_app_number_last4 = fd.get('neet_app_number_last4') || null;
        }

        if (isMinor) {
            payload.parent_name = fd.get('parent_name');
            payload.parent_consent = fd.get('parent_consent') === 'on';
        }

        if (whatsapp.trim()) {
            payload.whatsapp_number = whatsapp.trim();
        }

        // UTM passthrough
        if (typeof window !== 'undefined') {
            const sp = new URLSearchParams(window.location.search);
            payload.utm_source = sp.get('utm_source');
            payload.utm_medium = sp.get('utm_medium');
            payload.utm_campaign = sp.get('utm_campaign');
        }

        try {
            const r = await fetch('/api/fixourneet/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const j = await r.json();
            if (!r.ok) {
                setError(j.error || 'Could not submit. Please try again.');
                setSubmitting(false);
                return;
            }
            if (j.alreadyVerified) {
                setSuccess('This email already verified a signature. Thank you for being on the petition!');
            } else {
                setSuccess(j.message || 'Check your inbox to verify your signature.');
            }
        } catch (e: any) {
            setError(e.message || 'Network error. Please try again.');
        }
        setSubmitting(false);
    };

    if (success) {
        return (
            <div style={{
                background: '#f0fdf4', border: '2px solid #16a34a', borderRadius: 14,
                padding: '24px 22px', textAlign: 'center'
            }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📧</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#15803d', marginBottom: 10 }}>Check your inbox</h3>
                <p style={{ fontSize: 14, color: '#166534', lineHeight: 1.6 }}>{success}</p>
                <p style={{ fontSize: 12, color: '#16a34a', marginTop: 14, opacity: 0.85 }}>
                    Click the verification link in our email. Your name goes on the petition only after that.
                </p>
            </div>
        );
    }

    const inputStyle = {
        width: '100%', padding: '10px 12px', fontSize: 14,
        border: '1.5px solid #d1d5db', borderRadius: 8,
        fontFamily: 'inherit', background: '#fff',
        boxSizing: 'border-box' as const
    };
    const labelStyle = {
        display: 'block', fontSize: 13, fontWeight: 600,
        color: '#374151', marginBottom: 6
    };

    return (
        <form ref={formRef} onSubmit={onSubmit} style={{
            background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 14,
            padding: '24px 22px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
        }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', marginBottom: 6, fontFamily: "'Cormorant Garamond', serif" }}>
                Add your name to the petition
            </h3>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 18, lineHeight: 1.5 }}>
                Takes 45 seconds. You will receive an email to verify your signature. Verified signatures are the ones that go to the Ministry.
            </p>

            <div style={{ marginBottom: 14 }}>
                <label htmlFor="full_name" style={labelStyle}>Full name *</label>
                <input type="text" id="full_name" name="full_name" required style={inputStyle} autoComplete="name" />
            </div>

            <div style={{ marginBottom: 14 }}>
                <label htmlFor="email" style={labelStyle}>Email *</label>
                <input type="email" id="email" name="email" required style={inputStyle} autoComplete="email" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                    <label htmlFor="city" style={labelStyle}>City *</label>
                    <input type="text" id="city" name="city" required style={inputStyle} autoComplete="address-level2" />
                </div>
                <div>
                    <label htmlFor="state" style={labelStyle}>State *</label>
                    <select id="state" name="state" required style={inputStyle} defaultValue="">
                        <option value="" disabled>Select…</option>
                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>I am a *</label>
                {[
                    { v: 'candidate', l: 'NEET 2026 candidate' },
                    { v: 'parent', l: 'Parent / guardian of a NEET 2026 candidate' },
                    { v: 'educator', l: 'Educator' },
                    { v: 'supporter', l: 'Supporter (none of the above)' }
                ].map(opt => (
                    <label key={opt.v} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, cursor: 'pointer', fontSize: 14, color: '#374151' }}>
                        <input type="radio" name="role" value={opt.v} required onChange={() => setRole(opt.v)} />
                        {opt.l}
                    </label>
                ))}
            </div>

            {role === 'candidate' && (
                <div style={{ background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: BRAND.red, marginBottom: 12, letterSpacing: 0.5 }}>
                        CANDIDATE DETAILS
                    </div>

                    <label style={labelStyle}>My NEET 2026 attempt *</label>
                    {[
                        { v: 'first', l: 'First attempt' },
                        { v: 'dropper_1', l: 'Dropper (one year)' },
                        { v: 'dropper_2plus', l: 'Dropper (two or more years)' },
                        { v: 'repeater', l: 'Repeater (improvement)' }
                    ].map(opt => (
                        <label key={opt.v} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, cursor: 'pointer', fontSize: 13, color: '#374151' }}>
                            <input type="radio" name="neet_attempt" value={opt.v} required />
                            {opt.l}
                        </label>
                    ))}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
                        <div>
                            <label htmlFor="class_12_passing_year" style={labelStyle}>Class 12 year *</label>
                            <select id="class_12_passing_year" name="class_12_passing_year" required style={inputStyle} defaultValue="">
                                <option value="" disabled>Select…</option>
                                {[2022, 2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Target year *</label>
                            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                                <label style={{ fontSize: 14, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <input type="radio" name="target_year" value="2026" required /> 2026
                                </label>
                                <label style={{ fontSize: 14, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <input type="radio" name="target_year" value="2027" /> 2027
                                </label>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 14 }}>
                        <label style={labelStyle}>Preferred study medium</label>
                        <div style={{ display: 'flex', gap: 14 }}>
                            {['english', 'hindi', 'other'].map(m => (
                                <label key={m} style={{ fontSize: 13, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                                    <input type="radio" name="preferred_medium" value={m} /> {m.charAt(0).toUpperCase() + m.slice(1)}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: 12 }}>
                        <label htmlFor="state_board" style={labelStyle}>State board</label>
                        <select id="state_board" name="state_board" style={inputStyle} defaultValue="">
                            <option value="">Select (optional)…</option>
                            {STATE_BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>

                    <div style={{ marginTop: 12 }}>
                        <label htmlFor="neet_app_number_last4" style={labelStyle}>Last 4 digits of NEET 2026 application no. (optional)</label>
                        <input
                            type="text" id="neet_app_number_last4" name="neet_app_number_last4"
                            maxLength={4} pattern="\d{4}"
                            placeholder="1234"
                            style={inputStyle}
                        />
                        <small style={{ fontSize: 11, color: '#64748b', marginTop: 4, display: 'block' }}>
                            If provided, your signature is marked "verified candidate" on the Ministry submission.
                        </small>
                    </div>
                </div>
            )}

            <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#374151', cursor: 'pointer' }}>
                    <input type="checkbox" name="is_minor" checked={isMinor} onChange={e => setIsMinor(e.target.checked)} style={{ marginTop: 3 }} />
                    <span>I am under 18 years old</span>
                </label>
            </div>

            {isMinor && (
                <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#92400e', marginBottom: 12, letterSpacing: 0.5 }}>
                        PARENT / GUARDIAN CONSENT (Required for under-18)
                    </div>
                    <label htmlFor="parent_name" style={labelStyle}>Parent / guardian full name *</label>
                    <input type="text" id="parent_name" name="parent_name" required={isMinor} style={inputStyle} />
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 12, fontSize: 13, color: '#374151', cursor: 'pointer' }}>
                        <input type="checkbox" name="parent_consent" required={isMinor} style={{ marginTop: 3 }} />
                        <span>My parent / guardian consents to this signature.</span>
                    </label>
                </div>
            )}

            <div style={{ marginBottom: 14 }}>
                <label htmlFor="whatsapp_number" style={labelStyle}>WhatsApp number (optional)</label>
                <input
                    type="tel" id="whatsapp_number" name="whatsapp_number"
                    value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
                    placeholder="+91 98XXXXXXXX" style={inputStyle}
                />
                {whatsapp.trim() && (
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 8, fontSize: 13, color: '#374151', cursor: 'pointer' }}>
                        <input type="checkbox" name="whatsapp_consent" required={!!whatsapp.trim()} style={{ marginTop: 3 }} />
                        <span>I consent to receive updates about this petition on WhatsApp.</span>
                    </label>
                )}
            </div>

            <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#374151', cursor: 'pointer' }}>
                    <input type="checkbox" name="desi_educators_optin" style={{ marginTop: 3 }} />
                    <span>Send me NEET preparation updates from Desi Educators. I can opt out any time.</span>
                </label>
            </div>

            <div style={{ marginBottom: 18, padding: 12, background: BRAND.redLight, borderRadius: 8, border: `1px solid ${BRAND.red}33` }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#374151', cursor: 'pointer' }}>
                    <input type="checkbox" name="privacy_consent" required style={{ marginTop: 3 }} />
                    <span>I have read the <a href="#privacy" style={{ color: BRAND.red, fontWeight: 600 }}>Privacy Notice</a> and consent to my name, role, city, and state being printed on the petition delivered to the Ministry of Education. *</span>
                </label>
            </div>

            {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 14 }}>
                    {error}
                </div>
            )}

            <button
                type="submit" disabled={submitting}
                style={{
                    width: '100%', padding: '14px 24px',
                    background: submitting ? '#94a3b8' : BRAND.red,
                    color: '#fff', border: 'none', borderRadius: 10,
                    fontSize: 15, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s', boxShadow: `0 4px 12px ${BRAND.red}33`,
                    letterSpacing: 0.3
                }}
            >
                {submitting ? 'Sending verification email…' : 'Send me a verification email'}
            </button>
        </form>
    );
}

// ─── FAQ ITEM ──────────────────────────────────────────────────────────
function FAQItem({ q, children }: { q: string; children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ borderBottom: '1px solid #e5e7eb', padding: '16px 0' }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    width: '100%', textAlign: 'left', background: 'none', border: 'none',
                    cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', gap: 16, padding: 0, fontFamily: 'inherit'
                }}
            >
                <span style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', lineHeight: 1.5 }}>{q}</span>
                <span style={{ fontSize: 20, color: BRAND.red, lineHeight: 1, flexShrink: 0, transform: open ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>+</span>
            </button>
            {open && (
                <div style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, marginTop: 12 }}>
                    {children}
                </div>
            )}
        </div>
    );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────
export default function FixOurNeetPage() {
    const [urlError, setUrlError] = useState<string | null>(null);

    useEffect(() => {
        const sp = new URLSearchParams(window.location.search);
        const err = sp.get('error');
        if (err) {
            const msgs: Record<string, string> = {
                invalid_token: 'That verification link is invalid. Please sign again.',
                expired_token: 'That verification link has expired. Please sign again to receive a fresh link.',
                server_error: 'Something went wrong on our end. Please try again in a few minutes.'
            };
            setUrlError(msgs[err] || 'Verification failed. Please try again.');
        }
    }, []);

    return (
        <div style={{ background: '#fff', color: '#0f172a', fontFamily: "'Karla', system-ui, sans-serif" }}>

            {/* HERO */}
            <section style={{
                background: 'linear-gradient(180deg, #fefdfb 0%, #fef2f2 100%)',
                padding: '60px 20px 50px',
                borderBottom: '1px solid #f1f5f9'
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{
                        display: 'inline-block',
                        background: '#fff', border: `1.5px solid ${BRAND.red}`,
                        color: BRAND.red, padding: '6px 14px', borderRadius: 99,
                        fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 20
                    }}>
                        #FIXOURNEET · CITIZEN REPRESENTATION
                    </div>

                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 'clamp(32px, 5.5vw, 56px)',
                        fontWeight: 700, lineHeight: 1.15, color: '#0f172a',
                        marginBottom: 22, maxWidth: 900
                    }}>
                        23 lakh students. 10 days to the re-NEET. <span style={{ color: BRAND.red }}>Six fixes</span> the Ministry can make now.
                    </h1>

                    <p style={{
                        fontSize: 'clamp(16px, 1.8vw, 19px)', color: '#475569',
                        lineHeight: 1.6, maxWidth: 760, marginBottom: 30
                    }}>
                        A citizen representation to the Union Ministry of Education and the National Testing Agency. By educators, parents, and NEET 2026 candidates. Non-partisan. Constructive. Implementable.
                    </p>

                    {urlError && (
                        <div style={{
                            background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#991b1b',
                            padding: 14, borderRadius: 10, marginBottom: 24, fontSize: 14, maxWidth: 600
                        }}>
                            {urlError}
                        </div>
                    )}

                    <a href="#sign" style={{
                        display: 'inline-block', padding: '15px 32px',
                        background: BRAND.red, color: '#fff',
                        borderRadius: 10, fontSize: 16, fontWeight: 700,
                        textDecoration: 'none', boxShadow: `0 6px 20px ${BRAND.red}55`,
                        letterSpacing: 0.3
                    }}>
                        Add my name to Fix Our NEET →
                    </a>

                    <div style={{ maxWidth: 480 }}>
                        <LiveCounter />
                    </div>
                </div>
            </section>

            {/* WHAT IS FIX OUR NEET */}
            <section style={{ padding: '60px 20px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <h2 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700,
                        color: '#0f172a', marginBottom: 24
                    }}>
                        What is Fix Our NEET?
                    </h2>
                    <div style={{ fontSize: 17, lineHeight: 1.75, color: '#334155' }}>
                        <p style={{ marginBottom: 18 }}>
                            On 12 May 2026, the National Testing Agency cancelled the NEET UG 2026 examination held on 3 May 2026, following an alleged paper leak now under CBI investigation. The Government has confirmed a re-examination will be held within weeks.
                        </p>
                        <p style={{ marginBottom: 18 }}>
                            Fix Our NEET is a structured representation to the Ministry of Education and NTA from the people most affected. It does not ask anyone to resign. It does not ask for any agency to be dissolved. It asks for six specific, implementable fixes that can be announced together with the re-NEET dates.
                        </p>
                        <p style={{ marginBottom: 18 }}>
                            Each ask is something the Ministry, NTA, the Medical Counselling Committee, and the National Medical Commission can deliver inside the existing legal framework. None requires legislation. All can be in writing within 10 days.
                        </p>
                        <p>
                            When <strong>25,000 verified signatories</strong> are on record, the petition will be hand-delivered to the Ministry of Education with a request for stamped acknowledgement. The acknowledgement will be published here.
                        </p>
                    </div>
                </div>
            </section>

            {/* SIX ASKS + SIGN FORM (two columns on desktop) */}
            <section style={{ padding: '60px 20px', background: '#fafafa', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div className="six-asks-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, 420px)',
                        gap: 40, alignItems: 'start'
                    }}>
                        <div>
                            <h2 style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700,
                                color: '#0f172a', marginBottom: 30
                            }}>
                                The Six Asks
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                {ASKS.map(a => (
                                    <div key={a.n} style={{
                                        background: '#fff', borderRadius: 14,
                                        border: '1px solid #e5e7eb', padding: '24px 22px',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                                            <div style={{
                                                flexShrink: 0,
                                                width: 38, height: 38, borderRadius: 10,
                                                background: BRAND.red, color: '#fff',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                                                fontSize: 18
                                            }}>
                                                {a.n}
                                            </div>
                                            <div>
                                                <h3 style={{
                                                    fontSize: 17, fontWeight: 700, color: '#0f172a',
                                                    marginBottom: 10, lineHeight: 1.4
                                                }}>
                                                    {a.title}
                                                </h3>
                                                <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7 }}>
                                                    {a.body}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Suggest an addition — low-friction email link, no form */}
                                <div style={{
                                    background: '#fffbeb',
                                    border: '1px dashed #fbbf24',
                                    borderRadius: 14,
                                    padding: '20px 22px',
                                    fontSize: 14,
                                    color: '#78350f',
                                    lineHeight: 1.65
                                }}>
                                    <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: 1, color: '#92400e', marginBottom: 8, textTransform: 'uppercase' }}>
                                        Suggest an addition
                                    </div>
                                    This list of asks is the v1, drafted by educators. It will be expanded based on
                                    input from cybersecurity professionals, medical councils, parent groups, and
                                    candidates themselves before final submission to the Ministry on 19 May 2026.
                                    To propose an addition or refinement, email{' '}
                                    <a
                                        href="mailto:fixourneet@desieducators.com?subject=Fix%20Our%20NEET%20%E2%80%94%20Suggestion%20for%20the%20demands%20list"
                                        style={{ color: BRAND.red, fontWeight: 700, textDecoration: 'underline' }}
                                    >
                                        fixourneet@desieducators.com
                                    </a>
                                    {' '}with your name, professional credentials, and the specific addition.
                                </div>
                            </div>
                        </div>

                        <div id="sign" style={{ position: 'sticky', top: 20 }}>
                            <SignForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* CO-SIGNATORIES */}
            <section style={{ padding: '60px 20px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <h2 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 700,
                        color: '#0f172a', marginBottom: 12
                    }}>
                        Educator and professional co-signatories
                    </h2>
                    <p style={{ fontSize: 15, color: '#64748b', marginBottom: 28, maxWidth: 700, lineHeight: 1.6 }}>
                        Each co-signatory has reviewed the petition and added their name. We are continuing to invite educators, medical professionals, and parent associations.
                    </p>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: 16
                    }}>
                        {COSIGS.map(c => (
                            <div key={c.name} style={{
                                background: '#fff', border: '1px solid #e5e7eb',
                                borderRadius: 12, padding: '18px 18px'
                            }}>
                                <div style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{c.name}</div>
                                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{c.title}</div>
                            </div>
                        ))}
                        <div style={{
                            background: '#fafafa', border: '1.5px dashed #cbd5e1',
                            borderRadius: 12, padding: '18px 18px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#94a3b8', fontSize: 14, fontStyle: 'italic'
                        }}>
                            More confirmations being added daily
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section style={{ padding: '60px 20px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <h2 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700,
                        color: '#0f172a', marginBottom: 24
                    }}>
                        Questions
                    </h2>
                    <FAQItem q="Is this a political campaign?">
                        No. The petition does not call for anyone's resignation or the dissolution of any agency. It is a representation under the right to petition the executive, addressed to the Ministry and NTA, with six implementable asks.
                    </FAQItem>
                    <FAQItem q="Who is behind it?">
                        The petition is coordinated by Desi Educators (founded by Priya Pandey, NEET Biology educator) with legal coordination by Santosh Pandey, Solicitor (England &amp; Wales) and Advocate (India). Co-signatories include educators, medical professionals, and parent body representatives whose names appear on this page.
                    </FAQItem>
                    <FAQItem q="What happens after I sign?">
                        You&apos;ll get an email with a verification link. Click it within 48 hours. Your name, city, state, and role are added to the petition once verified. On or before 19 May 2026, the petition is hand-delivered to the Ministry of Education with a request for stamped acknowledgement. The acknowledgement is published here.
                    </FAQItem>
                    <FAQItem q="How is my data protected?">
                        Read the full Privacy Notice below. In short: only your name, role, city, and state appear on the printed petition. Your email is for verification and (if you opt in) Desi Educators updates. Phone and address fields are minimal or absent by design. Data is held under DPDP Act 2023 standards and deleted within 30 days of petition submission unless you have opted in to Desi Educators updates.
                    </FAQItem>
                    <FAQItem q="Why is the Class 12 / NEET attempt information asked?">
                        So we can tell the Ministry how many of the signatories are actively affected NEET 2026 candidates and how many are repeat attempters, parents, or educators. The Ministry treats verified candidate counts more seriously than total signature counts. Aggregated numbers, not individual identities, go on the petition.
                    </FAQItem>
                    <FAQItem q="Can I sign if I am not Indian?">
                        Yes, but the petition is primarily a representation by people directly affected. Non-candidate, non-resident supporters are recorded as &quot;Supporters&quot; and reported separately.
                    </FAQItem>
                    <FAQItem q="What if the Ministry does not respond?">
                        The petition includes co-signatories with standing in the legal system. If no response is received within 14 days of submission, an intervention application will be filed in the pending FAIMA proceedings before the Supreme Court of India.
                    </FAQItem>
                </div>
            </section>

            {/* PRIVACY NOTICE */}
            <section id="privacy" style={{ padding: '60px 20px', background: '#fafafa', borderBottom: '1px solid #f1f5f9', scrollMarginTop: 80 }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <h2 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 700,
                        color: '#0f172a', marginBottom: 24
                    }}>
                        Privacy Notice (DPDP Act 2023)
                    </h2>
                    <div style={{ fontSize: 15, color: '#334155', lineHeight: 1.75 }}>
                        <p style={{ marginBottom: 16 }}>
                            <strong>Data fiduciary:</strong> Desi Educators Pvt Ltd (proposed), c/o Santosh Pandey, Solicitor and Advocate.
                        </p>
                        <p style={{ marginBottom: 12 }}><strong>Purpose of collection:</strong></p>
                        <ol style={{ marginLeft: 22, marginBottom: 16 }}>
                            <li style={{ marginBottom: 6 }}>To compile a representation to the Ministry of Education and NTA, on which your name, role, city, and state will be printed.</li>
                            <li style={{ marginBottom: 6 }}>To verify the authenticity of signatories via email OTP.</li>
                            <li>Where you have explicitly opted in, to send you updates about this petition and NEET preparation resources from Desi Educators.</li>
                        </ol>
                        <p style={{ marginBottom: 16 }}>
                            <strong>Data collected:</strong> Name, email, city, state, role, NEET attempt status (candidates only), Class 12 passing year (candidates only), target year (candidates only), optional study medium and state board, optional last 4 digits of NEET application number (used only as a verification signal, not stored in plaintext after verification), optional parent name and consent (if signatory is under 18), optional WhatsApp number (only if you opted in).
                        </p>
                        <p style={{ marginBottom: 16 }}>
                            <strong>What appears on the petition delivered to the Ministry:</strong> Only your full name, role (candidate / parent / educator / supporter), city, and state. No email, no phone, no address, no NEET application number, no parent details.
                        </p>
                        <p style={{ marginBottom: 16 }}>
                            <strong>Retention:</strong> Records are retained for 30 days after petition submission unless you have opted into Desi Educators updates, in which case email and consent records are retained per Desi Educators' standing privacy policy.
                        </p>
                        <p style={{ marginBottom: 16 }}>
                            <strong>Your rights under DPDP Act 2023:</strong> You may request access, correction, or deletion of your data at any time by emailing <a href="mailto:privacy@desieducators.com" style={{ color: BRAND.red }}>privacy@desieducators.com</a>. You may withdraw consent for marketing emails using the unsubscribe link in any message.
                        </p>
                        <p style={{ marginBottom: 16 }}>
                            <strong>No third-party sharing.</strong> Data is not sold, rented, or shared with any third party. The only disclosure is the petition itself, which contains the minimal fields stated above.
                        </p>
                        <p>
                            <strong>Grievance redressal:</strong> Email <a href="mailto:privacy@desieducators.com" style={{ color: BRAND.red }}>privacy@desieducators.com</a>. Response within 7 days.
                        </p>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ padding: '40px 20px', background: '#0f172a', color: '#94a3b8' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto', fontSize: 14, lineHeight: 1.7 }}>
                    <p style={{ marginBottom: 14 }}>
                        Fix Our NEET is a citizen representation under Article 19(1)(a) and the right to petition the executive. It is not affiliated with any political party. Inquiries: <a href="mailto:fixourneet@desieducators.com" style={{ color: '#fff' }}>fixourneet@desieducators.com</a>.
                    </p>
                    <p style={{ fontSize: 13, color: '#64748b' }}>
                        © 2026 Desi Educators · <a href="#privacy" style={{ color: '#94a3b8' }}>Privacy</a> · <Link href="/" style={{ color: '#94a3b8' }}>Home</Link>
                    </p>
                </div>
            </footer>

            {/* Responsive styles */}
            <style jsx>{`
                @media (max-width: 1023px) {
                    .six-asks-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .six-asks-grid > div:last-child {
                        position: static !important;
                        order: 1;
                    }
                }
            `}</style>
        </div>
    );
}
