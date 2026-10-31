'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileUp,
  Globe,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { PublicShell } from '@/components/SiteChrome';

function RequestQuoteFormInner() {
  const searchParams = useSearchParams();
  const initialProd = searchParams?.get('product') || 'Cotton Yarn';
  const initialCount = searchParams?.get('count') || 'Ne 30/1 Combed';

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    referenceNumber: string;
    aiPriority: string;
    email: string;
    companyName: string;
  } | null>(null);

  const [form, setForm] = useState({
    productCategory: initialProd,
    yarnCount: initialCount,
    yarnType: 'Ring Spun Combed / Filament',
    quantity: '5000',
    unit: 'KG' as 'KG' | 'TON' | 'PCS',
    monthlyRequirement: '10,000 KG / Month',
    sampleRequired: true,
    specFileName: '',
    country: 'United States',
    destinationPort: 'Port of Savannah / Main Port',
    incoterms: 'CIF' as 'EXW' | 'FOB' | 'CFR' | 'CIF' | 'DAP',
    paymentPreference: '100% Irrevocable L/C at Sight',
    preferredDeliveryDate: '2026-12-10',
    fullName: '',
    companyName: '',
    companyWebsite: '',
    email: '',
    phone: '',
    additionalRequirements: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/rfqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || 'Please check required fields.');
      } else {
        setResult({
          referenceNumber: data.rfq.referenceNumber,
          aiPriority: data.rfq.aiPriority,
          email: data.rfq.email,
          companyName: data.rfq.companyName,
        });
      }
    } catch {
      setError('Network error submitting RFQ. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="bg-white rounded-3xl border-2 border-emerald-200 shadow-xl p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#ECF6EE] text-[#08752B] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-[#08752B] text-xs font-extrabold">
            OFFICIAL RFQ REGISTERED IN CRM
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10371E]">
            Thank You! Your Quotation Request is Received
          </h1>
          <div className="bg-[#F5F9F6] rounded-2xl p-5 border border-emerald-100 max-w-lg mx-auto space-y-2 text-sm">
            <div className="text-xs uppercase font-bold text-slate-500">Your Unique RFQ Reference Number</div>
            <div className="text-2xl font-black text-[#08752B] font-mono">{result.referenceNumber}</div>
            <div className="text-xs text-slate-600">
              Auto-Confirmation sent to <strong>{result.email}</strong> · AI Qualification:{' '}
              <strong>{result.aiPriority}</strong>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Our Export Sales Manager is reviewing mill lot availability and ocean freight to issue your Manager-Approved Official PDF Quotation within 12–24 business hours.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href={`/portal?email=${encodeURIComponent(result.email)}`}
              className="px-6 py-3 rounded-full bg-[#08752B] hover:bg-[#065C22] text-white text-xs sm:text-sm font-bold"
            >
              Track Enquiry in Buyer Portal →
            </Link>
            <Link
              href="/admin"
              className="px-6 py-3 rounded-full bg-[#F28C18] hover:bg-[#DF7A0B] text-white text-xs sm:text-sm font-bold"
            >
              View Live in Admin CRM Dashboard →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 3-Step Interactive Form */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#08752B]">
                INTERNATIONAL B2B QUOTATION DESK
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10371E] mt-0.5">
                Request a Bulk Yarn Quotation (RFQ)
              </h1>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#08752B] text-xs font-extrabold shrink-0">
              Step {step} of 3
            </span>
          </div>

          {/* 3-Step Progress Bar */}
          <div className="grid grid-cols-3 gap-2 my-5">
            {[
              { n: 1, t: '1. Product Specs' },
              { n: 2, t: '2. Port & Terms' },
              { n: 3, t: '3. Buyer Details' },
            ].map((s) => (
              <button
                key={s.n}
                type="button"
                onClick={() => setStep(s.n as 1 | 2 | 3)}
                className="text-left"
              >
                <div
                  className={`h-2 rounded-full transition ${
                    step >= s.n ? 'bg-[#16A34A]' : 'bg-slate-200'
                  }`}
                />
                <span
                  className={`text-[11px] font-bold mt-1.5 block ${
                    step === s.n ? 'text-[#08752B]' : 'text-slate-500'
                  }`}
                >
                  {s.t}
                </span>
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Product Category *</label>
                    <select
                      value={form.productCategory}
                      onChange={(e) => setForm({ ...form, productCategory: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold"
                    >
                      <option value="Cotton Yarn">100% Cotton Yarn</option>
                      <option value="Polyester Yarn">100% Polyester Yarn</option>
                      <option value="Embroidery Thread">Cotton Embroidery Thread</option>
                      <option value="Yarn Cones">Cotton Yarn Cones</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Yarn Count / Denier *
                    </label>
                    <input
                      value={form.yarnCount}
                      onChange={(e) => setForm({ ...form, yarnCount: e.target.value })}
                      placeholder="e.g. Ne 30/1 Combed, 150D/48F, 40/2"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Required Quantity *</label>
                    <input
                      type="number"
                      min={100}
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Unit *</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['KG', 'TON', 'PCS'] as const).map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setForm({ ...form, unit: u })}
                          className={`py-2.5 rounded-xl font-bold border ${
                            form.unit === u
                              ? 'bg-[#08752B] text-white border-[#08752B]'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Monthly Demand</label>
                    <input
                      value={form.monthlyRequirement}
                      onChange={(e) => setForm({ ...form, monthlyRequirement: e.target.value })}
                      placeholder="e.g. 20,000 KG / Month"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Yarn Type &amp; Composition</label>
                    <input
                      value={form.yarnType}
                      onChange={(e) => setForm({ ...form, yarnType: e.target.value })}
                      placeholder="Ring Spun Combed / DTY Semi-Dull / Mercerized"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Upload Technical Specification (Private Storage)
                    </label>
                    <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 cursor-pointer text-xs font-semibold text-[#08752B]">
                      <FileUp className="w-4 h-4 shrink-0" />
                      <span className="truncate">
                        {form.specFileName || 'Attach PDF / Excel Spec Sheet (Optional)'}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          setForm({ ...form, specFileName: e.target.files?.[0]?.name || '' })
                        }
                      />
                    </label>
                  </div>
                </div>

                <label className="inline-flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={form.sampleRequired}
                    onChange={(e) => setForm({ ...form, sampleRequired: e.target.checked })}
                    className="accent-[#08752B] w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    Include physical testing sample cones / shade card prior to bulk shipment
                  </span>
                </label>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Destination Country *</label>
                    <input
                      required
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      placeholder="e.g. United States, Germany, UK, UAE"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Destination Sea / Air Port</label>
                    <input
                      value={form.destinationPort}
                      onChange={(e) => setForm({ ...form, destinationPort: e.target.value })}
                      placeholder="e.g. Savannah, Hamburg, Felixstowe, Jebel Ali"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Preferred Incoterms</label>
                    <select
                      value={form.incoterms}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          incoterms: e.target.value as 'EXW' | 'FOB' | 'CFR' | 'CIF' | 'DAP',
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-bold"
                    >
                      <option value="FOB">FOB Chattogram</option>
                      <option value="CIF">CIF Destination Port</option>
                      <option value="CFR">CFR Destination Port</option>
                      <option value="EXW">EXW Dhaka Mill</option>
                      <option value="DAP">DAP Buyer Warehouse</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Payment Preference</label>
                    <select
                      value={form.paymentPreference}
                      onChange={(e) => setForm({ ...form, paymentPreference: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option>100% Irrevocable L/C at Sight</option>
                      <option>30% T/T Advance, 70% Against B/L Copy</option>
                      <option>Cash Against Documents (CAD)</option>
                      <option>100% T/T Bank Wire</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Target Shipment Date</label>
                    <input
                      type="date"
                      value={form.preferredDeliveryDate}
                      onChange={(e) => setForm({ ...form, preferredDeliveryDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
                    <input
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="John Smith"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Company Legal Name *</label>
                    <input
                      required
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      placeholder="ABC Textiles Ltd."
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
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="buyer@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">WhatsApp / Phone *</label>
                    <input
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+1 704 555 0192"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Company Website</label>
                    <input
                      value={form.companyWebsite}
                      onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })}
                      placeholder="https://company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Additional Packaging, Cone Weight or Certification Notes
                  </label>
                  <textarea
                    rows={3}
                    value={form.additionalRequirements}
                    onChange={(e) => setForm({ ...form, additionalRequirements: e.target.value })}
                    placeholder="Specify waxed/unwaxed, perforated dye cones, Pantone shade numbers, OEKO-TEX certificate requirements..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                disabled={step === 1}
                onClick={() => setStep((s) => Math.max(1, s - 1) as 1 | 2 | 3)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 font-bold disabled:opacity-40"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.min(3, s + 1) as 1 | 2 | 3)}
                  className="inline-flex items-center gap-2 bg-[#08752B] hover:bg-[#065C22] text-white font-bold px-6 py-2.5 rounded-full shadow"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-[#F28C18] hover:bg-[#DF7A0B] text-white font-extrabold px-7 py-3 rounded-full shadow-lg"
                >
                  <span>{submitting ? 'Generating RFQ Reference...' : 'Submit Official RFQ →'}</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Live Enquiry Summary & Workflow Assurance Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#063B1B] text-white rounded-3xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-extrabold uppercase">
              <Sparkles className="w-4 h-4" /> Live Enquiry Summary
            </div>
            <div className="space-y-2.5 text-xs border-y border-emerald-800 py-4">
              <div className="flex justify-between">
                <span className="text-emerald-200">Product:</span>
                <span className="font-bold">{form.productCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-200">Count / Spec:</span>
                <span className="font-bold">{form.yarnCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-200">Volume:</span>
                <span className="font-bold">
                  {Number(form.quantity || 0).toLocaleString()} {form.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-200">Destination:</span>
                <span className="font-bold">{form.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-200">Incoterms:</span>
                <span className="font-bold">{form.incoterms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-200">Samples:</span>
                <span className="font-bold">{form.sampleRequired ? 'Requested' : 'Not Needed'}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-emerald-100">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <span>Private B2B storage — buyer attachments &amp; contacts are never public.</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <span>Instant RFQ Reference Number (YSB-RFQ-2026-XXX) + Sales Manager alert.</span>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <span>Quotations available in USD, EUR &amp; GBP.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RequestQuotePage() {
  return (
    <PublicShell>
      <Suspense fallback={<div className="p-12 text-center text-sm">Loading RFQ System...</div>}>
        <RequestQuoteFormInner />
      </Suspense>
    </PublicShell>
  );
}
