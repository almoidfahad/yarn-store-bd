'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, FlaskConical, Plane } from 'lucide-react';
import { PublicShell } from '@/components/SiteChrome';

function RequestSampleInner() {
  const searchParams = useSearchParams();
  const initialProduct = searchParams?.get('product') || 'Cotton Yarn';

  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    buyerCompany: '',
    buyerName: '',
    buyerEmail: '',
    phone: '',
    country: 'United States',
    shippingAddress: '',
    product: initialProduct,
    yarnCount: 'Ne 30/1 Combed / 150D/48F / 40/2',
    conesCount: '3',
    shadeCard: true,
    courier: 'DHL Express',
    courierAccount: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/samples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        setSubmittedCode(data.sample.sampleCode);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {submittedCode ? (
        <div className="bg-white rounded-3xl border-2 border-emerald-200 p-8 text-center shadow-xl space-y-4">
          <CheckCircle2 className="w-12 h-12 text-[#08752B] mx-auto" />
          <h1 className="text-2xl font-extrabold text-[#10371E]">
            Sample Request Registered: {submittedCode}
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Our QA Lab has queued your testing cones and Uster Certificate of Analysis. Track the 7-stage dispatch workflow (`Request → Review → Approved → Prepared → Dispatched → Delivered → Feedback`) in the Buyer Portal or Admin Dashboard.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link href="/portal" className="px-5 py-2.5 rounded-full bg-[#08752B] text-white text-xs font-bold">
              Open Buyer Portal →
            </Link>
            <Link href="/admin" className="px-5 py-2.5 rounded-full bg-[#F28C18] text-white text-xs font-bold">
              View in Admin Sample Lab →
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 bg-[#063B1B] text-white p-7 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-bold">
                <FlaskConical className="w-3.5 h-3.5" /> INTERNATIONAL SAMPLE DESK
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Test Our Yarn Quality on Your Machines First
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                Evaluate tenacity, knitting performance, dye uptake, and shade fastness before confirming container orders. Every sample dispatch includes our QA Lab Uster &amp; CSP inspection sheet.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-emerald-800 space-y-2 text-xs text-emerald-100">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-amber-300" />
                <span>48–72 Hour QA Preparation · DHL / FedEx / UPS Worldwide</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 sm:p-8 space-y-4 text-xs sm:text-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Company Name *</label>
                <input
                  required
                  value={form.buyerCompany}
                  onChange={(e) => setForm({ ...form, buyerCompany: e.target.value })}
                  placeholder="Global Knitwear Ltd."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Contact Name *</label>
                <input
                  required
                  value={form.buyerName}
                  onChange={(e) => setForm({ ...form, buyerName: e.target.value })}
                  placeholder="Sourcing Manager"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Business Email *</label>
                <input
                  required
                  type="email"
                  value={form.buyerEmail}
                  onChange={(e) => setForm({ ...form, buyerEmail: e.target.value })}
                  placeholder="lab@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">WhatsApp / Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+49 40 555 0100"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Country *</label>
                <input
                  required
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Line *</label>
                <select
                  value={form.product}
                  onChange={(e) => setForm({ ...form, product: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold"
                >
                  <option>Cotton Yarn</option>
                  <option>Polyester Yarn</option>
                  <option>Embroidery Thread</option>
                  <option>Yarn Cones</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Count</label>
                <input
                  value={form.yarnCount}
                  onChange={(e) => setForm({ ...form, yarnCount: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Cones Needed</label>
                <select
                  value={form.conesCount}
                  onChange={(e) => setForm({ ...form, conesCount: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="2">2 Testing Cones</option>
                  <option value="3">3 Testing Cones</option>
                  <option value="4">4 Testing Cones</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Courier Service</label>
                <select
                  value={form.courier}
                  onChange={(e) => setForm({ ...form, courier: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option>DHL Express</option>
                  <option>FedEx International Priority</option>
                  <option>UPS Worldwide Express</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Delivery Address</label>
                <input
                  value={form.shippingAddress}
                  onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                  placeholder="Street, City, Postal Code"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.shadeCard}
                onChange={(e) => setForm({ ...form, shadeCard: e.target.checked })}
                className="accent-[#08752B] w-4 h-4"
              />
              <span className="text-xs font-semibold text-slate-700">
                Include Physical Master Shade Card (480+ Embroidery &amp; Dyed Yarn Colors)
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#08752B] hover:bg-[#065C22] text-white font-extrabold shadow-md"
            >
              {loading ? 'Submitting Sample Request...' : 'Submit International Sample Request →'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function RequestSamplePage() {
  return (
    <PublicShell>
      <Suspense fallback={<div className="p-12 text-center text-sm">Loading Sample System...</div>}>
        <RequestSampleInner />
      </Suspense>
    </PublicShell>
  );
}
