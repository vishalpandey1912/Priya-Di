'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const BRAND = { red: '#c41e1e', green: '#16a34a' };

export default function TestimonialPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill from profile if logged in
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('name, full_name, current_class, city, state')
        .eq('id', user.id)
        .single();
      if (data) {
        setName(data.full_name || data.name || '');
        const parts: string[] = [];
        if (data.current_class) parts.push(`Class ${data.current_class}`);
        if (data.city) parts.push(data.city);
        else if (data.state) parts.push(data.state);
        if (parts.length) setRole(parts.join(', '));
      }
    })();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !content.trim()) {
      setError('Name and testimonial content are required.');
      return;
    }
    if (content.trim().length < 20) {
      setError('Tell us a bit more — at least 20 characters.');
      return;
    }

    setSubmitting(true);
    const { error: insErr } = await supabase.from('testimonials').insert({
      user_id: user?.id ?? null,
      name: name.trim(),
      role: role.trim() || null,
      content: content.trim(),
      rating,
    });

    setSubmitting(false);
    if (insErr) {
      setError(insErr.message || 'Could not submit. Try again.');
      return;
    }
    setSubmitted(true);
    setTimeout(() => router.push('/'), 3000);
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🙏</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: BRAND.red, marginBottom: 12 }}>
          Thank you, {name}.
        </h1>
        <p style={{ fontSize: 16, color: '#6b7280', lineHeight: 1.7, marginBottom: 24 }}>
          Your testimonial has been received. After a quick review, it may appear on the homepage to help other NEET aspirants discover us.
        </p>
        <p style={{ fontSize: 13, color: '#9ca3af' }}>Redirecting to home...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: '40px auto', padding: '0 24px' }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b7280', textDecoration: 'none', marginBottom: 16 }}>
        ← Back to home
      </Link>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e5e4', padding: '32px 28px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: BRAND.green, letterSpacing: 1.5, marginBottom: 8 }}>
          SHARE YOUR EXPERIENCE
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, lineHeight: 1.2, marginBottom: 8 }}>
          A short testimonial helps NEET aspirants find us.
        </h1>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24, lineHeight: 1.6 }}>
          30 seconds. Honest words. Optional rating. We review before publishing — no spam, ever.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              Your name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Riya Sharma"
              required
              style={{
                width: '100%', padding: '10px 14px', fontSize: 14,
                border: '1.5px solid #e5e7eb', borderRadius: 10,
                fontFamily: "'Karla', sans-serif", outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              Your context (optional)
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Class 12 student, Mumbai"
              style={{
                width: '100%', padding: '10px 14px', fontSize: 14,
                border: '1.5px solid #e5e7eb', borderRadius: 10,
                fontFamily: "'Karla', sans-serif", outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
              Like &quot;Class 12 student, Mumbai&quot; or &quot;NEET dropper, Patna&quot;
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              Your testimonial *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What helped you the most? Quizzes? Audio lessons? Priya AI? NCERT corrections? Be specific."
              rows={5}
              required
              minLength={20}
              maxLength={500}
              style={{
                width: '100%', padding: '10px 14px', fontSize: 14,
                border: '1.5px solid #e5e7eb', borderRadius: 10,
                fontFamily: "'Karla', sans-serif", outline: 'none',
                resize: 'vertical', boxSizing: 'border-box'
              }}
            />
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, textAlign: 'right' }}>
              {content.length} / 500
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              Rating
            </label>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  style={{
                    fontSize: 28,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: n <= rating ? '#fbbf24' : '#e5e7eb',
                    padding: 0,
                    lineHeight: 1
                  }}
                  aria-label={`${n} stars`}
                >
                  ★
                </button>
              ))}
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
              padding: '12px 24px',
              background: submitting ? '#9ca3af' : BRAND.red,
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 15,
              cursor: submitting ? 'wait' : 'pointer',
              boxShadow: submitting ? 'none' : `0 4px 14px ${BRAND.red}33`,
              transition: 'all 0.2s'
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Testimonial'}
          </button>
        </form>
      </div>

      <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
        We may use your testimonial on the website and social media. We never share your contact info.
      </p>
    </div>
  );
}
