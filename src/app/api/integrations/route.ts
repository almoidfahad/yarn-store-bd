import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, getSupabaseEnv, saveSnapshotToSupabase } from '@/lib/supabase';
import { isResendConfigured, sendTransactionalEmail } from '@/lib/mailer';
import { readDBCloud } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sbEnv = getSupabaseEnv();
  const resendReady = isResendConfigured();
  const isVercel = process.env.VERCEL === '1';

  return NextResponse.json({
    ok: true,
    integrations: {
      vercel: {
        active: isVercel,
        environment: process.env.VERCEL_ENV || (isVercel ? 'production' : 'local-demo-workspace'),
        region: process.env.VERCEL_REGION || 'auto',
      },
      supabase: {
        configured: sbEnv.fullyConfigured,
        hasKeys: sbEnv.hasKeys,
        urlPreview: sbEnv.isValidUrl
          ? `${sbEnv.url.slice(0, 32)}...`
          : sbEnv.hasKeys
          ? 'Publishable + Secret Keys Ready (Add NEXT_PUBLIC_SUPABASE_URL)'
          : 'Not set (Using Local/Demo Store)',
        hasServiceRole: Boolean(sbEnv.secretKey),
      },
      resend: {
        configured: resendReady,
        fromEmail:
          process.env.RESEND_FROM_EMAIL || 'YARN STORE BD Export Desk <onboarding@resend.dev>',
      },
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { action, testEmail } = await req.json();

    if (action === 'TEST_SUPABASE') {
      const sbEnv = getSupabaseEnv();
      const supabase = getSupabaseAdmin();
      if (!supabase) {
        return NextResponse.json({
          ok: false,
          message: sbEnv.hasKeys
            ? 'Supabase Publishable & Secret Keys are saved! Only NEXT_PUBLIC_SUPABASE_URL (https://<project-id>.supabase.co) is needed to complete cloud database connection.'
            : 'Supabase env vars not set yet — running cleanly in Demo Mode.',
        });
      }
      const db = await readDBCloud();
      const saved = await saveSnapshotToSupabase(db);
      const { error } = await supabase.from('products').select('id').limit(1);
      if (error) {
        return NextResponse.json({
          ok: false,
          message: `Connected to Supabase URL, but schema not migrated yet (${error.message}). Run supabase/migrations/001_yarn_store_bd_schema.sql in Supabase SQL Editor.`,
        });
      }
      return NextResponse.json({
        ok: true,
        message: `Supabase PostgreSQL connected & verified! Cloud snapshot synced (${saved ? 'OK' : 'Read-only'}).`,
      });
    }

    if (action === 'TEST_RESEND') {
      const recipient = String(
        testEmail || process.env.SALES_NOTIFICATION_EMAIL || 'almoidfahad@gmail.com'
      );
      const res = await sendTransactionalEmail({
        to: recipient,
        subject: 'YARN STORE BD — Live Resend Integration Verification',
        trigger: 'Integration Health Check',
        referenceBadge: 'Vercel + Supabase + Resend Ready',
        heading: 'Transactional Email Pipeline Verified!',
        bodyLines: [
          'Your YARN STORE BD (MHR Thread & Accessories) B2B platform email service is live and working cleanly.',
          'All RFQ confirmations, sample tracking alerts, and manager-approved PDF quotation notifications will use this branded template.',
        ],
        ctaLabel: 'Open Admin Dashboard',
        ctaUrl: '/admin',
      });
      return NextResponse.json({
        ok: res.delivered,
        simulated: res.simulated,
        message: res.simulated
          ? `Demo Sandbox verified! Email logged in CRM for ${recipient}.`
          : res.delivered
          ? `Live email dispatched via Resend to ${recipient} (ID: ${res.messageId})!`
          : `Resend error: ${res.error}`,
      });
    }

    return NextResponse.json({ ok: false, message: 'Unknown integration test action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: err instanceof Error ? err.message : 'Integration check failed' },
      { status: 500 }
    );
  }
}
