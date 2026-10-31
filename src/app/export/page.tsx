import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, CheckCircle2, FileText, Ship } from 'lucide-react';
import { PublicShell } from '@/components/SiteChrome';
import { WorldExportMap } from '@/components/WorldExportMap';

export const metadata: Metadata = {
  title: 'Export & International Logistics — FOB Chattogram, CIF Worldwide & Export Documents',
  description:
    'Global textile yarn shipping from Chattogram Port & Dhaka Airport: Incoterms EXW, FOB, CFR, CIF, DAP, export documentation, and target buyer markets.',
};

export default function ExportPage() {
  return (
    <PublicShell>
      <section className="relative bg-[#063B1B] text-white py-14 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-extrabold">
              <Ship className="w-3.5 h-3.5" /> GLOBAL EXPORT &amp; PORT LOGISTICS
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
              Seamless Sea &amp; Air Yarn Export from Bangladesh
            </h1>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              Following official Bangladesh Customs &amp; BKMEA export procedures, our dedicated export documentation team handles Chattogram Port FCL/LCL ocean shipments and Dhaka HSIA air freight with complete customs accuracy.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/request-quote"
                className="inline-flex items-center gap-2 bg-[#F28C18] hover:bg-[#DF7A0B] text-white font-bold text-sm px-6 py-3 rounded-full"
              >
                Get Port-to-Port CIF Quote <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/export/yarn-supplier-bangladesh"
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold text-sm px-6 py-3 rounded-full"
              >
                Why Source from Bangladesh?
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <img
              src="/images/cargo-ship-port.jpg"
              alt="Container Export Vessel"
              className="rounded-3xl border-2 border-white/15 shadow-2xl h-72 w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft">
          <h2 className="text-xl font-extrabold text-[#10371E] mb-4">
            Global Export Route Network
          </h2>
          <WorldExportMap />
        </div>

        {/* Supported Incoterms & Export Documents */}
        <div className="grid md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="bg-[#F6FAF7] rounded-3xl p-6 border border-emerald-200 space-y-3">
            <h3 className="text-lg font-extrabold text-[#10371E]">Supported Incoterms® 2020</h3>
            <ul className="space-y-2 text-slate-700">
              <li><strong>EXW (Ex Works Dhaka/Gazipur):</strong> Buyer forwarder collects directly at mill gate.</li>
              <li><strong>FOB Chattogram Port:</strong> Most popular option for full container sea freight.</li>
              <li><strong>CFR / CIF Destination Port:</strong> Ocean freight &amp; marine insurance arranged to Savannah, Hamburg, Felixstowe, Ambarli, Jebel Ali, etc.</li>
              <li><strong>DAP:</strong> Door delivery available on select air-cargo embroidery thread consignments.</li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-3">
            <h3 className="text-lg font-extrabold text-[#10371E] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#08752B]" /> Standard Export Documentation Pack
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                'Signed Commercial Invoice',
                'Detailed Cone/Carton Packing List',
                'Certificate of Origin (COO / GSP)',
                'Original Bill of Lading / Air Waybill',
                'Uster Lab Inspection Certificate (CoA)',
                'OEKO-TEX / ISO Compliance Copy',
                'Phytosanitary / Fumigation Certificate',
                'ERC & Bangladesh Customs EXP Clearance',
              ].map((doc) => (
                <div key={doc} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 font-semibold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#08752B] shrink-0" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
