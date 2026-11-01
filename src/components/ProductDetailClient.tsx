'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Factory,
  FlaskConical,
  Package,
  Printer,
  ShieldCheck,
  X,
} from 'lucide-react';
import type { ProductItem, SecuritySettings } from '@/lib/db';
import {
  ContentProtectionShield,
  ProtectedProductImage,
} from './ContentProtectionShield';

const EMBROIDERY_SHADES = [
  { code: 'MHR-101', name: 'Ruby Crimson', hex: '#B91C1C' },
  { code: 'MHR-204', name: 'Imperial Gold', hex: '#D97706' },
  { code: 'MHR-318', name: 'Royal Cobalt', hex: '#1D4ED8' },
  { code: 'MHR-412', name: 'Bangladesh Emerald', hex: '#08752B' },
  { code: 'MHR-001', name: 'Optical Snow White', hex: '#F8FAFC' },
  { code: 'MHR-900', name: 'Deep Jet Black', hex: '#111827' },
  { code: 'MHR-509', name: 'Midnight Navy', hex: '#1E3A8A' },
  { code: 'MHR-615', name: ' plum Burgundy', hex: '#701A75' },
];

export function ProductDetailClient({
  product,
  related,
  initialSecuritySettings,
}: {
  product: ProductItem;
  related: ProductItem[];
  initialSecuritySettings?: SecuritySettings;
}) {
  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedShade, setSelectedShade] = useState(EMBROIDERY_SHADES[0]);
  const [showDatasheet, setShowDatasheet] = useState(false);

  const isOwn = product.supplyType === 'Manufactured by YARN STORE BD';

  // All 10 required Specification Table Rows from Turn 21 Section 4
  const tenRequiredRows = [
    { label: 'Product Name', value: product.name },
    { label: 'Material', value: product.spec.material },
    { label: 'Count', value: product.spec.counts },
    { label: 'Composition', value: product.spec.composition },
    { label: 'Yarn Type', value: product.spec.yarnType },
    { label: 'Packaging', value: `${product.spec.packaging} (${product.spec.coneWeight})` },
    { label: 'MOQ (Minimum Order Quantity)', value: `${product.moqKg.toLocaleString()} KG (Trial LCL) / 20ft & 40ft HQ FCL` },
    { label: 'Supply Capacity', value: `${product.monthlyCapacityMt} Metric Tons / Month` },
    { label: 'Lead Time', value: product.leadTime },
    { label: 'Documents', value: `${product.spec.datasheetCode} · Uster Test Report · Certificate of Origin · OEKO-TEX®` },
  ];

  return (
    <div className="bg-white">
      {/* Breadcrumb Bar */}
      <div className="bg-[#F5F8F5] border-b border-emerald-100 py-3 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-2 text-slate-600">
          <Link href="/" className="hover:text-[#08752B]">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#08752B]">Products</Link>
          <span>/</span>
          <span className="font-bold text-[#08752B]">{product.name}</span>
        </div>
      </div>

      {/* Main Product Hero Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Image Gallery */}
          <div className="lg:col-span-6 space-y-3">
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-[340px] sm:h-[420px]">
              <ProtectedProductImage
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
                protectedEnabled={initialSecuritySettings?.productScreenshotProtection !== false}
              />
            </div>
            <div className="flex gap-3">
              {product.gallery.map((imgUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-24 h-20 rounded-xl overflow-hidden border-2 transition ${
                    activeImage === imgUrl ? 'border-[#08752B]' : 'border-slate-200 opacity-75 hover:opacity-100'
                  }`}
                >
                  <ProtectedProductImage
                    src={imgUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    protectedEnabled={initialSecuritySettings?.productScreenshotProtection !== false}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Commercial Overview + Supply Verification + Actions */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold ${
                  isOwn ? 'bg-emerald-100 text-[#08752B]' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isOwn ? <Factory className="w-3.5 h-3.5" /> : <Package className="w-3.5 h-3.5" />}
                {product.supplyType}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono">
                {product.sku}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10371E] tracking-tight">
              {product.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{product.overview}</p>

            <div className="p-4 rounded-2xl bg-[#ECF6EE] border border-emerald-200 text-xs space-y-1.5">
              <div className="font-bold text-[#063B1B] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#08752B]" />
                Verified Production &amp; Origin Source: {product.facilityOrPartnerName}
              </div>
              <div className="text-slate-600">
                Quality Benchmark: {product.spec.qualityStandard} ({product.spec.usterCsp})
              </div>
            </div>

            {/* Interactive Shade Card Picker on Embroidery Thread */}
            {product.slug === 'embroidery-thread' && (
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-900">
                    Interactive Shade Swatch Preview (480+ Stocked Colors)
                  </span>
                  <span className="font-mono font-bold text-[#08752B]">
                    {selectedShade.code} · {selectedShade.name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {EMBROIDERY_SHADES.map((sh) => (
                    <button
                      key={sh.code}
                      type="button"
                      onClick={() => setSelectedShade(sh)}
                      className={`w-9 h-9 rounded-full border-2 transition ${
                        selectedShade.code === sh.code ? 'border-[#08752B] scale-110 shadow' : 'border-slate-300'
                      }`}
                      style={{ backgroundColor: sh.hex }}
                      title={`${sh.code} — ${sh.name}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Key Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <div className="text-[11px] text-slate-500">Minimum Order</div>
                <div className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                  {product.moqKg.toLocaleString()} KG
                </div>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <div className="text-[11px] text-slate-500">Monthly Capacity</div>
                <div className="text-sm sm:text-base font-black text-[#08752B] mt-0.5">
                  {product.monthlyCapacityMt} MT
                </div>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <div className="text-[11px] text-slate-500">Export Lead Time</div>
                <div className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
                  {product.leadTime.split(' ')[0]} Days
                </div>
              </div>
            </div>

            {/* Primary B2B Conversion Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href={`/request-quote?product=${encodeURIComponent(product.shortName)}&count=${encodeURIComponent(
                  product.spec.counts.split(',')[0]
                )}`}
                className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 bg-[#F28C18] hover:bg-[#DF7A0B] text-white font-extrabold text-sm px-6 py-3.5 rounded-full shadow-md transition"
              >
                <span>Request Official Quotation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={`/request-sample?product=${encodeURIComponent(product.shortName)}`}
                className="inline-flex items-center justify-center gap-2 bg-[#08752B] hover:bg-[#065C22] text-white font-bold text-sm px-5 py-3.5 rounded-full transition"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Request Sample Cones</span>
              </Link>

              <button
                type="button"
                onClick={() => setShowDatasheet(true)}
                className="inline-flex items-center justify-center gap-2 border border-slate-300 hover:border-[#08752B] text-slate-800 font-bold text-xs sm:text-sm px-4 py-3.5 rounded-full transition"
              >
                <Download className="w-4 h-4 text-[#08752B]" />
                <span>Technical Datasheet</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Complete 10-Point Technical Specification Table (Blueprint Section 4) */}
      <section className="bg-[#F8FBF9] border-y border-emerald-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#08752B]">
                VERIFIED TECHNICAL PARAMETERS
              </span>
              <h2 className="text-2xl font-extrabold text-[#10371E] mt-1">
                Complete B2B Export Specification Sheet
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowDatasheet(true)}
              className="text-xs font-bold text-[#08752B] hover:underline inline-flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save {product.spec.datasheetCode}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
            <table className="w-full text-xs sm:text-sm">
              <tbody className="divide-y divide-slate-100">
                {tenRequiredRows.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFDFB]'}>
                    <th className="w-1/3 sm:w-1/4 text-left p-4 font-bold text-[#10371E] border-r border-slate-100">
                      {row.label}
                    </th>
                    <td className="p-4 text-slate-700 font-medium">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Industrial Applications */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {product.spec.applications.map((app) => (
              <div
                key={app}
                className="p-3.5 rounded-xl bg-white border border-emerald-100 flex items-center gap-2.5 text-xs font-bold text-slate-800"
              >
                <CheckCircle2 className="w-4 h-4 text-[#08752B] shrink-0" />
                <span>{app}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Yarn Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-xl font-extrabold text-[#10371E] mb-5">Other Export Yarn Categories</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {related.map((r) => (
            <Link
              key={r.id}
              href={`/products/${r.slug}`}
              className="group bg-white rounded-2xl border border-slate-200 p-4 hover:border-[#08752B] transition flex items-center gap-4"
            >
              <img src={r.image} alt={r.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
              <div>
                <div className="text-sm font-extrabold text-slate-900 group-hover:text-[#08752B]">
                  {r.shortName}
                </div>
                <div className="text-xs text-slate-500 line-clamp-2 mt-0.5">{r.shortDescription}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Printable Technical Datasheet Modal */}
      {showDatasheet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-[#063B1B] text-white px-6 py-4 flex items-center justify-between no-print">
              <span className="font-bold text-sm">
                Technical Datasheet — {product.spec.datasheetCode}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-[#F28C18] text-white text-xs font-bold inline-flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / PDF
                </button>
                <button onClick={() => setShowDatasheet(false)} className="p-1 hover:bg-white/10 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="border-b border-slate-200 pb-3 flex justify-between">
                <div>
                  <div className="text-base font-extrabold text-[#08752B]">
                    YARN STORE BD — MHR THREAD &amp; ACCESSORIES
                  </div>
                  <div className="text-slate-500">QA Lab Technical Specification Document</div>
                </div>
                <div className="text-right font-mono font-bold">{product.sku}</div>
              </div>
              {tenRequiredRows.map((r) => (
                <div key={r.label} className="grid grid-cols-3 gap-2 py-1.5 border-b border-slate-100">
                  <span className="font-bold text-slate-700">{r.label}</span>
                  <span className="col-span-2 text-slate-900">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
