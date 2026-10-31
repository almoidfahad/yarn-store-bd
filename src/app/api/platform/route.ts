import { NextRequest, NextResponse } from 'next/server';
import {
  readDBCloud,
  writeDBCloud,
  getComputedKpis,
  computeAiLeadScore,
  LeadStage,
  SampleStage,
  OrderStage,
  SupplyType,
} from '@/lib/db';
import { sendTransactionalEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await readDBCloud();
  return NextResponse.json({
    db,
    computedKpis: getComputedKpis(db),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body;
    const db = await readDBCloud();

    if (action === 'ADD_PRODUCT') {
      const slug =
        payload.slug ||
        String(payload.name || 'yarn-product')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      const id = `prod-${Date.now()}`;
      const supplyType: SupplyType =
        payload.supplyType === 'Supplied through Verified Manufacturing Partner'
          ? 'Supplied through Verified Manufacturing Partner'
          : 'Manufactured by YARN STORE BD';

      db.products.unshift({
        id,
        slug,
        sku: payload.sku || `YSB-${Math.floor(100 + Math.random() * 899)}`,
        name: payload.name,
        shortName: payload.shortName || payload.name,
        category: payload.category || 'Cotton Yarn',
        supplyType,
        facilityOrPartnerName:
          payload.facilityOrPartnerName ||
          (supplyType === 'Manufactured by YARN STORE BD'
            ? 'YARN STORE BD — Gazipur Ring Spinning Unit-1'
            : 'Verified Partner Mill — ISO Audited'),
        shortDescription: payload.shortDescription || `${payload.name} export-grade textile yarn from Bangladesh.`,
        overview:
          payload.overview ||
          `Commercial B2B export supply of ${payload.name} with full Uster quality inspection and international container loading.`,
        moqKg: Number(payload.moqKg) || 1000,
        monthlyCapacityMt: Number(payload.monthlyCapacityMt) || 200,
        leadTime: payload.leadTime || '12–16 Business Days',
        indicativeFobNote: 'Manager-approved FOB / CIF quotation issued upon RFQ',
        image: payload.image || '/images/prod-cotton-yarn.jpg',
        gallery: [payload.image || '/images/prod-cotton-yarn.jpg', '/images/quality-lab.jpg'],
        featured: true,
        archivedAt: null,
        highlights: [
          `Counts: ${payload.counts || 'Custom Export Counts'}`,
          `Yarn Type: ${payload.yarnType || 'Ring Spun / Filament'}`,
          `Supply: ${supplyType}`,
        ],
        spec: {
          id: `spec-${Date.now()}`,
          productId: id,
          material: payload.material || '100% Cotton / Textile Fiber',
          counts: payload.counts || 'Ne 20/1, 30/1',
          composition: payload.composition || payload.material || '100% Pure Grade',
          yarnType: payload.yarnType || 'Ring Spun',
          packaging: payload.packaging || 'Export 5-Ply Cartons on Stretch-Wrapped Pallets',
          coneWeight: payload.coneWeight || '1.89 kg / 2.08 kg Paper or Dyeing Cone',
          applications: ['Knitting', 'Weaving', 'Garments Manufacturing'],
          colorsAvailable: payload.colorsAvailable || 'Raw White, Bleached & Custom Dyed',
          qualityStandard: 'ISO 9001:2015 · OEKO-TEX® Standard 100',
          usterCsp: 'Uster Inspected Lot with CoA',
          datasheetCode: `TDS-${slug.toUpperCase()}.PDF`,
        },
      });

      db.auditLogs.unshift({
        id: `aud-${Date.now()}`,
        actor: 'Product Manager',
        role: 'Product Manager',
        action: `Added new catalog product: ${payload.name} (${supplyType})`,
        timestamp: 'Just now',
      });
    } else if (action === 'ARCHIVE_PRODUCT') {
      const prod = db.products.find((p) => p.id === payload.id);
      if (prod) {
        prod.archivedAt = prod.archivedAt ? null : new Date().toISOString();
        db.auditLogs.unshift({
          id: `aud-${Date.now()}`,
          actor: 'Admin',
          role: 'Super Admin',
          action: `${prod.archivedAt ? 'Archived' : 'Restored'} product record ${prod.sku} (${prod.name})`,
          timestamp: 'Just now',
        });
      }
    } else if (action === 'UPDATE_COMPANY_PROFILE') {
      db.companyProfile = {
        ...db.companyProfile,
        name: payload.name ?? db.companyProfile.name,
        legalSubtitle: payload.legalSubtitle ?? db.companyProfile.legalSubtitle,
        email: payload.email ?? db.companyProfile.email,
        phone: payload.phone ?? db.companyProfile.phone,
        whatsapp: payload.whatsapp ?? db.companyProfile.whatsapp,
        address: payload.address ?? db.companyProfile.address,
        factoryAddress: payload.factoryAddress ?? db.companyProfile.factoryAddress,
        ercNumber: payload.ercNumber ?? db.companyProfile.ercNumber,
      };
      db.auditLogs.unshift({
        id: `aud-${Date.now()}`,
        actor: 'Super Admin',
        role: 'Super Admin',
        action: `Updated Corporate Profile (${db.companyProfile.name} · ${db.companyProfile.email})`,
        timestamp: 'Just now',
      });
    } else if (action === 'UPDATE_LEAD_STATUS') {
      const lead = db.leads.find((l) => l.id === payload.id);
      if (lead) {
        const newStage = payload.status as LeadStage;
        lead.status = newStage;
        const badgeMap: Record<LeadStage, LeadRecordBadge> = {
          'New Lead': 'New',
          Qualified: 'Contacted',
          Contacted: 'Contacted',
          'Quotation Sent': 'Quotation',
          Negotiation: 'Negotiation',
          'Sample Stage': 'Sample',
          Won: 'Won',
          Lost: 'Lost',
        };
        lead.dashboardBadge = badgeMap[newStage] || 'Contacted';
        if (payload.note) {
          lead.notes = payload.note;
        }
        lead.activities.unshift({
          id: `act-${Date.now()}`,
          date: 'Today',
          actor: payload.actor || 'Tanvir Rahman (Sales Manager)',
          action: `Pipeline status updated to "${newStage}"${payload.note ? ` — ${payload.note}` : ''}`,
        });
      }
    } else if (action === 'CREATE_QUOTE') {
      const qNum = `YSB-QT-2026-${106 + db.quotes.length}`;
      const qty = Number(payload.quantity) || 5000;
      const uPrice = Number(payload.unitPrice) || 3.2;
      const newQuote = {
        id: `qt-${Date.now()}`,
        quoteNumber: qNum,
        rfqRef: payload.rfqRef || 'Direct CRM Quote',
        buyerCompany: payload.buyerCompany,
        buyerEmail: payload.buyerEmail || 'buyer@company.com',
        country: payload.country || 'USA',
        product: payload.product || '100% Cotton Yarn',
        specification: payload.specification || 'Export Grade · ISO & OEKO-TEX Certified',
        quantity: qty,
        unit: (payload.unit === 'MT' ? 'MT' : 'KG') as 'KG' | 'MT',
        currency: (payload.currency || 'USD') as 'USD' | 'EUR' | 'GBP',
        unitPrice: uPrice,
        totalPrice: Number((qty * uPrice).toFixed(2)),
        incoterms: payload.incoterms || 'CIF Destination Port',
        deliveryTime: payload.deliveryTime || '14 Business Days',
        paymentTerms: payload.paymentTerms || '100% Irrevocable L/C at Sight',
        validityDate: payload.validityDate || '2026-11-30',
        approvalStatus: 'Pending Manager Approval' as const,
        approvedBy: 'Awaiting Sales Manager Sign-off',
        createdAt: new Date().toISOString().slice(0, 10),
      };
      db.quotes.unshift(newQuote);
      db.notifications.unshift({
        id: `notif-${Date.now()}`,
        color: 'orange',
        title: `Draft Quote ${qNum} created for ${newQuote.buyerCompany} — awaiting Manager approval`,
        timeAgo: 'Just now',
        unread: true,
      });
      db.auditLogs.unshift({
        id: `aud-${Date.now()}`,
        actor: 'Sales Desk',
        role: 'Sales Manager',
        action: `Created Quotation ${qNum} (${newQuote.currency} ${newQuote.totalPrice.toLocaleString()})`,
        timestamp: 'Just now',
      });
    } else if (action === 'APPROVE_AND_SEND_QUOTE') {
      const qt = db.quotes.find((q) => q.id === payload.id);
      if (qt) {
        qt.approvalStatus = payload.nextStatus || 'Sent to Buyer';
        qt.approvedBy = 'Md. Habibur Rahman (Super Admin / Director)';
        const subject = `Official Quotation ${qt.quoteNumber} (${qt.product}) — ${db.companyProfile.name}`;
        const mailRes = await sendTransactionalEmail({
          to: qt.buyerEmail,
          subject,
          trigger: 'Approved PDF Quotation Sent',
          referenceBadge: `Official Quote: ${qt.quoteNumber}`,
          heading: `Commercial Quotation Approved for ${qt.buyerCompany}`,
          bodyLines: [
            `Please find your Manager-Approved export quotation for <strong>${qt.product}</strong> (${qt.specification}).`,
            `<strong>Total Commercial Value:</strong> ${qt.currency} ${qt.totalPrice.toLocaleString()} (${qt.quantity} ${qt.unit} @ ${qt.currency} ${qt.unitPrice}/${qt.unit}) · Incoterms: ${qt.incoterms}.`,
            `<strong>Payment & Validity:</strong> ${qt.paymentTerms} · Valid until ${qt.validityDate}.`,
          ],
          ctaLabel: 'View & Download PDF Quotation',
          ctaUrl: '/buyer-portal',
        });

        db.emailLogs.unshift({
          id: `em-${Date.now()}`,
          trigger: 'Approved PDF Quotation Sent',
          recipient: qt.buyerEmail,
          subject,
          status: mailRes.delivered ? 'Delivered' : 'Queued',
          sentAt: mailRes.simulated ? 'Just now (Demo)' : 'Just now (Resend)',
        });
        db.auditLogs.unshift({
          id: `aud-${Date.now()}`,
          actor: 'Md. Habibur Rahman',
          role: 'Super Admin',
          action: `Approved & dispatched PDF Quotation ${qt.quoteNumber} to ${qt.buyerCompany}`,
          timestamp: 'Just now',
        });
      }
    } else if (action === 'ACCEPT_QUOTE_CREATE_ORDER') {
      const qt = db.quotes.find((q) => q.id === payload.id);
      if (qt) {
        qt.approvalStatus = 'Accepted';
        const ordNo = `ORD-${1006 + db.orders.length}`;
        const qtyMt = qt.unit === 'MT' ? qt.quantity : Number((qt.quantity / 1000).toFixed(1));
        db.orders.unshift({
          id: `ord-${Date.now()}`,
          orderNumber: ordNo,
          quoteNumber: qt.quoteNumber,
          buyer: qt.buyerCompany,
          buyerEmail: qt.buyerEmail,
          country: qt.country,
          product: qt.product.split('—')[0].trim(),
          qtyLabel: `${qtyMt} MT`,
          qtyMt,
          totalUsd: qt.totalPrice,
          incoterms: qt.incoterms,
          workflowStage: 'Purchase Order Received',
          displayStatus: 'Confirmed',
          portOfDischarge: qt.incoterms,
          vesselOrContainer: 'Container Slot Allocation Pending',
          blNumber: 'Pending Dispatch',
          responsibleManager: 'Farhan Kabir (Operations)',
          dateLabel: 'Today',
          documents: [`Proforma Invoice PI-${ordNo}`, `Approved Quote ${qt.quoteNumber}`],
        });
        db.notifications.unshift({
          id: `notif-${Date.now()}`,
          color: 'green',
          title: `Quote ${qt.quoteNumber} accepted! Confirmed Order ${ordNo} created`,
          timeAgo: 'Just now',
          unread: true,
        });
      }
    } else if (action === 'UPDATE_SAMPLE_STAGE') {
      const smp = db.samples.find((s) => s.id === payload.id);
      if (smp) {
        smp.stage = payload.stage as SampleStage;
        if (payload.trackingNo) smp.trackingNo = payload.trackingNo;
        if (payload.feedback) smp.feedback = payload.feedback;
        if (smp.stage === 'Dispatched') {
          const subject = `Sample Cones (${smp.sampleCode}) Dispatched via ${smp.courier} — Tracking: ${smp.trackingNo}`;
          const mailRes = await sendTransactionalEmail({
            to: smp.buyerEmail,
            subject,
            trigger: 'Sample Dispatched Notification',
            referenceBadge: `${smp.courier}: ${smp.trackingNo}`,
            heading: `Your Sample Cones Are En Route!`,
            bodyLines: [
              `Sample package <strong>${smp.sampleCode}</strong> (${smp.product} · ${smp.yarnCount}) has been dispatched via ${smp.courier}.`,
              `Air Waybill / Tracking Number: <strong>${smp.trackingNo}</strong>.`,
            ],
            ctaLabel: 'Confirm Sample Receipt in Portal',
            ctaUrl: '/buyer-portal',
          });
          db.emailLogs.unshift({
            id: `em-${Date.now()}`,
            trigger: 'Sample Dispatched Notification',
            recipient: smp.buyerEmail,
            subject,
            status: mailRes.delivered ? 'Delivered' : 'Queued',
            sentAt: mailRes.simulated ? 'Just now (Demo)' : 'Just now (Resend)',
          });
        }
      }
    } else if (action === 'UPDATE_ORDER_STAGE') {
      const ord = db.orders.find((o) => o.id === payload.id);
      if (ord) {
        const st = payload.workflowStage as OrderStage;
        ord.workflowStage = st;
        if (st === 'Delivered') ord.displayStatus = 'Delivered';
        else if (st === 'Shipment') ord.displayStatus = 'Shipped';
        else if (['Production/Sourcing', 'Quality Inspection', 'Packing'].includes(st)) ord.displayStatus = 'Processing';
        else ord.displayStatus = 'Confirmed';

        if (payload.blNumber) ord.blNumber = payload.blNumber;
        const subject = `Order ${ord.orderNumber} Status Updated: ${st} — ${db.companyProfile.name}`;
        const mailRes = await sendTransactionalEmail({
          to: ord.buyerEmail,
          subject,
          trigger: 'Order Workflow Update',
          referenceBadge: `Order: ${ord.orderNumber}`,
          heading: `Export Order ${ord.orderNumber} progressed to "${st}"`,
          bodyLines: [
            `Product: <strong>${ord.product} (${ord.qtyLabel})</strong> · Terms: ${ord.incoterms}.`,
            `B/L or Vessel Reference: <strong>${ord.blNumber}</strong>.`,
          ],
          ctaLabel: 'Download Export Documents',
          ctaUrl: '/buyer-portal',
        });
        db.emailLogs.unshift({
          id: `em-${Date.now()}`,
          trigger: 'Order Workflow Update',
          recipient: ord.buyerEmail,
          subject,
          status: mailRes.delivered ? 'Delivered' : 'Queued',
          sentAt: mailRes.simulated ? 'Just now (Demo)' : 'Just now (Resend)',
        });
      }
    } else if (action === 'SEND_CUSTOM_EMAIL') {
      const mailRes = await sendTransactionalEmail({
        to: payload.recipient,
        subject: payload.subject,
        trigger: 'Sales Desk Direct Reply',
        heading: payload.subject,
        bodyLines: [String(payload.body || 'Thank you for your business partnership with YARN STORE BD.')],
        ctaLabel: 'Open Buyer Portal',
        ctaUrl: '/buyer-portal',
      });
      db.emailLogs.unshift({
        id: `em-${Date.now()}`,
        trigger: 'Sales Desk Direct Reply',
        recipient: payload.recipient,
        subject: payload.subject,
        status: mailRes.delivered ? 'Delivered' : 'Queued',
        sentAt: mailRes.simulated ? 'Just now (Demo)' : 'Just now (Resend)',
      });
    } else if (action === 'TOGGLE_CHECKLIST') {
      const list = payload.listType === 'prep' ? db.prepChecklist : db.launchChecklist;
      const item = list.find((c) => c.id === Number(payload.id));
      if (item) {
        item.completed = !item.completed;
      }
    } else if (action === 'MARK_NOTIFICATIONS_READ') {
      db.notifications.forEach((n) => {
        n.unread = false;
      });
    } else if (action === 'QUICK_CREATE_LEAD') {
      const qtyKg = Number(payload.quantityKg) || 5000;
      const ai = computeAiLeadScore({
        email: payload.email || 'buyer@importer.com',
        quantityKg: qtyKg,
        companyWebsite: payload.website,
        phone: payload.phone,
      });
      const code = String(db.leads.length + 1).padStart(3, '0');
      db.leads.unshift({
        id: `lead-${Date.now()}`,
        code,
        buyerName: payload.buyerName || 'Procurement Director',
        company: payload.company,
        country: payload.country || 'USA',
        email: payload.email || 'buyer@importer.com',
        phone: payload.phone || '+1 555 0100',
        website: payload.website || '',
        product: payload.product || 'Cotton Yarn',
        estimatedQty: `${qtyKg.toLocaleString()} KG`,
        source: payload.source || 'Direct Website',
        assignedTo: 'Tanvir Rahman (Sales Manager)',
        status: 'New Lead',
        dashboardBadge: 'New',
        aiPriority: ai.priority,
        aiScore: ai.score,
        aiReason: ai.reason,
        nextFollowUp: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
        dateLabel: 'Today',
        notes: payload.notes || 'Created via Admin Quick Action.',
        activities: [
          {
            id: `act-${Date.now()}`,
            date: 'Today',
            actor: 'Admin CRM',
            action: `Lead registered · AI Priority: ${ai.priority} (${ai.score}/100)`,
          },
        ],
      });
    }

    await writeDBCloud(db);
    return NextResponse.json({
      ok: true,
      db,
      computedKpis: getComputedKpis(db),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Unexpected server error' },
      { status: 400 }
    );
  }
}

type LeadRecordBadge = 'New' | 'Contacted' | 'Quotation' | 'Sample' | 'Negotiation' | 'Won' | 'Lost';
