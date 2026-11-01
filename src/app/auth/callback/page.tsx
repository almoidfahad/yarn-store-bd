'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [statusText, setStatusText] = useState('Verifying Social OAuth Identity with YARN STORE BD...');

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    const hashParams = new URLSearchParams(hash);
    const searchParams = new URLSearchParams(window.location.search);

    const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
    const provider = searchParams.get('provider') || 'linkedin';

    if (!accessToken) {
      setStatusText('Redirecting to Admin Login...');
      setTimeout(() => router.replace('/admin'), 900);
      return;
    }

    fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'COMPLETE_SUPABASE_OAUTH',
        accessToken,
        provider,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          router.replace('/admin');
        } else {
          setStatusText(d.error || 'OAuth verification failed. Returning to login...');
          setTimeout(() => router.replace('/admin'), 1500);
        }
      })
      .catch(() => router.replace('/admin'));
  }, [router]);

  return (
    <div className="min-h-screen bg-[#063B19] text-white flex items-center justify-center p-6">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 max-w-md w-full text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-amber-400 mx-auto" />
        <h1 className="text-xl font-extrabold">Completing Secure Sign-In</h1>
        <p className="text-xs text-emerald-100 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{statusText}</span>
        </p>
      </div>
    </div>
  );
}
