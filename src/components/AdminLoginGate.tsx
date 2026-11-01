'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
export interface AdminSessionUser {
  name: string;
  email: string;
  provider: 'linkedin' | 'google' | 'facebook' | 'twitter' | 'email';
  providerLabel: string;
  role: string;
  exp: number;
}

type SocialProvider = 'linkedin' | 'google' | 'facebook' | 'twitter';

const PROVIDER_META: Record<
  SocialProvider,
  {
    title: string;
    accentBg: string;
    badge: string;
    placeholderName: string;
    placeholderEmail: string;
  }
> = {
  linkedin: {
    title: 'LinkedIn B2B Executive Login',
    accentBg: 'bg-[#0A66C2]',
    badge: 'Primary Corporate SSO',
    placeholderName: 'Al Moid Fahad (Managing Director)',
    placeholderEmail: 'almoidfahad@gmail.com',
  },
  google: {
    title: 'Google Workspace Sign-In',
    accentBg: 'bg-[#1A73E8]',
    badge: 'Google Verified',
    placeholderName: 'Al Moid Fahad',
    placeholderEmail: 'almoidfahad@gmail.com',
  },
  facebook: {
    title: 'Facebook Business Suite Sign-In',
    accentBg: 'bg-[#1877F2]',
    badge: 'Meta Business',
    placeholderName: 'Al Moid Fahad',
    placeholderEmail: 'almoidfahad@gmail.com',
  },
  twitter: {
    title: 'Twitter / X Verified Sign-In',
    accentBg: 'bg-[#0F1419]',
    badge: 'X Official',
    placeholderName: 'Al Moid Fahad',
    placeholderEmail: 'almoidfahad@gmail.com',
  },
};

