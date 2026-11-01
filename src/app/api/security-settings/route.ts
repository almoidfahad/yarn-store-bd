import { NextResponse } from 'next/server';
import { readDBCloud } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await readDBCloud();
  return NextResponse.json({
    ok: true,
    securitySettings: db.securitySettings,
  });
}
