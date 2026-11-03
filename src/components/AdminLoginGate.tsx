'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export interface AdminSessionUser {
  name: string;
  email: string;
  provider: 'linkedin' | 'google' | 'facebook' | 'twitter' | 'email';
  providerLabel: string;
  role: string;
  exp: number;
  authVersion?: number;
}

type SocialProvider = 'linkedin' | 'google' | 'facebook' | 'twitter';
type AuthView = 'signup' | 'login' | 'otp' | 'forgot';

const ROLES = [
  'Super Admin',
  'Managing Director',
  'Sales Manager',
  'Export Manager',
  'Operations Manager',
  'Product Manager',
  'Quality Manager',
  'Finance Manager',
];

const PROVIDER_BADGES: Record<SocialProvider, { label: string; color: string }> = {
  linkedin: { label: 'LinkedIn Corporate Identity', color: 'bg-[#0A66C2] text-white' },
  google: { label: 'Google Workspace Identity', color: 'bg-[#1A73E8] text-white' },
  facebook: { label: 'Facebook Business Identity', color: 'bg-[#1877F2] text-white' },
  twitter: { label: 'Twitter / X Identity', color: 'bg-[#0F1419] text-white' },
};

export function AdminLoginGate({
  onAuthenticated,
  hasRegisteredAdmins = true,
}: {
  onAuthenticated: (user: AdminSessionUser) => void;
  hasRegisteredAdmins?: boolean;
}) {
  const [view, setView] = useState<AuthView>(hasRegisteredAdmins ? 'login' : 'signup');
  const [selectedProvider, setSelectedProvider] = useState<SocialProvider | null>(null);

  // Form fields (completely clean — NO pre-filled demo credentials or demo keys)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Super Admin');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [suggestSignUp, setSuggestSignUp] = useState(false);

  useEffect(() => {
    fetch('/api/admin-auth', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.hasRegisteredAdmins === false) {
          setView('signup');
        }
      })
      .catch(() => {});
  }, []);

  function clearAlerts() {
    setError(null);
    setFeedback(null);
    setSuggestSignUp(false);
  }

  async function handleStartSocial(provider: SocialProvider) {
    clearAlerts();
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
      setFeedback(
        `${PROVIDER_BADGES[provider].label} selected. Sign Up first if new, or Login with your password to receive your 6-digit OTP.`
      );
    } catch {
      setSelectedProvider(provider);
    } finally {
      setLoading(false);
    }
  }

  /* ----------------------------------------------------------------
   * STEP 1: SIGN UP
   * ---------------------------------------------------------------- */
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    clearAlerts();
    setLoading(true);
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SIGN_UP',
          name,
          email,
          role,
          password,
          confirmPassword,
          provider: selectedProvider || 'email',
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setPassword('');
        setConfirmPassword('');
        setView('login');
        setFeedback(
          data.message ||
            'Account created successfully! Please Login with your email & password to receive your 6-digit OTP.'
        );
      } else {
        if (data.code === 'ALREADY_EXISTS') {
          setView('login');
          setPassword('');
        }
        setError(data.error || 'Could not create account.');
      }
    } catch {
      setError('Network error while creating account.');
    } finally {
      setLoading(false);
    }
  }

  /* ----------------------------------------------------------------
   * STEP 2: LOGIN WITH EMAIL + PASSWORD -> REQUEST 6-DIGIT OTP
   * ---------------------------------------------------------------- */
  async function handleLoginRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    clearAlerts();
    setLoading(true);
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'LOGIN_REQUEST_OTP',
          email,
          password,
          provider: selectedProvider || 'email',
        }),
      });
      const data = await res.json();
      if (data.ok && data.step === 'OTP_REQUIRED') {
        setOtpCode('');
        setView('otp');
        setFeedback(data.message);
      } else {
        if (data.code === 'ACCOUNT_NOT_FOUND') {
          setSuggestSignUp(true);
        }
        setError(data.error || 'Login failed.');
      }
    } catch {
      setError('Connection failed while verifying password.');
    } finally {
      setLoading(false);
    }
  }

  /* ----------------------------------------------------------------
   * STEP 3: VERIFY 6-DIGIT OTP -> ENTER ADMIN DASHBOARD
   * ---------------------------------------------------------------- */
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    clearAlerts();
    setLoading(true);
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'VERIFY_OTP',
          email,
          otpCode,
        }),
      });
      const data = await res.json();
      if (data.ok && data.user) {
        onAuthenticated(data.user);
      } else {
        setError(data.error || 'Invalid 6-digit OTP code.');
      }
    } catch {
      setError('Connection error while verifying OTP.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    clearAlerts();
    setResending(true);
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RESEND_LOGIN_OTP' }),
      });
      const data = await res.json();
      if (data.ok) {
        setFeedback(data.message || 'A fresh 6-digit OTP has been sent to your email.');
      } else {
        setError(data.error || 'Could not resend OTP. Please Login again.');
      }
    } catch {
      setError('Network error while resending OTP.');
    } finally {
      setResending(false);
    }
  }

  /* ----------------------------------------------------------------
   * FORGOT PASSWORD (OTP RESET)
   * ---------------------------------------------------------------- */
  async function handleForgotSendOtp(e: React.FormEvent) {
    e.preventDefault();
    clearAlerts();
    setLoading(true);
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'FORGOT_PASSWORD_SEND_OTP', email }),
      });
      const data = await res.json();
      if (data.ok) {
        setResetSent(true);
        setOtpCode('');
        setPassword('');
        setFeedback(data.message);
      } else {
        setError(data.error || 'Could not send password reset OTP.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotConfirmReset(e: React.FormEvent) {
    e.preventDefault();
    clearAlerts();
    setLoading(true);
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'FORGOT_PASSWORD_RESET',
          email,
          otpCode,
          newPassword: password,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setResetSent(false);
        setPassword('');
        setOtpCode('');
        setView('login');
        setFeedback(data.message);
      } else {
        setError(data.error || 'Password reset failed.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#042A12] via-[#07441F] to-[#0A5D2A] flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#F28C18]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl" />

      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between text-white z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Public Website
        </Link>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-400/30 text-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> 2FA OTP &amp; Anti-Capture Protected
        </span>
      </div>

      {/* Main Centered Auth Card */}
      <div className="max-w-md w-full mx-auto my-6 bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden z-10">
        {/* Brand Header */}
        <div className="bg-[#063B19] px-7 py-5 text-white flex items-center justify-between border-b border-white/10">
          <BrandLogo theme="dark" />
          <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider">
            Admin 2FA
          </span>
        </div>

        {/* 3-Step Security Progress Bar */}
        <div className="bg-[#F4FAF6] px-6 py-2.5 border-b border-emerald-100 flex items-center justify-between text-[11px] font-extrabold">
          <span
            className={`flex items-center gap-1 ${
              view === 'signup' ? 'text-[#08752B]' : 'text-slate-400'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                view === 'signup' ? 'bg-[#08752B] text-white' : 'bg-emerald-100 text-[#08752B]'
              }`}
            >
              1
            </span>
            Sign Up
          </span>
          <span className="text-slate-300">→</span>
          <span
            className={`flex items-center gap-1 ${
              view === 'login' ? 'text-[#08752B]' : 'text-slate-400'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                view === 'login' ? 'bg-[#08752B] text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </span>
            Login
          </span>
          <span className="text-slate-300">→</span>
          <span
            className={`flex items-center gap-1 ${
              view === 'otp' ? 'text-[#F28C18]' : 'text-slate-400'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                view === 'otp' ? 'bg-[#F28C18] text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </span>
            6-Digit OTP
          </span>
        </div>

        <div className="p-6 sm:p-7 space-y-4">
          {/* Login / Sign Up Switcher Tabs (shown unless on OTP or Forgot view) */}
          {(view === 'login' || view === 'signup') && (
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 text-xs font-extrabold">
              <button
                type="button"
                onClick={() => {
                  clearAlerts();
                  setView('login');
                }}
                className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition ${
                  view === 'login'
                    ? 'bg-[#08752B] text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" /> Login
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAlerts();
                  setView('signup');
                }}
                className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition ${
                  view === 'signup'
                    ? 'bg-[#08752B] text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" /> Sign Up
              </button>
            </div>
          )}

          {/* Selected Social Provider Pill */}
          {selectedProvider && (view === 'login' || view === 'signup') && (
            <div
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between ${PROVIDER_BADGES[selectedProvider].color}`}
            >
              <span>{PROVIDER_BADGES[selectedProvider].label}</span>
              <button
                type="button"
                onClick={() => setSelectedProvider(null)}
                className="text-[10px] underline opacity-90 hover:opacity-100"
              >
                Clear
              </button>
            </div>
          )}

          {/* Feedback & Error Banners */}
          {feedback && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#08752B] text-xs font-semibold flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{feedback}</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold space-y-2">
              <div>{error}</div>
              {suggestSignUp && (
                <button
                  type="button"
                  onClick={() => {
                    clearAlerts();
                    setView('signup');
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#08752B] text-white text-[11px] font-extrabold"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Create Admin Account (Sign Up) →
                </button>
              )}
            </div>
          )}

          {/* =================================================================
              VIEW 1: SIGN UP (CREATE ADMIN ACCOUNT)
          ================================================================= */}
          {view === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
              <div>
                <h1 className="text-lg font-extrabold text-[#10371E]">Create Admin Account</h1>
                <p className="text-[11px] text-slate-500">
                  Step 1: Register your Admin account first. After Sign Up, you will Login and verify via 6-digit email OTP.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Admin Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Admin Role / Designation</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900 bg-white"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Create Password</label>
                  <div className="relative">
                    <input
                      required
                      minLength={6}
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Confirm Password</label>
                  <input
                    required
                    minLength={6}
                    type={showPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#08752B] hover:bg-[#065C22] text-white font-extrabold text-sm shadow flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up &amp; Continue to Login</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* =================================================================
              VIEW 2: LOGIN (EMAIL + PASSWORD -> SENDS 6-DIGIT OTP)
          ================================================================= */}
          {view === 'login' && (
            <>
              <div className="space-y-1">
                <h1 className="text-lg font-extrabold text-[#10371E]">Admin Sign-In</h1>
                <p className="text-[11px] text-slate-500">
                  Step 2: Sign in with your registered email &amp; password to receive your mandatory 6-digit OTP code.
                </p>
              </div>

              <form onSubmit={handleLoginRequestOtp} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Registered Admin Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Account Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        clearAlerts();
                        setResetSent(false);
                        setView('forgot');
                      }}
                      className="text-[11px] font-bold text-[#08752B] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      required
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#08752B] hover:bg-[#065C22] text-white font-extrabold text-sm shadow flex items-center justify-center gap-2 transition"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Login &amp; Send 6-Digit OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Corporate Social Identity Options */}
              <div className="relative flex items-center py-0.5">
                <div className="flex-grow border-t border-slate-200" />
                <span className="flex-shrink mx-3 text-[10px] font-bold uppercase text-slate-400">
                  Or Corporate SSO Identity
                </span>
                <div className="flex-grow border-t border-slate-200" />
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleStartSocial('linkedin')}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0A66C2] hover:bg-[#084E96] text-white font-extrabold text-xs shadow flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-white text-[#0A66C2] flex items-center justify-center font-black text-sm">
                      in
                    </span>
                    <span>Continue with LinkedIn</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-extrabold uppercase">
                    Primary B2B
                  </span>
                </button>

                <div className="grid grid-cols-3 gap-2 text-[11px] font-bold">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleStartSocial('google')}
                    className="py-2 px-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 text-slate-800 flex items-center justify-center gap-1.5 transition"
                  >
                    <span className="font-black text-[#EA4335]">G</span>
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleStartSocial('facebook')}
                    className="py-2 px-2.5 rounded-xl border border-slate-200 hover:border-[#1877F2] text-slate-800 flex items-center justify-center gap-1.5 transition"
                  >
                    <span className="w-4 h-4 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-black text-[10px]">
                      f
                    </span>
                    <span>Facebook</span>
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleStartSocial('twitter')}
                    className="py-2 px-2.5 rounded-xl border border-slate-200 hover:border-slate-900 text-slate-800 flex items-center justify-center gap-1.5 transition"
                  >
                    <span className="w-4 h-4 rounded bg-[#0F1419] text-white flex items-center justify-center font-black text-[9px]">
                      𝕏
                    </span>
                    <span>Twitter</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* =================================================================
              VIEW 3: MANDATORY 6-DIGIT OTP VERIFICATION
          ================================================================= */}
          {view === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
              <button
                type="button"
                onClick={() => {
                  clearAlerts();
                  setView('login');
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </button>

              <div className="bg-[#063B19] text-white rounded-2xl p-4 space-y-1">
                <span className="inline-block px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase">
                  Step 3 · Mandatory 2FA OTP
                </span>
                <h2 className="text-base font-extrabold">Enter 6-Digit Email OTP</h2>
                <p className="text-[11px] text-emerald-100">
                  Enter the 6-digit verification code sent for <strong>{email}</strong> to access the Admin Dashboard.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5">
                  6-Digit Verification Code
                </label>
                <input
                  required
                  inputMode="numeric"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full px-4 py-3 rounded-xl border-2 border-emerald-300 focus:border-[#08752B] outline-none text-center text-xl font-black tracking-[0.45em] text-[#063B19]"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full py-3 rounded-xl bg-[#F28C18] hover:bg-[#DF7A0B] disabled:opacity-50 text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify OTP &amp; Enter Dashboard</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">Didn&apos;t receive the code?</span>
                <button
                  type="button"
                  disabled={resending}
                  onClick={handleResendOtp}
                  className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#08752B] hover:underline"
                >
                  <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
                  <span>{resending ? 'Sending...' : 'Resend 6-Digit OTP'}</span>
                </button>
              </div>
            </form>
          )}

          {/* =================================================================
              VIEW 4: FORGOT PASSWORD (RESET WITH EMAIL OTP)
          ================================================================= */}
          {view === 'forgot' && (
            <div className="space-y-4 text-xs">
              <button
                type="button"
                onClick={() => {
                  clearAlerts();
                  setView('login');
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </button>

              <div>
                <h2 className="text-base font-extrabold text-[#10371E]">Reset Admin Password</h2>
                <p className="text-[11px] text-slate-500">
                  Verify your registered email with a 6-digit OTP to set a new password.
                </p>
              </div>

              {!resetSent ? (
                <form onSubmit={handleForgotSendOtp} className="space-y-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Registered Email</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-[#08752B] text-white font-extrabold text-xs"
                  >
                    {loading ? 'Sending Reset OTP...' : 'Send Password Reset OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleForgotConfirmReset} className="space-y-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">6-Digit OTP Code</label>
                    <input
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-extrabold text-center tracking-widest text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">New Password</label>
                    <input
                      required
                      minLength={6}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-[#F28C18] text-white font-extrabold text-xs"
                  >
                    {loading ? 'Updating Password...' : 'Save New Password & Go to Login'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-emerald-200/80 z-10">
        Protected by YARN STORE BD 2FA OTP &amp; Zero-Capture Shield · Unauthorized access is strictly blocked.
      </div>
    </div>
  );
}
