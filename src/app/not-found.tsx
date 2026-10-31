import React from 'react';
import Link from 'next/link';
import { PublicShell } from '@/components/SiteChrome';

export default function NotFound() {
  return (
    <PublicShell>
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-[#08752B] text-xs font-extrabold">
          404 · PAGE NOT FOUND
        </span>
        <h1 className="text-3xl font-extrabold text-[#10371E]">
          We Couldn&apos;t Find That Page
        </h1>
        <p className="text-sm text-slate-600">
          Explore our export yarn catalog, submit a quotation request, or return to the YARN STORE BD homepage.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link href="/" className="px-5 py-2.5 rounded-full bg-[#08752B] text-white text-xs font-bold">
            Back to Homepage
          </Link>
          <Link href="/products" className="px-5 py-2.5 rounded-full bg-[#F28C18] text-white text-xs font-bold">
            View Yarn Catalog
          </Link>
        </div>
      </div>
    </PublicShell>
  );
}
