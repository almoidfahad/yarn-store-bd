import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Award, Building2, Factory, Globe, Package, ShieldCheck } from 'lucide-react';
import { PublicShell } from '@/components/SiteChrome';

export const metadata: Metadata = {
  title: 'About YARN STORE BD — MHR Thread & Accessories | Since 2010',
  description:
    'Learn about YARN STORE BD (MHR Thread & Accessories), an established Bangladesh textile yarn manufacturer, verified sourcing house, and international B2B exporter since 2010.',
};

export default function AboutPage() {
  return (
    <PublicShell>
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#053517] via-[#085D28] to-[#0A6C2E] text-white py-14 sm:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-extrabold uppercase tracking-wider">
              ESTABLISHED 2010 · DHAKA, BANGLADESH
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
              Connecting Bangladesh&apos;s Textile Strength with Global Buyers
            </h1>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              <strong>YARN STORE BD — MHR THREAD &amp; ACCESSORIES</strong> combines in-house yarn &amp; embroidery thread manufacturing with an audited partner-mill trading network to deliver reliable, specification-verified bulk supply worldwide.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/request-quote"
                className="inline-flex items-center gap-2 bg-[#F28C18] hover:bg-[#DF7A0B] text-white font-bold text-sm px-6 py-3 rounded-full"
              >
                Request Official Quote <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about/team"
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold text-sm px-6 py-3 rounded-full"
              >
                Meet Our Export Team
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <img
              src="/images/factory-floor.jpg"
              alt="YARN STORE BD Spinning Floor"
              className="rounded-3xl border-4 border-white/15 shadow-2xl w-full h-72 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Dual Business Model Transparency (Blueprint Part 1.1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#08752B]">
            100% SUPPLY TRANSPARENCY
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10371E] mt-1">
            Dual-Channel Manufacturing &amp; Verified Sourcing Model
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            International buyers deserve complete clarity on where every cone is spun. We clearly label every product as either Own Production or Verified Partner Supply.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#ECF6EE] rounded-3xl p-7 border border-emerald-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#08752B] text-white flex items-center justify-center">
              <Factory className="w-6 h-6" />
            </div>
            <span className="inline-block px-3 py-0.5 rounded-full bg-[#08752B] text-white text-xs font-bold">
              Own Production Division
            </span>
            <h3 className="text-xl font-extrabold text-[#10371E]">
              Manufactured by YARN STORE BD
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Our Gazipur Ring Spinning &amp; Auto-Coner Unit and Narayanganj MHR Thread Plant directly produce 100% Cotton Yarn (Ne 10s–40s), Cotton Yarn Cones, and 40/2 &amp; 60/2 Mercerized Embroidery Thread (475+ MT/month combined capacity).
            </p>
            <Link href="/manufacturing" className="inline-flex items-center gap-1 text-xs font-extrabold text-[#08752B] hover:underline">
              Explore Manufacturing Facilities <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-amber-50/75 rounded-3xl p-7 border border-amber-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F28C18] text-white flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <span className="inline-block px-3 py-0.5 rounded-full bg-[#F28C18] text-white text-xs font-bold">
              Trading &amp; Sourcing Division
            </span>
            <h3 className="text-xl font-extrabold text-[#10371E]">
              Supplied through Verified Manufacturing Partners
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              For specialized synthetic filament counts (75D/36F, 150D/48F, 300D/96F DTY/FDY) and custom CVC/PC blends, we source exclusively from ISO-certified Bangladeshi partner mills with pre-shipment YARN STORE BD lab auditing.
            </p>
            <Link href="/trading" className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-800 hover:underline">
              Explore Partner Sourcing Network <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Registered Corporate Facts */}
        <div className="bg-white rounded-3xl border border-slate-200 p-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          {[
            { icon: Building2, title: 'Registered Business', val: 'YARN STORE BD — MHR THREAD & ACCESSORIES' },
            { icon: ShieldCheck, title: 'Export Registration', val: 'ERC-BD-2014-88412 · BKMEA Export Procedure Compliant' },
            { icon: Globe, title: 'Global Export Reach', val: 'USA, UK, Germany, Turkey, UAE, Canada & Australia' },
            { icon: Award, title: 'Quality Systems', val: 'ISO 9001:2015 · OEKO-TEX® Standard 100 · Uster Lab' },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="space-y-1.5">
                <Icon className="w-5 h-5 text-[#08752B]" />
                <div className="font-bold text-slate-500 uppercase">{f.title}</div>
                <div className="font-extrabold text-sm text-slate-900">{f.val}</div>
              </div>
            );
          })}
        </div>
      </section>
    </PublicShell>
  );
}
