'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Factory,
  Package,
  ArrowRight,
  SlidersHorizontal,
  FlaskConical,
  FileCheck2,
} from 'lucide-react';
import type { ProductItem } from '@/lib/db';

export function ProductsCatalogClient({ products }: { products: ProductItem[] }) {
  const [category, setCategory] = useState<string>('All');
  const [supplyFilter, setSupplyFilter] = useState<string>('All');
  const [query, setQuery] = useState('');

  const filtered = products.filter((p) => {
    const matchCat = category === 'All' || p.category === category;
    const matchSupply = supplyFilter === 'All' || p.supplyType === supplyFilter;
    const q = query.toLowerCase();
    const matchQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.spec.counts.toLowerCase().includes(q) ||
      p.spec.yarnType.toLowerCase().includes(q) ||
      p.spec.applications.join(' ').toLowerCase().includes(q);
    return matchCat && matchSupply && matchQ;
  });

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#053517] via-[#085D28] to-[#0B6E30] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-extrabold uppercase tracking-wider">
              EXPORT PRODUCT CATALOG · DIRECT SPINNING &amp; VERIFIED SOURCING
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Industrial Yarn &amp; Thread Specifications
            </h1>
            <p className="mt-3 text-sm sm:text-base text-emerald-100 leading-relaxed">
              Explore our complete range of 100% Cotton Yarn, 100% Polyester Filament Yarn, Cotton Embroidery Thread, and Precision Auto-Coner Yarn Cones—each with transparent supply source labeling, verified counts, MOQ, and technical datasheets.
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Cotton Yarn', 'Polyester Yarn', 'Embroidery Thread', 'Yarn Cones'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  category === cat
                    ? 'bg-[#08752B] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#08752B]" />
              <select
                aria-label="Filter by Supply Type"
                value={supplyFilter}
                onChange={(e) => setSupplyFilter(e.target.value)}
                className="bg-transparent font-semibold text-slate-700 focus:outline-none"
              >
                <option value="All">All Supply Channels (Own + Partner)</option>
                <option value="Manufactured by YARN STORE BD">Manufactured by YARN STORE BD</option>
                <option value="Supplied through Verified Manufacturing Partner">
                  Verified Partner Mill Supply
                </option>
              </select>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search count (30s, 150D/48F, 40/2)..."
                className="w-full sm:w-64 pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#08752B]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {filtered.map((item) => {
            const isOwn = item.supplyType === 'Manufactured by YARN STORE BD';
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-64 bg-slate-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow ${
                          isOwn ? 'bg-[#08752B] text-white' : 'bg-[#F28C18] text-white'
                        }`}
                      >
                        {isOwn ? <Factory className="w-3.5 h-3.5" /> : <Package className="w-3.5 h-3.5" />}
                        {item.supplyType}
                      </span>
                    </div>
                    <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[11px] font-mono">
                      SKU: {item.sku}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-[#10371E]">{item.name}</h2>
                      <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.shortDescription}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-[#F6FAF7] p-3.5 rounded-xl border border-emerald-100 text-xs">
                      <div>
                        <span className="text-slate-500 block">Available Counts</span>
                        <span className="font-bold text-slate-900">{item.spec.counts.split('&')[0]}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Export MOQ</span>
                        <span className="font-bold text-slate-900">{item.moqKg.toLocaleString()} KG</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Monthly Capacity</span>
                        <span className="font-bold text-[#08752B]">{item.monthlyCapacityMt} MT / Mo</span>
                      </div>
                    </div>

                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {item.highlights.map((h, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <FileCheck2 className="w-4 h-4 text-[#08752B] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/products/${item.slug}`}
                    className="flex-1 text-center inline-flex items-center justify-center gap-2 bg-[#08752B] hover:bg-[#065C22] text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-xl transition"
                  >
                    <span>Full Specifications &amp; TDS</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/request-quote?product=${encodeURIComponent(item.shortName)}`}
                    className="inline-flex items-center justify-center gap-1.5 bg-[#F28C18] hover:bg-[#DF7A0B] text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-xl transition"
                  >
                    Request a Quote
                  </Link>
                  <Link
                    href={`/request-sample?product=${encodeURIComponent(item.shortName)}`}
                    className="inline-flex items-center justify-center gap-1 border border-emerald-300 text-[#08752B] hover:bg-emerald-50 text-xs font-bold px-3.5 py-3 rounded-xl transition"
                    title="Order Testing Cones"
                  >
                    <FlaskConical className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
