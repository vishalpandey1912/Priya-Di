'use client';

import { useEffect, useState } from 'react';

// Sticky red strip rendered above the Navbar on every page.
// Drives traffic to /fixourneet during the campaign window.
// Dismissible per session so it stops blocking after the user has seen it.

export default function TopAlertBanner() {
    // Always render on SSR + first client paint so it appears immediately.
    // Check sessionStorage after mount; if dismissed, hide.
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (sessionStorage.getItem('fixourneet_banner_dismissed')) {
                setDismissed(true);
            }
        }
    }, []);

    if (dismissed) return null;

    const handleDismiss = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        sessionStorage.setItem('fixourneet_banner_dismissed', '1');
        setDismissed(true);
    };

    return (
        <a
            href="/fixourneet"
            style={{
                display: 'block',
                background: 'linear-gradient(90deg, #991b1b 0%, #c41e1e 50%, #991b1b 100%)',
                color: '#fff',
                textDecoration: 'none',
                position: 'relative',
                zIndex: 100,
                animation: 'fixourneetStripPulse 3s ease-in-out infinite'
            }}
        >
            <div style={{
                maxWidth: 1200,
                margin: '0 auto',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                fontSize: 14,
                fontWeight: 600,
                position: 'relative'
            }}>
                <span style={{
                    display: 'inline-block',
                    background: 'rgba(255,255,255,0.18)',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: 1,
                    flexShrink: 0
                }}>
                    PETITION
                </span>
                <span className="banner-msg">
                    <strong>Fix Our NEET — Sign the petition to MoE.</strong>
                    {' '}23 lakh students. 6 demands. 25,000 signatures needed.
                </span>
                <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontWeight: 800,
                    textDecoration: 'underline',
                    flexShrink: 0
                }}>
                    Sign Now →
                </span>
                <button
                    onClick={handleDismiss}
                    aria-label="Dismiss"
                    style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: '#fff',
                        opacity: 0.6,
                        cursor: 'pointer',
                        fontSize: 18,
                        padding: '4px 8px',
                        lineHeight: 1
                    }}
                >
                    ×
                </button>
            </div>
            <style jsx>{`
                @media (max-width: 640px) {
                    .banner-msg {
                        font-size: 12px;
                    }
                    .banner-msg strong {
                        display: block;
                    }
                }
            `}</style>
        </a>
    );
}
