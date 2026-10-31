import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, CheckCircle2, Package, ShieldCheck } from 'lucide-react';
import { PublicShell } from '@/components/SiteChrome';
import { readDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Trading & Verified Mill Sourcing Division — Polyester Filament & Blended Yarns',
  description:
    'Transparent B2B yarn sourcing from audited ISO-certified partner mills in Bangladesh for 75D/36F, 150D/48F, 300D/96F Polyester Filament, CVC, PC, and Mélange yarns.',
};

export default function TradingPage() {
  const db = readDB();
  const partnerMills = db.facilities.filter((f) => f.type === 'Verified Partner Mill');

  return (
    <PublicShell>
      <section className="bg-gradient-to-r from-[#063B1B] via-[#0B5A28] to-[#136F34] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold">
            <Package className="w-3.5 h-3.5" /> TRADING &amp; SOURCING DIVISION
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
            Audited Partner-Mill Sourcing with Single-Window Export Accountability
          </h1>
          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
            When international buyers require continuous Polyester Filament (75D/36F, 150D/48F, 300D/96F), GRS recycled polyester, or multi-count CVC/PC blends, our Trading Division sources exclusively from pre-audited Bangladeshi partner mills—inspected by YARN STORE BD&apos;s own QA team prior to container sealing.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/request-quote?product=Polyester+Yarn"
              className="inline-flex items-center gap-2 bg-[#F28C18] hover:bg-[#DF7A0B] text-white font-bold text-sm px-6 py-3 rounded-full"
            >
              Submit Multi-Mill Sourcing RFQ <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/wholesale"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold text-sm px-6 py-3 rounded-full"
            >
              Wholesale &amp; Bulk Container Guide
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          {partnerMills.map((m) => (
            <div key={m.id} className="bg-white rounded-3xl border border-amber-200 p-6 shadow-soft space-y-3">
              <div className="flex justify-between text-xs">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">
                  Supplied through Verified Manufacturing Partner
                </span>
                <span className="font-mono font-bold text-slate-400">{m.code}</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">{m.name}</h2>
              <p className="text-xs text-slate-500">{m.location}</p>
              <p className="text-sm text-slate-700">{m.specialization}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {m.certifications.map((c) => (
                  <span key={c} className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#ECF6EE] rounded-3xl p-7 border border-emerald-200 grid sm:grid-cols-3 gap-5 text-xs">
          {[
            {
              title: 'Zero Misrepresentation Policy',
              body: 'Every quotation and datasheet explicitly states whether the lot is Manufactured by YARN STORE BD or Supplied through a Verified Partner Mill.',
            },
            {
              title: 'Independent Lot Lab Testing',
              body: 'Partner mill lots undergo independent tenacity, Uster evenness, and shade continuity verification at our QA lab before dispatch.',
            },
            {
              title: 'Consolidated Mixed Containers',
              body: 'Combine Cotton Yarn, Polyester Filament, and Embroidery Thread into one consolidated 20ft or 40ft HQ export container.',
            },
          ].map((item) => (
            <div key={item.title} className="space-y-1.5">
              <div className="font-extrabold text-sm text-[#063B1B] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#08752B]" /> {item.title}
              </div>
              <p className="text-slate-700 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
