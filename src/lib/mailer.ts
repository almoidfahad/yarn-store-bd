import { Resend } from 'resend';
import { DEFAULT_COMPANY_CONFIG } from '@/lib/companyConfig';
import { syncEmailLogToSupabase } from '@/lib/supabase';

export function isResendConfigured(): boolean {
  const key = process.env.RESEND_API_KEY;
  return Boolean(key && key.startsWith('re_'));
}

export interface SendTransactionalEmailInput {
  to: string;
  subject: string;
  trigger: string;
  heading: string;
  bodyLines: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  referenceBadge?: string;
}

export interface SendTransactionalEmailResult {
  delivered: boolean;
  simulated: boolean;
  provider: string;
  messageId?: string;
  error?: string;
}

function buildBrandedHtml(input: SendTransactionalEmailInput): string {
  const siteUrl = DEFAULT_COMPANY_CONFIG.websiteUrl.replace(/\/$/, '');
  const ctaHref = input.ctaUrl ? (input.ctaUrl.startsWith('http') ? input.ctaUrl : `${siteUrl}${input.ctaUrl}`) : `${siteUrl}/buyer-portal`;
  const paragraphs = input.bodyLines
    .map(
      (line) =>
        `<p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#334155;">${line}</p>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:24px;background-color:#F3F7F4;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #DCE8DF;">
    <tr>
      <td style="background:linear-gradient(90deg,#063B19,#08752B);padding:22px 28px;color:#FFFFFF;">
        <div style="font-size:20px;font-weight:800;letter-spacing:0.4px;">${DEFAULT_COMPANY_CONFIG.brandName}</div>
        <div style="font-size:11px;font-weight:700;color:#F6AD49;letter-spacing:1.2px;margin-top:2px;">${DEFAULT_COMPANY_CONFIG.subBrand}</div>
      </td>
    </tr>
    <tr>
      <td style="padding:28px;">
        ${
          input.referenceBadge
            ? `<div style="display:inline-block;padding:5px 12px;border-radius:999px;background:#ECF7EE;color:#08752B;font-size:12px;font-weight:700;margin-bottom:14px;">${input.referenceBadge}</div>`
            : ''
        }
        <h1 style="margin:0 0 16px 0;font-size:20px;color:#10371E;">${input.heading}</h1>
        ${paragraphs}
        ${
          input.ctaLabel
            ? `<div style="margin:24px 0 10px 0;">
                <a href="${ctaHref}" style="display:inline-block;padding:12px 24px;border-radius:999px;background:#F28C18;color:#FFFFFF;text-decoration:none;font-size:13px;font-weight:700;">${input.ctaLabel} →</a>
               </div>`
            : ''
        }
      </td>
    </tr>
    <tr>
      <td style="padding:18px 28px;background:#063B19;color:#D1FAE5;font-size:12px;line-height:1.6;">
        <strong>${DEFAULT_COMPANY_CONFIG.brandName} — Export Sales Desk</strong><br/>
        ${DEFAULT_COMPANY_CONFIG.headOfficeAddress}<br/>
        WhatsApp / Hotline: ${DEFAULT_COMPANY_CONFIG.phoneDisplay} · Email: ${DEFAULT_COMPANY_CONFIG.officialEmail}
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Sends a branded transactional B2B email via Resend when `RESEND_API_KEY` is configured,
 * and gracefully logs in Demo Sandbox mode when running with demo settings.
 */
export async function sendTransactionalEmail(
  input: SendTransactionalEmailInput
): Promise<SendTransactionalEmailResult> {
  const fromAddress =
    process.env.RESEND_FROM_EMAIL ||
    'YARN STORE BD Export Desk <onboarding@resend.dev>';

  if (!isResendConfigured()) {
    await syncEmailLogToSupabase({
      trigger: input.trigger,
      recipient: input.to,
      subject: input.subject,
      status: 'Simulated (Demo Mode)',
      provider: 'Demo Sandbox',
    });
    return {
      delivered: true,
      simulated: true,
      provider: 'Demo Sandbox (Add RESEND_API_KEY for live email)',
    };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const html = buildBrandedHtml(input);
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [input.to],
      subject: input.subject,
      html,
    });

    if (error) {
      await syncEmailLogToSupabase({
        trigger: input.trigger,
        recipient: input.to,
        subject: input.subject,
        status: `Error: ${error.message}`,
        provider: 'Resend',
      });
      return {
        delivered: false,
        simulated: false,
        provider: 'Resend',
        error: error.message,
      };
    }

    await syncEmailLogToSupabase({
      trigger: input.trigger,
      recipient: input.to,
      subject: input.subject,
      status: 'Delivered',
      provider: 'Resend',
    });

    return {
      delivered: true,
      simulated: false,
      provider: 'Resend Cloud',
      messageId: data?.id,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Resend dispatch error';
    return {
      delivered: false,
      simulated: false,
      provider: 'Resend',
      error: msg,
    };
  }
}
