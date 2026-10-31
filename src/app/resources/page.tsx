'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calculator, Container, FileSpreadsheet } from 'lucide-react';
import { PublicShell } from '@/components/SiteChrome';

export default function ResourcesPage() {
  const [ne, setNe] = useState<number>(30);
  const [containerType, setContainerType] = useState<'20ft' | '40hq'>('40hq');
  const [coneWeightKg, setConeWeightKg] = useState<number>(1.89);

  const validNe = ne > 0 ? ne : 1;
  const nm = (validNe * 1.693).toFixed(1);
  const denier = (5315 / validNe).toFixed(0);
  const tex = (590.5 / validNe).toFixed(1);

  const netContainerKg = containerType === '20ft' ? 9500 : 22500;
  const approxCones = Math.round(netContainerKg / (coneWeightKg > 0 ? coneWeightKg : 1.89));
  const approxCartons = Math.round(approxCones / 24);

  return (
    <PublicShell>
      <section className="bg-[#063B1B] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
            TECHNICAL BUYER TOOLS &amp; RESOURCES
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            Yarn Count Converter, Container Estimator &amp; Export Guides
          </h1>
          <p className="text-sm text-emerald-100">
            Built for international textile sourcing managers preparing accurate B2B RFQs.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-2 gap-7">
        {/* Interactive Yarn Count Converter */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-[#08752B] font-extrabold text-lg">
            <Calculator className="w-5 h-5" />
            <h2>Live Yarn Count Converter (Ne ↔ Nm ↔ Denier ↔ Tex)</h2>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">
              Enter English Cotton Count (Ne):
            </label>
            <input
              type="number"
              min={1}
              max={120}
              value={ne}
              onChange={(e) => setNe(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-emerald-300 text-lg font-black text-[#08752B]"
            />
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-[#ECF6EE]">
              <div className="text-xs text-slate-600 font-semibold">Metric (Nm)</div>
              <div className="text-xl font-black text-slate-900 mt-1">{nm}</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#ECF6EE]">
              <div className="text-xs text-slate-600 font-semibold">Denier (D)</div>
              <div className="text-xl font-black text-slate-900 mt-1">{denier}D</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#ECF6EE]">
              <div className="text-xs text-slate-600 font-semibold">Tex</div>
              <div className="text-xl font-black text-slate-900 mt-1">{tex}</div>
            </div>
          </div>
        </div>

        {/* Interactive Container Load Calculator */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-[#08752B] font-extrabold text-lg">
            <Container className="w-5 h-5" />
            <h2>FCL Export Container Load Calculator</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-600 block mb-1">Container Size</label>
              <select
                value={containerType}
                onChange={(e) => setContainerType(e.target.value as '20ft' | '40hq')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold"
              >
                <option value="20ft">20ft Standard FCL (~9.5 MT)</option>
                <option value="40hq">40ft High-Cube HQ (~22.5 MT)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-600 block mb-1">Cone Weight (KG)</label>
              <select
                value={coneWeightKg}
                onChange={(e) => setConeWeightKg(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold"
              >
                <option value={1.25}>1.25 kg (Soft Dye Cone)</option>
                <option value={1.89}>1.89 kg (Standard Knitting)</option>
                <option value={2.08}>2.08 kg (Export Cone)</option>
                <option value={2.5}>2.50 kg (Jumbo Cone)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500">Est. Net Weight</div>
              <div className="text-lg font-black text-[#08752B] mt-1">
                {netContainerKg.toLocaleString()} KG
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500">Total Cones</div>
              <div className="text-lg font-black text-slate-900 mt-1">
                ~{approxCones.toLocaleString()}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500">24-Cone Cartons</div>
              <div className="text-lg font-black text-slate-900 mt-1">
                ~{approxCartons.toLocaleString()}
              </div>
            </div>
          </div>

          <Link
            href="/request-quote"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-[#08752B] hover:underline"
          >
            <FileSpreadsheet className="w-4 h-4" /> Send These Container Parameters to RFQ →
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
