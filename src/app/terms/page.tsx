import React from 'react';
import type { Metadata } from 'next';
import { PublicShell } from '@/components/SiteChrome';

export const metadata: Metadata = {
  title: 'Terms & Conditions of B2B Export Supply',
};

export default function TermsPage() {
  return (
    <PublicShell>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-5 text-sm text-slate-700 leading-relaxed">
        <h1 className="text-3xl font-extrabold text-[#10371E]">
          Commercial Terms &amp; Conditions of Export Supply
        </h1>
        <p className="text-xs text-slate-500">
          YARN STORE BD — MHR THREAD &amp; ACCESSORIES · Dhaka, Bangladesh
        </p>

        <h2 className="text-lg font-extrabold text-[#10371E]">1. B2B Quotations &amp; Validity</h2>
        <p>
          All website specifications are indicative for B2B inquiry purposes. Binding commercial prices, currency exchange rates (USD, EUR, GBP), lead times, and freight charges apply only when issued on an Official Sales-Manager-Approved Quotation (`YSB-QT-2026-XXX`) within its stated validity date.
        </p>

        <h2 className="text-lg font-extrabold text-[#10371E]">2. Supply Origin Disclosure</h2>
        <p>
          YARN STORE BD clearly designates whether each contracted lot is produced in our own facilities or supplied through a verified partner mill in Bangladesh. Lot quality certificates accompany every shipment.
        </p>

        <h2 className="text-lg font-extrabold text-[#10371E]">3. Incoterms, Payment &amp; Claims</h2>
        <p>
          Shipments are governed by Incoterms® 2020 (EXW, FOB Chattogram, CFR, CIF, or DAP as specified on the Proforma Invoice). Standard payment is by confirmed Irrevocable L/C at Sight or agreed T/T wire. Any quality variance claim must be submitted within 14 days of port arrival referencing the master retention cone lot number.
        </p>
      </section>
    </PublicShell>
  );
}
