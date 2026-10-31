import { NextRequest, NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const q = String(message || '').toLowerCase();
  const db = readDB();

  let reply = '';
  let suggestedLinks: { label: string; href: string }[] = [];

  if (q.includes('price') || q.includes('cost') || q.includes('discount') || q.includes('rate') || q.includes('usd')) {
    reply =
      'As YARN STORE BD’s AI Export Advisor, I do not issue unverified prices, discounts, or binding stock commitments—raw cotton and filament indices, yarn count, cone type, and port freight (FOB Chattogram vs. CIF) determine final pricing. Please submit a 1-minute RFQ and our Sales Manager will approve and send an official PDF Quotation in USD, EUR, or GBP within 12–24 business hours.';
    suggestedLinks = [
      { label: 'Submit Official RFQ →', href: '/request-quote' },
      { label: 'Contact Export Sales Desk', href: '/contact' },
    ];
  } else if (q.includes('cotton') || q.includes('30s') || q.includes('20s') || q.includes('combed') || q.includes('carded')) {
    reply =
      'Our 100% Cotton Yarn (Manufactured by YARN STORE BD in our Gazipur Ring Spinning Unit) is available in Ne 10s, 16s, 20s, 24s, 26s, 30s, 32s, and 40s across Carded, Combed, and Compact Ring Spun grades. Commercial export MOQ starts at 1,000 KG (or 9.5 MT for 20ft FCL / 22 MT for 40ft HQ), inspected on Uster Tester 6 and OEKO-TEX® Standard 100 certified.';
    suggestedLinks = [
      { label: 'View 100% Cotton Yarn Specs', href: '/products/cotton-yarn' },
      { label: 'Request Cotton Sample Cones', href: '/request-sample' },
    ];
  } else if (q.includes('polyester') || q.includes('150d') || q.includes('75') || q.includes('300d') || q.includes('dty')) {
    reply =
      'Our 100% Polyester Yarn covers exact brochure counts 75D/36F, 150D/48F, and 300D/96F (DTY, FDY & Spun Polyester) in Semi-Dull, Bright, and Dope-Dyed finishes. For complete transparency, this line is Supplied through our Verified ISO-Certified Manufacturing Partner Mill in Bangladesh, with strict YARN STORE BD pre-shipment lab auditing and 1,000 KG MOQ.';
    suggestedLinks = [
      { label: 'View 100% Polyester Yarn', href: '/products/polyester-yarn' },
      { label: 'Quote Polyester Bulk Lot', href: '/request-quote?product=Polyester+Yarn' },
    ];
  } else if (q.includes('embroidery') || q.includes('40/2') || q.includes('60/2') || q.includes('thread') || q.includes('shade')) {
    reply =
      'Our Cotton Embroidery Thread (Manufactured by YARN STORE BD — MHR Thread & Accessories) is produced in 40/2 and 60/2 counts on 2,500m–5,000m King Spools across 480+ colorfast shades (Grade 4.5 wash fastness, OEKO-TEX Annex 6). Export MOQ starts at just 300 KG, and we provide custom Pantone® lab-dips in 72 hours.';
    suggestedLinks = [
      { label: 'Explore Embroidery Thread & Shades', href: '/products/embroidery-thread' },
      { label: 'Order Master Shade Card', href: '/request-sample' },
    ];
  } else if (q.includes('sample') || q.includes('swatch') || q.includes('cone')) {
    reply =
      'Qualified international buyers can request 2–4 physical testing cones plus our Master Shade Card. Our QA Lab prepares sample packages within 48–72 hours with an enclosed Uster/CoA report and dispatches via DHL, FedEx, or UPS.';
    suggestedLinks = [
      { label: 'Request Sample Cones →', href: '/request-sample' },
      { label: 'View Yarn Cones Specs', href: '/products/yarn-cones' },
    ];
  } else if (q.includes('ship') || q.includes('export') || q.includes('incoterm') || q.includes('fob') || q.includes('cif') || q.includes('payment')) {
    reply =
      'We export globally from Chattogram Port and Dhaka Air Cargo to the USA, UK, Germany, Turkey, UAE, Canada, and Australia under EXW, FOB, CFR, CIF, and DAP Incoterms. Standard export packs include Commercial Invoice, Packing List, Certificate of Origin (COO), Bill of Lading, ERC compliance, and Uster Test Certificates. Approved payment terms include Irrevocable L/C at Sight and T/T.';
    suggestedLinks = [
      { label: 'Export & Logistics Guide', href: '/export' },
      { label: 'Start Multi-Step RFQ', href: '/request-quote' },
    ];
  } else {
    reply = `Welcome to ${db.companyProfile.name} (${db.companyProfile.legalSubtitle})! I can help you verify yarn counts (Cotton Ne 10s–40s, Polyester 75/36, 150D/48F, 300D/96F, Embroidery Thread 40/2 & 60/2, Precision Yarn Cones), check MOQ & Supply Type (Own Manufacturing vs. Verified Partner Mills), arrange DHL/FedEx sample cones, or guide your official RFQ.`;
    suggestedLinks = [
      { label: 'Browse All Products', href: '/products' },
      { label: 'Request Official Quote →', href: '/request-quote' },
      { label: 'Speak to Human Sales Rep', href: '/contact' },
    ];
  }

  return NextResponse.json({ ok: true, reply, suggestedLinks });
}
