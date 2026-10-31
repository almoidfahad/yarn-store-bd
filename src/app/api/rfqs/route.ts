import { NextRequest, NextResponse } from 'next/server';
import { readDBCloud, writeDBCloud, computeAiLeadScore, getComputedKpis } from '@/lib/db';
import { syncRfqToSupabase } from '@/lib/supabase';
import { sendTransactionalEmail } from '@/lib/mailer';
import { DEFAULT_COMPANY_CONFIG } from '@/lib/companyConfig';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await readDBCloud();
  return NextResponse.json({ rfqs: db.rfqs });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      companyName,
      companyWebsite,
      email,
      phone,
      country,
      destinationPort,
      productCategory,
      yarnCount,
      yarnType,
      quantity,
      unit,
      monthlyRequirement,
      incoterms,
      paymentPreference,
      preferredDeliveryDate,
      sampleRequired,
      specFileName,
      additionalRequirements,
    } = body;

    if (!fullName || !companyName || !email || !country || !productCategory) {
      return NextResponse.json(
        { ok: false, error: 'Please complete required buyer and product fields.' },
        { status: 400 }
      );
    }

    const db = await readDBCloud();
    const seq = String(db.rfqs.length + 1).padStart(3, '0');
    const referenceNumber = `YSB-RFQ-2026-${seq}`;

    const rawQty = Number(quantity) || 1000;
    const qtyInKg = unit === 'TON' ? rawQty * 1000 : rawQty;
    const isRepeat = db.rfqs.some((r) => r.email.toLowerCase() === String(email).toLowerCase());

    const ai = computeAiLeadScore({
      email,
      quantityKg: qtyInKg,
      companyWebsite,
      phone,
      isRepeat,
    });

    const newRfq = {
      id: `rfq-${Date.now()}`,
      referenceNumber,
      fullName: String(fullName).trim(),
      companyName: String(companyName).trim(),
      companyWebsite: String(companyWebsite || '').trim(),
      email: String(email).trim(),
      phone: String(phone || '').trim(),
      country: String(country).trim(),
      destinationPort: String(destinationPort || 'Main Port').trim(),
      productCategory: String(productCategory),
      yarnCount: String(yarnCount || 'Standard Export Count'),
      yarnType: String(yarnType || 'Ring Spun / Filament'),
      quantity: rawQty,
      unit: (['KG', 'TON', 'PCS'].includes(unit) ? unit : 'KG') as 'KG' | 'TON' | 'PCS',
      monthlyRequirement: String(monthlyRequirement || 'On Confirmation'),
      incoterms: (['EXW', 'FOB', 'CFR', 'CIF', 'DAP'].includes(incoterms) ? incoterms : 'FOB') as
        | 'EXW'
        | 'FOB'
        | 'CFR'
        | 'CIF'
        | 'DAP',
      paymentPreference: String(paymentPreference || 'Irrevocable L/C at Sight / T/T'),
      preferredDeliveryDate: String(preferredDeliveryDate || '2026-12-15'),
      sampleRequired: Boolean(sampleRequired),
      specFileName: String(specFileName || ''),
      additionalRequirements: String(additionalRequirements || ''),
      status: 'New Inquiry' as const,
      assignedTo: 'Tanvir Rahman (Sales Manager)',
      aiPriority: `${ai.priority} (${ai.score}/100)`,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    db.rfqs.unshift(newRfq);

    const leadCode = String(db.leads.length + 1).padStart(3, '0');
    db.leads.unshift({
      id: `lead-${Date.now()}`,
      code: leadCode,
      buyerName: newRfq.fullName,
      company: newRfq.companyName,
      country: newRfq.country,
      email: newRfq.email,
      phone: newRfq.phone || 'Pending Phone',
      website: newRfq.companyWebsite,
      product: newRfq.productCategory,
      estimatedQty: `${newRfq.quantity.toLocaleString()} ${newRfq.unit} (${newRfq.yarnCount})`,
      source: 'Direct Website',
      assignedTo: 'Tanvir Rahman (Sales Manager)',
      status: 'New Lead',
      dashboardBadge: 'New',
      aiPriority: ai.priority,
      aiScore: ai.score,
      aiReason: ai.reason,
      nextFollowUp: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      dateLabel: 'Today',
      notes: `RFQ ${referenceNumber} · ${newRfq.incoterms} ${newRfq.destinationPort}. ${newRfq.additionalRequirements}`,
      activities: [
        {
          id: `act-${Date.now()}-1`,
          date: 'Just now',
          actor: 'Website RFQ Engine',
          action: `Submitted ${referenceNumber} for ${newRfq.quantity.toLocaleString()} ${newRfq.unit} ${newRfq.productCategory}`,
        },
        {
          id: `act-${Date.now()}-2`,
          date: 'Just now',
          actor: 'AI Lead Scorer',
          action: `Scored ${ai.score}/100 (${ai.priority}) — ${ai.reason}`,
        },
      ],
    });

    // 1. Sync normalized rows to Supabase PostgreSQL (if configured)
    await syncRfqToSupabase({
      referenceNumber,
      fullName: newRfq.fullName,
      companyName: newRfq.companyName,
      companyWebsite: newRfq.companyWebsite,
      email: newRfq.email,
      phone: newRfq.phone,
      country: newRfq.country,
      destinationPort: newRfq.destinationPort,
      productCategory: newRfq.productCategory,
      yarnCount: newRfq.yarnCount,
      yarnType: newRfq.yarnType,
      quantity: newRfq.quantity,
      unit: newRfq.unit,
      monthlyRequirement: newRfq.monthlyRequirement,
      incoterms: newRfq.incoterms,
      paymentPreference: newRfq.paymentPreference,
      preferredDeliveryDate: newRfq.preferredDeliveryDate,
      sampleRequired: newRfq.sampleRequired,
      additionalRequirements: newRfq.additionalRequirements,
      leadCode,
      aiPriority: ai.priority,
      aiScore: ai.score,
    });

    // 2. Dispatch branded Resend emails (or Demo Sandbox log)
    const buyerSubject = `[${referenceNumber}] Quotation Request Received — ${db.companyProfile.name}`;
    const salesAlertEmail = db.companyProfile.email || DEFAULT_COMPANY_CONFIG.salesAlertEmail;
    const salesSubject = `New ${newRfq.country} RFQ [${referenceNumber}] — ${newRfq.companyName} (${newRfq.quantity} ${newRfq.unit})`;

    const [buyerMail, salesMail] = await Promise.all([
      sendTransactionalEmail({
        to: newRfq.email,
        subject: buyerSubject,
        trigger: 'New RFQ Auto-Confirmation',
        referenceBadge: `RFQ Reference: ${referenceNumber}`,
        heading: `Dear ${newRfq.fullName}, we have received your B2B quotation enquiry.`,
        bodyLines: [
          `Thank you for submitting your yarn requirement to <strong>${db.companyProfile.name} (${db.companyProfile.legalSubtitle})</strong>.`,
          `<strong>Summary:</strong> ${newRfq.productCategory} (${newRfq.yarnCount}) · Quantity: ${newRfq.quantity.toLocaleString()} ${newRfq.unit} · Terms: ${newRfq.incoterms} ${newRfq.destinationPort}, ${newRfq.country}.`,
          `Our Export Sales Manager will review mill allocation and dispatch your official Manager-Approved Quotation within 24 business hours.`,
        ],
        ctaLabel: 'Track Enquiry in Buyer Portal',
        ctaUrl: '/buyer-portal',
      }),
      sendTransactionalEmail({
        to: salesAlertEmail,
        subject: salesSubject,
        trigger: 'Sales Team Instant Alert',
        referenceBadge: `AI Priority: ${ai.priority} (${ai.score}/100)`,
        heading: `New Export RFQ from ${newRfq.companyName} (${newRfq.country})`,
        bodyLines: [
          `<strong>Buyer:</strong> ${newRfq.fullName} (${newRfq.email} · ${newRfq.phone || 'No phone'})`,
          `<strong>Product:</strong> ${newRfq.productCategory} · ${newRfq.yarnCount} · ${newRfq.quantity.toLocaleString()} ${newRfq.unit}`,
          `<strong>Incoterms & Port:</strong> ${newRfq.incoterms} ${newRfq.destinationPort} · Sample Required: ${newRfq.sampleRequired ? 'Yes' : 'No'}`,
        ],
        ctaLabel: 'Open Admin CRM Dashboard',
        ctaUrl: '/admin',
      }),
    ]);

    db.emailLogs.unshift(
      {
        id: `em-${Date.now()}-buyer`,
        trigger: 'New RFQ Auto-Confirmation',
        recipient: newRfq.email,
        subject: buyerSubject,
        status: buyerMail.delivered ? 'Delivered' : 'Queued',
        sentAt: buyerMail.simulated ? 'Just now (Demo)' : 'Just now (Resend)',
      },
      {
        id: `em-${Date.now()}-sales`,
        trigger: 'Sales Team Instant Alert',
        recipient: salesAlertEmail,
        subject: salesSubject,
        status: salesMail.delivered ? 'Delivered' : 'Queued',
        sentAt: salesMail.simulated ? 'Just now (Demo)' : 'Just now (Resend)',
      }
    );

    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      color: 'green',
      title: `New RFQ ${referenceNumber} received from ${newRfq.companyName} (${newRfq.country})`,
      timeAgo: 'Just now',
      unread: true,
    });

    await writeDBCloud(db);

    return NextResponse.json({
      ok: true,
      rfq: newRfq,
      aiScore: ai,
      computedKpis: getComputedKpis(db),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Failed to submit RFQ' },
      { status: 500 }
    );
  }
}
