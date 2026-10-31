import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Boxes, CheckCircle2 } from 'lucide-react';
import { PublicShell } from '@/components/SiteChrome';

export const metadata: Metadata = {
  title: 'Wholesale & Bulk Container Yarn Orders — MOQ, FCL Loading & Contract Supply',
  description:
    'B2B wholesale yarn MOQ, 20ft FCL & 40ft HQ container capacities, and repeat contract supply programs from YARN STORE BD.',
};

export default function WholesalePage() {
  return (
    <PublicShell>
      <section className="bg-[#063B1B] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-extrabold">
            <Boxes className="w-3.5 h-3.5" /> WHOLESALE &amp; BULK SUPPLY PROGRAM
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            Container-Scale Wholesale Supply &amp; Standing Mill Contracts
          </h1>
          <p className="text-sm text-emerald-100 leading-relaxed">
            Engineered for regional yarn distributors, large garment groups, and textile importers ordering LCL trial pallets up to multi-container monthly programs.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="bg-white rounded-3xl border border-slate-200 overflow-x-auto shadow-soft">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-[#08752B] text-white text-left">
              <tr>
                <th className="p-4">Shipment Tier</th>
                <th className="p-4">Net Yarn Load</th>
                <th className="p-4">Packaging Configuration</th>
                <th className="p-4">Typical Lead Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-4 font-extrabold">Trial Wholesale Lot (LCL / Air)</td>
                <td className="p-4">300 KG – 2,500 KG</td>
                <td className="p-4">5-Ply Export Cartons on Fumigated Euro Pallets</td>
                <td className="p-4">7–10 Business Days</td>
              </tr>
              <tr className="bg-[#F9FCFA]">
                <td className="p-4 font-extrabold">20ft FCL Container</td>
                <td className="p-4">9,000 KG – 10,200 KG (~9.5 MT)</td>
                <td className="p-4">Carton or PP Bag Floor-Loaded / Palletized</td>
                <td className="p-4">12–15 Business Days</td>
              </tr>
              <tr>
                <td className="p-4 font-extrabold">40ft High-Cube (HQ) FCL</td>
                <td className="p-4">21,500 KG – 24,000 KG (~22.5 MT)</td>
                <td className="p-4">High-Density Moisture-Wrapped Export Cartons</td>
                <td className="p-4">14–18 Business Days</td>
              </tr>
              <tr className="bg-[#F9FCFA]">
                <td className="p-4 font-extrabold">Quarterly Blanket Contract</td>
                <td className="p-4">50 MT – 300+ MT / Quarter</td>
                <td className="p-4">Reserved Spindle/Dye Lot Consistency + Scheduled Releases</td>
                <td className="p-4">Priority Rolling Dispatch</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-[#ECF6EE] rounded-3xl p-7 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-lg font-extrabold text-[#10371E] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#08752B]" />
              Ready to Lock In Container Pricing?
            </div>
            <p className="text-xs text-slate-600">
              Submit your target yarn counts and destination port for a customized FOB or CIF container quote.
            </p>
          </div>
          <Link
            href="/request-quote"
            className="inline-flex items-center gap-2 bg-[#F28C18] hover:bg-[#DF7A0B] text-white font-extrabold text-sm px-6 py-3 rounded-full"
          >
            Request Bulk Quotation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
