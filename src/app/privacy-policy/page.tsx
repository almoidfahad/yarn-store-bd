'use client';

import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { PublicShell } from '@/components/SiteChrome';

export default function PrivacyPolicyPage() {
  const [reqEmail, setReqEmail] = useState('');
  const [reqType, setReqType] = useState('Export My Buyer Data');
  const [done, setDone] = useState(false);

  return (
    <PublicShell>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-sm text-slate-700 leading-relaxed">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#08752B] uppercase">
            <ShieldCheck className="w-4 h-4" /> INTERNATIONAL B2B DATA PRIVACY
          </span>
          <h1 className="text-3xl font-extrabold text-[#10371E]">Privacy Policy &amp; Buyer Data Protection</h1>
          <p className="text-xs text-slate-500">Effective Date: October 31, 2026 · YARN STORE BD — MHR THREAD &amp; ACCESSORIES</p>
        </div>

        <p>
          YARN STORE BD respects the confidentiality of international textile buyers, importers, and sourcing agencies. All RFQ specification attachments, target prices, destination port details, and corporate contact records are stored in private role-restricted storage and are never published publicly or shared with third-party brokers.
        </p>

        <h2 className="text-lg font-extrabold text-[#10371E]">1. Information Collected</h2>
        <p>
          We collect business contact details (name, company name, corporate email, phone/WhatsApp, destination port, and yarn specifications) strictly to prepare commercial quotations, dispatch physical sample cones, and execute export documentation.
        </p>

        <h2 className="text-lg font-extrabold text-[#10371E]">2. Role-Based Access &amp; Private Storage</h2>
        <p>
          Access inside our CRM is restricted by Role-Based Access Control (RBAC) and Row-Level Security (RLS). Buyer Portal users can view only their own company&apos;s enquiries, quotations, and shipping documents.
        </p>

        {/* Buyer Data Export & Deletion Request Form (Blueprint Part 5.5) */}
        <div className="bg-[#F5F9F6] rounded-2xl p-6 border border-emerald-200 space-y-3">
          <h3 className="text-base font-extrabold text-[#10371E]">
            GDPR / International Buyer Data Export or Deletion Request
          </h3>
          {done ? (
            <div className="text-xs font-bold text-[#08752B]">
              Your data privacy request has been logged for compliance verification within 48 hours.
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await fetch('/api/contact', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: 'Data Privacy Officer Request',
                    email: reqEmail,
                    subject: reqType,
                    message: `Formal ${reqType} submitted for ${reqEmail}`,
                  }),
                });
                setDone(true);
              }}
              className="flex flex-col sm:flex-row gap-2.5 text-xs"
            >
              <input
                required
                type="email"
                value={reqEmail}
                onChange={(e) => setReqEmail(e.target.value)}
                placeholder="Your corporate email..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
              />
              <select
                value={reqType}
                onChange={(e) => setReqType(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-bold"
              >
                <option>Export My Buyer Data</option>
                <option>Archive / Delete My Contact Data</option>
              </select>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#08752B] text-white font-bold">
                Submit Request
              </button>
            </form>
          )}
        </div>
      </section>
    </PublicShell>
  );
}
