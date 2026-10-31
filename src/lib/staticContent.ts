export interface BlogPost {
  slug: string;
  title: string;
  category: 'Educational SEO' | 'Product SEO' | 'Export Guide';
  readTime: string;
  publishedAt: string;
  author: string;
  excerpt: string;
  image: string;
  targetKeywords: string[];
  sections: { heading: string; body: string }[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-choose-cotton-yarn-for-knitting',
    title: 'How to Choose Cotton Yarn for High-Speed Circular Knitting',
    category: 'Educational SEO',
    readTime: '6 min read',
    publishedAt: 'October 18, 2026',
    author: 'Engr. Kamrul Hasan · Spinning & Technical Lead',
    excerpt:
      'A practical B2B procurement guide comparing Carded, Combed, and Compact Ring Spun cotton yarns across Ne 20/1 to Ne 40/1 for T-shirts, polo pique, and fleece.',
    image: '/images/prod-cotton-yarn.jpg',
    targetKeywords: ['Cotton Yarn Supplier Bangladesh', 'Combed Knitting Yarn', 'Bulk Cotton Yarn Supplier'],
    sections: [
      {
        heading: '1. Matching Yarn Count (Ne) to GSM & Machine Gauge',
        body: 'International knitwear factories typically pair 24GG–28GG single-jersey circular knitting machines with Ne 24/1, Ne 26/1, or Ne 30/1 ring-spun yarn to achieve 145–180 GSM fabrics. Heavyweight 220+ GSM streetwear jerseys perform best with Ne 16/1 or Ne 20/1, while fine interlock and premium polo shirts rely on Ne 32/1 and Ne 40/1 combed compact counts.',
      },
      {
        heading: '2. Carded vs. Combed vs. Compact Spinning',
        body: 'Carded Hosiery (KH) yarn offers an economical solution for standard casualwear and three-thread fleece backing. Combed Hosiery (CH) removes short fibers (<12mm) to minimize pilling, thin/thick places, and nep count. Compact spinning further condenses the fiber strand, lowering Uster hairiness (H) and boosting Lea CSP strength by 10–15%.',
      },
      {
        heading: '3. Waxing, Moisture Regain & Cone Density',
        body: 'For export container transit from Chattogram Port, knitting cones must be precision-waxed with uniform paraffin pick-up to reduce needle friction and conditioned to standard 7.8%–8.5% moisture regain inside moisture-barrier polybags.',
      },
    ],
  },
  {
    slug: 'understanding-yarn-counts-and-specifications',
    title: 'Understanding Yarn Counts & Specifications: Ne, Nm, Denier & Tex Explained',
    category: 'Educational SEO',
    readTime: '7 min read',
    publishedAt: 'October 11, 2026',
    author: 'Rashedul Islam · Head of Quality Assurance Lab',
    excerpt:
      'Master indirect (English Cotton Count Ne) and direct (Denier, Tex) numbering systems so your international RFQs specify exact filament and staple parameters.',
    image: '/images/quality-lab.jpg',
    targetKeywords: ['Understanding Yarn Counts', '75D/36F 150D/48F 300D/96F', '40/2 60/2 Thread'],
    sections: [
      {
        heading: '1. Indirect Count System (Ne & Nm) for Staple Yarns',
        body: 'In the English Cotton Count (Ne) system, a higher number indicates a finer yarn: Ne 30/1 means thirty 840-yard hanks weigh 1 pound. Plied yarns such as 40/2 or 60/2 embroidery thread denote two single strands of Ne 40 or Ne 60 twisted together for double tenacity and balanced torque.',
      },
      {
        heading: '2. Direct Count System (Denier & Filament Count) for Synthetics',
        body: 'Continuous filament polyester uses Denier (grams per 9,000 meters) paired with filament count. For example, 150D/48F means 9,000 meters weigh 150g and consist of 48 individual micro-filaments, while 75D/36F provides a finer drape and 300D/96F delivers heavy industrial durability.',
      },
      {
        heading: '3. Quick Conversion Formulas Used by Sourcing Managers',
        body: 'Denier = 5315 ÷ Ne · Tex = 590.5 ÷ Ne · Nm = 1.693 × Ne. You can also use the live Yarn Count Converter on our Resources page to verify specifications before submitting an RFQ.',
      },
    ],
  },
  {
    slug: 'cotton-yarn-vs-polyester-yarn',
    title: 'Cotton Yarn vs. Polyester Yarn: Selecting the Right Fiber for Global Apparel Programs',
    category: 'Product SEO',
    readTime: '5 min read',
    publishedAt: 'October 03, 2026',
    author: 'Tanvir Rahman · International Export Sales Manager',
    excerpt:
      'Compare breathability, tenacity, shrinkage, dye chemistry, and landed container economics between 100% Cotton Yarn and 100% Polyester Filament/Spun Yarn.',
    image: '/images/prod-polyester-yarn.jpg',
    targetKeywords: ['Polyester Yarn Wholesale Supplier', 'Cotton Yarn vs Polyester Yarn', 'Textile Yarn Exporter Bangladesh'],
    sections: [
      {
        heading: '1. Physical Performance & End-Use',
        body: '100% Cotton Yarn excels in moisture absorption, natural skin comfort, and reactive dye vibrancy—making it indispensable for casual knitwear, babywear, and woven shirting. 100% Polyester Yarn (75D/36F, 150D/48F, 300D/96F) delivers superior tensile strength, dimensional stability, wrinkle resistance, and rapid wicking for sportswear and technical textiles.',
      },
      {
        heading: '2. Supply Transparency: Own Production vs. Verified Partner Mills',
        body: 'At YARN STORE BD, we maintain full supply chain transparency: our core 100% Cotton Yarns and 40/2–60/2 Embroidery Threads are produced in our own facilities, while specialized Polyester Filament DTY/FDY lots are supplied through our audited, ISO-certified partner texturizing mills in Bangladesh.',
      },
    ],
  },
  {
    slug: 'textile-yarn-quality-testing-guide',
    title: 'Textile Yarn Quality Testing Guide: Uster Evenness, CSP, IPI & Pre-Shipment Audits',
    category: 'Export Guide',
    readTime: '8 min read',
    publishedAt: 'September 24, 2026',
    author: 'Rashedul Islam · Head of Quality Assurance Lab',
    excerpt:
      'What European and North American textile buyers verify on a Certificate of Analysis (CoA) before approving bulk shipment release.',
    image: '/images/warehouse-export.jpg',
    targetKeywords: ['Textile Yarn Quality Testing Guide', 'Uster Yarn Report', 'Yarn Sourcing from Bangladesh'],
    sections: [
      {
        heading: '1. U% Evenness & Imperfection Index (IPI)',
        body: 'Electronic capacitive testing measures mass variation (U% or CVm%) alongside Thin places (-50%), Thick places (+50%), and Neps (+200%) per 1,000 meters. Consistent IPI values prevent barre streaks and fabric pinholes after dyeing.',
      },
      {
        heading: '2. Lea Count Strength Product (CSP) & Single-Yarn Tenacity',
        body: 'High-speed air-jet looms and multi-feed circular knitters demand high elongation and breaking force. Every export lot at YARN STORE BD undergoes Lea CSP testing, cone Shore-hardness checks, and UV light contamination screening prior to carton sealing.',
      },
    ],
  },
];

