import crypto from 'crypto';

export const ADMIN_SESSION_COOKIE = 'ysb_admin_session';
export const ADMIN_OTP_COOKIE = 'ysb_admin_otp';

export interface AdminSessionUser {
  name: string;
  email: string;
  provider: 'linkedin' | 'google' | 'facebook' | 'twitter' | 'email';
  providerLabel: string;
  role: string;
  exp: number;
}

function getSigningSecret(): string {
  return (
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.RESEND_API_KEY ||
    'ysb-mhr-admin-hmac-secret-2026'
  );
}

export function signHmacToken(data: object): string {
  const json = Buffer.from(JSON.stringify(data)).toString('base64url');
  const sig = crypto.createHmac('sha256', getSigningSecret()).update(json).digest('base64url');
  return `${json}.${sig}`;
}

export function verifyHmacToken<T>(token: string | undefined): T | null {
  if (!token || !token.includes('.')) return null;
  const [json, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', getSigningSecret()).update(json).digest('base64url');
  if (sig !== expected) return null;
  try {
    return JSON.parse(Buffer.from(json, 'base64url').toString('utf-8')) as T;
  } catch {
    return null;
  }
}

export function getVerifiedAdminFromCookieValue(cookieVal: string | undefined): AdminSessionUser | null {
  const session = verifyHmacToken<AdminSessionUser>(cookieVal);
  if (!session || session.exp <= Date.now()) return null;
  return session;
}
