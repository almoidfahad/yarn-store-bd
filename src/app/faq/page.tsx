'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search } from 'lucide-react';
import { PublicShell } from '@/components/SiteChrome';
import { FAQ_ITEMS } from '@/lib/staticContent';

export default function FaqPage() {
  const [search, setSearch] = useState('');
  const [openIdx, setOpenIdx] = useState<number>(0);

  const filtered = FAQ_ITEMS.filter(
    (f) =>
      !search ||
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <PublicShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="bg-[#063B1B] text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
            BUYER KNOWLEDGE BASE
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            Frequently Asked Questions for International Buyers
          </h1>
          <div className="max-w-md mx-auto pt-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 mt-1" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search MOQ, samples, L/C, Incoterms..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full text-slate-900 text-xs sm:text-sm focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-3">
        {filtered.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#08752B]">{item.category}</span>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">{item.q}</div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-[#08752B] shrink-0 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}

        <div className="pt-6 text-center">
          <Link
            href="/request-quote"
            className="inline-block px-7 py-3 rounded-full bg-[#F28C18] hover:bg-[#DF7A0B] text-white text-sm font-extrabold"
          >
            Still Have Questions? Submit an RFQ →
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