export const FAQ_ITEMS = [
  {
    category: 'MOQ & Bulk Orders',
    q: 'What is your Minimum Order Quantity (MOQ) for international export orders?',
    a: 'For standard 100% Cotton Yarn, 100% Polyester Yarn, and Cotton Yarn Cones, our commercial export MOQ starts at 1,000 KG – 1,500 KG for LCL trial orders and 9,500 KG (20ft FCL) or 22,000 KG (40ft HQ) for full container loads. For 40/2 & 60/2 Cotton Embroidery Thread, MOQ starts at 300 KG across assorted shade-card colors.',
  },
  {
    category: 'Supply Model',
    q: 'Is YARN STORE BD a direct manufacturer or a trading company?',
    a: 'We operate both divisions with 100% transparency. Our Manufacturing Division produces 100% Cotton Yarn, Auto-Coner Yarn Cones, and MHR 40/2 & 60/2 Embroidery Thread in our own facilities. Our Trading & Sourcing Division supplies specialized counts such as 75D/36F, 150D/48F, and 300D/96F Polyester Filament Yarn through audited, ISO-certified partner mills in Bangladesh. Every product page clearly states its exact Supply Type.',
  },
  {
    category: 'Samples',
    q: 'Can international buyers request physical yarn sample cones before placing a bulk order?',
    a: 'Yes. Qualified B2B buyers can request 2–4 testing cones plus our Master Shade Card via the Request a Sample page. Sample cones are prepared within 48–72 hours along with a laboratory Uster/CoA test sheet and dispatched globally via DHL, FedEx, or UPS.',
  },
  {
    category: 'Pricing & Quotations',
    q: 'How quickly will I receive an official quotation after submitting an RFQ?',
    a: 'You receive an instant RFQ Reference Number (e.g., YSB-RFQ-2026-XXX) upon submission. Our Export Sales Team verifies current cotton/filament index rates, mill slot availability, and freight to issue a Manager-Approved PDF Quotation in USD, EUR, or GBP within 12–24 business hours.',
  },
  {
    category: 'Shipping & Export',
    q: 'Which Incoterms and export documents do you support from Bangladesh?',
    a: 'We support EXW, FOB Chattogram, CFR, CIF (USA, UK, EU, Turkey, UAE, Canada, Australia), and DAP where applicable. Standard export documentation includes Commercial Invoice, Detailed Packing List, Certificate of Origin (COO), Bill of Lading / Air Waybill, Export Registration Certificate (ERC) compliance, Phytosanitary/Fumigation certificate, and Lot Quality Test Report.',
  },
  {
    category: 'Payment Terms',
    q: 'What international payment methods do you accept?',
    a: 'For international bulk shipments we accept 100% Irrevocable Letter of Credit (L/C at Sight) from prime international banks, T/T Bank Wire (e.g., 30% deposit with order confirmation, 70% against scanned Bill of Lading), and approved CAD terms for established repeat buyers.',
  },
  {
    category: 'Quality & Certifications',
    q: 'How do you guarantee consistent yarn quality across repeat shipments?',
    a: 'Every batch retains a master lot reference cone for 12 months, undergoes 4-stage inspection (raw fiber, roving/spinning, auto-coner electronic clearing, and pre-shipment carton audit), and meets ISO 9001:2015 and OEKO-TEX® Standard 100 chemical safety benchmarks.',
  },
];

