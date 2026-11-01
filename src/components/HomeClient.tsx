'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Play,
  Gem,
  Truck,
  Handshake,
  Headphones,
  Factory,
  Globe,
  ShieldCheck,
  Settings,
  Users,
  Mail,
  X,
  Package,
  Building2,
  Sparkles,
} from 'lucide-react';
import { WorldExportMap } from './WorldExportMap';
import { CertificationEmblems, CountryFlagAvatar } from './VisualBadges';
import { useGlobalPrefs } from './SiteChrome';
import {
  ContentProtectionShield,
  ProtectedProductImage,
} from './ContentProtectionShield';
import { LANGUAGE_LABELS } from '@/lib/staticContent';
import type { ProductItem, SecuritySettings } from '@/lib/db';

const HERO_SLIDES = [
  {
    titleTop: 'Your Trusted Global',
    titleAccent: 'Yarn Supply Partner',
    subtitle: 'Quality Yarn. Reliable Supply. Stronger Partnerships.',
    image: '/images/hero-yarn-mill.jpg',
  },
  {
    titleTop: 'Export-Grade Cotton &',
    titleAccent: 'Polyester Filament Yarn',
    subtitle: 'Direct Spinning & Verified Mill Sourcing from Dhaka, Bangladesh.',
    image: '/images/factory-floor.jpg',
  },
  {
    titleTop: 'High-Speed Industrial',
    titleAccent: 'Embroidery Thread 40/2 & 60/2',
    subtitle: '480+ Colorfast Shades · OEKO-TEX® Certified · Global DHL Sample Dispatch.',
    image: '/images/warehouse-export.jpg',
  },
  {
    titleTop: 'Container-Scale B2B',
    titleAccent: 'FOB & CIF Export Logistics',
    subtitle: 'Serving Garment Factories, Knitting Mills & Importers in 25+ Countries.',
    image: '/images/hero-yarn-mill.jpg',
  },
];

const TESTIMONIAL_PAGES = [
  [
    {
      country: 'USA' as const,
      quote: 'Excellent quality and professional service. YARN STORE BD is our long-term partner.',
      name: 'John Smith',
      location: 'USA',
    },
    {
      country: 'UK' as const,
      quote: 'Reliable supplier with on-time delivery.',
      name: 'David Wilson',
      location: 'UK',
    },
    {
      country: 'Germany' as const,
      quote: 'Great products and outstanding support.',
      name: 'Anna Müller',
      location: 'Germany',
    },
  ],
  [
    {
      country: 'UAE' as const,
      quote: 'Consistent Ne 20/1 and 30/1 cone winding quality with fast Jebel Ali documentation.',
      name: 'Khalid Al-Mansoor',
      location: 'UAE',
    },
    {
      country: 'Turkey' as const,
      quote: 'Uniform soft dyeing cones and transparent Uster test reports on every container lot.',
      name: 'Emre Yilmaz',
      location: 'Turkey',
    },
    {
      country: 'Germany' as const,
      quote: 'Clear distinction between own-manufactured cotton yarn and audited filament partners.',
      name: 'Markus Weber',
      location: 'Germany',
    },
  ],
];

