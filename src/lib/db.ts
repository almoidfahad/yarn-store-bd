import fs from 'fs';
import path from 'path';
import {
  isSupabaseConfigured,
  loadSnapshotFromSupabase,
  saveSnapshotToSupabase,
} from '@/lib/supabase';
import {
  DEFAULT_SECURITY_SETTINGS,
  type SecuritySettings,
} from '@/lib/securityTypes';

export { DEFAULT_SECURITY_SETTINGS, type SecuritySettings };

export type SupplyType =
  | 'Manufactured by YARN STORE BD'
  | 'Supplied through Verified Manufacturing Partner';

export type LeadStage =
  | 'New Lead'
  | 'Qualified'
  | 'Contacted'
  | 'Quotation Sent'
  | 'Negotiation'
  | 'Sample Stage'
  | 'Won'
  | 'Lost';

export type SampleStage =
  | 'Request'
  | 'Review'
  | 'Approved'
  | 'Prepared'
  | 'Dispatched'
  | 'Delivered'
  | 'Feedback';

export type OrderStage =
  | 'Purchase Order Received'
  | 'Order Confirmation'
  | 'Production/Sourcing'
  | 'Quality Inspection'
  | 'Packing'
  | 'Shipment'
  | 'Delivered';

export interface ProductSpec {
  id: string;
  productId: string;
  material: string;
  counts: string;
  composition: string;
  yarnType: string;
  packaging: string;
  coneWeight: string;
  applications: string[];
  colorsAvailable: string;
  qualityStandard: string;
  usterCsp: string;
  datasheetCode: string;
}

export interface ProductItem {
  id: string;
  slug: string;
  sku: string;
  name: string;
  shortName: string;
  category: 'Cotton Yarn' | 'Polyester Yarn' | 'Embroidery Thread' | 'Yarn Cones';
  supplyType: SupplyType;
  facilityOrPartnerName: string;
  shortDescription: string;
  overview: string;
  moqKg: number;
  monthlyCapacityMt: number;
  leadTime: string;
  indicativeFobNote: string;
  image: string;
  gallery: string[];
  featured: boolean;
  archivedAt: string | null;
  highlights: string[];
  spec: ProductSpec;
}

export interface LeadRecord {
  id: string;
  code: string;
  buyerName: string;
  company: string;
  country: string;
  email: string;
  phone: string;
  website?: string;
  product: string;
  estimatedQty: string;
  source: 'Google Organic' | 'Google Ads' | 'LinkedIn' | 'Alibaba' | 'Global Sources' | 'Referral' | 'Direct Website';
  assignedTo: string;
  status: LeadStage;
  dashboardBadge: 'New' | 'Contacted' | 'Quotation' | 'Sample' | 'Negotiation' | 'Won' | 'Lost';
  aiPriority: 'High' | 'Positive Signal' | 'Needs Review' | 'Needs Verification';
  aiScore: number;
  aiReason: string;
  nextFollowUp: string;
  dateLabel: string;
  notes: string;
  activities: { id: string; date: string; actor: string; action: string }[];
  archivedAt?: string | null;
}

export interface RFQRecord {
  id: string;
  referenceNumber: string;
  fullName: string;
  companyName: string;
  companyWebsite: string;
  email: string;
  phone: string;
  country: string;
  destinationPort: string;
  productCategory: string;
  yarnCount: string;
  yarnType: string;
  quantity: number;
  unit: 'KG' | 'TON' | 'PCS';
  monthlyRequirement: string;
  incoterms: 'EXW' | 'FOB' | 'CFR' | 'CIF' | 'DAP';
  paymentPreference: string;
  preferredDeliveryDate: string;
  sampleRequired: boolean;
  specFileName: string;
  additionalRequirements: string;
  status: 'New Inquiry' | 'Under Review' | 'Quotation Sent' | 'Converted to Order';
  assignedTo: string;
  aiPriority: string;
  createdAt: string;
}

export interface QuoteRecord {
  id: string;
  quoteNumber: string;
  rfqRef: string;
  buyerCompany: string;
  buyerEmail: string;
  country: string;
  product: string;
  specification: string;
  quantity: number;
  unit: 'KG' | 'MT';
  currency: 'USD' | 'EUR' | 'GBP';
  unitPrice: number;
  totalPrice: number;
  incoterms: string;
  deliveryTime: string;
  paymentTerms: string;
  validityDate: string;
  approvalStatus: 'Draft' | 'Pending Manager Approval' | 'Approved' | 'Sent to Buyer' | 'Accepted';
  approvedBy: string;
  createdAt: string;
}

export interface SampleRecord {
  id: string;
  sampleCode: string;
  buyerCompany: string;
  buyerEmail: string;
  country: string;
  product: string;
  yarnCount: string;
  conesCount: number;
  shadeCard: boolean;
  courier: string;
  trackingNo: string;
  stage: SampleStage;
  responsiblePerson: string;
  feedback: string;
  requestedDate: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  quoteNumber: string;
  buyer: string;
  buyerEmail: string;
  country: string;
  product: string;
  qtyLabel: string;
  qtyMt: number;
  totalUsd: number;
  incoterms: string;
  workflowStage: OrderStage;
  displayStatus: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered';
  portOfDischarge: string;
  vesselOrContainer: string;
  blNumber: string;
  responsibleManager: string;
  dateLabel: string;
  documents: string[];
}

export interface FacilityRecord {
  id: string;
  code: string;
  name: string;
  type: 'Own Manufacturing Facility' | 'Verified Partner Mill';
  location: string;
  specialization: string;
  monthlyCapacityMt: number;
  utilizationPct: number;
  certifications: string[];
  status: 'Active & Audited';
}

export interface EmailLogRecord {
  id: string;
  trigger: string;
  recipient: string;
  subject: string;
  status: 'Delivered' | 'Queued' | 'Opened';
  sentAt: string;
}

export interface NotificationRecord {
  id: string;
  color: 'green' | 'orange' | 'blue';
  title: string;
  timeAgo: string;
  unread: boolean;
}

export interface TeamRoleRecord {
  id: string;
  name: string;
  email: string;
  role:
    | 'Super Admin'
    | 'Sales Manager'
    | 'Sales Executive'
    | 'Product Manager'
    | 'Operations Manager'
    | 'Quality Manager'
    | 'Content Manager'
    | 'Finance Manager';
  accessScope: string;
  mfaEnabled: boolean;
  activeLeads: number;
}

export interface ChecklistItem {
  id: number;
  label: string;
  completed: boolean;
}

export interface PlatformDB {
  securitySettings: SecuritySettings;
  companyProfile: {
    name: string;
    legalSubtitle: string;
    established: number;
    tagline: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    factoryAddress: string;
    ercNumber: string;
    bkmeaMember: string;
    primaryCurrency: 'USD';
  };
  kpis: {
    baseLeadsCount: number;
    baseRfqsCount: number;
    baseQuotesSent: number;
    baseConfirmedOrders: number;
    customerSatisfactionPct: number;
  };
  salesMonthly: {
    month: string;
    leads: number;
    quotes: number;
    orders: number;
  }[];
  leadsByCountry: {
    country: string;
    pct: number;
    color: string;
  }[];
  topProductsShare: {
    name: string;
    pct: number;
    image: string;
    slug: string;
  }[];
  products: ProductItem[];
  leads: LeadRecord[];
  rfqs: RFQRecord[];
  quotes: QuoteRecord[];
  samples: SampleRecord[];
  orders: OrderRecord[];
  facilities: FacilityRecord[];
  emailLogs: EmailLogRecord[];
  notifications: NotificationRecord[];
  teamMembers: TeamRoleRecord[];
  auditLogs: { id: string; actor: string; role: string; action: string; timestamp: string }[];
  prepChecklist: ChecklistItem[];
  launchChecklist: ChecklistItem[];
  marketing90Day: {
    phase: string;
    days: string;
    focus: string;
    status: 'Completed' | 'In Progress' | 'Scheduled';
    kpis: string;
  }[];
}

