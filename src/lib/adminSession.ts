import crypto from 'crypto';

// Bumped cookie names to v2 so any old demo-passkey session is immediately invalidated
export const ADMIN_SESSION_COOKIE = 'ysb_admin_session_v2';
export const ADMIN_OTP_COOKIE = 'ysb_admin_otp_v2';

export interface AdminSessionUser {
  name: string;
  email: string;
  provider: 'linkedin' | 'google' | 'facebook' | 'twitter' | 'email';
  providerLabel: string;
  role: string;
  exp: number;
  authVersion?: number;
}

function getSigningSecret(): string {
  return (
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.RESEND_API_KEY ||
    'ysb-mhr-admin-hmac-secret-2026-v2'
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
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    return JSON.parse(Buffer.from(json, 'base64url').toString('utf-8')) as T;
  } catch {
    return null;
  }
}

export function hashAdminPassword(password: string): { salt: string; hash: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

export function verifyAdminPassword(password: string, salt: string, storedHash: string): boolean {
  if (!password || !salt || !storedHash) return false;
  const computed = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(storedHash, 'hex');
  if (computed.length !== expected.length) return false;
  return crypto.timingSafeEqual(computed, expected);
}

export function hashOtpCode(email: string, otpCode: string): string {
  return crypto
    .createHmac('sha256', getSigningSecret())
    .update(`${email.trim().toLowerCase()}:${otpCode.trim()}`)
    .digest('hex');
}

export function getVerifiedAdminFromCookieValue(cookieVal: string | undefined): AdminSessionUser | null {
  const session = verifyHmacToken<AdminSessionUser>(cookieVal);
  if (!session || session.exp <= Date.now() || session.authVersion !== 2) return null;
  return session;
}