export function HomeClient({
  products,
  initialSecuritySettings,
}: {
  products: ProductItem[];
  initialSecuritySettings?: SecuritySettings;
}) {
  const { lang } = useGlobalPrefs();
  const [heroIdx, setHeroIdx] = useState(0);
  const [testimonialPage, setTestimonialPage] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const slide = HERO_SLIDES[heroIdx];
  const coreFour = products.slice(0, 4);

  return (
    <div className="bg-white overflow-x-hidden">
      {/* =====================================================================
          1. HERO SECTION — Pixel-Faithful to Screenshot #1
      ===================================================================== */}
      <section className="relative bg-[#053B1A] text-white overflow-hidden">
        {/* Background Industrial Spinning Photo */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url('${slide.image}')` }}
        />
        {/* Rich Left-to-Right Deep Forest Green Gradient Overlay matching Screenshot #1 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(4,48,20,0.97) 0%, rgba(6,68,29,0.93) 42%, rgba(7,78,34,0.48) 68%, rgba(7,78,34,0.12) 100%)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32">
          <div className="max-w-2xl">
            {/* Green Pill Badge */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#22A947] text-white text-[11px] sm:text-xs font-extrabold tracking-[0.08em] uppercase shadow-sm mb-5">
              {LANGUAGE_LABELS[lang].heroBadge}
            </div>

            {/* Two-Line Bold Display Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold leading-[1.1] tracking-tight">
              <span className="block text-white">{slide.titleTop}</span>
              <span className="block text-[#F59E0B] mt-1">{slide.titleAccent}</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-base sm:text-lg lg:text-[19px] font-medium text-emerald-50/95">
              {slide.subtitle}
            </p>

            {/* 3 Green Checkmark Highlights */}
            <div className="mt-5 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-white">
              {['Bulk Orders', 'Export Enquiries', 'Product Samples'].map((pill) => (
                <div key={pill} className="inline-flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#043014]" />
                  </span>
                  <span>{pill}</span>
                </div>
              ))}
            </div>

            {/* Primary Orange Pill Button + Watch Our Factory Trigger */}
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                href="/request-quote"
                className="inline-flex items-center gap-2.5 bg-[#F28C18] hover:bg-[#DF7A0B] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5"
              >
                <span>Request a Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                id="factory-tour"
                onClick={() => setVideoModalOpen(true)}
                className="inline-flex items-center gap-3 group text-left"
              >
                <span className="w-11 h-11 rounded-full bg-white text-[#08752B] group-hover:scale-105 transition flex items-center justify-center shadow-md">
                  <Play className="w-4 h-4 fill-[#08752B] ml-0.5" />
                </span>
                <span className="leading-tight">
                  <span className="block text-xs font-bold text-white">Watch</span>
                  <span className="block text-xs text-emerald-100 group-hover:text-amber-300 transition">
                    Watch Our Factory
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* Center Bottom Carousel Dots matching Screenshot #1 */}
          <div className="mt-10 flex items-center justify-center gap-2">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Slide ${idx + 1}`}
                onClick={() => setHeroIdx(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  heroIdx === idx ? 'w-6 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Signature Sweeping Green, White & Orange Curved Wave Ribbon at Hero Bottom */}
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-14 sm:h-20 lg:h-24 pointer-events-none"
        >
          {/* Green upper ribbon */}
          <path
            d="M0,96 C420,58 920,115 1440,14 L1440,120 L0,120 Z"
            fill="#148038"
          />
          {/* Orange bold ribbon */}
          <path
            d="M680,120 C980,118 1220,82 1440,34 L1440,120 Z"
            fill="#F28C18"
          />
          {/* Crisp white base transition */}
          <path
            d="M0,108 C460,68 960,126 1440,76 L1440,120 L0,120 Z"
            fill="#FFFFFF"
          />
        </svg>
      </section>

      {/* =====================================================================
          2. 4-ITEM MINT TRUST & BUSINESS HIGHLIGHTS BAR — Exact Match
      ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-6">
        <div className="bg-[#ECF6EE] border border-emerald-100 rounded-2xl px-4 py-4 sm:py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-emerald-800/15">
          {[
            { icon: Gem, title: 'Premium Quality', sub: 'Guaranteed' },
            { icon: Truck, title: 'On-Time Delivery', sub: 'Worldwide' },
            { icon: Handshake, title: 'Long-Term Partnership', sub: 'Trusted B2B Supply' },
            { icon: Headphones, title: 'Dedicated Support', sub: 'International Export Desk' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-center justify-start lg:justify-center gap-3.5 py-2.5 lg:py-1 px-4"
              >
                <div className="w-10 h-10 rounded-xl bg-white/80 text-[#08752B] flex items-center justify-center shadow-sm shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="leading-snug">
                  <div className="text-sm font-bold text-[#10371E]">{item.title}</div>
                  <div className="text-xs text-slate-600">{item.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          3. OUR PRODUCTS — Premium Yarn & Thread Collection (4 Cards + Botanical Accents)
      ===================================================================== */}
      <section className="relative py-10 sm:py-14 overflow-hidden">
        {/* Subtle Botanical Leaf Line-Art Watermarks on Left & Right like Screenshot #1 */}
        <svg
          viewBox="0 0 180 360"
          className="hidden xl:block absolute left-0 top-8 w-40 text-emerald-900/[0.05] pointer-events-none"
          fill="currentColor"
        >
          <path d="M10 340 C 30 220, 90 120, 150 20 C 120 140, 80 250, 10 340 Z" />
          <path d="M0 260 C 40 200, 85 160, 135 120 C 95 190, 50 235, 0 260 Z" />
        </svg>
        <svg
          viewBox="0 0 180 360"
          className="hidden xl:block absolute right-0 top-8 w-40 text-emerald-900/[0.05] pointer-events-none scale-x-[-1]"
          fill="currentColor"
        >
          <path d="M10 340 C 30 220, 90 120, 150 20 C 120 140, 80 250, 10 340 Z" />
          <path d="M0 260 C 40 200, 85 160, 135 120 C 95 190, 50 235, 0 260 Z" />
        </svg>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#08752B]">
              <span className="w-6 h-[1.5px] bg-[#08752B]" />
              <span>OUR PRODUCTS</span>
              <span className="w-6 h-[1.5px] bg-[#08752B]" />
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#10371E] tracking-tight">
              Premium Yarn &amp; Thread Collection
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              High-quality yarns for garment, textile and embroidery industries worldwide.
            </p>
          </div>

          {/* 4 Product Cards Grid */}
          <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreFour.map((item) => {
              const isOwn = item.supplyType === 'Manufactured by YARN STORE BD';
              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl border border-slate-200/85 shadow-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100 p-2.5 pb-0">
                    <div className="w-full h-full rounded-xl overflow-hidden relative">
                      <ProtectedProductImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        protectedEnabled={initialSecuritySettings?.productScreenshotProtection !== false}
                      />
                      <span
                        className={`absolute top-2 left-2 z-20 text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm ${
                          isOwn
                            ? 'bg-[#08752B]/90 text-white'
                            : 'bg-amber-500/95 text-white'
                        }`}
                      >
                        {isOwn ? 'Own Production' : 'Verified Partner Mill'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 text-center flex-1 flex flex-col items-center justify-between">
                    <div>
                      <h3 className="text-lg font-extrabold text-[#17231C]">{item.shortName}</h3>
                      <p className="mt-1.5 text-xs text-slate-500 line-clamp-2">{item.shortDescription}</p>
                    </div>

                    <Link
                      href={`/products/${item.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-[#08752B]/60 text-[#08752B] group-hover:bg-[#08752B] group-hover:text-white text-xs font-bold transition-colors"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. ABOUT YARN STORE BD — 3-Column Layout with "Since 2010" Badge
      ===================================================================== */}
      <section className="py-10 sm:py-14 bg-[#FAFDFB] border-y border-emerald-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Image + Circular "Since 2010 Trusted Supplier" Badge */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-emerald-100">
                <img
                  src="/images/factory-floor.jpg"
                  alt="YARN STORE BD Spinning Mill Facility"
                  className="w-full h-[270px] sm:h-[310px] object-cover"
                />
              </div>

              {/* Circular Overlapping Since 2010 Badge matching Screenshot #1 */}
              <div className="absolute -bottom-4 right-4 sm:right-6 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#073E1C] text-white border-4 border-white shadow-xl flex flex-col items-center justify-center text-center ring-2 ring-[#22A947]">
                <span className="text-[11px] font-medium text-emerald-200">Since</span>
                <span className="text-2xl sm:text-3xl font-black leading-none tracking-tight my-0.5">
                  2010
                </span>
                <span className="text-[10px] font-bold text-amber-300">Trusted Supplier</span>
              </div>
            </div>

            {/* Center Story + Supply Division Transparency */}
            <div className="lg:col-span-4 space-y-4 pt-2 lg:pt-0">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#08752B]">
                <span className="w-5 h-[1.5px] bg-[#08752B]" />
                <span>ABOUT YARN STORE BD</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10371E] leading-tight">
                Building Global Connections with Quality Yarn
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                We are a leading yarn supplier from Bangladesh (<strong>MHR Thread &amp; Accessories</strong>), offering both in-house manufacturing and verified mill trading solutions. With a commitment to quality, transparent sourcing, and on-time shipment, we serve garment factories, wholesalers, and importers across the globe.
              </p>

              {/* Dual Supply Channel Pills (Blueprint Part 1.1) */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <Link
                  href="/manufacturing"
                  className="p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200 hover:bg-emerald-100 transition text-xs"
                >
                  <div className="font-bold text-[#08752B] flex items-center gap-1">
                    <Factory className="w-3.5 h-3.5" /> Own Manufacturing
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Cotton Yarn, Cones &amp; Embroidery Thread</div>
                </Link>
                <Link
                  href="/trading"
                  className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 hover:bg-amber-100 transition text-xs"
                >
                  <div className="font-bold text-amber-800 flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" /> Trading &amp; Sourcing
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Audited Partner Filament &amp; Blended Mills</div>
                </Link>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 bg-[#085D28] hover:bg-[#08752B] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-full shadow-sm transition"
                >
                  <span>Know More About Us</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right 3 Stacked Feature Cards matching Screenshot #1 */}
            <div className="lg:col-span-3 space-y-3">
              {[
                {
                  icon: Factory,
                  title: 'Our Factory & Sourcing',
                  desc: '475+ MT/month own production + audited partner mills',
                  href: '/manufacturing',
                },
                {
                  icon: Globe,
                  title: 'Global Market Worldwide',
                  desc: 'Exporting to USA, UK, Germany, Turkey & UAE',
                  href: '/export',
                },
                {
                  icon: ShieldCheck,
                  title: 'ISO Certified Quality',
                  desc: 'Uster Tester 6 lab reports & OEKO-TEX® standards',
                  href: '/quality',
                },
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={idx}
                    href={card.href}
                    className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:border-[#08752B] transition"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#ECF6EE] text-[#08752B] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-[#10371E]">{card.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{card.desc}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. WHY CHOOSE US + GLOBAL WORLD EXPORT MAP — Exact Match to Screenshot #1
      ===================================================================== */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 5 Pillar Icons */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#08752B]">
                <span className="w-5 h-[1.5px] bg-[#08752B]" />
                <span>WHY CHOOSE US</span>
              </div>
              <h2 className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-[#10371E]">
                Your Reliable Yarn Partner
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-xl">
                Serving garment manufacturers, circular knitting mills, denim weavers, and embroidery houses with dependable bulk container supply from Bangladesh.
              </p>

              <div className="mt-7 grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-0 sm:divide-x divide-slate-200 bg-[#F9FCFA] sm:bg-transparent p-3 sm:p-0 rounded-2xl">
                {[
                  { icon: CheckCircle2, l1: 'Consistent', l2: 'Quality' },
                  { icon: Settings, l1: 'Competitive', l2: 'Pricing' },
                  { icon: Users, l1: 'Professional', l2: 'Team' },
                  { icon: Globe, l1: 'Global', l2: 'Supply' },
                  { icon: Handshake, l1: 'Long-Term', l2: 'Support' },
                ].map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <div key={i} className="flex flex-col items-center text-center px-2 py-2">
                      <div className="w-11 h-11 rounded-full bg-[#ECF6EE] text-[#08752B] flex items-center justify-center mb-2.5">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-[#17231C] leading-tight">{p.l1}</span>
                      <span className="text-xs font-bold text-[#17231C] leading-tight">{p.l2}</span>
                    </div>
                  );
                })}
              </div>

              {/* Quick Industries Strip (Blueprint Homepage Section 07) */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-700 inline-flex items-center gap-1 mr-1">
                  <Building2 className="w-3.5 h-3.5 text-[#08752B]" /> Industries Served:
                </span>
                {['RMG Garments', 'Circular Knitting', 'Woven & Denim', 'Multi-Head Embroidery', 'Home Textiles'].map(
                  (ind) => (
                    <Link
                      key={ind}
                      href="/industries"
                      className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-[#08752B] text-slate-700 font-medium transition"
                    >
                      {ind}
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Right Custom World Export Map SVG */}
            <div className="lg:col-span-6">
              <WorldExportMap />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. CERTIFICATIONS & EXPORT CAPABILITY DARK-GREEN BANNER + CONTAINER SHIP
      ===================================================================== */}
      <section className="relative bg-[#063D1C] text-white overflow-hidden">
        {/* Right-side Container Cargo Ship Photo Blended into Dark Green Left */}
        <div
          className="hidden md:block absolute inset-y-0 right-0 w-[48%] bg-cover bg-center"
          style={{ backgroundImage: "url('/images/cargo-ship-port.jpg')" }}
        />
        <div
          className="hidden md:block absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, #063D1C 0%, #063D1C 52%, rgba(6,61,28,0.82) 62%, rgba(6,61,28,0.08) 82%, rgba(6,61,28,0) 100%)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-11">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-4 lg:border-r lg:border-emerald-600/50 lg:pr-6">
              <h2 className="text-xl sm:text-2xl font-extrabold leading-snug">
                Our Certifications
                <span className="block">&amp; Export Capability</span>
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-emerald-100/90">
                Meeting International Standards · FOB Chattogram &amp; CIF Worldwide
              </p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                <Link href="/certifications" className="text-amber-300 hover:underline font-semibold">
                  Verify Certificates →
                </Link>
                <Link href="/export" className="text-emerald-200 hover:underline font-medium">
                  Export Procedure →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex items-center justify-start lg:justify-center">
              <CertificationEmblems />
            </div>

            <div className="md:hidden rounded-xl overflow-hidden border border-white/15">
              <img
                src="/images/cargo-ship-port.jpg"
                alt="International Export Container Vessel"
                className="w-full h-44 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. WHAT OUR CLIENTS SAY — Trusted by Global Buyers (3 Flag Cards)
      ===================================================================== */}
      <section className="py-12 sm:py-16 bg-[#F9FBFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.15em] text-[#08752B]">
              <span className="w-5 h-[1.5px] bg-[#08752B]" />
              <span>WHAT OUR CLIENTS SAY</span>
              <span className="w-5 h-[1.5px] bg-[#08752B]" />
            </div>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-[#10371E]">
              Trusted by Global Buyers
            </h2>
          </div>

          <div className="mt-9 grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIAL_PAGES[testimonialPage].map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-soft relative"
              >
                <span className="text-3xl font-serif font-black text-[#08752B] leading-none block mb-2">
                  “
                </span>
                <div className="flex items-start gap-4">
                  <CountryFlagAvatar country={t.country} />
                  <div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="mt-3">
                      <div className="text-sm font-extrabold text-[#17231C]">{t.name}</div>
                      <div className="text-xs text-slate-500 font-medium">{t.location}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {TESTIMONIAL_PAGES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Testimonial page ${idx + 1}`}
                onClick={() => setTestimonialPage(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  testimonialPage === idx ? 'w-5 bg-[#08752B]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          8. DUAL SPLIT BAND — FAQ Left + "Ready to Source Quality Yarn?" CTA Card Right
      ===================================================================== */}
      <section className="py-10 sm:py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left FAQ Card with 3 White Yarn Cones + Green Leaves Photo */}
            <div className="lg:col-span-6 bg-[#F5F9F6] border border-emerald-100 rounded-2xl overflow-hidden flex flex-col sm:flex-row items-center">
              <div className="w-full sm:w-52 h-44 sm:h-full shrink-0">
                <img
                  src="/images/faq-cones-leaves.jpg"
                  alt="Sustainable White Cotton Yarn Cones"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex-1">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.13em] text-[#08752B]">
                  <span className="w-4 h-[1.5px] bg-[#08752B]" />
                  <span>FREQUENTLY ASKED QUESTIONS</span>
                </div>
                <h3 className="mt-1 text-xl sm:text-2xl font-extrabold text-[#10371E]">
                  Have Any Questions?
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  Find quick answers on MOQ, sample cones, Incoterms, L/C payment &amp; lead times.
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <Link
                    href="/faq"
                    className="inline-flex items-center gap-2 bg-[#085D28] hover:bg-[#08752B] text-white text-xs font-bold px-5 py-2.5 rounded-full transition"
                  >
                    <span>View FAQ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/request-sample"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-emerald-300 text-[#08752B] hover:bg-emerald-50 text-xs font-bold transition"
                  >
                    Request Sample
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Angled Green CTA Card matching Screenshot #1 */}
            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#138A3B] via-[#0B6E2C] to-[#074F20] text-white p-6 sm:p-8 flex items-center gap-5 shadow-lg">
              {/* Angled decorative light-green ribbon accent on left */}
              <div className="hidden sm:flex w-16 h-16 rounded-full bg-white text-[#08752B] items-center justify-center shrink-0 shadow-md">
                <Mail className="w-7 h-7" />
              </div>

              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Ready to Source Quality Yarn?
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-emerald-100 leading-relaxed">
                  Tell us your requirements and receive a manager-approved business quotation within 12–24 hours.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-white hover:bg-emerald-50 text-[#085D28] text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-full shadow transition"
                  >
                    <span>Contact Us</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/request-quote"
                    className="inline-flex items-center gap-1.5 bg-[#F28C18] hover:bg-[#DF7A0B] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full shadow transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Multi-Step RFQ</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          VIRTUAL FACTORY & QUALITY TOUR MODAL
      ===================================================================== */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-emerald-200">
            <div className="bg-[#063B1B] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base">
                  YARN STORE BD — Spinning, Winding &amp; Export Facility Showcase
                </h3>
                <p className="text-xs text-emerald-200">
                  Gazipur Ring Spinning · Narayanganj MHR Thread Plant · Uster Quality Lab
                </p>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/15"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <img src="/images/factory-floor.jpg" alt="Spinning Line" className="h-36 w-full object-cover" />
                  <div className="p-2.5 text-xs">
                    <div className="font-bold text-slate-900">1. Ring Spinning &amp; Auto-Coner</div>
                    <div className="text-slate-500">380 MT/month Cotton &amp; Cones</div>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <img src="/images/quality-lab.jpg" alt="Uster Lab" className="h-36 w-full object-cover" />
                  <div className="p-2.5 text-xs">
                    <div className="font-bold text-slate-900">2. Uster Quality Inspection</div>
                    <div className="text-slate-500">CSP, U%, IPI &amp; Shade Fastness</div>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <img src="/images/warehouse-export.jpg" alt="Export Packing" className="h-36 w-full object-cover" />
                  <div className="p-2.5 text-xs">
                    <div className="font-bold text-slate-900">3. Moisture-Proof Export Packing</div>
                    <div className="text-slate-500">20ft &amp; 40ft HQ Chattogram Loading</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#ECF6EE] p-4 rounded-xl text-xs">
                <span className="font-semibold text-[#063B1B]">
                  Want a live video walkthrough with our Production &amp; Export Manager?
                </span>
                <div className="flex gap-2">
                  <Link
                    href="/gallery"
                    onClick={() => setVideoModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-white text-[#08752B] font-bold border border-emerald-200"
                  >
                    Full Photo Gallery
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setVideoModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-[#08752B] text-white font-bold"
                  >
                    Schedule Live Mill Call →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
