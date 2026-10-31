import { NextRequest, NextResponse } from 'next/server';
import { readDBCloud, writeDBCloud, computeAiLeadScore } from '@/lib/db';
import { sendTransactionalEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, company, email, phone, country, subject, message, inquiryType } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: 'Name, email, and message are required.' }, { status: 400 });
    }

    const db = await readDBCloud();
    const ai = computeAiLeadScore({
      email,
      quantityKg: 2000,
      phone,
    });

    const code = String(db.leads.length + 1).padStart(3, '0');
    const reference = `YSB-MSG-2026-${code}`;

    db.leads.unshift({
      id: `lead-${Date.now()}`,
      code,
      buyerName: String(name),
      company: String(company || 'International Buyer'),
      country: String(country || 'International'),
      email: String(email),
      phone: String(phone || 'Not provided'),
      product: String(inquiryType || 'General Export Enquiry'),
      estimatedQty: 'Contact Form Inquiry',
      source: 'Direct Website',
      assignedTo: 'Nusrat Jahan (Export Executive)',
      status: 'New Lead',
      dashboardBadge: 'New',
      aiPriority: ai.priority,
      aiScore: ai.score,
      aiReason: ai.reason,
      nextFollowUp: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      dateLabel: 'Today',
      notes: `${subject || 'Website Contact'}: ${message}`,
      activities: [
        {
          id: `act-${Date.now()}`,
          date: 'Just now',
          actor: 'Contact Desk',
          action: `Message received: "${String(subject || inquiryType || 'Enquiry')}"`,
        },
      ],
    });

    const mailSubject = `[${reference}] Thank you for contacting ${db.companyProfile.name}`;
    const mailRes = await sendTransactionalEmail({
      to: String(email),
      subject: mailSubject,
      trigger: 'Contact Auto-Acknowledgement',
      referenceBadge: `Ticket: ${reference}`,
      heading: `Hello ${name}, our Export Desk has received your message.`,
      bodyLines: [
        `Thank you for reaching out to <strong>${db.companyProfile.name} (${db.companyProfile.legalSubtitle})</strong>.`,
        `An Export Sales Executive has been assigned to your enquiry ("${subject || inquiryType || 'Export Inquiry'}") and will respond promptly.`,
      ],
      ctaLabel: 'Explore Export Yarn Catalog',
      ctaUrl: '/products',
    });

    db.emailLogs.unshift({
      id: `em-${Date.now()}`,
      trigger: 'Contact Auto-Acknowledgement',
      recipient: String(email),
      subject: mailSubject,
      status: mailRes.delivered ? 'Delivered' : 'Queued',
      sentAt: mailRes.simulated ? 'Just now (Demo)' : 'Just now (Resend)',
    });

    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      color: 'green',
      title: `New Contact Message from ${company || name} (${country || 'Global'})`,
      timeAgo: 'Just now',
      unread: true,
    });

    await writeDBCloud(db);
    return NextResponse.json({ ok: true, reference });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