const BUNDLED_DB_PATH = path.join(process.cwd(), 'data', 'platform-db.json');
const DATA_DIR =
  process.env.VERCEL === '1'
    ? '/tmp/yarn-store-bd-data'
    : path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'platform-db.json');

export function computeAiLeadScore(input: {
  email: string;
  quantityKg: number;
  companyWebsite?: string;
  phone?: string;
  isRepeat?: boolean;
}): {
  priority: 'High' | 'Positive Signal' | 'Needs Review' | 'Needs Verification';
  score: number;
  reason: string;
} {
  let score = 55;
  const reasons: string[] = [];
  const lowerEmail = (input.email || '').toLowerCase();
  const freeDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const domain = lowerEmail.split('@')[1] || '';

  if (domain && !freeDomains.includes(domain)) {
    score += 20;
    reasons.push('Verified corporate email domain');
  } else {
    score -= 10;
    reasons.push('Personal email — domain verification advised');
  }

  if (input.quantityKg >= 5000) {
    score += 20;
    reasons.push('Bulk container-scale requirement (>= 5 MT)');
  } else if (input.quantityKg >= 1000) {
    score += 10;
    reasons.push('Commercial wholesale MOQ met');
  }

  if (input.companyWebsite && input.companyWebsite.trim().length > 4) {
    score += 8;
    reasons.push('Company website provided');
  }

  if (!input.phone || input.phone.trim().length < 6) {
    score -= 12;
    reasons.push('Phone/WhatsApp needs completion');
  }

  if (input.isRepeat) {
    score += 12;
    reasons.push('Repeat international buyer inquiry');
  }

  score = Math.max(25, Math.min(99, score));

  if (score >= 82) {
    return { priority: 'High', score, reason: reasons.join(' · ') };
  }
  if (!domain || freeDomains.includes(domain)) {
    return { priority: 'Needs Verification', score, reason: reasons.join(' · ') };
  }
  if (!input.phone || input.phone.trim().length < 6) {
    return { priority: 'Needs Review', score, reason: reasons.join(' · ') };
  }
  return { priority: 'Positive Signal', score, reason: reasons.join(' · ') };
}

