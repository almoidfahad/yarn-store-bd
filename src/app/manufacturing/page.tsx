import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, CheckCircle2, Factory } from 'lucide-react';
import { PublicShell } from '@/components/SiteChrome';
import { readDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Manufacturing Division — Own Spinning, Auto-Coner & Embroidery Thread Production',
  description:
    'Explore YARN STORE BD in-house ring spinning, precision auto-coner winding, and MHR 40/2 & 60/2 mercerized embroidery thread manufacturing facilities in Bangladesh.',
};

export default function ManufacturingPage() {
  const db = readDB();
  const ownUnits = db.facilities.filter((f) => f.type === 'Own Manufacturing Facility');

  return (
    <PublicShell>
      <section className="bg-gradient-to-r from-[#053517] to-[#086A2C] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-extrabold">
              <Factory className="w-3.5 h-3.5" /> OWN PRODUCTION DIVISION
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
              Precision Spinning, Winding &amp; Thread Dyeing in Bangladesh
            </h1>
            <p className="text-sm sm:text-base text-emerald-100">
              Products labeled <strong>&ldquo;Manufactured by YARN STORE BD&rdquo;</strong> are produced directly inside our Gazipur and Narayanganj facilities with full lot traceability from raw cotton bale to export carton.
            </p>
            <Link
              href="/request-quote"
              className="inline-flex items-center gap-2 bg-[#F28C18] hover:bg-[#DF7A0B] text-white font-bold text-sm px-6 py-3 rounded-full"
            >
              Book Mill Production Capacity <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="lg:col-span-5">
            <img
              src="/images/factory-floor.jpg"
              alt="Ring Spinning Frames"
              className="rounded-3xl shadow-2xl border-2 border-white/15 h-72 w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid md:grid-cols-2 gap-6">
          {ownUnits.map((u) => (
            <div key={u.id} className="bg-white rounded-3xl border border-emerald-200 p-6 shadow-soft space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#08752B] font-extrabold">
                  {u.type}
                </span>
                <span className="font-mono font-bold text-slate-400">{u.code}</span>
              </div>
              <h2 className="text-xl font-extrabold text-[#10371E]">{u.name}</h2>
              <p className="text-xs text-slate-500">{u.location}</p>
              <p className="text-sm text-slate-700">{u.specialization}</p>
              <div className="p-3.5 rounded-xl bg-[#F5F9F6] flex justify-between text-xs font-bold">
                <span>Monthly Capacity: {u.monthlyCapacityMt} MT</span>
                <span className="text-[#08752B]">Active Utilization: {u.utilizationPct}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* 5-Stage Production Process */}
        <div className="bg-[#F7FAF8] rounded-3xl p-7 border border-emerald-100">
          <h3 className="text-xl font-extrabold text-[#10371E] mb-5">
            5-Stage In-House Yarn Manufacturing Workflow
          </h3>
          <div className="grid sm:grid-cols-5 gap-4 text-xs">
            {[
              { step: '01', title: 'Bale Selection & Blowroom', desc: 'UV & optical foreign-fiber contamination sorting.' },
              { step: '02', title: 'Carding & Combing', desc: 'Short-staple removal for low nep & smooth yarn surface.' },
              { step: '03', title: 'Ring & Compact Spinning', desc: 'Automated spindle monitoring for Ne 10s–40s counts.' },
              { step: '04', title: 'Auto-Coner Splicing', desc: 'Electronic yarn clearers, waxing & precision cone density.' },
              { step: '05', title: 'Conditioning & Packing', desc: '7.8%–8.5% moisture regain & palletized export cartons.' },
            ].map((s) => (
              <div key={s.step} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-lg font-black text-[#08752B]">{s.step}</span>
                <div className="font-extrabold text-slate-900">{s.title}</div>
                <p className="text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <CheckCircle2 className="w-5 h-5 text-[#08752B]" />
            <span>Need synthetic filament or blended counts outside our own spinning lines?</span>
          </div>
          <Link href="/trading" className="text-xs font-extrabold text-[#08752B] hover:underline">
            View Verified Partner Sourcing Division →
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
