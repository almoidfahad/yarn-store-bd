import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Award, CheckCircle2, FileCheck2 } from 'lucide-react';
import { PublicShell } from '@/components/SiteChrome';
import { CertificationEmblems } from '@/components/VisualBadges';

export const metadata: Metadata = {
  title: 'Certifications & Export Compliance — ISO 9001:2015, OEKO-TEX® & ERC',
  description:
    'Verified quality and export compliance documentation of YARN STORE BD: ISO 9001:2015, OEKO-TEX Standard 100, BCI Better Cotton, and Bangladesh Export Registration Certificate (ERC).',
};

export default function CertificationsPage() {
  return (
    <PublicShell>
      <section className="bg-[#063B1B] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-amber-300 text-xs font-extrabold">
              <Award className="w-3.5 h-3.5" /> VERIFIED INTERNATIONAL STANDARDS
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold">
              Quality &amp; Export Compliance Documentation
            </h1>
            <p className="text-sm text-emerald-100">
              We publish only verifiable compliance scopes and provide lot-specific certificates alongside every commercial shipment.
            </p>
          </div>
          <CertificationEmblems />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-2 gap-6 text-xs sm:text-sm">
        {[
          {
            code: 'ISO 9001:2015',
            title: 'Quality Management System',
            scope: 'Spinning, Auto-Coner Winding, Embroidery Thread Processing & B2B Export Quality Auditing.',
            status: 'Active & Audited Annually',
          },
          {
            code: 'OEKO-TEX® STANDARD 100',
            title: 'Harmful Substance Testing (Class I & II)',
            scope: '100% Cotton Yarn, Dyed Yarn Cones, and MHR Mercerized Cotton Embroidery Thread.',
            status: 'Verified Mill Scope Certificate Provided with RFQ',
          },
          {
            code: 'BCI — Better Cotton',
            title: 'Sustainable Cotton Traceability',
            scope: 'Mass-balance sustainable cotton yarn lots available for European & US apparel programs.',
            status: 'Available on Buyer Specification',
          },
          {
            code: 'ERC-BD-2014-88412',
            title: 'Bangladesh Export Registration Certificate (ERC)',
            scope: 'Authorized direct exporter under Bangladesh Customs & BKMEA/EPB trade procedures.',
            status: 'Government Registered Exporter',
          },
        ].map((cert) => (
          <div key={cert.code} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#08752B] text-xs font-extrabold">
                {cert.code}
              </span>
              <FileCheck2 className="w-5 h-5 text-[#08752B]" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">{cert.title}</h2>
            <p className="text-slate-600">{cert.scope}</p>
            <div className="pt-2 text-xs font-bold text-[#08752B] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {cert.status}
            </div>
          </div>
        ))}

        <div className="md:col-span-2 bg-[#ECF6EE] rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
          <span className="text-sm font-bold text-[#10371E]">
            Need certificate copies attached to your vendor onboarding packet?
          </span>
          <Link href="/request-quote" className="px-5 py-2.5 rounded-full bg-[#08752B] text-white text-xs font-bold">
            Request Compliance Pack with RFQ →
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
