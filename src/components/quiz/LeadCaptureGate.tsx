'use client';

import React, { useState } from 'react';

interface Props {
  quizId: string;
  quizTitle?: string;
  onSuccess: () => void;
}

const BRAND = { red: '#c41e1e', dark: '#1a1a1a' };

export const LeadCaptureGate = ({ quizId, quizTitle, onSuccess }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Name, email and phone are all required.');
      return;
    }
    setSubmitting(true);
    try {
      const r = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          source_quiz_id: quizId,
          source_path: typeof window !== 'undefined' ? window.location.pathname : null
        })
      });
      const j = await r.json();
      if (!r.ok || !j.success) {
        setError(j.error || 'Could not submit. Try again.');
        setSubmitting(false);
        return;
      }
      // Persist so we don't ask again on this device
      try {
        localStorage.setItem('de_lead_captured', JSON.stringify({
          name: name.trim(), email: email.trim(), phone: phone.trim(), at: Date.now()
        }));
      } catch {}
      onSuccess();
    } catch (err: any) {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      maxWidth: 520,
      margin: '40px auto',
      padding: '0 20px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        border: '1px solid #e5e5e4',
        padding: '32px 28px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
      }}>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: BRAND.red,
          letterSpacing: 1.5,
          marginBottom: 8
        }}>
          ONE QUICK STEP
        </div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 26,
          lineHeight: 1.2,
          marginBottom: 8,
          color: BRAND.dark
        }}>
          {quizTitle ? `Start "${quizTitle}"` : 'Start your quiz'}
        </h1>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 22, lineHeight: 1.6 }}>
          Tell us where to send your results, important NEET updates, and the NCERT correction roadmap. No spam, ever.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              Your name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              autoFocus
              style={{
                width: '100%', padding: '11px 14px', fontSize: 14,
                border: '1.5px solid #e5e7eb', borderRadius: 10,
                fontFamily: "'Karla', sans-serif", outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              Email address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: '100%', padding: '11px 14px', fontSize: 14,
                border: '1.5px solid #e5e7eb', borderRadius: 10,
                fontFamily: "'Karla', sans-serif", outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              Phone number *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
              required
              style={{
                width: '100%', padding: '11px 14px', fontSize: 14,
                border: '1.5px solid #e5e7eb', borderRadius: 10,
                fontFamily: "'Karla', sans-serif", outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
              We'll send your scores and important NEET updates here
            </div>
          </div>

          {error && (
            <div style={{
              padding: '10px 14px', background: '#fef2f2',
              color: '#b91c1c', borderRadius: 8, fontSize: 13,
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '13px 24px',
              background: submitting ? '#9ca3af' : BRAND.red,
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 15,
              cursor: submitting ? 'wait' : 'pointer',
              boxShadow: submitting ? 'none' : `0 4px 14px ${BRAND.red}33`,
              transition: 'all 0.2s',
              marginTop: 6
            }}
          >
            {submitting ? 'Loading quiz...' : 'Start Quiz →'}
          </button>
        </form>

        <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
          By starting the quiz you agree to receive NEET prep updates from Desi Educators. You can unsubscribe any time.
        </p>
      </div>
    </div>
  );
};