export function AdminLoginGate({
  onAuthenticated,
}: {
  onAuthenticated: (user: AdminSessionUser) => void;
}) {
  const [selectedProvider, setSelectedProvider] = useState<SocialProvider | null>(null);
  const [name, setName] = useState('Al Moid Fahad');
  const [email, setEmail] = useState('almoidfahad@gmail.com');
  const [passOrCode, setPassOrCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleStartSocial(provider: SocialProvider) {
    setError(null);
    setFeedback(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'START_SOCIAL_AUTH',
          provider,
          origin: typeof window !== 'undefined' ? window.location.origin : '',
        }),
      });
      const data = await res.json();
      if (data.mode === 'external_oauth_redirect' && data.oauthUrl) {
        window.location.href = data.oauthUrl;
        return;
      }
      setSelectedProvider(provider);
      setPassOrCode('');
    } catch {
      setSelectedProvider(provider);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendOtp() {
    if (!email || !email.includes('@')) {
      setError('Please enter your email address first to receive the 6-digit verification code.');
      return;
    }
    setOtpSending(true);
    setError(null);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SEND_OTP',
          email,
          provider: selectedProvider || 'email',
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setFeedback(data.message);
      } else {
        setError(data.error || 'Could not send verification code.');
      }
    } catch {
      setError('Network error while sending OTP.');
    } finally {
      setOtpSending(false);
    }
  }

  async function handleCompleteLogin(e: React.FormEvent, providerOverride?: SocialProvider | 'email') {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'COMPLETE_LOGIN',
          provider: providerOverride || selectedProvider || 'email',
          name,
          email,
          passOrCode,
        }),
      });
      const data = await res.json();
      if (data.ok && data.user) {
        onAuthenticated(data.user);
      } else {
        setError(data.error || 'Authentication failed.');
      }
    } catch {
      setError('Connection failed while verifying credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#042A12] via-[#07441F] to-[#0A5D2A] flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      {/* Decorative subtle wave */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#F28C18]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl" />

      {/* Top Back to Website Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between text-white z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Public Website
        </Link>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-400/30 text-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Anti-Screenshot &amp; SSO Protected
        </span>
      </div>

      {/* Main Centered Login Card */}
      <div className="max-w-md w-full mx-auto my-8 bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden z-10">
        {/* Top Brand Banner */}
        <div className="bg-[#063B19] px-7 py-6 text-white flex items-center justify-between border-b border-white/10">
          <BrandLogo theme="dark" />
          <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
            Admin CRM
          </span>
        </div>

        <div className="p-6 sm:p-7 space-y-5">
          {selectedProvider ? (
            /* ===============================================================
               STEP 2: WORKABLE SOCIAL IDENTITY VERIFICATION MODAL VIEW
            =============================================================== */
            <form onSubmit={(e) => handleCompleteLogin(e, selectedProvider)} className="space-y-4 text-xs">
              <button
                type="button"
                onClick={() => {
                  setSelectedProvider(null);
                  setError(null);
                  setFeedback(null);
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> All Sign-In Options
              </button>

              <div className={`${PROVIDER_META[selectedProvider].accentBg} text-white rounded-2xl p-4 space-y-1`}>
                <span className="inline-block px-2 py-0.5 rounded bg-white/20 text-[10px] font-extrabold uppercase">
                  {PROVIDER_META[selectedProvider].badge}
                </span>
                <h2 className="text-base font-extrabold">{PROVIDER_META[selectedProvider].title}</h2>
                <p className="text-[11px] text-white/85">
                  Verify your {selectedProvider.toUpperCase()} executive identity via 6-digit email OTP or Admin Master Passkey.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Executive Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={PROVIDER_META[selectedProvider].placeholderName}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {selectedProvider === 'linkedin'
                    ? 'LinkedIn Account Email'
                    : selectedProvider === 'google'
                    ? 'Google Account Email'
                    : selectedProvider === 'facebook'
                    ? 'Facebook Account Email'
                    : 'Twitter / X Account Email'}
                </label>
                <div className="flex gap-2">
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={PROVIDER_META[selectedProvider].placeholderEmail}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900"
                  />
                  <button
                    type="button"
                    disabled={otpSending}
                    onClick={handleSendOtp}
                    className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#08752B] border border-emerald-200 font-extrabold whitespace-nowrap"
                  >
                    {otpSending ? 'Sending...' : 'Send 6-Digit OTP'}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">
                    6-Digit OTP Code or Admin Passkey
                  </label>
                  <button
                    type="button"
                    onClick={() => setPassOrCode('Admin@2026')}
                    className="text-[11px] font-extrabold text-[#F28C18] hover:underline"
                  >
                    Auto-fill Demo Passkey
                  </button>
                </div>
                <input
                  required
                  type="password"
                  value={passOrCode}
                  onChange={(e) => setPassOrCode(e.target.value)}
                  placeholder="Enter 6-digit email OTP or Admin@2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900"
                />
              </div>

              {feedback && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#08752B] font-semibold flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{feedback}</span>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 ${PROVIDER_META[selectedProvider].accentBg} hover:opacity-95 transition`}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Authorize &amp; Enter Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ===============================================================
               STEP 1: MAIN SOCIAL SSO (LINKEDIN PRIMARY + GOOGLE, FB, TWITTER)
            =============================================================== */
            <>
              <div className="space-y-1">
                <h1 className="text-xl font-extrabold text-[#10371E]">
                  Executive Admin Sign-In
                </h1>
                <p className="text-xs text-slate-500">
                  Authenticate with LinkedIn (Primary B2B), Google, Facebook, Twitter/X, or Admin Credentials.
                </p>
              </div>

              {/* 1. PRIMARY FEATURED BUTTON: LINKEDIN */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleStartSocial('linkedin')}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#0A66C2] hover:bg-[#084E96] text-white font-extrabold text-sm shadow-lg shadow-blue-900/15 flex items-center justify-between transition group"
                >
                  <span className="flex items-center gap-3">
                    {/* Crisp LinkedIn SVG */}
                    <span className="w-7 h-7 rounded-lg bg-white text-[#0A66C2] flex items-center justify-center font-black text-base">
                      in
                    </span>
                    <span>Continue with LinkedIn</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wide">
                    Primary B2B
                  </span>
                </button>

                {/* 2. GOOGLE, FACEBOOK, TWITTER/X WORKABLE BUTTONS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-bold">
                  {/* Google */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleStartSocial('google')}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-slate-800 flex items-center justify-center gap-2 transition"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12s4.3 9.5 9.5 9.5c5.5 0 9.1-3.8 9.1-9.2 0-.6-.1-1.1-.2-1.6H12z"
                      />
                    </svg>
                    <span>Google</span>
                  </button>

                  {/* Facebook */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleStartSocial('facebook')}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-[#1877F2] hover:bg-blue-50/40 text-slate-800 flex items-center justify-center gap-2 transition"
                  >
                    <span className="w-4 h-4 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-black text-[11px]">
                      f
                    </span>
                    <span>Facebook</span>
                  </button>

                  {/* Twitter / X */}
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleStartSocial('twitter')}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-900 hover:bg-slate-50 text-slate-800 flex items-center justify-center gap-2 transition"
                  >
                    <span className="w-4 h-4 rounded bg-[#0F1419] text-white flex items-center justify-center font-black text-[10px]">
                      𝕏
                    </span>
                    <span>Twitter / X</span>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-slate-200" />
                <span className="flex-shrink mx-3 text-[11px] font-bold uppercase text-slate-400">
                  Or Direct Admin Access
                </span>
                <div className="flex-grow border-t border-slate-200" />
              </div>

              {/* Direct Email + Passkey / OTP Form */}
              <form onSubmit={(e) => handleCompleteLogin(e, 'email')} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Admin Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="almoidfahad@gmail.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Password or 6-Digit Email OTP</label>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpSending}
                      className="text-[11px] font-bold text-[#08752B] hover:underline"
                    >
                      {otpSending ? 'Sending OTP...' : 'Email me OTP Code'}
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      required
                      type="password"
                      value={passOrCode}
                      onChange={(e) => setPassOrCode(e.target.value)}
                      placeholder="Enter Admin@2026 or 6-digit OTP"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900"
                    />
                  </div>
                </div>

                {feedback && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#08752B] font-semibold">
                    {feedback}
                  </div>
                )}

                {error && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-semibold">
                    {error}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-[#08752B] hover:bg-[#065C22] text-white font-extrabold text-sm shadow flex items-center justify-center gap-2 transition"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{loading ? 'Signing In...' : 'Sign In to Dashboard'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('almoidfahad@gmail.com');
                      setPassOrCode('Admin@2026');
                    }}
                    title="Fill Demo Admin Credentials"
                    className="px-3 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-[11px] inline-flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F28C18]" /> Demo Key
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center text-[11px] text-emerald-200/80 z-10">
        Protected by YARN STORE BD Zero-Capture Shield · Unauthorized screenshots &amp; screen recordings are blocked.
      </div>
    </div>
  );
}
