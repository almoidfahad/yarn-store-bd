import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, getSupabaseEnv } from '@/lib/supabase';
import { sendTransactionalEmail } from '@/lib/mailer';
import { readDBCloud, writeDBCloud, type AdminAccountRecord } from '@/lib/db';
import {
  ADMIN_OTP_COOKIE,
  ADMIN_SESSION_COOKIE,
  getVerifiedAdminFromCookieValue,
  hashAdminPassword,
  hashOtpCode,
  signHmacToken,
  verifyAdminPassword,
  verifyHmacToken,
  type AdminSessionUser,
} from '@/lib/adminSession';

export type { AdminSessionUser };

export const dynamic = 'force-dynamic';

const PROVIDER_LABELS: Record<AdminSessionUser['provider'], string> = {
  linkedin: 'LinkedIn B2B Verified',
  google: 'Google Workspace',
  facebook: 'Facebook Business',
  twitter: 'X (Twitter)',
  email: 'Admin Account + 2FA OTP',
};

interface OtpChallengePayload {
  email: string;
  name: string;
  role: string;
  provider: AdminSessionUser['provider'];
  otpDigest: string;
  purpose: 'login' | 'reset';
  exp: number;
}

async function fetchLiveSupabaseOAuthSettings(): Promise<Record<string, boolean>> {
  const sbEnv = getSupabaseEnv();
  if (!sbEnv.isValidUrl || !sbEnv.publishableKey) return {};
  try {
    const res = await fetch(`${sbEnv.url}/auth/v1/settings`, {
      headers: { apikey: sbEnv.publishableKey },
      cache: 'no-store',
    });
    if (!res.ok) return {};
    const json = await res.json();
    return (json?.external as Record<string, boolean>) || {};
  } catch {
    return {};
  }
}