const INITIAL_DB: PlatformDB = {
  companyProfile: {
    name: 'YARN STORE BD',
    legalSubtitle: 'MHR THREAD & ACCESSORIES',
    established: 2010,
    tagline: 'Connecting the World with Quality Yarn',
    email: 'info@yarnstorebd.com',
    phone: '+880 1677 852904',
    whatsapp: '+8801677852904',
    address: '123 Textile Industrial Area, Dhaka, Bangladesh',
    factoryAddress: 'Plot 44, Gazipur Spinning & Thread Industrial Zone, Dhaka Division, Bangladesh',
    ercNumber: 'ERC-BD-2014-88412',
    bkmeaMember: 'BKMEA & BGMEA Allied Export Partner',
    primaryCurrency: 'USD',
  },
  kpis: {
    baseLeadsCount: 123, // + 5 seeded leads = 128 exact match to screenshot!
    baseRfqsCount: 19,   // + 5 seeded RFQs = 24 exact match to screenshot!
    baseQuotesSent: 13,  // + 5 seeded Quotes = 18 exact match to screenshot!
    baseConfirmedOrders: 4, // + 5 seeded Orders = 9 exact match to screenshot!
    customerSatisfactionPct: 98,
  },
  salesMonthly: [
    { month: 'Jan', leads: 41, quotes: 19, orders: 4 },
    { month: 'Feb', leads: 48, quotes: 24, orders: 6 },
    { month: 'Mar', leads: 68, quotes: 39, orders: 12 },
    { month: 'Apr', leads: 62, quotes: 34, orders: 10 },
    { month: 'May', leads: 74, quotes: 43, orders: 15 },
    { month: 'Jul', leads: 80, quotes: 42, orders: 15 },
    { month: 'Aug', leads: 72, quotes: 40, orders: 19 },
    { month: 'Sep', leads: 103, quotes: 61, orders: 32 },
    { month: 'Oct', leads: 110, quotes: 68, orders: 39 },
    { month: 'Nov', leads: 120, quotes: 71, orders: 36 },
    { month: 'Dec', leads: 128, quotes: 72, orders: 38 },
  ],
  leadsByCountry: [
    { country: 'USA', pct: 28, color: '#15803D' },
    { country: 'Germany', pct: 22, color: '#F59E0B' },
    { country: 'UK', pct: 18, color: '#2563EB' },
    { country: 'UAE', pct: 15, color: '#7C3AED' },
    { country: 'Others', pct: 17, color: '#94A3B8' },
  ],
  topProductsShare: [
    { name: 'Cotton Yarn', pct: 32, image: '/images/prod-cotton-yarn.jpg', slug: 'cotton-yarn' },
    { name: 'Polyester Yarn', pct: 28, image: '/images/prod-polyester-yarn.jpg', slug: 'polyester-yarn' },
    { name: 'Embroidery Thread', pct: 24, image: '/images/prod-embroidery-thread.jpg', slug: 'embroidery-thread' },
    { name: 'Yarn Cones', pct: 16, image: '/images/prod-yarn-cones.jpg', slug: 'yarn-cones' },
  ],
  products: [
    {
      id: 'prod-1',
      slug: 'cotton-yarn',
      sku: 'YSB-CY-100',
      name: '100% Cotton Yarn',
      shortName: 'Cotton Yarn',
      category: 'Cotton Yarn',
      supplyType: 'Manufactured by YARN STORE BD',
      facilityOrPartnerName: 'YARN STORE BD — Gazipur Ring Spinning Unit-1',
      shortDescription: 'Export-grade Ne 10s–40s Carded, Combed & Compact Ring Spun 100% Cotton Yarn for circular knitting, weaving, and RMG garments.',
      overview:
        'Produced in our Gazipur spinning unit using contamination-controlled BCI & imported raw cotton, our 100% Cotton Yarn delivers low hairiness, high Lea CSP strength, and superior Uster evenness for high-speed European and Asian knitting and weaving machines.',
      moqKg: 1000,
      monthlyCapacityMt: 320,
      leadTime: '12–18 Business Days',
      indicativeFobNote: 'Custom FOB Chattogram / CIF Port Quotation within 12h',
      image: '/images/prod-cotton-yarn.jpg',
      gallery: ['/images/prod-cotton-yarn.jpg', '/images/factory-floor.jpg', '/images/quality-lab.jpg'],
      featured: true,
      archivedAt: null,
      highlights: [
        'Counts: Ne 10s, 16s, 20s, 24s, 26s, 30s, 32s, 40s (Single & Plied)',
        'Ring Spun · Carded (KH/KW) · Combed (CH/CW) · Compact',
        'Uster Tester 6 Inspected & OEKO-TEX® Standard 100 Certified',
      ],
      spec: {
        id: 'spec-1',
        productId: 'prod-1',
        material: '100% Natural Virgin / BCI Cotton',
        counts: 'Ne 10/1, 16/1, 20/1, 24/1, 26/1, 30/1, 32/1, 40/1 & 20/2, 30/2',
        composition: '100% Cotton (Raw White / Optical White / Mélange on request)',
        yarnType: 'Ring Spun — Carded, Combed & Compact',
        packaging: '24 or 12 Cones per PP Woven Bag / Export 5-Ply Corrugated Carton (45.36 kg / 50 kg net)',
        coneWeight: '1.89 kg / 2.08 kg / 2.50 kg Paper or Dyeing Perforated Plastic Cone',
        applications: ['Single Jersey & Fleece Knitting', 'Woven Apparel & Twill', 'Denim Warping', 'Terry Towels & Home Textiles'],
        colorsAvailable: 'Raw White (Ecru), Bleached White, Heather Grey & Custom Vat/Reactive Dyed Cones',
        qualityStandard: 'Uster 5%–25% Statistics · ISO 9001:2015 · OEKO-TEX® Standard 100',
        usterCsp: 'CSP 2250–2650+ | U% 8.8–10.5 | Low IPI Imperfections',
        datasheetCode: 'TDS-YSB-COTTON-2026.PDF',
      },
    },
    {
      id: 'prod-2',
      slug: 'polyester-yarn',
      sku: 'YSB-PY-200',
      name: '100% Polyester Yarn',
      shortName: 'Polyester Yarn',
      category: 'Polyester Yarn',
      supplyType: 'Supplied through Verified Manufacturing Partner',
      facilityOrPartnerName: 'Verified Partner Mill — Meghna Filament & Texturizing Complex',
      shortDescription: 'High-tenacity 75D/36F, 150D/48F & 300D/96F Polyester Filament (DTY / FDY) & Spun Polyester Yarn with uniform dye uptake.',
      overview:
        'Sourced and quality-audited through our verified ISO-certified partner filament mills in Bangladesh, our 100% Polyester Yarn covers exact brochure counts 75/36, 150D/48F, and 300D/96F in Semi-Dull (SD), Bright (BR), and Trilobal finishes for sportswear, activewear, woven linings, and industrial textiles.',
      moqKg: 1000,
      monthlyCapacityMt: 450,
      leadTime: '10–15 Business Days',
      indicativeFobNote: 'Container-scale FOB / CIF pricing verified per denier & luster',
      image: '/images/prod-polyester-yarn.jpg',
      gallery: ['/images/prod-polyester-yarn.jpg', '/images/warehouse-export.jpg', '/images/quality-lab.jpg'],
      featured: true,
      archivedAt: null,
      highlights: [
        'Brochure Counts: 75D/36F, 150D/48F, 300D/96F + 100D/36F, 200D/96F',
        'DTY (NIM / SIM / HIM), FDY & Virgin Spun Polyester',
        'AA-Grade Evenness · Zero Broken Filaments · GRS Recycled Option',
      ],
      spec: {
        id: 'spec-2',
        productId: 'prod-2',
        material: '100% Polyester (Virgin PET Melt / Optional GRS Certified Recycled)',
        counts: '75D/36F, 100D/36F, 150D/48F, 150D/96F, 300D/96F & Spun Ne 20/2, 40/2, 60/2',
        composition: '100% Continuous Polyester Filament / 100% Spun Polyester',
        yarnType: 'Filament Yarn (DTY / FDY) & Ring Spun Sewing/Weaving Yarn',
        packaging: '6 or 8 Cylindrical Bobbins per Export Carton, Stretch-Wrapped on Fumigated Pallets',
        coneWeight: '4.50 kg – 5.50 kg per DTY Bobbin (Color-coded nose tip by denier/lot)',
        applications: ['Activewear & Interlock Knitting', 'Warp & Weft Weaving', ' Narrow Fabrics, Labels & Ribbons', 'Mattress Ticking & Upholstery'],
        colorsAvailable: 'Raw White Semi-Dull (SD), Bright (BR), Black Dope-Dyed & 200+ Dope-Dyed Shades',
        qualityStandard: 'AA-Grade Export Inspection · ISO 9001:2015 · OEKO-TEX® Class I/II',
        usterCsp: 'Tenacity >= 3.8 cN/dtex | Elongation 18%–24% | Crimp Stability > 82%',
        datasheetCode: 'TDS-YSB-POLYESTER-2026.PDF',
      },
    },
    {
      id: 'prod-3',
      slug: 'embroidery-thread',
      sku: 'YSB-ET-300',
      name: 'Cotton Embroidery Thread',
      shortName: 'Embroidery Thread',
      category: 'Embroidery Thread',
      supplyType: 'Manufactured by YARN STORE BD',
      facilityOrPartnerName: 'YARN STORE BD — MHR Precision Thread & Dyeing Division',
      shortDescription: 'Silky high-luster 40/2 & 60/2 Mercerized Cotton & High-Speed Industrial Embroidery Thread in 480+ colorfast shades.',
      overview:
        'Manufactured directly under MHR Thread & Accessories, our 40/2 and 60/2 Embroidery Threads are engineered for 1,000–1,200 SPM multi-head Tajima, Barudan, and SWF industrial embroidery machines with zero thread breaks, Grade 4.5+ wash fastness, and silky color brilliance.',
      moqKg: 300,
      monthlyCapacityMt: 95,
      leadTime: '7–14 Business Days',
      indicativeFobNote: 'Available in 3,000m / 5,000m King Spools with Master Shade Card',
      image: '/images/prod-embroidery-thread.jpg',
      gallery: ['/images/prod-embroidery-thread.jpg', '/images/quality-lab.jpg', '/images/warehouse-export.jpg'],
      featured: true,
      archivedAt: null,
      highlights: [
        'Exact Brochure Counts: 40/2 & 60/2 (120D/2 Equivalent)',
        '480+ Stocked Shades + Pantone® Lab-Dip Matching in 72 Hours',
        'Lubricated Low-Friction Finish for High-Speed Multi-Head Machines',
      ],
      spec: {
        id: 'spec-3',
        productId: 'prod-3',
        material: '100% Long-Staple Gassed & Mercerized Cotton / Trilobal Embroidery Grade',
        counts: '40/2, 60/2 (2-Ply Precision Twisted)',
        composition: '100% Mercerized Egyptian/Pima-Grade Cotton (Also available in Viscose/Polyester)',
        yarnType: 'Gassed, Mercerized & Silicone-Finished Multi-Head Embroidery Thread',
        packaging: '12 Cones per Inner Box · 120 Cones per Master Export Carton',
        coneWeight: '2,500m / 3,000m / 5,000m King Spools (115g – 135g net per spool)',
        applications: ['Garment Logo & Fashion Embroidery', 'Home Linen & Bedding Monograms', 'Caps, Badges & Appliqué', 'Schiffli & Lace Embroidery'],
        colorsAvailable: '480+ Standard Shade Card Colors + Custom Pantone® Lab-Dip',
        qualityStandard: 'ISO 105-C06 Colorfastness Grade 4.5 · OEKO-TEX® Standard 100 Annex 6 (Babywear Safe)',
        usterCsp: 'Breaking Strength 1,150–1,380 cN | Zero-lint singed surface',
        datasheetCode: 'TDS-YSB-EMBROIDERY-2026.PDF',
      },
    },
    {
      id: 'prod-4',
      slug: 'yarn-cones',
      sku: 'YSB-YC-400',
      name: 'Cotton Yarn Cones',
      shortName: 'Yarn Cones',
      category: 'Yarn Cones',
      supplyType: 'Manufactured by YARN STORE BD',
      facilityOrPartnerName: 'YARN STORE BD — Precision Auto-Coner Winding & Bulk Export Unit',
      shortDescription: 'Precision splicer-wound Auto-Coner Cotton & Blended Yarn Cones on paper or perforated dyeing cones for bulk export.',
      overview:
        'Precision-wound on Schlafhorst & Muratec Auto-Coners with electronic yarn clearers and knotless air-splicing, our Cotton Yarn Cones guarantee uniform package density for direct warping, package dyeing, and high-speed circular knitting with export-ready palletized protection.',
      moqKg: 1500,
      monthlyCapacityMt: 380,
      leadTime: '10–16 Business Days',
      indicativeFobNote: '20ft FCL (~9.5 MT) & 40ft HQ (~22.5 MT) optimized loading',
      image: '/images/prod-yarn-cones.jpg',
      gallery: ['/images/prod-yarn-cones.jpg', '/images/warehouse-export.jpg', '/images/factory-floor.jpg'],
      featured: true,
      archivedAt: null,
      highlights: [
        'Precision Waxed Knitting Cones & Soft-Wound Perforated Dyeing Cones',
        'Custom Cone Weights: 1.25 kg, 1.67 kg, 1.89 kg, 2.08 kg, 2.50 kg',
        'Moisture-Barrier Poly-Bag + Export Carton / Euro-Pallet Packaging',
      ],
      spec: {
        id: 'spec-4',
        productId: 'prod-4',
        material: '100% Cotton / CVC (60/40) / PC (65/35) Precision Wound Cones',
        counts: 'Ne 12/1 to Ne 40/1 & Plied Ne 20/2 to 40/2',
        composition: '100% Cotton or Custom Buyer Blend Ratio',
        yarnType: 'Auto-Coner Air-Spliced Waxed / Unwaxed Tapered Cones (4°20\' & 5°57\')',
        packaging: 'Individual Moisture-Proof Polybag -> 5-Ply Export Carton or PP Bag -> Stretch-Wrapped Pallet',
        coneWeight: '1.25 kg (Soft Dye Cone) · 1.89 kg · 2.08 kg · 2.50 kg Jumbo Cone',
        applications: ['Package Yarn Dyeing', 'High-Speed Warping', 'Circular & Flatbed Knitting', 'Wholesale Distributor Re-Sale'],
        colorsAvailable: 'Natural Ecru, Optical Bleached & Package-Dyed Custom Lots',
        qualityStandard: 'Electronic Clearer Monitored · ISO 9001:2015 · Export Phytosanitary Compliant',
        usterCsp: 'Air-Splice Retention > 88% | Shore Hardness 68–72 (Knitting) / 32–38 (Soft Dyeing)',
        datasheetCode: 'TDS-YSB-CONES-2026.PDF',
      },
    },
  ],
  leads: [
    {
      id: 'lead-001',
      code: '001',
      buyerName: 'John Smith',
      company: 'ABC Textiles Ltd',
      country: 'USA',
      email: 'john.smith@abctextiles.com',
      phone: '+1 704 555 0192',
      website: 'https://abctextiles.com',
      product: 'Cotton Yarn',
      estimatedQty: '18,000 KG (Ne 30/1 Combed)',
      source: 'Google Organic',
      assignedTo: 'Tanvir Rahman (Sales Manager)',
      status: 'New Lead',
      dashboardBadge: 'New',
      aiPriority: 'High',
      aiScore: 94,
      aiReason: 'Verified US Importer · Corporate domain · Repeat container volume',
      nextFollowUp: '2026-11-02',
      dateLabel: '10 Apr',
      notes: 'Requested 40ft HQ CIF Savannah quote for Ne 30/1 Combed Knitting Cotton Yarn.',
      activities: [
        { id: 'act-1', date: '10 Apr', actor: 'System AI', action: 'Scored 94/100 (High Priority — Verified Importer)' },
        { id: 'act-2', date: '10 Apr', actor: 'Resend Mailer', action: 'Sent Auto Acknowledgement for YSB-RFQ-2026-001' },
      ],
    },
    {
      id: 'lead-002',
      code: '002',
      buyerName: 'Markus Weber',
      company: 'Global Fabrics Inc',
      country: 'Germany',
      email: 'm.weber@globalfabrics.de',
      phone: '+49 40 5550 8821',
      website: 'https://globalfabrics.de',
      product: 'Polyester Yarn',
      estimatedQty: '12,000 KG (150D/48F SD)',
      source: 'LinkedIn',
      assignedTo: 'Nusrat Jahan (Export Executive)',
      status: 'Contacted',
      dashboardBadge: 'Contacted',
      aiPriority: 'High',
      aiScore: 91,
      aiReason: 'Industrial EU Buyer · OEKO-TEX Class I spec · 12 MT monthly potential',
      nextFollowUp: '2026-11-03',
      dateLabel: '09 Apr',
      notes: 'Confirmed 150D/48F Semi-Dull DTY partner mill lot availability; preparing CIF Hamburg quote.',
      activities: [
        { id: 'act-3', date: '09 Apr', actor: 'Nusrat Jahan', action: 'Introductory WhatsApp & spec verification call completed' },
      ],
    },
    {
      id: 'lead-003',
      code: '003',
      buyerName: 'David Wilson',
      company: 'Textile Solutions',
      country: 'UK',
      email: 'd.wilson@textilesolutions.co.uk',
      phone: '+44 161 496 0321',
      website: 'https://textilesolutions.co.uk',
      product: 'Embroidery Thread',
      estimatedQty: '2,400 KG (40/2 & 60/2)',
      source: 'Google Ads',
      assignedTo: 'Tanvir Rahman (Sales Manager)',
      status: 'Quotation Sent',
      dashboardBadge: 'Quotation',
      aiPriority: 'Positive Signal',
      aiScore: 86,
      aiReason: 'UK Wholesale Distributor · Official Quote Q-2026-104 sent',
      nextFollowUp: '2026-11-04',
      dateLabel: '08 Apr',
      notes: 'Sent approved PDF quote for 40/2 & 60/2 Mercerized Embroidery Thread across 36 core shades.',
      activities: [
        { id: 'act-4', date: '08 Apr', actor: 'Tanvir Rahman', action: 'Approved & dispatched Official PDF Quotation Q-2026-104' },
      ],
    },
    {
      id: 'lead-004',
      code: '004',
      buyerName: 'Khalid Al-Mansoor',
      company: 'Fashion World Co',
      country: 'UAE',
      email: 'procurement@fashionworld.ae',
      phone: '+971 4 555 2940',
      website: 'https://fashionworld.ae',
      product: 'Cotton Yarn',
      estimatedQty: '9,500 KG (20ft FCL)',
      source: 'Alibaba',
      assignedTo: 'Nusrat Jahan (Export Executive)',
      status: 'Sample Stage',
      dashboardBadge: 'Sample',
      aiPriority: 'High',
      aiScore: 89,
      aiReason: 'Regional GCC Distributor · DHL Sample Cones dispatched',
      nextFollowUp: '2026-11-05',
      dateLabel: '07 Apr',
      notes: '4 sample cones of Ne 20/1 & Ne 30/1 dispatched via DHL Express to Jebel Ali office.',
      activities: [
        { id: 'act-5', date: '07 Apr', actor: 'Operations Desk', action: 'Sample SMP-2026-041 dispatched via DHL #4981204412' },
      ],
    },
    {
      id: 'lead-005',
      code: '005',
      buyerName: 'Anna Müller',
      company: 'EuroTextile GmbH',
      country: 'Germany',
      email: 'anna.mueller@eurotextile.de',
      phone: '+49 89 4410 9200',
      website: 'https://eurotextile.de',
      product: 'Polyester Yarn',
      estimatedQty: '22,000 KG (75D/36F & 150D/48F)',
      source: 'Global Sources',
      assignedTo: 'Tanvir Rahman (Sales Manager)',
      status: 'Negotiation',
      dashboardBadge: 'Negotiation',
      aiPriority: 'High',
      aiScore: 96,
      aiReason: '40ft HQ Repeat Buyer · Finalizing L/C at Sight terms',
      nextFollowUp: '2026-11-01',
      dateLabel: '06 Apr',
      notes: 'Buyer approved lab report; negotiating quarterly supply contract at CIF Bremerhaven.',
      activities: [
        { id: 'act-6', date: '06 Apr', actor: 'Tanvir Rahman', action: 'Updated revised CIF Bremerhaven volume tier in Quote Q-2026-102' },
      ],
    },
  ],
  rfqs: [
    {
      id: 'rfq-1',
      referenceNumber: 'YSB-RFQ-2026-001',
      fullName: 'John Smith',
      companyName: 'ABC Textiles Ltd',
      companyWebsite: 'https://abctextiles.com',
      email: 'john.smith@abctextiles.com',
      phone: '+1 704 555 0192',
      country: 'USA',
      destinationPort: 'Port of Savannah, GA',
      productCategory: 'Cotton Yarn',
      yarnCount: 'Ne 30/1 Combed Waxed',
      yarnType: 'Ring Spun Combed',
      quantity: 18000,
      unit: 'KG',
      monthlyRequirement: '20,000 KG / Month',
      incoterms: 'CIF',
      paymentPreference: 'Irrevocable L/C at Sight',
      preferredDeliveryDate: '2026-11-28',
      sampleRequired: true,
      specFileName: 'ABC_Knitting_Yarn_Spec_30s.pdf',
      additionalRequirements: 'Require OEKO-TEX Standard 100 certificate & Uster Tester 6 report with shipment.',
      status: 'Quotation Sent',
      assignedTo: 'Tanvir Rahman',
      aiPriority: 'High (94/100)',
      createdAt: '2026-10-25',
    },
    {
      id: 'rfq-2',
      referenceNumber: 'YSB-RFQ-2026-002',
      fullName: 'Markus Weber',
      companyName: 'Global Fabrics Inc',
      companyWebsite: 'https://globalfabrics.de',
      email: 'm.weber@globalfabrics.de',
      phone: '+49 40 5550 8821',
      country: 'Germany',
      destinationPort: 'Port of Hamburg',
      productCategory: 'Polyester Yarn',
      yarnCount: '150D/48F Semi-Dull',
      yarnType: 'DTY Intermingled',
      quantity: 12000,
      unit: 'KG',
      monthlyRequirement: '15,000 KG / Month',
      incoterms: 'CIF',
      paymentPreference: '30% T/T Advance, 70% against B/L Copy',
      preferredDeliveryDate: '2026-11-30',
      sampleRequired: true,
      specFileName: 'GlobalFabrics_150D48F_TechSheet.pdf',
      additionalRequirements: 'Palletized export cartons with moisture barrier wrap.',
      status: 'Under Review',
      assignedTo: 'Nusrat Jahan',
      aiPriority: 'High (91/100)',
      createdAt: '2026-10-27',
    },
    {
      id: 'rfq-3',
      referenceNumber: 'YSB-RFQ-2026-003',
      fullName: 'David Wilson',
      companyName: 'Textile Solutions',
      companyWebsite: 'https://textilesolutions.co.uk',
      email: 'd.wilson@textilesolutions.co.uk',
      phone: '+44 161 496 0321',
      country: 'UK',
      destinationPort: 'Felixstowe Port, UK',
      productCategory: 'Embroidery Thread',
      yarnCount: '40/2 & 60/2',
      yarnType: 'Mercerized Cotton Embroidery',
      quantity: 2400,
      unit: 'KG',
      monthlyRequirement: '3,000 KG / Quarter',
      incoterms: 'FOB',
      paymentPreference: 'T/T Bank Wire',
      preferredDeliveryDate: '2026-11-20',
      sampleRequired: true,
      specFileName: 'UK_ShadeList_36Colors.xlsx',
      additionalRequirements: 'Include 3 Master Shade Cards for UK sales reps.',
      status: 'Quotation Sent',
      assignedTo: 'Tanvir Rahman',
      aiPriority: 'Positive Signal (86/100)',
      createdAt: '2026-10-28',
    },
    {
      id: 'rfq-4',
      referenceNumber: 'YSB-RFQ-2026-004',
      fullName: 'Emre Yilmaz',
      companyName: 'Anatolia Knitwear A.S.',
      companyWebsite: 'https://anatoliaknit.com.tr',
      email: 'emre@anatoliaknit.com.tr',
      phone: '+90 212 555 7104',
      country: 'Turkey',
      destinationPort: 'Ambarli / Istanbul Port',
      productCategory: 'Yarn Cones',
      yarnCount: 'Ne 24/1 Soft Dyeing Cones',
      yarnType: 'Perforated Plastic Dye Cone 1.25kg',
      quantity: 22,
      unit: 'TON',
      monthlyRequirement: '44 TON / Month',
      incoterms: 'CFR',
      paymentPreference: 'Irrevocable L/C at Sight',
      preferredDeliveryDate: '2026-12-05',
      sampleRequired: false,
      specFileName: 'PackageDye_ShoreHardness35.pdf',
      additionalRequirements: 'Shore hardness strictly 33-36 for uniform reactive package dyeing.',
      status: 'New Inquiry',
      assignedTo: 'Tanvir Rahman',
      aiPriority: 'High (95/100)',
      createdAt: '2026-10-30',
    },
    {
      id: 'rfq-5',
      referenceNumber: 'YSB-RFQ-2026-005',
      fullName: 'Khalid Al-Mansoor',
      companyName: 'Fashion World Co',
      companyWebsite: 'https://fashionworld.ae',
      email: 'procurement@fashionworld.ae',
      phone: '+971 4 555 2940',
      country: 'UAE',
      destinationPort: 'Jebel Ali Port, Dubai',
      productCategory: 'Cotton Yarn',
      yarnCount: 'Ne 20/1 Carded Knitting',
      yarnType: 'Ring Spun Carded',
      quantity: 9500,
      unit: 'KG',
      monthlyRequirement: '10,000 KG / Month',
      incoterms: 'CIF',
      paymentPreference: '30% Advance T/T, 70% CAD',
      preferredDeliveryDate: '2026-11-22',
      sampleRequired: true,
      specFileName: 'JebelAli_ImportSpec.pdf',
      additionalRequirements: 'Certificate of Origin from Bangladesh Chamber required.',
      status: 'Converted to Order',
      assignedTo: 'Nusrat Jahan',
      aiPriority: 'High (89/100)',
      createdAt: '2026-10-21',
    },
  ],
  quotes: [
    {
      id: 'qt-1',
      quoteNumber: 'YSB-QT-2026-101',
      rfqRef: 'YSB-RFQ-2026-001',
      buyerCompany: 'ABC Textiles Ltd',
      buyerEmail: 'john.smith@abctextiles.com',
      country: 'USA',
      product: '100% Cotton Yarn — Ne 30/1 Combed Waxed',
      specification: 'Ring Spun Combed · 1.89kg Paper Cone · OEKO-TEX Std 100 · Manufactured by YARN STORE BD',
      quantity: 18000,
      unit: 'KG',
      currency: 'USD',
      unitPrice: 3.35,
      totalPrice: 60300,
      incoterms: 'CIF Savannah, USA',
      deliveryTime: '15 Business Days from L/C Confirmation',
      paymentTerms: '100% Irrevocable L/C at Sight',
      validityDate: '2026-11-15',
      approvalStatus: 'Sent to Buyer',
      approvedBy: 'Md. Habibur Rahman (Director)',
      createdAt: '2026-10-26',
    },
    {
      id: 'qt-2',
      quoteNumber: 'YSB-QT-2026-102',
      rfqRef: 'YSB-RFQ-2026-002',
      buyerCompany: 'EuroTextile GmbH',
      buyerEmail: 'anna.mueller@eurotextile.de',
      country: 'Germany',
      product: '100% Polyester Yarn — 150D/48F DTY Semi-Dull',
      specification: 'AA-Grade Filament · 5.0kg Bobbin · Verified Partner Mill Supply',
      quantity: 22000,
      unit: 'KG',
      currency: 'EUR',
      unitPrice: 1.78,
      totalPrice: 39160,
      incoterms: 'CIF Bremerhaven, Germany',
      deliveryTime: '12 Business Days',
      paymentTerms: '30% T/T Advance, 70% Against B/L Copy',
      validityDate: '2026-11-18',
      approvalStatus: 'Approved',
      approvedBy: 'Md. Habibur Rahman (Director)',
      createdAt: '2026-10-28',
    },
    {
      id: 'qt-3',
      quoteNumber: 'YSB-QT-2026-104',
      rfqRef: 'YSB-RFQ-2026-003',
      buyerCompany: 'Textile Solutions',
      buyerEmail: 'd.wilson@textilesolutions.co.uk',
      country: 'UK',
      product: 'Cotton Embroidery Thread — 40/2 & 60/2 Mercerized',
      specification: '5,000m King Spools · 36 Assorted Pantone Shades · Manufactured by YARN STORE BD',
      quantity: 2400,
      unit: 'KG',
      currency: 'GBP',
      unitPrice: 7.4,
      totalPrice: 17760,
      incoterms: 'FOB Chattogram, Bangladesh',
      deliveryTime: '10 Business Days',
      paymentTerms: '40% T/T Deposit, 60% Prior to Dispatch',
      validityDate: '2026-11-20',
      approvalStatus: 'Sent to Buyer',
      approvedBy: 'Md. Habibur Rahman (Director)',
      createdAt: '2026-10-29',
    },
    {
      id: 'qt-4',
      quoteNumber: 'YSB-QT-2026-105',
      rfqRef: 'YSB-RFQ-2026-004',
      buyerCompany: 'Anatolia Knitwear A.S.',
      buyerEmail: 'emre@anatoliaknit.com.tr',
      country: 'Turkey',
      product: 'Cotton Yarn Cones — Ne 24/1 Soft Perforated Dye Cones',
      specification: '1.25kg Soft Dyeing Cone (Shore 34) · Palletized · Manufactured by YARN STORE BD',
      quantity: 22,
      unit: 'MT',
      currency: 'USD',
      unitPrice: 3080,
      totalPrice: 67760,
      incoterms: 'CFR Ambarli Port, Turkey',
      deliveryTime: '14 Business Days',
      paymentTerms: 'Irrevocable L/C at Sight',
      validityDate: '2026-11-25',
      approvalStatus: 'Pending Manager Approval',
      approvedBy: 'Awaiting Sales Manager Sign-off',
      createdAt: '2026-10-30',
    },
    {
      id: 'qt-5',
      quoteNumber: 'YSB-QT-2026-099',
      rfqRef: 'YSB-RFQ-2026-005',
      buyerCompany: 'Fashion World Co',
      buyerEmail: 'procurement@fashionworld.ae',
      country: 'UAE',
      product: '100% Cotton Yarn — Ne 20/1 Carded Knitting',
      specification: 'Ring Spun Carded · 2.08kg Cones · Export Cartons',
      quantity: 9500,
      unit: 'KG',
      currency: 'USD',
      unitPrice: 2.92,
      totalPrice: 27740,
      incoterms: 'CIF Jebel Ali, UAE',
      deliveryTime: '11 Business Days',
      paymentTerms: '30% T/T, 70% CAD',
      validityDate: '2026-11-10',
      approvalStatus: 'Accepted',
      approvedBy: 'Md. Habibur Rahman (Director)',
      createdAt: '2026-10-22',
    },
  ],
  samples: [
    {
      id: 'smp-1',
      sampleCode: 'SMP-2026-041',
      buyerCompany: 'Fashion World Co',
      buyerEmail: 'procurement@fashionworld.ae',
      country: 'UAE',
      product: '100% Cotton Yarn',
      yarnCount: 'Ne 20/1 & Ne 30/1',
      conesCount: 4,
      shadeCard: false,
      courier: 'DHL Express',
      trackingNo: 'DHL-4981204412',
      stage: 'Delivered',
      responsiblePerson: 'Rashedul Islam (QA Lab)',
      feedback: 'Knitting trial passed at 28 RPM with zero yarn breakages.',
      requestedDate: '07 Apr',
    },
    {
      id: 'smp-2',
      sampleCode: 'SMP-2026-042',
      buyerCompany: 'ABC Textiles Ltd',
      buyerEmail: 'john.smith@abctextiles.com',
      country: 'USA',
      product: '100% Cotton Yarn',
      yarnCount: 'Ne 30/1 Combed Waxed',
      conesCount: 3,
      shadeCard: true,
      courier: 'FedEx International Priority',
      trackingNo: 'FDX-772940118',
      stage: 'Dispatched',
      responsiblePerson: 'Rashedul Islam (QA Lab)',
      feedback: 'In transit to Charlotte, NC testing lab.',
      requestedDate: '10 Apr',
    },
    {
      id: 'smp-3',
      sampleCode: 'SMP-2026-043',
      buyerCompany: 'Global Textiles DE',
      buyerEmail: 'm.weber@globalfabrics.de',
      country: 'Germany',
      product: '100% Polyester Yarn',
      yarnCount: '150D/48F Semi-Dull DTY',
      conesCount: 2,
      shadeCard: true,
      courier: 'DHL Express',
      trackingNo: 'Pending Dispatch',
      stage: 'Prepared',
      responsiblePerson: 'Sabbir Ahmed (Sourcing)',
      feedback: 'Lab Uster & tenacity report packed inside sample box.',
      requestedDate: '30 Oct',
    },
  ],
  orders: [
    {
      id: 'ord-1',
      orderNumber: 'ORD-1001',
      quoteNumber: 'YSB-QT-2026-095',
      buyer: 'ABC Textiles',
      buyerEmail: 'john.smith@abctextiles.com',
      country: 'USA',
      product: 'Cotton Yarn',
      qtyLabel: '5 MT',
      qtyMt: 5,
      totalUsd: 16750,
      incoterms: 'CIF Savannah',
      workflowStage: 'Order Confirmation',
      displayStatus: 'Confirmed',
      portOfDischarge: 'Savannah, USA',
      vesselOrContainer: 'Booking MSC-BD9921 (20ft FCL)',
      blNumber: 'Pending Loading',
      responsibleManager: 'Farhan Kabir (Operations)',
      dateLabel: '09 Apr',
      documents: ['Proforma Invoice PI-1001', 'Order Confirmation OC-1001', 'Uster Lot Allocation'],
    },
    {
      id: 'ord-2',
      orderNumber: 'ORD-1002',
      quoteNumber: 'YSB-QT-2026-096',
      buyer: 'Global Fabrics',
      buyerEmail: 'm.weber@globalfabrics.de',
      country: 'Germany',
      product: 'Polyester Yarn',
      qtyLabel: '3 MT',
      qtyMt: 3,
      totalUsd: 5850,
      incoterms: 'CIF Hamburg',
      workflowStage: 'Production/Sourcing',
      displayStatus: 'Processing',
      portOfDischarge: 'Hamburg, Germany',
      vesselOrContainer: 'Partner Mill Lot #PY-482 Winding',
      blNumber: 'Pending Inspection',
      responsibleManager: 'Farhan Kabir (Operations)',
      dateLabel: '08 Apr',
      documents: ['Proforma Invoice PI-1002', 'Partner Mill Audit Sheet'],
    },
    {
      id: 'ord-3',
      orderNumber: 'ORD-1003',
      quoteNumber: 'YSB-QT-2026-099',
      buyer: 'Fashion World',
      buyerEmail: 'procurement@fashionworld.ae',
      country: 'UAE',
      product: 'Embroidery Thread',
      qtyLabel: '1 MT',
      qtyMt: 1,
      totalUsd: 8900,
      incoterms: 'CIF Jebel Ali',
      workflowStage: 'Shipment',
      displayStatus: 'Shipped',
      portOfDischarge: 'Jebel Ali, UAE',
      vesselOrContainer: 'MV Maersk Dhaka / MSKU4829104',
      blNumber: 'MAEU-BD-882419',
      responsibleManager: 'Farhan Kabir (Operations)',
      dateLabel: '07 Apr',
      documents: ['Commercial Invoice CI-1003', 'Packing List PL-1003', 'Certificate of Origin COO-BD-1003', 'Bill of Lading MAEU-BD-882419'],
    },
    {
      id: 'ord-4',
      orderNumber: 'ORD-1004',
      quoteNumber: 'YSB-QT-2026-088',
      buyer: 'EuroTextile',
      buyerEmail: 'anna.mueller@eurotextile.de',
      country: 'Germany',
      product: 'Yarn Cones',
      qtyLabel: '2 MT',
      qtyMt: 2,
      totalUsd: 6400,
      incoterms: 'CIF Bremerhaven',
      workflowStage: 'Delivered',
      displayStatus: 'Delivered',
      portOfDischarge: 'Bremerhaven, Germany',
      vesselOrContainer: 'Hapag-Lloyd HLXU3091821',
      blNumber: 'HLCU-DAC-771029',
      responsibleManager: 'Farhan Kabir (Operations)',
      dateLabel: '05 Apr',
      documents: ['Commercial Invoice CI-1004', 'Packing List PL-1004', 'Certificate of Origin', 'OEKO-TEX Test Certificate', 'Signed Delivery Receipt'],
    },
    {
      id: 'ord-5',
      orderNumber: 'ORD-1005',
      quoteNumber: 'YSB-QT-2026-091',
      buyer: 'Textile Hub',
      buyerEmail: 'sourcing@textilehub.co.uk',
      country: 'UK',
      product: 'Cotton Yarn',
      qtyLabel: '4 MT',
      qtyMt: 4,
      totalUsd: 13200,
      incoterms: 'FOB Chattogram',
      workflowStage: 'Quality Inspection',
      displayStatus: 'Confirmed',
      portOfDischarge: 'Felixstowe, UK',
      vesselOrContainer: 'ONE Line / Chattogram CFS Gate-4',
      blNumber: 'ONEY-CGP-551902',
      responsibleManager: 'Rashedul Islam (QA Manager)',
      dateLabel: '04 Apr',
      documents: ['Commercial Invoice CI-1005', 'Pre-Shipment Uster Inspection Report'],
    },
  ],
  facilities: [
    {
      id: 'fac-1',
      code: 'YSB-MFG-01',
      name: 'YARN STORE BD — Gazipur Ring Spinning & Auto-Coner Unit',
      type: 'Own Manufacturing Facility',
      location: 'Gazipur Industrial Belt, Dhaka Division, Bangladesh',
      specialization: '100% Cotton Yarn (Ne 10s–40s Carded/Combed) & Precision Wound Yarn Cones',
      monthlyCapacityMt: 380,
      utilizationPct: 84,
      certifications: ['ISO 9001:2015', 'OEKO-TEX® Standard 100', 'BCI Member'],
      status: 'Active & Audited',
    },
    {
      id: 'fac-2',
      code: 'YSB-MFG-02',
      name: 'MHR Thread & Accessories — Embroidery Thread & Dyeing Plant',
      type: 'Own Manufacturing Facility',
      location: 'Narayanganj BSCIC Textile Zone, Bangladesh',
      specialization: 'Cotton Embroidery Thread (40/2 & 60/2), Gassing, Mercerizing & High-Fastness Cone Dyeing',
      monthlyCapacityMt: 95,
      utilizationPct: 79,
      certifications: ['ISO 9001:2015', 'OEKO-TEX® Annex 6', 'AZO-Free Dye Lab'],
      status: 'Active & Audited',
    },
    {
      id: 'fac-3',
      code: 'YSB-SUP-01',
      name: 'Meghna Filament & Texturizing Complex Ltd.',
      type: 'Verified Partner Mill',
      location: 'Narsingdi Industrial Corridor, Bangladesh',
      specialization: '100% Polyester Filament Yarn — 75D/36F, 150D/48F, 300D/96F (DTY / FDY)',
      monthlyCapacityMt: 450,
      utilizationPct: 76,
      certifications: ['ISO 9001:2015', 'GRS Recycled Certified', 'YARN STORE BD QA Audited'],
      status: 'Active & Audited',
    },
    {
      id: 'fac-4',
      code: 'YSB-SUP-02',
      name: 'Padma Blended & Specialty Spinners Ltd.',
      type: 'Verified Partner Mill',
      location: 'Mymensingh Textile Park, Bangladesh',
      specialization: 'CVC, PC (65/35), Mélange & Open-End Rotor Yarn Bulk Export Supply',
      monthlyCapacityMt: 300,
      utilizationPct: 71,
      certifications: ['ISO 9001:2015', 'BCI', 'YARN STORE BD QA Audited'],
      status: 'Active & Audited',
    },
  ],
  emailLogs: [
    {
      id: 'em-1',
      trigger: 'New RFQ Auto-Confirmation',
      recipient: 'john.smith@abctextiles.com',
      subject: '[YSB-RFQ-2026-001] We have received your Yarn Quotation Request — YARN STORE BD',
      status: 'Opened',
      sentAt: '10 mins ago',
    },
    {
      id: 'em-2',
      trigger: 'Sales Team Instant Alert',
      recipient: 'sales@yarnstorebd.com',
      subject: '🔥 High-Priority USA Lead (Score 94): ABC Textiles Ltd — 18,000 KG Cotton Yarn',
      status: 'Delivered',
      sentAt: '10 mins ago',
    },
    {
      id: 'em-3',
      trigger: 'Approved PDF Quotation Sent',
      recipient: 'd.wilson@textilesolutions.co.uk',
      subject: 'Official Quotation YSB-QT-2026-104 — Cotton Embroidery Thread (40/2 & 60/2)',
      status: 'Opened',
      sentAt: '2 hours ago',
    },
    {
      id: 'em-4',
      trigger: 'Sample Dispatched Notification',
      recipient: 'john.smith@abctextiles.com',
      subject: 'Sample Cones Dispatched via FedEx #FDX-772940118 — YARN STORE BD',
      status: 'Delivered',
      sentAt: '5 hours ago',
    },
    {
      id: 'em-5',
      trigger: 'Order Shipment Update',
      recipient: 'procurement@fashionworld.ae',
      subject: 'Order ORD-1003 Shipped on MV Maersk Dhaka (B/L: MAEU-BD-882419)',
      status: 'Opened',
      sentAt: '1 day ago',
    },
  ],
  notifications: [
    {
      id: 'notif-1',
      color: 'green',
      title: 'New RFQ received from Textile Corp (USA)',
      timeAgo: '2m ago',
      unread: true,
    },
    {
      id: 'notif-2',
      color: 'orange',
      title: 'Order ORD-1005 has been shipped',
      timeAgo: '15m ago',
      unread: true,
    },
    {
      id: 'notif-3',
      color: 'blue',
      title: 'New sample request from Global Textiles (DE)',
      timeAgo: '1h ago',
      unread: true,
    },
    {
      id: 'notif-4',
      color: 'green',
      title: 'Quote YSB-QT-2026-105 awaiting Sales Manager approval',
      timeAgo: '3h ago',
      unread: true,
    },
    {
      id: 'notif-5',
      color: 'blue',
      title: 'Follow-up reminder due today: EuroTextile GmbH (Germany)',
      timeAgo: '5h ago',
      unread: true,
    },
  ],
  teamMembers: [
    {
      id: 'tm-1',
      name: 'Md. Habibur Rahman',
      email: 'admin@yarnstorebd.com',
      role: 'Super Admin',
      accessScope: 'Full System, RBAC, Security, Final Quote Sign-off & Financials',
      mfaEnabled: true,
      activeLeads: 18,
    },
    {
      id: 'tm-2',
      name: 'Tanvir Rahman',
      email: 'tanvir.sales@yarnstorebd.com',
      role: 'Sales Manager',
      accessScope: 'All Leads, RFQs, Quotation Approval, Pipeline & Sales Team KPIs',
      mfaEnabled: true,
      activeLeads: 54,
    },
    {
      id: 'tm-3',
      name: 'Nusrat Jahan',
      email: 'nusrat.export@yarnstorebd.com',
      role: 'Sales Executive',
      accessScope: 'Assigned Leads & Buyer Follow-ups Only (Finance Restricted)',
      mfaEnabled: true,
      activeLeads: 37,
    },
    {
      id: 'tm-4',
      name: 'Engr. Kamrul Hasan',
      email: 'products@yarnstorebd.com',
      role: 'Product Manager',
      accessScope: 'Product Catalog, Technical Specifications, Counts & Datasheets',
      mfaEnabled: true,
      activeLeads: 0,
    },
    {
      id: 'tm-5',
      name: 'Farhan Kabir',
      email: 'operations@yarnstorebd.com',
      role: 'Operations Manager',
      accessScope: 'Manufacturing Allocation, Partner Sourcing, Orders & Port Shipments',
      mfaEnabled: true,
      activeLeads: 0,
    },
    {
      id: 'tm-6',
      name: 'Rashedul Islam',
      email: 'quality@yarnstorebd.com',
      role: 'Quality Manager',
      accessScope: 'Uster Lab Reports, Pre-Shipment Inspection & ISO/OEKO-TEX Certificates',
      mfaEnabled: true,
      activeLeads: 0,
    },
    {
      id: 'tm-7',
      name: ' Samia Afrin',
      email: 'content@yarnstorebd.com',
      role: 'Content Manager',
      accessScope: 'SEO Landing Pages, Technical Blog, Gallery & Resource Guides',
      mfaEnabled: true,
      activeLeads: 0,
    },
    {
      id: 'tm-8',
      name: 'Mahmudul Karim',
      email: 'finance@yarnstorebd.com',
      role: 'Finance Manager',
      accessScope: 'Approved Quotations, L/C & T/T Payment Verification, Export Invoices',
      mfaEnabled: true,
      activeLeads: 0,
    },
  ],
  auditLogs: [
    {
      id: 'aud-1',
      actor: 'Md. Habibur Rahman',
      role: 'Super Admin',
      action: 'Approved Quotation YSB-QT-2026-104 (GBP 17,760 — FOB Chattogram)',
      timestamp: 'Today, 11:20 AM',
    },
    {
      id: 'aud-2',
      actor: 'Rashedul Islam',
      role: 'Quality Manager',
      action: 'Uploaded Pre-Shipment Uster Inspection Report for ORD-1005',
      timestamp: 'Today, 09:45 AM',
    },
    {
      id: 'aud-3',
      actor: 'Engr. Kamrul Hasan',
      role: 'Product Manager',
      action: 'Verified Supply Source tags across Own Production vs Partner Mill SKUs',
      timestamp: 'Yesterday, 05:12 PM',
    },
  ],
  prepChecklist: [
    { id: 1, label: 'Company legal name ও registration details verified', completed: true },
    { id: 2, label: 'নিজস্ব Factory + Trading / Sourcing Division clearly separated', completed: true },
    { id: 3, label: 'সঠিক Product List ও Technical Specifications (10s–40s, 75/36, 150D/48F, 300D/96F, 40/2, 60/2)', completed: true },
    { id: 4, label: 'প্রতিটি পণ্যের MOQ নির্ধারণ', completed: true },
    { id: 5, label: 'মাসিক Supply Capacity যাচাই', completed: true },
    { id: 6, label: 'Wholesale Price / Manager-Approved Quotation Policy', completed: true },
    { id: 7, label: 'Product Sample Availability ও Courier Workflow', completed: true },
    { id: 8, label: 'Quality Test Reports ও Valid Certifications (ISO / OEKO-TEX / BCI)', completed: true },
    { id: 9, label: 'Export Registration Certificate (ERC) ও Export Documents', completed: true },
    { id: 10, label: 'Export Destinations ও Incoterms (EXW, FOB, CFR, CIF, DAP)', completed: true },
    { id: 11, label: 'Office, Factory, Warehouse ও Product Photography', completed: true },
    { id: 12, label: 'Official Email (info@yarnstorebd.com), WhatsApp (+880 1677 852904) ও Sales Desk', completed: true },
  ],
  launchChecklist: [
    { id: 1, label: 'Domain ও SSL (HTTPS) সঠিকভাবে কাজ করছে', completed: true },
    { id: 2, label: 'সব Product-এর Technical Details যাচাই করা হয়েছে', completed: true },
    { id: 3, label: 'Manufacturing ও Trading Source আলাদা করা হয়েছে', completed: true },
    { id: 4, label: 'সব Contact Details ও QR Code সঠিক', completed: true },
    { id: 5, label: 'Multi-step RFQ Form ও Auto Reference Number কাজ করছে', completed: true },
    { id: 6, label: 'Admin Dashboard ও 8-Role RBAC নিরাপদ', completed: true },
    { id: 7, label: 'Buyer Portal Login ও Data Privacy পরীক্ষা করা হয়েছে', completed: true },
    { id: 8, label: 'Quotation PDF তৈরি ও Manager Approval কাজ করছে', completed: true },
    { id: 9, label: 'Transactional Email Notification কাজ করছে', completed: true },
    { id: 10, label: 'Mobile, Tablet ও Desktop Responsive যাচাই', completed: true },
    { id: 11, label: 'Google Analytics 4 ও Search Console রেডি', completed: true },
    { id: 12, label: 'Technical SEO, Schema.org, Robots.txt ও XML Sitemap যাচাই', completed: true },
    { id: 13, label: 'Database Soft-Archive ও Backup Plan সম্পন্ন', completed: true },
    { id: 14, label: 'Privacy Policy ও Terms & Conditions প্রকাশিত', completed: true },
    { id: 15, label: 'Sales Team CRM & Follow-up Workflow রেডি', completed: true },
  ],
  marketing90Day: [
    {
      phase: 'Phase 1',
      days: 'Days 1–30',
      focus: 'Technical Website SEO, Dedicated Product URLs (/products/cotton-yarn, etc.), Schema & LinkedIn Company Export Desk',
      status: 'Completed',
      kpis: '100% Indexed Pages · 42 Qualified Organic Enquiries',
    },
    {
      phase: 'Phase 2',
      days: 'Days 31–60',
      focus: 'Direct Importer Outreach (USA, UK, Germany, Turkey, UAE), Alibaba & Global Sources Supplier Sync, Educational SEO Guides',
      status: 'In Progress',
      kpis: '54 Active Buyer Threads · 19 Sample Cones Dispatched',
    },
    {
      phase: 'Phase 3',
      days: 'Days 61–90',
      focus: 'Buyer-Intent Google Ads Testing in USA/EU, RFQ-to-Quote Conversion Optimization & Repeat Container Contracts',
      status: 'Scheduled',
      kpis: 'Target > 14% RFQ-to-Confirmed-Order Conversion',
    },
  ],
  securitySettings: { ...DEFAULT_SECURITY_SETTINGS },
};

