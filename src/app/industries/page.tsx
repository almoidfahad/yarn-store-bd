import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Building2, Layers, Scissors, Shirt, Sparkles } from 'lucide-react';
import { PublicShell } from '@/components/SiteChrome';

export const metadata: Metadata = {
  title: 'Industries We Serve — Garments, Knitting, Weaving, Embroidery & Home Textiles',
  description:
    'Supplying specialized textile yarns and threads for RMG garment factories, circular knitting mills, woven denim plants, and multi-head embroidery units.',
};

export default function IndustriesPage() {
  const sectors = [
    {
      icon: Shirt,
      title: 'RMG Garment Factories',
      yarns: 'Ne 20/1–40/1 Cotton Yarn & Spun Sewing/Embroidery Thread',
      desc: 'Dependable high-tenacity yarns and colorfast threads engineered for export knitwear, polo shirts, fleece hoodies, and woven apparel lines.',
    },
    {
      icon: Layers,
      title: 'Circular & Flatbed Knitting Mills',
      yarns: 'Waxed Combed & Compact Cotton Cones · 75D/36F & 150D/48F DTY',
      desc: 'Paraffin-waxed auto-coner packages with low hairiness and uniform tension for high-RPM Mayer & Cie, Terrot, and Fukuhara machines.',
    },
    {
      icon: Building2,
      title: 'Woven, Twill & Denim Manufacturers',
      yarns: 'Ne 10/1, 16/1, 20/1 Warp-Grade Cotton & 300D/96F Polyester',
      desc: 'High Lea CSP warp and weft yarns designed for air-jet, rapier, and projectile weaving looms with minimal loom stops.',
    },
    {
      icon: Sparkles,
      title: 'Industrial Multi-Head Embroidery Units',
      yarns: '40/2 & 60/2 Mercerized Cotton Embroidery Thread (480+ Shades)',
      desc: 'Silicone-finished low-friction spools for 1,200 SPM Tajima and Barudan monogramming, badges, and fashion embroidery.',
    },
    {
      icon: Scissors,
      title: 'Home Textiles, Terry Towels & Wholesalers',
      yarns: 'Soft Perforated Dye Cones (1.25kg–2.50kg) & Bulk Pallet Packs',
      desc: 'Absorbent carded/combed cotton cones and distributor-ready wholesale cartons for regional textile importers.',
    },
  ];

  return (
    <PublicShell>
      <section className="bg-[#063B1B] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
            B2B SECTORS WE SUPPLY
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            Engineered Yarn Solutions Across Five Core Textile Sectors
          </h1>
          <p className="text-sm text-emerald-100">
            Tailored twist factors, cone densities, and luster finishes matched to your downstream machinery.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sectors.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-[#ECF6EE] text-[#08752B] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-extrabold text-[#10371E]">{s.title}</h2>
                <div className="text-xs font-bold text-[#08752B] bg-emerald-50 px-3 py-1.5 rounded-lg">
                  {s.yarns}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
              <Link
                href="/request-quote"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#08752B] hover:underline"
              >
                Request Sector Quotation <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </section>
    </PublicShell>
  );
}
