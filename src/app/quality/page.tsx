import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, CheckCircle2, Microscope } from 'lucide-react';
import { PublicShell } from '@/components/SiteChrome';

export const metadata: Metadata = {
  title: 'Quality Assurance & Uster Laboratory Yarn Testing',
  description:
    'Discover YARN STORE BD 4-stage textile quality inspection, Uster Tester 6 evenness, Lea CSP strength, hairiness index, and pre-shipment carton auditing.',
};

export default function QualityPage() {
  return (
    <PublicShell>
      <section className="bg-gradient-to-r from-[#053517] to-[#086A2C] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-extrabold">
              <Microscope className="w-3.5 h-3.5" /> IN-HOUSE QUALITY CONTROL LAB
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
              Every Lot Tested Before Container Sealing
            </h1>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              International knitters and weavers rely on predictable machine efficiency. Every production and partner lot undergoes electronic Uster evenness, tensile strength, moisture regain, and UV shade-band inspection before dispatch.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/request-sample"
                className="inline-flex items-center gap-2 bg-[#F28C18] hover:bg-[#DF7A0B] text-white font-bold text-sm px-6 py-3 rounded-full"
              >
                Request Sample + Lab CoA <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/certifications"
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold text-sm px-6 py-3 rounded-full"
              >
                View Certifications
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <img
              src="/images/quality-lab.jpg"
              alt="Yarn Quality Inspection Laboratory"
              className="rounded-3xl shadow-2xl border-2 border-white/15 h-72 w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs">
          {[
            {
              title: 'U% Mass Evenness & IPI',
              body: 'Capacitive testing of thin places (-50%), thick places (+50%), and neps (+200%) per 1,000m to prevent fabric barre.',
            },
            {
              title: 'Lea CSP & Single-End Tenacity',
              body: 'Verified breaking force (cN/tex) and elongation for zero stops on high-RPM circular knitters and air-jet looms.',
            },
            {
              title: 'Shore Cone Density & Waxing',
              body: 'Durometer hardness verification (Shore 33–36 for soft dye cones; 68–72 for waxed knitting cones).',
            },
            {
              title: 'ISO 105 Wash & Rub Fastness',
              body: 'Spectrophotometer Delta-E < 0.8 shade continuity and Grade 4.5+ colorfastness on dyed & embroidery threads.',
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft space-y-2">
              <CheckCircle2 className="w-5 h-5 text-[#08752B]" />
              <h2 className="text-sm font-extrabold text-slate-900">{item.title}</h2>
              <p className="text-slate-600 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