export const CURRENCY_RATES: Record<'USD' | 'EUR' | 'GBP', { symbol: string; rate: number; sourceNote: string }> = {
  USD: { symbol: '$', rate: 1, sourceNote: 'Primary B2B Settlement Currency (USD)' },
  EUR: { symbol: '€', rate: 0.92, sourceNote: 'Indicative ECB Ref Rate (1 USD = 0.92 EUR · Oct 31, 2026 — Final Quote set by Sales Team)' },
  GBP: { symbol: '£', rate: 0.79, sourceNote: 'Indicative BoE Ref Rate (1 USD = 0.79 GBP · Oct 31, 2026 — Final Quote set by Sales Team)' },
};

export const LANGUAGE_LABELS: Record<'EN' | 'DE' | 'ES' | 'AR', { name: string; heroBadge: string; ctaQuote: string }> = {
  EN: { name: 'English', heroBadge: 'BANGLADESH TEXTILE SUPPLIER', ctaQuote: 'Get a Quote' },
  DE: { name: 'Deutsch', heroBadge: 'TEXTILLIEFERANT AUS BANGLADESCH', ctaQuote: 'Angebot anfordern' },
  ES: { name: 'Español', heroBadge: 'PROVEEDOR TEXTIL DE BANGLADESH', ctaQuote: 'Solicitar Cotización' },
  AR: { name: 'العربية', heroBadge: 'مورد الغزول والمنسوجات من بنغلاديش', ctaQuote: 'اطلب عرض سعر' },
};
