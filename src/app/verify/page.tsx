'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * /verify is now a transparent redirect page.
 * Email confirmation is auto-handled server-side at signup; manual verification flow removed.
 * Logged-in users → /neet. Logged-out users → /login.
 */
export default function VerifyPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    router.replace(user ? '/neet' : '/login');
  }, [user, isLoading, router]);

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 12
    }}>
      <div style={{ fontSize: 14, color: '#6b7280' }}>Setting up your account...</div>
    </div>
  );
}
