import { NextRequest, NextResponse } from 'next/server';
import { readDBCloud, writeDBCloud } from '@/lib/db';
import { syncSampleToSupabase } from '@/lib/supabase';
import { sendTransactionalEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      buyerCompany,
      buyerName,
      buyerEmail,
      phone,
      country,
      shippingAddress,
      product,
      yarnCount,
      conesCount,
      shadeCard,
      courier,
      courierAccount,
    } = body;

    if (!buyerCompany || !buyerEmail || !country || !product) {
      return NextResponse.json(
        { ok: false, error: 'Company, email, country, and product selection are required.' },
        { status: 400 }
      );
    }

    const db = await readDBCloud();
    const sampleCode = `SMP-2026-0${44 + db.samples.length}`;
    const newSample = {
      id: `smp-${Date.now()}`,
      sampleCode,
      buyerCompany: String(buyerCompany),
      buyerEmail: String(buyerEmail),
      country: String(country),
      product: String(product),
      yarnCount: String(yarnCount || 'Standard Export Count'),
      conesCount: Number(conesCount) || 2,
      shadeCard: Boolean(shadeCard),
      courier: String(courier || 'DHL Express'),
      trackingNo: courierAccount ? `Buyer Acct: ${courierAccount}` : 'Awaiting Review',
      stage: 'Request' as const,
      responsiblePerson: 'Rashedul Islam (QA Lab)',
      feedback: `Contact: ${buyerName || 'Buyer'} (${phone || ''}) · Ship to: ${shippingAddress || country}`,
      requestedDate: 'Today',
    };

    db.samples.unshift(newSample);

    await syncSampleToSupabase({
      sampleCode,
      buyerCompany: newSample.buyerCompany,
      buyerName: buyerName ? String(buyerName) : undefined,
      buyerEmail: newSample.buyerEmail,
      phone: phone ? String(phone) : undefined,
      country: newSample.country,
      product: newSample.product,
      yarnCount: newSample.yarnCount,
      conesCount: newSample.conesCount,
      shadeCard: newSample.shadeCard,
      courier: newSample.courier,
      trackingNo: newSample.trackingNo,
    });

    const subject = `[${sampleCode}] Sample Cone Request Received — ${db.companyProfile.name} QA Lab`;
    const mailRes = await sendTransactionalEmail({
      to: newSample.buyerEmail,
      subject,
      trigger: 'Sample Request Confirmation',
      referenceBadge: `Sample Code: ${sampleCode}`,
      heading: `Physical Sample Request Logged for ${newSample.buyerCompany}`,
      bodyLines: [
        `Our Quality Assurance Lab has registered your sample evaluation request for <strong>${newSample.product} (${newSample.yarnCount})</strong>.`,
        `<strong>Package:</strong> ${newSample.conesCount} cones ${newSample.shadeCard ? '+ Master Shade Card ' : ''}via ${newSample.courier}.`,
        `Once lot testing is verified, you will receive your air-waybill tracking number automatically.`,
      ],
      ctaLabel: 'Track Sample Stage in Buyer Portal',
      ctaUrl: '/buyer-portal',
    });

    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      color: 'blue',
      title: `New sample request ${sampleCode} from ${buyerCompany} (${country})`,
      timeAgo: 'Just now',
      unread: true,
    });
    db.emailLogs.unshift({
      id: `em-${Date.now()}`,
      trigger: 'Sample Request Confirmation',
      recipient: String(buyerEmail),
      subject,
      status: mailRes.delivered ? 'Delivered' : 'Queued',
      sentAt: mailRes.simulated ? 'Just now (Demo)' : 'Just now (Resend)',
    });

    await writeDBCloud(db);
    return NextResponse.json({ ok: true, sample: newSample });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Sample submission error' },
      { status: 500 }
    );
  }
}