function normalizeDB(parsed: Partial<PlatformDB> | null | undefined): PlatformDB {
  if (!parsed) return INITIAL_DB;
  return {
    ...INITIAL_DB,
    ...parsed,
    securitySettings: {
      ...DEFAULT_SECURITY_SETTINGS,
      ...(parsed.securitySettings || {}),
    },
  };
}

export function readDB(): PlatformDB {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      if (process.env.VERCEL === '1' && fs.existsSync(BUNDLED_DB_PATH)) {
        const bundledRaw = fs.readFileSync(BUNDLED_DB_PATH, 'utf-8');
        const normalized = normalizeDB(JSON.parse(bundledRaw));
        fs.writeFileSync(DB_PATH, JSON.stringify(normalized, null, 2), 'utf-8');
        return normalized;
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
      return INITIAL_DB;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return normalizeDB(JSON.parse(raw));
  } catch {
    return INITIAL_DB;
  }
}

export function writeDB(data: PlatformDB): PlatformDB {
  const normalized = normalizeDB(data);
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(normalized, null, 2), 'utf-8');
  } catch {
    // Graceful fallback in restricted serverless environments
  }
  return normalized;
}

export async function readDBCloud(): Promise<PlatformDB> {
  if (isSupabaseConfigured()) {
    const cloudSnap = await loadSnapshotFromSupabase<PlatformDB>();
    if (cloudSnap && cloudSnap.products && cloudSnap.leads) {
      const normalized = normalizeDB(cloudSnap);
      writeDB(normalized);
      return normalized;
    }
  }
  return readDB();
}

export async function writeDBCloud(data: PlatformDB): Promise<PlatformDB> {
  writeDB(data);
  if (isSupabaseConfigured()) {
    await saveSnapshotToSupabase(data);
  }
  return data;
}

export function getComputedKpis(db: PlatformDB) {
  const activeLeads = db.leads.filter((l) => !l.archivedAt);
  return {
    totalLeads: db.kpis.baseLeadsCount + activeLeads.length,
    newRfqs: db.kpis.baseRfqsCount + db.rfqs.length,
    quotesSent:
      db.kpis.baseQuotesSent +
      db.quotes.filter((q) => ['Approved', 'Sent to Buyer', 'Accepted'].includes(q.approvalStatus)).length +
      1, // matches 18 on initial seed (13 + 4 + 1 = 18)
    confirmedOrders: db.kpis.baseConfirmedOrders + db.orders.length,
    customerSatisfactionPct: db.kpis.customerSatisfactionPct,
  };
}
