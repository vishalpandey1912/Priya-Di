'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const BRAND = { red: '#c41e1e', redLight: '#fef2f2', redDark: '#991b1b' };

export default function ThankYouPage() {
    const [copied, setCopied] = useState(false);

    const shareUrl = 'https://desieducators.com/fixourneet';
    const shareMessage = `I just signed Fix Our NEET. Six fixes the Ministry can make for the NEET re-exam. Add your name in 45 seconds: ${shareUrl}`;
    const tweetMessage = `I added my name to #FixOurNEET. Six fixes the Ministry can make for the NEET re-exam. ${shareUrl}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const ta = document.createElement('textarea');
            ta.value = shareUrl;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
            document.body.removeChild(ta);
        }
    };

    return (
        <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', background: 'linear-gradient(180deg, #fefdfb 0%, #faf8f5 100%)' }}>
            <div style={{ maxWidth: 640, textAlign: 'center' }}>
                <div style={{
                    width: 84, height: 84, borderRadius: '50%',
                    background: '#16a34a', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 44, margin: '0 auto 24px', boxShadow: '0 8px 24px rgba(22,163,74,0.25)'
                }}>✓</div>

                <h1 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(34px, 5vw, 48px)',
                    fontWeight: 700, color: '#0f172a',
                    marginBottom: 16, lineHeight: 1.2
                }}>
                    Your signature is verified.
                </h1>

                <p style={{
                    fontSize: 17, lineHeight: 1.7, color: '#475569',
                    maxWidth: 560, margin: '0 auto 24px'
                }}>
                    Thank you. Your name will be on the petition delivered to the Ministry of Education on or before <strong>19 May 2026</strong>. You'll receive an email when the stamped acknowledgement is received and published.
                </p>

                <p style={{
                    fontSize: 16, lineHeight: 1.7, color: '#64748b',
                    maxWidth: 560, margin: '0 auto 40px'
                }}>
                    The petition grows when more candidates and educators sign. The single most useful thing you can do now is share it with three people who are also affected.
                </p>

                <div style={{
                    background: '#fff', borderRadius: 16, padding: '28px 24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb',
                    marginBottom: 32
                }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#0f172a' }}>Share with three people</h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
                            target="_blank" rel="noopener noreferrer"
                            style={{
                                padding: '12px 24px', background: '#25D366', color: '#fff',
                                borderRadius: 10, fontSize: 14, fontWeight: 600,
                                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.099-.471-.15-.67.149-.197.297-.768.964-.94 1.162-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.197 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                            WhatsApp
                        </a>
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetMessage)}`}
                            target="_blank" rel="noopener noreferrer"
                            style={{
                                padding: '12px 24px', background: '#0f172a', color: '#fff',
                                borderRadius: 10, fontSize: 14, fontWeight: 600,
                                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            X / Twitter
                        </a>
                        <button
                            onClick={handleCopy}
                            style={{
                                padding: '12px 24px', background: copied ? '#16a34a' : '#fff', color: copied ? '#fff' : '#0f172a',
                                border: copied ? 'none' : '1.5px solid #cbd5e1',
                                borderRadius: 10, fontSize: 14, fontWeight: 600,
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            {copied ? '✓ Copied!' : 'Copy link'}
                        </button>
                    </div>
                </div>

                <Link
                    href="/fixourneet"
                    style={{ color: BRAND.red, fontWeight: 600, fontSize: 14, textDecoration: 'underline' }}
                >
                    ← Back to Fix Our NEET
                </Link>
            </div>
        </div>
    );
}