async function dispatchAdminOtpEmail(params: {
  email: string;
  name: string;
  otpCode: string;
  provider: AdminSessionUser['provider'];
  purpose: 'login' | 'reset';
}): Promise<{ deliveredDirect: boolean; message: string }> {
  const { email, name, otpCode, provider, purpose } = params;
  const actionTitle = purpose === 'reset' ? 'Password Reset OTP' : 'Admin Login 2FA OTP';

  const mailRes = await sendTransactionalEmail({
    to: email,
    subject: `[${otpCode}] YARN STORE BD — ${actionTitle}`,
    trigger: `${PROVIDER_LABELS[provider]} ${actionTitle}`,
    referenceBadge: `6-Digit Security OTP: ${otpCode}`,
    heading: `Your Verification Code: ${otpCode}`,
    bodyLines: [
      `Hello <strong>${name}</strong>,`,
      purpose === 'reset'
        ? `A password reset was requested for your YARN STORE BD Admin account (<strong>${email}</strong>).`
        : `Your email &amp; password sign-in via <strong>${PROVIDER_LABELS[provider]}</strong> succeeded. Enter this 6-digit OTP to unlock the Admin Dashboard:`,
      `<strong style="font-size:22px;letter-spacing:4px;color:#08752B;">${otpCode}</strong>`,
      `This one-time verification code expires in <strong>10 minutes</strong>.`,
    ],
    ctaLabel: 'Open Admin Login',
    ctaUrl: '/admin',
  });

  if (mailRes.delivered && !mailRes.simulated) {
    return {
      deliveredDirect: true,
      message: `6-digit OTP code sent to ${email}! Please check your email inbox (or Spam folder).`,
    };
  }

  // Fallback when Resend is still on onboarding@resend.dev before custom domain (@yarnstorebd.com) verification:
  // 1) Trigger Supabase Auth native email OTP if available
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
    } catch {
      // Ignore Supabase rate-limit errors; Super Admin relay below guarantees delivery
    }
  }

  // 2) Relay OTP to the verified Super Admin security inbox so zero demo keys are ever needed
  const ownerInbox = (process.env.SALES_NOTIFICATION_EMAIL || 'almoidfahad@gmail.com').trim().toLowerCase();
  if (ownerInbox && ownerInbox !== email) {
    await sendTransactionalEmail({
      to: ownerInbox,
      subject: `[${otpCode}] Admin OTP Relay for ${email} — YARN STORE BD`,
      trigger: `Admin Security Relay (${actionTitle})`,
      referenceBadge: `Admin OTP: ${otpCode}`,
      heading: `Verification Code for ${name} (${email}): ${otpCode}`,
      bodyLines: [
        `<strong>${name}</strong> (<strong>${email}</strong>) completed password verification and requested a 6-digit OTP for YARN STORE BD Admin.`,
        `Verification Code: <strong style="font-size:22px;letter-spacing:4px;color:#08752B;">${otpCode}</strong>`,
        `<em>Note: Once @yarnstorebd.com DNS is verified in Resend, OTP emails go directly to every staff inbox automatically.</em>`,
      ],
      ctaLabel: 'Go to Admin Panel',
      ctaUrl: '/admin',
    });
  }

  return {
    deliveredDirect: false,
    message:
      ownerInbox && ownerInbox !== email
        ? `6-digit OTP sent! Check ${email} (or Super Admin security inbox ${ownerInbox} until @yarnstorebd.com domain is verified in Resend).`
        : `6-digit OTP generated for ${email}. Please check your email inbox.`,
  };
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = getVerifiedAdminFromCookieValue(token);

  const [external, db] = await Promise.all([
    fetchLiveSupabaseOAuthSettings(),
    readDBCloud(),
  ]);
  const sbEnv = getSupabaseEnv();

  return NextResponse.json({
    ok: true,
    authenticated: Boolean(session),
    user: session,
    hasRegisteredAdmins: Array.isArray(db.adminAccounts) && db.adminAccounts.length > 0,
    oauthProviders: {
      linkedin: Boolean(external.linkedin_oidc || external.linkedin),
      google: Boolean(external.google),
      facebook: Boolean(external.facebook),
      twitter: Boolean(external.twitter),
    },
    supabaseCallbackUrl: sbEnv.isValidUrl
      ? `${sbEnv.url}/auth/v1/callback`
      : 'https://your-project.supabase.co/auth/v1/callback',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    /* ------------------------------------------------------------------
     * LOGOUT (Clears v2 session + legacy v1 cookie + OTP challenge)
     * ------------------------------------------------------------------ */
    if (action === 'LOGOUT') {
      const res = NextResponse.json({ ok: true });
      res.cookies.delete(ADMIN_SESSION_COOKIE);
      res.cookies.delete('ysb_admin_session');
      res.cookies.delete(ADMIN_OTP_COOKIE);
      return res;
    }

    /* ------------------------------------------------------------------
     * STEP 1: SIGN UP (Create Admin Account in Supabase Cloud DB)
     * ------------------------------------------------------------------ */
    if (action === 'SIGN_UP') {
      const name = String(body.name || '').trim();
      const email = String(body.email || '').trim().toLowerCase();
      const role = String(body.role || 'Super Admin').trim() || 'Super Admin';
      const password = String(body.password || '');
      const confirmPassword = String(body.confirmPassword || '');
      const provider = ((body.provider as AdminSessionUser['provider']) || 'email');

      if (name.length < 2) {
        return NextResponse.json(
          { ok: false, error: 'Please enter your full name (at least 2 characters).' },
          { status: 400 }
        );
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json(
          { ok: false, error: 'Please enter a valid email address.' },
          { status: 400 }
        );
      }
      if (password.length < 6) {
        return NextResponse.json(
          { ok: false, error: 'Password must be at least 6 characters long.' },
          { status: 400 }
        );
      }
      if (password !== confirmPassword) {
        return NextResponse.json(
          { ok: false, error: 'Password and Confirm Password do not match.' },
          { status: 400 }
        );
      }

      const db = await readDBCloud();
      const existing = db.adminAccounts.find((a) => a.email === email);
      if (existing) {
        return NextResponse.json(
          {
            ok: false,
            code: 'ALREADY_EXISTS',
            error: 'An Admin account with this email is already registered. Please Sign In instead.',
          },
          { status: 409 }
        );
      }

      const { salt, hash } = hashAdminPassword(password);
      const newAccount: AdminAccountRecord = {
        id: `adm-${Date.now()}`,
        name,
        email,
        role,
        passwordSalt: salt,
        passwordHash: hash,
        provider,
        createdAt: new Date().toISOString(),
      };

      db.adminAccounts.push(newAccount);
      db.auditLogs.unshift({
        id: `aud-${Date.now()}`,
        actor: `${name} (${email})`,
        role,
        action: 'Registered new Admin account (Sign Up completed)',
        timestamp: 'Just now',
      });
      await writeDBCloud(db);

      return NextResponse.json({
        ok: true,
        email,
        message: 'Sign Up successful! Now please Login with your email & password to receive your 6-digit OTP.',
      });
    }

    /* ------------------------------------------------------------------
     * STEP 2: LOGIN WITH EMAIL + PASSWORD -> GENERATE & SEND 6-DIGIT OTP
     * ------------------------------------------------------------------ */
    if (action === 'LOGIN_REQUEST_OTP') {
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      const provider = ((body.provider as AdminSessionUser['provider']) || 'email');

      if (!email || !email.includes('@')) {
        return NextResponse.json(
          { ok: false, error: 'Please enter your registered email address.' },
          { status: 400 }
        );
      }
      if (!password) {
        return NextResponse.json(
          { ok: false, error: 'Please enter your account password.' },
          { status: 400 }
        );
      }

      const db = await readDBCloud();
      const account = db.adminAccounts.find((a) => a.email === email);
      if (!account) {
        return NextResponse.json(
          {
            ok: false,
            code: 'ACCOUNT_NOT_FOUND',
            error: 'No Admin account found for this email. Please Sign Up first!',
          },
          { status: 404 }
        );
      }

      const passwordValid = verifyAdminPassword(
        password,
        account.passwordSalt,
        account.passwordHash
      );
      if (!passwordValid) {
        return NextResponse.json(
          { ok: false, error: 'Incorrect password. Please try again.' },
          { status: 401 }
        );
      }

      const otpCode = String(crypto.randomInt(100000, 1000000));
      const challenge: OtpChallengePayload = {
        email: account.email,
        name: account.name,
        role: account.role,
        provider: provider || account.provider,
        otpDigest: hashOtpCode(account.email, otpCode),
        purpose: 'login',
        exp: Date.now() + 10 * 60 * 1000,
      };

      const dispatchInfo = await dispatchAdminOtpEmail({
        email: account.email,
        name: account.name,
        otpCode,
        provider: challenge.provider,
        purpose: 'login',
      });

      const res = NextResponse.json({
        ok: true,
        step: 'OTP_REQUIRED',
        email: account.email,
        name: account.name,
        deliveredDirect: dispatchInfo.deliveredDirect,
        message: dispatchInfo.message,
      });
      res.cookies.set(ADMIN_OTP_COOKIE, signHmacToken(challenge), {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 600,
        path: '/',
      });
      return res;
    }

    /* ------------------------------------------------------------------
     * RESEND 6-DIGIT OTP (Requires active post-password OTP challenge)
     * ------------------------------------------------------------------ */
    if (action === 'RESEND_LOGIN_OTP') {
      const otpCookie = req.cookies.get(ADMIN_OTP_COOKIE)?.value;
      const existing = verifyHmacToken<OtpChallengePayload>(otpCookie);
      if (!existing || existing.exp <= Date.now()) {
        return NextResponse.json(
          { ok: false, error: 'OTP session expired. Please Sign In with your password again.' },
          { status: 401 }
        );
      }

      const otpCode = String(crypto.randomInt(100000, 1000000));
      const updatedChallenge: OtpChallengePayload = {
        ...existing,
        otpDigest: hashOtpCode(existing.email, otpCode),
        exp: Date.now() + 10 * 60 * 1000,
      };

      const dispatchInfo = await dispatchAdminOtpEmail({
        email: existing.email,
        name: existing.name,
        otpCode,
        provider: existing.provider,
        purpose: existing.purpose,
      });

      const res = NextResponse.json({
        ok: true,
        message: `New ${dispatchInfo.message}`,
      });
      res.cookies.set(ADMIN_OTP_COOKIE, signHmacToken(updatedChallenge), {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 600,
        path: '/',
      });
      return res;
    }

    /* ------------------------------------------------------------------
     * STEP 3: VERIFY 6-DIGIT OTP & ISSUE SESSION COOKIE (NO DEMO KEYS!)
     * ------------------------------------------------------------------ */
    if (action === 'VERIFY_OTP') {
      const email = String(body.email || '').trim().toLowerCase();
      const otpCode = String(body.otpCode || '').replace(/\D/g, '');

      if (otpCode.length !== 6) {
        return NextResponse.json(
          { ok: false, error: 'Please enter the 6-digit numeric OTP code sent to your email.' },
          { status: 400 }
        );
      }

      const otpCookie = req.cookies.get(ADMIN_OTP_COOKIE)?.value;
      const challenge = verifyHmacToken<OtpChallengePayload>(otpCookie);

      if (!challenge || challenge.purpose !== 'login' || challenge.exp <= Date.now()) {
        return NextResponse.json(
          { ok: false, error: 'OTP code expired or missing. Please Login again to request a fresh OTP.' },
          { status: 401 }
        );
      }

      if (challenge.email !== email) {
        return NextResponse.json(
          { ok: false, error: 'Email mismatch for current OTP verification.' },
          { status: 401 }
        );
      }

      const expectedDigest = hashOtpCode(email, otpCode);
      let verified =
        expectedDigest.length === challenge.otpDigest.length &&
        crypto.timingSafeEqual(Buffer.from(expectedDigest), Buffer.from(challenge.otpDigest));

      // Also accept Supabase Auth's 6-digit email token if dispatched via fallback
      if (!verified) {
        const supabase = getSupabaseAdmin();
        if (supabase) {
          try {
            const { data, error } = await supabase.auth.verifyOtp({
              email,
              token: otpCode,
              type: 'email',
            });
            if (!error && data?.user) {
              verified = true;
            }
          } catch {
            // Ignore
          }
        }
      }

      if (!verified) {
        return NextResponse.json(
          { ok: false, error: 'Invalid 6-digit OTP code. Please check your email and try again.' },
          { status: 401 }
        );
      }

      const sessionUser: AdminSessionUser = {
        name: challenge.name,
        email: challenge.email,
        provider: challenge.provider,
        providerLabel: PROVIDER_LABELS[challenge.provider],
        role: challenge.role,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
        authVersion: 2,
      };

      const db = await readDBCloud();
      const acc = db.adminAccounts.find((a) => a.email === email);
      if (acc) {
        acc.lastLoginAt = new Date().toISOString();
      }
      db.auditLogs.unshift({
        id: `aud-${Date.now()}`,
        actor: `${challenge.name} (${challenge.email})`,
        role: challenge.role,
        action: `Verified 6-digit 2FA OTP & signed in via ${PROVIDER_LABELS[challenge.provider]}`,
        timestamp: 'Just now',
      });
      await writeDBCloud(db);

      const res = NextResponse.json({ ok: true, user: sessionUser });
      res.cookies.set(ADMIN_SESSION_COOKIE, signHmacToken(sessionUser), {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });
      res.cookies.delete(ADMIN_OTP_COOKIE);
      return res;
    }

    /* ------------------------------------------------------------------
     * FORGOT PASSWORD (SEND OTP + RESET PASSWORD)
     * ------------------------------------------------------------------ */
    if (action === 'FORGOT_PASSWORD_SEND_OTP') {
      const email = String(body.email || '').trim().toLowerCase();
      const db = await readDBCloud();
      const account = db.adminAccounts.find((a) => a.email === email);
      if (!account) {
        return NextResponse.json(
          { ok: false, error: 'No registered Admin account found for this email. Please Sign Up first.' },
          { status: 404 }
        );
      }

      const otpCode = String(crypto.randomInt(100000, 1000000));
      const challenge: OtpChallengePayload = {
        email: account.email,
        name: account.name,
        role: account.role,
        provider: account.provider,
        otpDigest: hashOtpCode(account.email, otpCode),
        purpose: 'reset',
        exp: Date.now() + 10 * 60 * 1000,
      };

      const dispatchInfo = await dispatchAdminOtpEmail({
        email: account.email,
        name: account.name,
        otpCode,
        provider: account.provider,
        purpose: 'reset',
      });

      const res = NextResponse.json({
        ok: true,
        message: dispatchInfo.message,
      });
      res.cookies.set(ADMIN_OTP_COOKIE, signHmacToken(challenge), {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 600,
        path: '/',
      });
      return res;
    }

    if (action === 'FORGOT_PASSWORD_RESET') {
      const email = String(body.email || '').trim().toLowerCase();
      const otpCode = String(body.otpCode || '').replace(/\D/g, '');
      const newPassword = String(body.newPassword || '');

      if (otpCode.length !== 6) {
        return NextResponse.json({ ok: false, error: 'Enter the 6-digit OTP code.' }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json(
          { ok: false, error: 'New password must be at least 6 characters.' },
          { status: 400 }
        );
      }

      const otpCookie = req.cookies.get(ADMIN_OTP_COOKIE)?.value;
      const challenge = verifyHmacToken<OtpChallengePayload>(otpCookie);
      if (
        !challenge ||
        challenge.purpose !== 'reset' ||
        challenge.email !== email ||
        challenge.exp <= Date.now() ||
        challenge.otpDigest !== hashOtpCode(email, otpCode)
      ) {
        return NextResponse.json(
          { ok: false, error: 'Invalid or expired reset OTP code.' },
          { status: 401 }
        );
      }

      const db = await readDBCloud();
      const account = db.adminAccounts.find((a) => a.email === email);
      if (!account) {
        return NextResponse.json({ ok: false, error: 'Account not found.' }, { status: 404 });
      }

      const { salt, hash } = hashAdminPassword(newPassword);
      account.passwordSalt = salt;
      account.passwordHash = hash;
      await writeDBCloud(db);

      const res = NextResponse.json({
        ok: true,
        message: 'Password updated! Please Sign In with your new password to receive a login OTP.',
      });
      res.cookies.delete(ADMIN_OTP_COOKIE);
      return res;
    }

    /* ------------------------------------------------------------------
     * SOCIAL SSO START & SUPABASE OAUTH CALLBACK
     * ------------------------------------------------------------------ */
    if (action === 'START_SOCIAL_AUTH') {
      const provider = body.provider as 'linkedin' | 'google' | 'facebook' | 'twitter';
      const external = await fetchLiveSupabaseOAuthSettings();
      const sbEnv = getSupabaseEnv();
      const origin = body.origin || process.env.NEXT_PUBLIC_SITE_URL || 'https://yarnstorebd.vercel.app';

      const supaProviderMap: Record<typeof provider, string> = {
        linkedin: external.linkedin_oidc ? 'linkedin_oidc' : 'linkedin',
        google: 'google',
        facebook: 'facebook',
        twitter: 'twitter',
      };

      const isExternalEnabled =
        provider === 'linkedin'
          ? Boolean(external.linkedin_oidc || external.linkedin)
          : Boolean(external[provider]);

      if (isExternalEnabled && sbEnv.isValidUrl) {
        const redirectTo = encodeURIComponent(`${origin}/auth/callback?provider=${provider}`);
        const oauthUrl = `${sbEnv.url}/auth/v1/authorize?provider=${supaProviderMap[provider]}&redirect_to=${redirectTo}`;
        return NextResponse.json({
          ok: true,
          mode: 'external_oauth_redirect',
          oauthUrl,
        });
      }

      return NextResponse.json({
        ok: true,
        mode: 'builtin_verified_social',
        provider,
        providerLabel: PROVIDER_LABELS[provider],
      });
    }

    if (action === 'COMPLETE_SUPABASE_OAUTH') {
      const accessToken = String(body.accessToken || '');
      const providerHint = (body.provider || 'linkedin') as AdminSessionUser['provider'];
      const supabase = getSupabaseAdmin();
      if (!supabase || !accessToken) {
        return NextResponse.json({ ok: false, error: 'Invalid OAuth callback token.' }, { status: 400 });
      }
      const { data, error } = await supabase.auth.getUser(accessToken);
      if (error || !data.user) {
        return NextResponse.json({ ok: false, error: 'Failed to verify OAuth user.' }, { status: 401 });
      }

      const email = (data.user.email || '').trim().toLowerCase();
      const db = await readDBCloud();
      const registered = db.adminAccounts.find((a) => a.email === email);
      if (!registered) {
        return NextResponse.json(
          { ok: false, error: 'Please Sign Up for an Admin account first before signing in.' },
          { status: 403 }
        );
      }

      const sessionUser: AdminSessionUser = {
        name: registered.name,
        email: registered.email,
        provider: providerHint,
        providerLabel: PROVIDER_LABELS[providerHint] || 'OAuth SSO',
        role: registered.role,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
        authVersion: 2,
      };

      const res = NextResponse.json({ ok: true, user: sessionUser });
      res.cookies.set(ADMIN_SESSION_COOKIE, signHmacToken(sessionUser), {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });
      return res;
    }

    return NextResponse.json({ ok: false, error: `Unsupported action: ${action}` }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Admin authentication error' },
      { status: 500 }
    );
  }
}
