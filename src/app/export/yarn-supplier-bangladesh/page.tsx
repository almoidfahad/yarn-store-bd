import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { PublicShell } from '@/components/SiteChrome';

export const metadata: Metadata = {
  title: 'Textile Yarn Exporter & Wholesale Supplier Bangladesh — Cotton, Polyester & Thread',
  description:
    'Source export-grade Cotton Yarn, Polyester Filament (75/36, 150D/48F, 300D/96F), and Embroidery Thread (40/2, 60/2) directly from Bangladesh with YARN STORE BD.',
};

export default function YarnSupplierBangladeshSeoPage() {
  return (
    <PublicShell>
      <section className="bg-[#063B1B] text-white py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="px-3 py-1 rounded-full bg-white/15 text-amber-300 text-xs font-extrabold">
            BANGLADESH B2B EXPORT HUB
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
            Trusted Textile Yarn Manufacturer &amp; Exporter in Bangladesh
          </h1>
          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
            As the world&apos;s second-largest apparel manufacturing hub, Bangladesh operates one of Asia&apos;s most advanced spinning and thread ecosystems. <strong>YARN STORE BD (MHR Thread &amp; Accessories)</strong> gives international buyers direct access to export-ready Cotton Yarn, Polyester Filament, Embroidery Thread, and Auto-Coner Cones.
          </p>
          <Link
            href="/request-quote"
            className="inline-flex items-center gap-2 bg-[#F28C18] hover:bg-[#DF7A0B] text-white font-extrabold text-sm px-6 py-3 rounded-full"
          >
            Request Direct Mill &amp; Export Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-2xl font-extrabold text-[#10371E]">
          Why Global Importers Source Yarn from YARN STORE BD
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          {[
            'Competitive Bangladesh spinning economics with modern European & Japanese ring frames',
            'Transparent separation of Own Manufacturing vs Verified ISO Partner Mills',
            'Full Uster Tester 6 quality verification + physical DHL/FedEx sample cones before bulk PO',
            'Dedicated Export Desk handling FOB Chattogram & CIF USA, EU, UK, Turkey & UAE',
          ].map((pt) => (
            <div key={pt} className="p-4 rounded-2xl bg-[#ECF6EE] border border-emerald-200 flex items-start gap-2.5 font-semibold text-[#10371E]">
              <CheckCircle2 className="w-4 h-4 text-[#08752B] shrink-0 mt-0.5" />
              <span>{pt}</span>
            </div>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
